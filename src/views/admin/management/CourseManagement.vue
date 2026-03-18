<template>
    <admin-dashboard-layout>
        <data-table
            title="Unités d'enseignement"
            subtitle="Créer, modifier et supprimer les UE"
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
    name: 'CourseManagement',
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
                { key: 'codeUE', label: 'Code UE', sortable: true },
                { key: 'intitulé', label: 'Intitulé', sortable: true },
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
                const response = await adminService.getUEs()
                this.items = response.data || []
            } catch (error) {
                this.error = (error.response && error.response.data && error.response.data.message) || 'Impossible de charger les UE.'
            } finally {
                this.loading = false
            }
        },
        async handleCreate() {
            try {
                const code = window.prompt('Code UE (ex: MAT141)')
                if (!code) return
                const name = window.prompt('Intitulé UE')
                if (!name) return

                await adminService.addCourse({ code, name })
                await this.loadItems()
            } catch (error) {
                this.error = (error.response && error.response.data && error.response.data.message) || 'Création UE impossible.'
            }
        },
        async handleEdit(item) {
            try {
                const codeNew = window.prompt('Nouveau code UE', item.codeUE)
                if (!codeNew) return
                const name = window.prompt('Nouvel intitulé', item.intitulé)
                if (!name) return

                await adminService.updateCourse({ code: item.codeUE, codeNew, name })
                await this.loadItems()
            } catch (error) {
                this.error = (error.response && error.response.data && error.response.data.message) || 'Modification UE impossible.'
            }
        },
        async handleDelete(item) {
            try {
                await adminService.deleteCourse({ code: item.codeUE })
                await this.loadItems()
            } catch (error) {
                this.error = (error.response && error.response.data && error.response.data.message) || 'Suppression UE impossible.'
            }
        }
    }
}
</script>