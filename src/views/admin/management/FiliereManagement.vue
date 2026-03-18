<template>
    <admin-dashboard-layout>
        <data-table
            title="Filières"
            subtitle="Créer, modifier et supprimer les filières"
            :items="items"
            :columns="columns"
            :loading="loading"
            :error="error"
            @create="handleCreate"
            @edit="handleEdit"
            @delete="handleDelete"
            @retry="loadItems"
        />
    </admin-dashboard-layout>
</template>

<script>
import DataTable from '@/components/admin/DataTable.vue'
import AdminDashboardLayout from '@/layouts/AdminDashboardLayout.vue'
import adminService from '@/services/admin.service'

export default {
    name: 'FiliereManagement',
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
                { key: 'codeFiliere', label: 'Code filière', sortable: true },
                { key: 'nom', label: 'Nom', sortable: true },
                { key: 'code_departement', label: 'Département', sortable: true },
            ],
        }
    },
    mounted() {
        this.loadItems()
    },
    methods: {
        async loadItems() {
            this.loading = true
            this.error = null
            try {
                const response = await adminService.getFilieres()
                this.items = response.data || []
            } catch (error) {
                this.error = (error.response && error.response.data && error.response.data.message) || 'Impossible de charger les filières.'
            } finally {
                this.loading = false
            }
        },
        async handleCreate() {
            try {
                const code = window.prompt('Code filière (ex: INF)')
                if (!code) return
                const name = window.prompt('Nom filière')
                if (!name) return
                const dep = window.prompt('Code département lié')
                if (!dep) return
                await adminService.addFiliere({ code, name, dep })
                await this.loadItems()
            } catch (error) {
                this.error = (error.response && error.response.data && error.response.data.message) || 'Création filière impossible.'
            }
        },
        async handleEdit(item) {
            try {
                const codeNew = window.prompt('Nouveau code filière', item.codeFiliere)
                if (!codeNew) return
                const name = window.prompt('Nouveau nom filière', item.nom)
                if (!name) return
                const dep = window.prompt('Nouveau code département', item.code_departement)
                if (!dep) return
                await adminService.updateFiliere({ code: item.codeFiliere, codeNew, name, dep })
                await this.loadItems()
            } catch (error) {
                this.error = (error.response && error.response.data && error.response.data.message) || 'Modification filière impossible.'
            }
        },
        async handleDelete(item) {
            try {
                await adminService.deleteFiliere({ code: item.codeFiliere })
                await this.loadItems()
            } catch (error) {
                this.error = (error.response && error.response.data && error.response.data.message) || 'Suppression filière impossible.'
            }
        }
    }
}
</script>