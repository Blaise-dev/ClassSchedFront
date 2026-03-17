<template>
    <basic-layout>
        <template v-slot:main-title>
            <h1 class="fs-4 fw-bold m-0">Gestion des unités d'enseignement</h1>
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
    name: "CourseManagement",
    components: {
        BasicLayout,
        AdminSectionSwitcher,
    },
    data() {
        return {
            switchItems: [
                { to: '/admin/courses/create', label: 'Créer une UE' },
                { to: '/admin/courses/update', label: 'Modifier une UE' },
            ],
        };
    },
}
</script>