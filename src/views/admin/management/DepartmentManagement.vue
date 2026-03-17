<template>
    <basic-layout>
        <template v-slot:main-title>
            <h1 class="fs-4 fw-bold m-0">Gestion des départements</h1>
        </template>
        <template v-slot:main-content>
            <AdminSectionSwitcher :items="switchItems" />
            <div class="row">
                <router-view/>
            </div>
        </template>
    </basic-layout>
</template>

<script>
import BasicLayout from "@/components/BasicLayout.vue"
import AdminSectionSwitcher from '@/components/admin/AdminSectionSwitcher.vue'

export default {
    name: "DepartmentManagement",
    components: {
        BasicLayout,
        AdminSectionSwitcher,
    },
    data() {
        return {
            switchItems: [
                { to: '/admin/departments/create', label: 'Créer un département' },
                { to: '/admin/departments/update', label: 'Modifier un département' },
            ],
        };
    },
}
</script>