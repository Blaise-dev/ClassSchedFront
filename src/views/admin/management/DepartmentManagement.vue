<template>
    <admin-dashboard-layout>
        <data-table
            title="Départements"
            subtitle="Créer, modifier et supprimer les départements"
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
    name: 'DepartmentManagement',
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
                { key: 'codeDepartement', label: 'Code département', sortable: true },
                { key: 'nom', label: 'Nom', sortable: true },
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
                const response = await adminService.getDepartements()
                this.items = response.data || []
            } catch (error) {
                this.error = (error.response && error.response.data && error.response.data.message) || 'Impossible de charger les départements.'
            } finally {
                this.loading = false
            }
        },
        async handleCreate() {
            try {
                const code = window.prompt('Code département (ex: INFO)')
                if (!code) return
                const name = window.prompt('Nom département')
                if (!name) return
                await adminService.addDepartment({ code, name })
                await this.loadItems()
            } catch (error) {
                this.error = (error.response && error.response.data && error.response.data.message) || 'Création département impossible.'
            }
        },
        async handleEdit(item) {
            try {
                const codeNew = window.prompt('Nouveau code département', item.codeDepartement)
                if (!codeNew) return
                const name = window.prompt('Nouveau nom département', item.nom)
                if (!name) return
                await adminService.updateDepartment({ code: item.codeDepartement, codeNew, name })
                await this.loadItems()
            } catch (error) {
                this.error = (error.response && error.response.data && error.response.data.message) || 'Modification département impossible.'
            }
        },
        async handleDelete(item) {
            try {
                await adminService.deleteDepartment({ code: item.codeDepartement })
                await this.loadItems()
            } catch (error) {
                this.error = (error.response && error.response.data && error.response.data.message) || 'Suppression département impossible.'
            }
        }
    }
}
</script>