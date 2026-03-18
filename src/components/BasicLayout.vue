<template>
    <div class="min-vh-100 d-flex flex-column">
        <Header/>
        <main class="flex-grow-1 py-3">
            <div class="cs-container">
                <div class="row g-3">
                    <div v-if="showSidebar" class="col-12 col-lg-2">
                        <div class="side-menu cs-card h-100 overflow-hidden">
                            <Sidebar/>
                        </div>
                    </div>
                    <div :class="showSidebar ? 'col-12 col-lg-10' : 'col-12'">
                        <div class="d-flex align-items-center justify-content-between mb-3 cs-card p-3">
                            <slot name="main-title"></slot>
                            <div class="d-flex align-items-center gap-2">
                                <img src="@/assets/logo_uy1.png" alt="logo uy1" width="34" height="42">
                                <span class="school-label">Yaoundé 1</span>
                                <button v-if="isLoggedIn" @click="logout" class="btn basic-logout-btn" type="button" aria-label="Déconnexion">
                                    <i class="fas fa-sign-out-alt me-1"></i>
                                    Déconnexion
                                </button>
                            </div>
                        </div>
                        <div class="cs-card p-3 p-md-4">
                            <slot name="main-content"></slot>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <Footer/>
    </div>
</template>

<script>
import Header from './Header.vue';
import Sidebar from '@/components/admin/Sidebar.vue'
import Footer from './Footer.vue';

export default {
    name: 'BasicLayout',
    props: {
        showSidebar: {
            type: Boolean,
            default: true,
        },
    },
    components: {
        Header,
        Sidebar,
        Footer,
    },
    computed: {},
    methods: {}
}
</script>

<style>
.side-menu {
    background: rgba(26, 31, 58, 0.82);
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: var(--cs-radius-lg);
}

.school-label {
    color: #f0f3ff;
    font-weight: 700;
}

.cs-card {
    background: rgba(26, 31, 58, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.14);
    color: #eef2ff;
}

.cs-card :deep(.cs-section-subtitle),
.cs-card :deep(.text-muted) {
    color: #c8d0ef !important;
}

@media (max-width: 992px) {
    .side-menu {
        max-height: 320px;
        overflow-y: auto;
    }
}
</style>