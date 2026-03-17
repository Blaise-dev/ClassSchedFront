<template>
    <basic-layout>
        <template v-slot:main-title>
            <h1 class="fs-4 fw-bold m-0">Gestion des salles</h1>
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
import BasicLayout from '@/components/BasicLayout.vue';
import AdminSectionSwitcher from '@/components/admin/AdminSectionSwitcher.vue'

export default {
    name: 'ClassroomManagement',
    components: {
        BasicLayout,
        AdminSectionSwitcher,
    },
    data() {
        return {
            switchItems: [
                { to: '/admin/classrooms/create', label: 'Créer une salle' },
                { to: '/admin/classrooms/update', label: 'Modifier une salle' },
            ],
        };
    },
}
</script>