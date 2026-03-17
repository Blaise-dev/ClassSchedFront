<template>
    <div class="min-vh-100 d-flex flex-column">
        <Header/>
        <main class="flex-grow-1 py-3">
            <div class="cs-container">
                <div class="row g-3">
                    <div class="col-12 col-lg-2">
                        <div class="side-menu cs-card h-100 overflow-hidden">
                            <Sidebar/>
                        </div>
                    </div>
                    <div class="col-12 col-lg-10">
                        <div class="d-flex align-items-center justify-content-between mb-3 cs-card p-3">
                            <slot name="main-title"></slot>
                            <div class="d-flex align-items-center gap-2">
                                <img src="@/assets/logo_uy1.png" alt="logo uy1" width="34" height="42">
                                <span class="school-label">Yaoundé 1</span>
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
    components: {
        Header,
        Sidebar,
        Footer,
    }
}
</script>

<style> 
.side-menu {
    background-color: #fff;
}

.school-label {
    color: var(--cs-muted);
    font-weight: 700;
}
</style>