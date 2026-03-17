<template>
    <header class="cs-header">
        <nav class="navbar navbar-expand-lg">
            <div class="cs-container d-flex align-items-center justify-content-between py-2">
                <router-link to="/" class="navbar-brand d-flex align-items-center gap-2 m-0 brand-link">
                    <img src="@/assets/logo.png" alt="logo" width="34" height="28" class="d-inline-block align-text-top">
                    <div class="d-flex flex-column">
                        <span class="brand-title">ClassSched</span>
                        <span class="brand-subtitle">Planification académique</span>
                    </div>
                </router-link>

                <div class="d-none d-lg-flex align-items-center gap-3 nav-links">
                    <router-link to="/accueil/" class="nav-item" :class="{ active: route.path === '/accueil/' || route.path === '/' }">Accueil</router-link>
                    <router-link to="/planning/" class="nav-item" :class="{ active: route.path.startsWith('/planning') }">Planning</router-link>
                    <router-link to="/reservations/" class="nav-item" :class="{ active: route.path.startsWith('/reservations') }">Réservations</router-link>
                </div>

                <router-link class="btn cs-btn-primary" :to="adminCta.to">{{ adminCta.label }}</router-link>
            </div>
        </nav>
    </header>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
    name: 'AdminHeader',
    setup() {
        const route = useRoute();
        const adminCta = computed(() => {
            if (route.path.startsWith('/admin')) {
                return { to: '/accueil/', label: 'Espace public' };
            }
            return { to: '/admin/login', label: 'Espace admin' };
        });

        return {
            route,
            adminCta,
        };
    },
}
</script>

<style>
.cs-header {
    position: sticky;
    top: 10px;
    z-index: 20;
    background: transparent;
}

.cs-header .navbar {
    margin: 0 auto;
    max-width: 1260px;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    background: rgba(255, 255, 255, 0.14);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    box-shadow: 0 12px 30px rgba(7, 12, 34, 0.2);
}

.brand-link {
    color: #f7f8ff;
}

.brand-title {
    font-weight: 800;
    color: #fff;
    line-height: 1;
}

.brand-subtitle {
    font-size: 0.78rem;
    color: rgba(235, 237, 255, 0.78);
}

.nav-links .nav-item {
    font-weight: 700;
    color: rgba(241, 244, 255, 0.82);
    padding: 0.45rem 0.7rem;
    border-radius: 10px;
    transition: all 0.2s ease;
}

.nav-links .nav-item:hover,
.nav-links .nav-item.active {
    color: #fff;
    background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 992px) {
    .brand-subtitle {
        display: none;
    }
}
</style>