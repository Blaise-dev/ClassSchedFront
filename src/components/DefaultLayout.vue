<template>
    <div class="min-vh-100 d-flex flex-column">
        <Header/>
        <main class="flex-grow-1 py-3">
            <div class="cs-container">
                <div class="d-flex align-items-center justify-content-between mb-3 page-top cs-card p-3">
                    <slot name="main-title"></slot>
                    <div class="d-flex align-items-center gap-2 school-badge">
                        <img src="@/assets/logo_uy1.png" alt="logo uy1" width="34" height="42">
                        <div>
                            <div class="fw-bold">Université de Yaoundé I</div>
                            <small>Organisation des cours</small>
                        </div>
                    </div>
                </div>
                <slot name="main-content"></slot>
            </div>
        </main>
        <Footer/>
    </div>
</template>

<script>
import Header from './Header.vue';
import Footer from './Footer.vue';

export default {
    name: 'BasicLayout',
    components: {
        Header,
        Footer,
    }
}
</script>

<style scoped>
.page-top {
    border-radius: var(--cs-radius-lg);
    border: 1px solid rgba(255, 255, 255, 0.5);
}

.school-badge {
    color: #46506a;
    background: rgba(255, 255, 255, 0.66);
    border: 1px solid rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    padding: 0.45rem 0.7rem;
}

@media (max-width: 768px) {
    .page-top {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 0.75rem;
    }
}
</style>