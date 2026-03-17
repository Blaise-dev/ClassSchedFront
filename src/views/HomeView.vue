<template>
    <default-layout>
        <template v-slot:main-title>
            <div>
                <span class="cs-pill">Plateforme officielle</span>
            </div>
        </template>

        <template v-slot:main-content>
            <section class="hero cs-card p-4 p-md-5 mb-4">
                <div class="row align-items-center g-4">
                    <div class="col-lg-7">
                        <h1 class="hero-title">Planifiez les cours et événements universitaires avec fiabilité</h1>
                        <p class="hero-subtitle mt-3">ClassSched centralise l’emploi du temps, réduit les collisions de salles et améliore la communication entre administration, enseignants et étudiants.</p>
                        <div class="d-flex flex-wrap gap-2 mt-4">
                            <router-link to="/planning/" class="btn cs-btn-primary">Consulter le planning</router-link>
                            <router-link to="/admin/login" class="btn btn-outline-dark fw-bold">Accès administration</router-link>
                        </div>
                    </div>
                    <div class="col-lg-5">
                        <img src="@/assets/image_planning.png" alt="Illustration planning" class="w-100 hero-image">
                    </div>
                </div>
            </section>

            <section class="mb-4">
                <h2 class="cs-section-title">Pourquoi cette plateforme ?</h2>
                <p class="cs-section-subtitle">Une gestion académique moderne impose des données fiables, des accès rapides et une diffusion d’information cohérente.</p>

                <div class="row g-3 mt-1">
                    <div v-for="item in values" :key="item.title" class="col-md-4">
                        <article class="cs-card h-100 p-3 value-card">
                            <div class="value-icon"><v-icon size="22">{{ item.icon }}</v-icon></div>
                            <h3 class="value-title mt-2">{{ item.title }}</h3>
                            <p class="value-text mt-1">{{ item.description }}</p>
                        </article>
                    </div>
                </div>
            </section>

            <section class="stats cs-card p-4 mb-2">
                <div class="row text-center g-3">
                    <div class="col-md-3 col-6" v-for="metric in metrics" :key="metric.label">
                        <div class="metric-value">{{ metric.value }}</div>
                        <div class="metric-label">{{ metric.label }}</div>
                    </div>
                </div>
            </section>
            <section class="text-center mt-4 mb-3">
                <router-link to="/reservations/" class="fw-bold text-decoration-underline">Gérer les demandes de réservation</router-link>
            </section>
        </template>
    </default-layout>
</template>

<script>
import DefaultLayout from "@/components/DefaultLayout.vue"

export default {
    name: 'HomeView',
    components: {
        DefaultLayout,
    },
    data() {
        return {
            values: [
                {
                    icon: 'mdi-clipboard-check-outline',
                    title: 'Réduction des erreurs',
                    description: 'Les saisies de cours, salles et créneaux sont centralisées pour éviter les incohérences.',
                },
                {
                    icon: 'mdi-calendar-sync-outline',
                    title: 'Mise à jour rapide',
                    description: 'Une modification est propagée immédiatement pour conserver un planning fiable.',
                },
                {
                    icon: 'mdi-account-group-outline',
                    title: 'Communication claire',
                    description: 'Étudiants, enseignants et administration consultent la même version de référence.',
                },
            ],
            metrics: [
                { value: '24/7', label: 'Accès plateforme' },
                { value: '1', label: 'Source de vérité' },
                { value: '0', label: 'Partages hors système' },
                { value: '100%', label: 'Vision unifiée' },
            ],
        };
    },
}
</script>

<style scoped>
.hero {
    overflow: hidden;
}

.hero-title {
    font-size: clamp(1.6rem, 2.5vw, 2.6rem);
    font-weight: 800;
    max-width: 640px;
}

.hero-subtitle {
    color: var(--cs-muted);
    max-width: 620px;
    line-height: 1.75;
}

.hero-image {
    border-radius: 14px;
    border: 1px solid var(--cs-border);
}

.value-card {
    transition: transform 0.2s ease;
}

.value-card:hover {
    transform: translateY(-4px);
}

.value-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--cs-primary);
    background: #eee8fb;
}

.value-title {
    font-size: 1.05rem;
    font-weight: 800;
}

.value-text {
    color: var(--cs-muted);
    line-height: 1.7;
}

.metric-value {
    font-size: 1.75rem;
    font-weight: 800;
    color: var(--cs-primary);
}

.metric-label {
    color: var(--cs-muted);
    font-weight: 600;
}
</style>