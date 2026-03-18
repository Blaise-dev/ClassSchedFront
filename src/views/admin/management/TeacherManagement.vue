<template>
  <admin-dashboard-layout>
    <data-table
      title="Enseignants"
      subtitle="Créer, supprimer et affecter des UEs aux enseignants"
      :items="items"
      :columns="columns"
      :loading="loading"
      :error="error"
      @create="handleCreate"
      @edit="handleEditAssignments"
      @delete="handleDelete"
      @retry="loadItems"
    />
  </admin-dashboard-layout>
</template>

<script>
import DataTable from '@/components/admin/DataTable.vue';
import AdminDashboardLayout from '@/layouts/AdminDashboardLayout.vue';
import adminService from '@/services/admin.service';

export default {
  name: 'TeacherManagement',
  components: {
    DataTable,
    AdminDashboardLayout,
  },
  data() {
    return {
      loading: false,
      error: null,
      items: [],
      columns: [
        { key: 'nom', label: 'Nom', sortable: true },
        { key: 'prenom', label: 'Prénom', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'ueCount', label: 'UE affectées', sortable: true },
      ],
    };
  },
  mounted() {
    this.loadItems();
  },
  methods: {
    async loadItems() {
      this.loading = true;
      this.error = null;
      try {
        const [enseignantsResponse, dispenserResponse, uesResponse] = await Promise.all([
          adminService.getEnseignants(),
          adminService.getDispenserUes(),
          adminService.getUEs(),
        ]);

        const enseignants = Array.isArray(enseignantsResponse?.data) ? enseignantsResponse.data : [];
        const dispenser = Array.isArray(dispenserResponse?.data) ? dispenserResponse.data : [];
        const ues = Array.isArray(uesResponse?.data) ? uesResponse.data : [];

        this.items = enseignants.map((enseignant) => {
          const enseignantId = enseignant.id;
          const relatedAssignments = dispenser.filter((row) => Number(row?.enseignanT) === Number(enseignantId));
          const ueCodes = relatedAssignments.map((row) => row.ue).filter(Boolean);
          const ueLabels = ues
            .filter((ue) => ueCodes.includes(ue.codeUE))
            .map((ue) => ue.codeUE)
            .join(', ');

          return {
            id: enseignantId,
            nom: enseignant?.utilisateur?.nom || '-',
            prenom: enseignant?.utilisateur?.prenom || '-',
            email: enseignant?.utilisateur?.email || '-',
            ueCount: ueCodes.length,
            ueCodes,
            ueLabels,
            raw: enseignant,
          };
        });
      } catch (error) {
        this.error = (error.response && error.response.data && error.response.data.message) || 'Impossible de charger les enseignants.';
      } finally {
        this.loading = false;
      }
    },

    async handleCreate() {
      try {
        const nom = window.prompt('Nom enseignant');
        if (!nom) return;
        const prenom = window.prompt('Prénom enseignant');
        if (!prenom) return;
        const email = window.prompt('Email enseignant');
        if (!email) return;
        const password = window.prompt('Mot de passe (6 à 10 caractères)');
        if (!password) return;

        await adminService.createEnseignant({ nom, prenom, email, password });
        await this.loadItems();
      } catch (error) {
        this.error = (error.response && error.response.data && error.response.data.message) || 'Création enseignant impossible.';
      }
    },

    async handleEditAssignments(item) {
      try {
        const target = this.items.find((entry) => entry.id === item.id) || item;
        const defaultValue = Array.isArray(target.ueCodes) ? target.ueCodes.join(',') : '';
        const value = window.prompt('Codes UE à affecter (séparés par des virgules)', defaultValue);
        if (value === null) return;

        const desiredCodes = value
          .split(',')
          .map((code) => code.trim())
          .filter(Boolean);

        const dispenserResponse = await adminService.getDispenserUes();
        const assignments = Array.isArray(dispenserResponse?.data) ? dispenserResponse.data : [];
        const currentAssignments = assignments.filter((row) => Number(row?.enseignanT) === Number(target.id));

        const currentCodes = currentAssignments.map((row) => row.ue);
        const toAdd = desiredCodes.filter((code) => !currentCodes.includes(code));
        const toRemove = currentAssignments.filter((row) => !desiredCodes.includes(row.ue));

        await Promise.allSettled([
          ...toAdd.map((ueCode) => adminService.assignUeToEnseignant(target.id, ueCode)),
          ...toRemove.map((row) => adminService.removeUeAssignment(row.id)),
        ]);

        await this.loadItems();
      } catch (error) {
        this.error = (error.response && error.response.data && error.response.data.message) || 'Mise à jour des affectations impossible.';
      }
    },

    async handleDelete(item) {
      try {
        const dispenserResponse = await adminService.getDispenserUes();
        const assignments = Array.isArray(dispenserResponse?.data) ? dispenserResponse.data : [];
        const currentAssignments = assignments.filter((row) => Number(row?.enseignanT) === Number(item.id));

        if (currentAssignments.length) {
          await Promise.allSettled(currentAssignments.map((row) => adminService.removeUeAssignment(row.id)));
        }

        await adminService.deleteEnseignant(item.id);
        await this.loadItems();
      } catch (error) {
        this.error = (error.response && error.response.data && error.response.data.message) || 'Suppression enseignant impossible.';
      }
    },
  },
};
</script>
