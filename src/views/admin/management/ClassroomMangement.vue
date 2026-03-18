<template>
    <admin-dashboard-layout>
        <data-table
            title="Salles"
            subtitle="Créer, modifier et supprimer les salles"
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
    name: 'ClassroomManagement',
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
                { key: 'codeSalle', label: 'Code salle', sortable: true },
                { key: 'nomSalle', label: 'Nom salle', sortable: true },
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
                const response = await adminService.getSalles()
                this.items = response.data || []
            } catch (error) {
                this.error = (error.response && error.response.data && error.response.data.message) || 'Impossible de charger les salles.'
            } finally {
                this.loading = false
            }
        },
        async handleCreate() {
            try {
                const code = window.prompt('Code salle (ex: S006)')
                if (!code) return
                const name = window.prompt('Nom salle')
                if (!name) return
                await adminService.addClassroom({ code, name })
                await this.loadItems()
            } catch (error) {
                this.error = (error.response && error.response.data && error.response.data.message) || 'Création salle impossible.'
            }
        },
        async handleEdit(item) {
            try {
                const codeNew = window.prompt('Nouveau code salle', item.codeSalle)
                if (!codeNew) return
                const name = window.prompt('Nouveau nom salle', item.nomSalle)
                if (!name) return
                await adminService.updateClassroom({ code: item.codeSalle, codeNew, name })
                await this.loadItems()
            } catch (error) {
                this.error = (error.response && error.response.data && error.response.data.message) || 'Modification salle impossible.'
            }
        },
        async handleDelete(item) {
            try {
                await adminService.deleteClassroom({ code: item.codeSalle })
                await this.loadItems()
            } catch (error) {
                this.error = (error.response && error.response.data && error.response.data.message) || 'Suppression salle impossible.'
            }
        }
    }
}
</script>