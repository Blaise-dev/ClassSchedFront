<template>
    <admin-dashboard-layout>
        <!-- Stats Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #5b2cff, #7e4cff)">
                    <i class="fas fa-book"></i>
                </div>
                <div class="stat-content">
                    <p class="stat-label">Unités d'enseignement</p>
                    <p class="stat-value">{{ stats.ues }}</p>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #ff4f9f, #ff7fb3)">
                    <i class="fas fa-door-open"></i>
                </div>
                <div class="stat-content">
                    <p class="stat-label">Salles</p>
                    <p class="stat-value">{{ stats.salles }}</p>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #4cd18b, #6ee0a0)">
                    <i class="fas fa-building"></i>
                </div>
                <div class="stat-content">
                    <p class="stat-label">Départements</p>
                    <p class="stat-value">{{ stats.departements }}</p>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #ffc107, #ffdb4d)">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <div class="stat-content">
                    <p class="stat-label">Filières</p>
                    <p class="stat-value">{{ stats.filieres }}</p>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions-section">
            <h2 class="section-title">Actions rapides</h2>
            <div class="actions-grid">
                <button @click="navigateTo('/admin/courses')" class="action-card">
                    <div class="action-icon">
                        <i class="fas fa-plus"></i>
                    </div>
                    <h3>Créer une UE</h3>
                    <p>Ajouter une nouvelle unité d'enseignement</p>
                </button>

                <button @click="navigateTo('/admin/classrooms')" class="action-card">
                    <div class="action-icon">
                        <i class="fas fa-plus"></i>
                    </div>
                    <h3>Créer une salle</h3>
                    <p>Ajouter une nouvelle salle de classe</p>
                </button>

                <button @click="navigateTo('/admin/departments')" class="action-card">
                    <div class="action-icon">
                        <i class="fas fa-plus"></i>
                    </div>
                    <h3>Créer un département</h3>
                    <p>Ajouter un nouveau département</p>
                </button>

                <button @click="navigateTo('/admin/filieres')" class="action-card">
                    <div class="action-icon">
                        <i class="fas fa-plus"></i>
                    </div>
                    <h3>Créer une filière</h3>
                    <p>Ajouter une nouvelle filière</p>
                </button>
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="recent-section">
            <h2 class="section-title">Gestion rapide</h2>
            <div class="management-cards">
                <router-link to="/admin/courses" class="management-card">
                    <div class="card-icon">
                        <i class="fas fa-book"></i>
                    </div>
                    <h3>Unités d'enseignement</h3>
                    <p>Gérer et organiser les UE</p>
                    <span class="count">{{ stats.ues }} UE</span>
                </router-link>

                <router-link to="/admin/classrooms" class="management-card">
                    <div class="card-icon">
                        <i class="fas fa-door-open"></i>
                    </div>
                    <h3>Salles</h3>
                    <p>Configurer les salles de cours</p>
                    <span class="count">{{ stats.salles }} Salles</span>
                </router-link>

                <router-link to="/admin/departments" class="management-card">
                    <div class="card-icon">
                        <i class="fas fa-building"></i>
                    </div>
                    <h3>Départements</h3>
                    <p>Gérer les départements</p>
                    <span class="count">{{ stats.departements }} Depts</span>
                </router-link>

                <router-link to="/admin/filieres" class="management-card">
                    <div class="card-icon">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                    <h3>Filières</h3>
                    <p>Organiser les filières</p>
                    <span class="count">{{ stats.filieres }} Filières</span>
                </router-link>

                <router-link to="/admin/levels" class="management-card">
                    <div class="card-icon">
                        <i class="fas fa-layer-group"></i>
                    </div>
                    <h3>Niveaux</h3>
                    <p>Définir les niveaux d'étude</p>
                    <span class="count">{{ stats.niveaux }} Niveaux</span>
                </router-link>

                <router-link to="/admin/options" class="management-card">
                    <div class="card-icon">
                        <i class="fas fa-sliders-h"></i>
                    </div>
                    <h3>Options</h3>
                    <p>Gérer les options</p>
                    <span class="count">{{ stats.options }} Options</span>
                </router-link>

                <router-link to="/admin/teachers" class="management-card">
                    <div class="card-icon">
                        <i class="fas fa-chalkboard-teacher"></i>
                    </div>
                    <h3>Enseignants</h3>
                    <p>Gérer les enseignants et leurs UEs</p>
                    <span class="count">{{ stats.enseignants }} Enseignants</span>
                </router-link>
            </div>
        </div>
    </admin-dashboard-layout>
