<template>
    <header v-if="showPublicHeader" class="cs-header">
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
                </div>

                <div class="d-flex align-items-center gap-2">
                    <button
                        class="mobile-menu-toggle d-lg-none"
                        type="button"
                        aria-label="Ouvrir le menu"
                        @click="mobileMenuOpen = !mobileMenuOpen"
                    >
                        <i :class="mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
                    </button>
                    <router-link class="btn cs-btn-primary header-cta" :to="adminCta.to">{{ adminCta.label }}</router-link>
                </div>
            </div>

            <div v-if="mobileMenuOpen" class="mobile-nav d-lg-none">
                <router-link to="/accueil/" class="mobile-nav-item" @click="closeMobileMenu">Accueil</router-link>
                <router-link to="/planning/" class="mobile-nav-item" @click="closeMobileMenu">Planning</router-link>
            </div>
        </nav>
    </header>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export default {
    name: 'AdminHeader',
    setup() {
        const route = useRoute();
        const mobileMenuOpen = ref(false);

        const showPublicHeader = computed(() => !route.path.startsWith('/admin'));

        const adminCta = computed(() => {
            if (route.path.startsWith('/admin')) {
                return { to: '/accueil/', label: 'Espace public' };
            }
            return { to: '/admin/login', label: 'Espace admin' };
        });

        const closeMobileMenu = () => {
            mobileMenuOpen.value = false;
        };

        watch(() => route.path, () => {
            closeMobileMenu();
        });

        return {
            route,
            adminCta,
            mobileMenuOpen,
            closeMobileMenu,
            showPublicHeader,
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
    background: rgba(22, 30, 60, 0.78);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    box-shadow: 0 12px 30px rgba(7, 12, 34, 0.2);
    position: relative;
    overflow: visible;
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
    color: rgba(241, 244, 255, 0.9) !important;
    padding: 0.45rem 0.7rem;
    border-radius: 10px;
    transition: all 0.2s ease;
}

.nav-links .nav-item:hover,
.nav-links .nav-item.active {
    color: #fff !important;
    background: rgba(255, 255, 255, 0.2);
}

.header-cta {
    white-space: nowrap;
}

.mobile-menu-toggle {
    width: 34px;
    height: 34px;
    border: none;
    background: transparent;
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: none;
    padding: 0;
}

.mobile-menu-toggle i {
    font-size: 1.06rem;
}

.mobile-nav {
    position: absolute;
    top: calc(100% + 10px);
    right: 0.9rem;
    width: min(290px, calc(100% - 1.8rem));
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 0.8rem;
    border-radius: 14px;
    background: rgba(17, 24, 52, 0.96);
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 18px 40px rgba(6, 10, 28, 0.45);
    z-index: 30;
}

.mobile-nav-item {
    color: #f4f6ff !important;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.14);
    padding: 0.6rem 0.8rem;
    border-radius: 10px;
    font-weight: 700;
    text-decoration: none;
}

.mobile-nav-item.router-link-active {
    background: rgba(255, 255, 255, 0.22);
    color: #fff !important;
}

@media (max-width: 992px) {
    .cs-header {
        position: static;
        top: auto;
    }

    .cs-header .navbar {
        border-radius: 12px;
    }

    .brand-subtitle {
        display: none;
    }

    .header-cta {
        font-size: 0.82rem;
        padding: 0.42rem 0.65rem;
    }
}
</style>