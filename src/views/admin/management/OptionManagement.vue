<template>
    <admin-dashboard-layout>
        <data-table
            title="Options"
            subtitle="Créer, modifier et supprimer les options"
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
    name: 'OptionManagement',
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
                { key: 'codeOption', label: 'Code option', sortable: true },
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
                const response = await adminService.getOptions()
                this.items = response.data || []
            } catch (error) {
                this.error = (error.response && error.response.data && error.response.data.message) || 'Impossible de charger les options.'
            } finally {
                this.loading = false
            }
        },
        async handleCreate() {
            try {
                const code = window.prompt('Code option (ex: IA)')
                if (!code) return
                const name = window.prompt('Nom option')
                if (!name) return
                await adminService.addOption({ code, name })
                await this.loadItems()
            } catch (error) {
                this.error = (error.response && error.response.data && error.response.data.message) || 'Création option impossible.'
            }
        },
        async handleEdit(item) {
            try {
                const codeNew = window.prompt('Nouveau code option', item.codeOption)
                if (!codeNew) return
                const name = window.prompt('Nouveau nom option', item.nom)
                if (!name) return
                await adminService.updateOption({ code: item.codeOption, codeNew, name })
                await this.loadItems()
            } catch (error) {
                this.error = (error.response && error.response.data && error.response.data.message) || 'Modification option impossible.'
            }
        },
        async handleDelete(item) {
            try {
                await adminService.deleteOption({ code: item.codeOption })
                await this.loadItems()
            } catch (error) {
                this.error = (error.response && error.response.data && error.response.data.message) || 'Suppression option impossible.'
            }
        }
    }
}
</script>