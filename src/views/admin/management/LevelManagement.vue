<template>
    <admin-dashboard-layout>
        <data-table
            title="Niveaux"
            subtitle="Créer, modifier et supprimer les niveaux"
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
    name: 'LevelManagement',
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
                { key: 'codeNiveau', label: 'Code niveau', sortable: true },
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
                const response = await adminService.getNiveaux()
                this.items = response.data || []
            } catch (error) {
                this.error = (error.response && error.response.data && error.response.data.message) || 'Impossible de charger les niveaux.'
            } finally {
                this.loading = false
            }
        },
        async handleCreate() {
            try {
                const code = window.prompt('Code niveau (ex: L1)')
                if (!code) return
                const name = window.prompt('Nom niveau')
                if (!name) return
                await adminService.addLevel({ code, name })
                await this.loadItems()
            } catch (error) {
                this.error = (error.response && error.response.data && error.response.data.message) || 'Création niveau impossible.'
            }
        },
        async handleEdit(item) {
            try {
                const codeNew = window.prompt('Nouveau code niveau', item.codeNiveau)
                if (!codeNew) return
                const name = window.prompt('Nouveau nom niveau', item.nom)
                if (!name) return
                await adminService.updateLevel({ code: item.codeNiveau, codeNew, name })
                await this.loadItems()
            } catch (error) {
                this.error = (error.response && error.response.data && error.response.data.message) || 'Modification niveau impossible.'
            }
        },
        async handleDelete(item) {
            try {
                await adminService.deleteLevel({ code: item.codeNiveau })
                await this.loadItems()
            } catch (error) {
                this.error = (error.response && error.response.data && error.response.data.message) || 'Suppression niveau impossible.'
            }
        }
    }
}
</script>