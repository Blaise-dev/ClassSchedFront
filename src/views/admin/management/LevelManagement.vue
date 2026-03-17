<template>
    <basic-layout>
        <template v-slot:main-title>
            <h1 class="fs-4 fw-bold m-0">Gestion des niveaux</h1>
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
    name: "LevelManagement",
    components: {
        BasicLayout,
        AdminSectionSwitcher,
    },
    data() {
        return {
            switchItems: [
                { to: '/admin/levels/create', label: 'Créer un niveau' },
                { to: '/admin/levels/update', label: 'Modifier un niveau' },
            ],
        };
    },
}
</script>