</template>

<script>
import AdminDashboardLayout from '@/layouts/AdminDashboardLayout.vue';
import adminService from '@/services/admin.service';

export default {
    name: 'AdminDashboard',
    components: {
        AdminDashboardLayout
    },
    data() {
        return {
            stats: {
                ues: 0,
                salles: 0,
                departements: 0,
                filieres: 0,
                niveaux: 0,
                options: 0,
                enseignants: 0,
            }
        };
    },
    mounted() {
        this.loadStats();
    },
    methods: {
        async loadStats() {
            try {
                const [ues, salles, depts, filieres, niveaux, options, enseignants] = await Promise.all([
                    adminService.getUEs(),
                    adminService.getSalles(),
                    adminService.getDepartements(),
                    adminService.getFilieres(),
                    adminService.getNiveaux(),
                    adminService.getOptions(),
                    adminService.getEnseignants(),
                ]);

                this.stats = {
                    ues: ues.data.length || 0,
                    salles: salles.data.length || 0,
                    departements: depts.data.length || 0,
                    filieres: filieres.data.length || 0,
                    niveaux: niveaux.data.length || 0,
                    options: options.data.length || 0,
                    enseignants: enseignants.data.length || 0,
                };
            } catch (error) {
                console.error('Error loading stats:', error);
            }
        },
        navigateTo(path) {
            this.$router.push(path);
        }
    }
};
</script>

<style scoped lang="css">
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
    margin-bottom: 48px;
}

.stat-card {
    background: rgba(26, 31, 58, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 24px;
    display: flex;
    gap: 16px;
    align-items: center;
    transition: all 0.3s ease;
}

.stat-card:hover {
    border-color: rgba(91, 44, 255, 0.3);
    transform: translateY(-4px);
}

.stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: white;
    flex-shrink: 0;
}

.stat-content {
    flex: 1;
}

.stat-label {
    margin: 0;
    font-size: 13px;
    color: #b0b7d4;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.stat-value {
    margin: 8px 0 0;
    font-size: 32px;
    font-weight: 700;
    color: #ffffff;
}

.section-title {
    margin: 0 0 24px;
    font-size: 20px;
    font-weight: 600;
    color: #ffffff;
}

.quick-actions-section {
    margin-bottom: 48px;
}

.actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
}

.action-card {
    background: rgba(26, 31, 58, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
}

.action-card:hover {
    background: rgba(26, 31, 58, 0.8);
    border-color: #5b2cff;
    transform: translateY(-4px);
}

.action-icon {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    background: linear-gradient(135deg, #5b2cff, #ff4f9f);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
}

.action-card h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: #ffffff;
}

.action-card p {
    margin: 0;
    font-size: 12px;
    color: #b0b7d4;
}

.recent-section {
    margin-bottom: 32px;
}

.management-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
}

.management-card {
    background: rgba(26, 31, 58, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 24px;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.management-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
}

.management-card:hover {
    border-color: #5b2cff;
    transform: translateY(-4px);
}

.management-card:hover::before {
    left: 100%;
}

.card-icon {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    background: rgba(91, 44, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #5b2cff;
}

.management-card h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
}

.management-card p {
    margin: 0;
    font-size: 13px;
    color: #b0b7d4;
}

.count {
    display: inline-block;
    margin-top: 8px;
    padding: 4px 12px;
    background: rgba(91, 44, 255, 0.2);
    color: #5b2cff;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
}

@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .actions-grid,
    .management-cards {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 12px;
    }

    .stat-value {
        font-size: 24px;
    }
}
</style>
