<template>
    <div class="admin-dashboard min-vh-100">
        <!-- Sidebar Navigation -->
        <div class="dashboard-sidebar" :class="{ open: sidebarOpen }">
            <div class="sidebar-header">
                <div class="logo-section">
                    <img src="@/assets/logo.png" alt="ClassSched" class="sidebar-logo">
                    <span class="brand-name">ClassSched</span>
                </div>
                <button @click="toggleSidebar" class="sidebar-toggle d-lg-none">
                    <i class="fas fa-bars"></i>
                </button>
            </div>

            <nav class="sidebar-nav">
                <ul class="nav-list">
                    <li>
                        <router-link to="/admin/dashboard" active-class="active" class="nav-link">
                            <i class="fas fa-chart-line"></i>
                            <span>Tableau de bord</span>
                        </router-link>
                    </li>
                    <li class="nav-section">
                        <span class="section-title">Gestion académique</span>
                    </li>
                    <li>
                        <router-link to="/admin/courses" active-class="active" class="nav-link">
                            <i class="fas fa-book"></i>
                            <span>Unités (UE)</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/admin/departments" active-class="active" class="nav-link">
                            <i class="fas fa-building"></i>
                            <span>Départements</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/admin/filieres" active-class="active" class="nav-link">
                            <i class="fas fa-graduation-cap"></i>
                            <span>Filières</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/admin/levels" active-class="active" class="nav-link">
                            <i class="fas fa-layer-group"></i>
                            <span>Niveaux</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/admin/options" active-class="active" class="nav-link">
                            <i class="fas fa-sliders-h"></i>
                            <span>Options</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/admin/teachers" active-class="active" class="nav-link">
                            <i class="fas fa-chalkboard-teacher"></i>
                            <span>Enseignants</span>
                        </router-link>
                    </li>
                    <li class="nav-section">
                        <span class="section-title">Planning et réservation</span>
                    </li>
                    <li>
                        <router-link to="/admin/classrooms" active-class="active" class="nav-link">
                            <i class="fas fa-door-open"></i>
                            <span>Salles</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/admin/time-table" active-class="active" class="nav-link">
                            <i class="fas fa-clock"></i>
                            <span>Emplois du temps</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/admin/reservations" active-class="active" class="nav-link">
                            <i class="fas fa-calendar-check"></i>
                            <span>Réservations</span>
                        </router-link>
                    </li>
                </ul>
            </nav>

            <div class="sidebar-footer">
                <div class="user-profile-mini">
                    <div class="avatar">
                        <span>{{ getInitials() }}</span>
                    </div>
                    <div class="user-info">
                        <p class="user-name">{{ userInfo.nom }} {{ userInfo.prenom }}</p>
                        <p class="user-role">{{ getUserTypeLabel() }}</p>
                    </div>
                </div>
            </div>
        </div>

        <button
            v-if="isMobile && sidebarOpen"
            class="sidebar-backdrop"
            type="button"
            aria-label="Fermer le menu"
            @click="closeSidebar"
        ></button>

        <!-- Main Content Area -->
        <div class="dashboard-main">
            <!-- Top Header -->
            <div class="dashboard-header">
                <div class="header-left">
                    <button @click="toggleSidebar" class="header-menu-btn d-md-none" aria-label="Ouvrir le menu">
                        <i class="fas fa-bars"></i>
                    </button>
                    <h1 class="page-title">{{ getPageTitle() }}</h1>
                    <p class="page-subtitle">Bienvenue dans le panneau d'administration ClassSched</p>
                </div>
                <div class="header-right">
                    <div class="quick-actions">
                        <div ref="notificationsDropdown" class="action-dropdown" @click.stop>
                            <button class="btn-icon" title="Notifications" @click.stop="toggleNotifications" aria-label="Notifications">
                                <i class="fas fa-bell"></i>
                                <span class="badge" v-if="unreadNotificationsCount">{{ unreadNotificationsCount }}</span>
                            </button>
                            <div v-if="showNotifications" class="dropdown-menu-modern" @click.stop>
                                <div class="dropdown-menu-head">
                                    <div>
                                        <div class="dropdown-menu-title">Notifications</div>
                                        <div class="dropdown-menu-subtitle">Suivi des événements récents du back-office</div>
                                    </div>
                                    <button type="button" class="menu-head-link" @click="goToReservations">Tout voir</button>
                                </div>
                                <div v-if="notifications.length" class="notification-stack">
                                    <button
                                        v-for="item in notifications"
                                        :key="item.id"
                                        type="button"
                                        class="notification-item"
                                        @click="handleNotificationClick(item)"
                                    >
                                        <span class="notification-dot" :class="{ unread: item.unread }"></span>
                                        <div class="notification-content">
                                            <div class="notification-row">
                                                <span class="notification-title">{{ item.title }}</span>
                                                <span class="notification-time">{{ item.time }}</span>
                                            </div>
                                            <p class="notification-text">{{ item.text }}</p>
                                        </div>
                                    </button>
                                </div>
                                <div v-else class="dropdown-empty-state">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Aucune notification en attente.</span>
                                </div>
                                <div class="dropdown-menu-actions">
                                    <button type="button" class="menu-action" @click="markNotificationsRead">Tout marquer comme lu</button>
                                    <button type="button" class="menu-action" @click="goToReservations">Voir les réservations</button>
                                </div>
                            </div>
                        </div>

                        <div ref="settingsDropdown" class="action-dropdown" @click.stop>
                            <button class="btn-icon" title="Paramètres" @click.stop="toggleSettings" aria-label="Paramètres">
                                <i class="fas fa-cog"></i>
                            </button>
                            <div v-if="showSettings" class="dropdown-menu-modern" @click.stop>
                                <div class="dropdown-menu-head">
                                    <div>
                                        <div class="dropdown-menu-title">Paramètres</div>
                                        <div class="dropdown-menu-subtitle">Préférences du compte et navigation rapide</div>
                                    </div>
                                </div>
                                <div class="settings-profile-card">
                                    <div class="avatar settings-avatar">
                                        <span>{{ getInitials() }}</span>
                                    </div>
                                    <div class="settings-profile-copy">
                                        <div class="settings-profile-name">{{ userInfo.nom }} {{ userInfo.prenom }}</div>
                                        <div class="settings-profile-meta">{{ userInfo.email || 'Adresse email non renseignée' }}</div>
                                        <div class="settings-profile-role">{{ getUserTypeLabel() }} • Langue: Français</div>
                                    </div>
                                </div>
                                <div class="dropdown-menu-actions">
                                    <button type="button" class="menu-action" @click="goToDashboard">Tableau de bord</button>
                                    <button type="button" class="menu-action" @click="goToReservations">Réservations</button>
                                    <button type="button" class="menu-action menu-action-danger" @click="logoutAndCloseMenus">Déconnexion</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <div class="dashboard-content">
                <slot />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AdminDashboard',
    computed: {
        unreadNotificationsCount() {
            return this.notifications.filter((item) => item.unread).length;
        }
    },
    data() {
        return {
            sidebarOpen: false,
            isMobile: false,
            showNotifications: false,
            showSettings: false,
            notifications: [
                {
                    id: 'reservation-pending',
                    title: 'Réservations en attente',
                    text: '3 demandes de réservation nécessitent une validation.',
                    time: 'Maintenant',
                    route: '/admin/reservations',
                    unread: true,
                },
                {
                    id: 'timetable-update',
                    title: 'Planning mis à jour',
                    text: 'L’emploi du temps L3 Informatique a été publié ce matin.',
                    time: 'Il y a 18 min',
                    route: '/admin/time-table',
                    unread: true,
                },
                {
                    id: 'department-account',
                    title: 'Compte créé',
                    text: 'Un nouveau profil enseignant a été ajouté au département.',
                    time: 'Aujourd’hui',
                    route: '/admin/dashboard',
                    unread: false,
                }
            ],
            userInfo: {
                email: '',
                nom: '',
                prenom: '',
                typeU: ''
            }
        };
    },
    mounted() {
        this.loadUserInfo();
        this.setInitialViewportState();
        document.addEventListener('click', this.handleDocumentClick);
        window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleDocumentClick);
        window.removeEventListener('resize', this.handleResize);
    },
    watch: {
        '$route.path'() {
            if (this.isMobile) {
                this.sidebarOpen = false;
            }
            this.closeAllMenus();
        },
    },
    methods: {
        setInitialViewportState() {
            this.isMobile = window.innerWidth <= 768;
            this.sidebarOpen = !this.isMobile;
        },
        handleResize() {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;

            if (this.isMobile && !wasMobile) {
                this.sidebarOpen = false;
            }

            if (!this.isMobile && wasMobile) {
                this.sidebarOpen = true;
            }
        },
        loadUserInfo() {
            const admin = localStorage.getItem('admin');
            if (admin) {
                this.userInfo = JSON.parse(admin);
            }
        },
        getInitials() {
            return `${this.userInfo.nom?.charAt(0) || 'A'}${this.userInfo.prenom?.charAt(0) || 'C'}`.toUpperCase();
        },
        getUserTypeLabel() {
            const types = {
                'chefDpartement': 'Chef de département',
                'chefDepartement': 'Chef de département',
                'doyen': 'Doyen',
                'enseignant': 'Enseignant'
            };
            return types[this.userInfo.typeU] || this.userInfo.typeU;
        },
        getPageTitle() {
            const titles = {
                'admin-dashboard': 'Tableau de bord',
                'management-course': 'Gestion des unités (UE)',
                'management-classroom': 'Gestion des salles',
                'management-department': 'Gestion des départements',
                'management-filiere': 'Gestion des filières',
                'management-level': 'Gestion des niveaux',
                'management-option': 'Gestion des options',
                'management-teacher': 'Gestion des enseignants',
                'management-reservation': 'Réservations',
                'time-table': 'Emplois du temps'
            };
            return titles[this.$route.name] || 'Tableau de bord';
        },
        toggleSidebar() {
            this.sidebarOpen = !this.sidebarOpen;
        },
        closeSidebar() {
            this.sidebarOpen = false;
        },
        toggleNotifications() {
            this.showNotifications = !this.showNotifications;
            if (this.showNotifications) {
                this.showSettings = false;
            }
        },
        toggleSettings() {
            this.showSettings = !this.showSettings;
            if (this.showSettings) {
                this.showNotifications = false;
            }
        },
        closeAllMenus() {
            this.showNotifications = false;
            this.showSettings = false;
        },
        markNotificationsRead() {
            this.notifications = this.notifications.map((item) => ({
                ...item,
                unread: false,
            }));
        },
        goToReservations() {
            this.closeAllMenus();
            this.$router.push('/admin/reservations');
        },
        goToDashboard() {
            this.closeAllMenus();
            this.$router.push('/admin/dashboard');
        },
        logoutAndCloseMenus() {
            this.closeAllMenus();
            this.logout();
        },
        handleNotificationClick(item) {
            this.notifications = this.notifications.map((notification) => {
                if (notification.id !== item.id) {
                    return notification;
                }
                return {
                    ...notification,
                    unread: false,
                };
            });

            this.closeAllMenus();

            if (item.route) {
                this.$router.push(item.route);
            }
        },
        handleDocumentClick(event) {
            const notificationsEl = this.$refs.notificationsDropdown;
            const settingsEl = this.$refs.settingsDropdown;
            const target = event.target;

            const insideNotifications = notificationsEl && notificationsEl.contains(target);
            const insideSettings = settingsEl && settingsEl.contains(target);

            if (!insideNotifications && !insideSettings) {
                this.closeAllMenus();
            }
        },
        logout() {
            this.$store.dispatch('auth/logout');
            this.$router.push('/admin/login');
        }
    }
};
</script>

<style scoped lang="css">
.admin-dashboard {
    --sidebar-width: 280px;
    --header-height: 70px;
    --primary: #5b2cff;
    --secondary: #ff4f9f;
    --bg-dark: #0f1226;
    --bg-surface: #1a1f3a;
    --text-primary: #ffffff;
    --text-secondary: #b0b7d4;
    --border-color: rgba(255, 255, 255, 0.1);
    display: flex;
    background: linear-gradient(135deg, var(--bg-dark) 0%, #1f1d4d 100%);
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Sidebar */
.dashboard-sidebar {
    width: var(--sidebar-width);
    background: rgba(26, 31, 58, 0.8);
    backdrop-filter: blur(10px);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    height: 100vh;
    position: sticky;
    top: 0;
    overflow-y: auto;
    z-index: 1000;
}

.sidebar-header {
    padding: 24px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo-section {
    display: flex;
    align-items: center;
    gap: 12px;
}

.sidebar-logo {
    width: 40px;
    height: 32px;
}

.brand-name {
    font-size: 18px;
    font-weight: 700;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.sidebar-toggle {
    display: none;
    background: none;
    border: none;
    color: var(--text-primary);
    font-size: 20px;
    cursor: pointer;
}

.sidebar-nav {
    flex: 1;
    padding: 24px 12px;
    overflow-y: auto;
}

.nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.nav-section {
    padding: 16px 12px 8px;
    margin-top: 12px;
}

.section-title {
    font-size: 12px;
    font-weight: 700;
    color: #d7def7 !important;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    color: #eef2ff !important;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    cursor: pointer;
    margin: 4px 0;
    font-size: 14px;
}

.nav-link span,
.nav-link i {
    color: inherit !important;
}

.nav-link:hover {
    color: #ffffff;
    background: rgba(91, 44, 255, 0.1);
    transform: translateX(4px);
}

.nav-link.active {
    color: #ffffff;
    background: linear-gradient(90deg, rgba(91, 44, 255, 0.2), transparent);
    border-left: 3px solid var(--primary);
    padding-left: 13px;
    font-weight: 500;
}

.nav-link i {
    font-size: 16px;
    width: 20px;
}

/* Sidebar Footer */
.sidebar-footer {
    padding: 20px;
    border-top: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.sidebar-backdrop {
    display: none;
}

.user-profile-mini {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(91, 44, 255, 0.1);
    border-radius: 8px;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    flex-shrink: 0;
}

.user-info {
    flex: 1;
}

.user-name {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
}

.user-role {
    margin: 0;
    font-size: 12px;
    color: var(--text-secondary);
}

/* Main Content */
.dashboard-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: visible;
}

.dashboard-header {
    height: var(--header-height);
    background: rgba(20, 27, 54, 0.94);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border-color);
    padding: 0 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    position: relative;
    z-index: 1400;
}

.header-left {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.header-menu-btn {
    width: 40px;
    height: 40px;
    margin-bottom: 6px;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: rgba(247, 248, 255, 0.7);
    box-shadow: none;
}

.header-menu-btn:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #f7f8ff;
}

.page-title {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: #ffffff;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.35);
}

.page-subtitle {
    margin: 4px 0 0;
    font-size: 13px;
    color: var(--text-secondary);
}

.header-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.quick-actions {
    display: flex;
    gap: 12px;
    position: relative;
}

.action-dropdown {
    position: relative;
}

.btn-icon {
    width: 42px;
    height: 42px;
    border-radius: 8px;
    background: transparent;
    color: rgba(247, 248, 255, 0.65);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: none;
}

.btn-icon:hover {
    background: rgba(255, 255, 255, 0.07);
    color: #f7f8ff;
}

.btn-icon i {
    font-size: 1rem;
}

.badge {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 20px;
    height: 20px;
    background: var(--secondary);
    color: white;
    border-radius: 50%;
    font-size: 11px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dashboard-content {
    flex: 1;
    overflow-y: auto;
    padding: 32px;
}

.dropdown-menu-modern {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    min-width: 270px;
    padding: 0.8rem;
    border-radius: 12px;
    background: rgba(16, 22, 47, 0.98);
    border: 1px solid rgba(255, 255, 255, 0.16);
    box-shadow: 0 16px 34px rgba(6, 10, 28, 0.42);
    z-index: 10000;
}

.dropdown-menu-title {
    font-size: 0.9rem;
    font-weight: 700;
    color: #f1f4ff;
}

.dropdown-menu-subtitle {
    margin-top: 0.2rem;
    color: rgba(214, 222, 249, 0.68);
    font-size: 0.76rem;
    line-height: 1.45;
}

.dropdown-menu-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.85rem;
}

.menu-head-link {
    border: none;
    background: transparent;
    color: #cdbdff;
    font-size: 0.78rem;
    font-weight: 700;
    padding: 0;
}

.notification-stack {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
}

.notification-item {
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 0.8rem;
    display: flex;
    align-items: flex-start;
    gap: 0.7rem;
    text-align: left;
    transition: background 0.2s ease, border-color 0.2s ease;
}

.notification-item:hover {
    background: rgba(255, 255, 255, 0.09);
    border-color: rgba(167, 139, 250, 0.18);
}

.notification-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-top: 0.35rem;
    background: rgba(255, 255, 255, 0.18);
    flex-shrink: 0;
}

.notification-dot.unread {
    background: #8b5cf6;
    box-shadow: 0 0 0 5px rgba(139, 92, 246, 0.16);
}

.notification-content {
    flex: 1;
}

.notification-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.6rem;
}

.notification-title {
    color: #f4f7ff;
    font-size: 0.84rem;
    font-weight: 700;
}

.notification-time {
    color: rgba(214, 222, 249, 0.62);
    font-size: 0.72rem;
    white-space: nowrap;
}

.notification-text {
    margin: 0.25rem 0 0;
    color: #d8def9;
    font-size: 0.8rem;
    line-height: 1.5;
}

.dropdown-empty-state {
    border: 1px dashed rgba(255, 255, 255, 0.14);
    border-radius: 12px;
    padding: 0.9rem;
    color: rgba(214, 222, 249, 0.72);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 0.8rem;
}

.dropdown-menu-list {
    margin: 0;
    padding-left: 1rem;
    color: #d8def9;
    font-size: 0.85rem;
}

.dropdown-menu-list li {
    margin-bottom: 0.35rem;
}

.menu-line {
    list-style: disc;
}

.dropdown-menu-actions {
    margin-top: 0.7rem;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
}

.settings-profile-card {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.85rem;
    margin-bottom: 0.75rem;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.settings-avatar {
    width: 44px;
    height: 44px;
}

.settings-profile-copy {
    flex: 1;
    min-width: 0;
}

.settings-profile-name {
    color: #f4f7ff;
    font-size: 0.86rem;
    font-weight: 700;
}

.settings-profile-meta,
.settings-profile-role {
    color: rgba(214, 222, 249, 0.68);
    font-size: 0.76rem;
    line-height: 1.45;
}

.menu-action {
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
    color: #f4f7ff;
    border-radius: 8px;
    padding: 0.5rem 0.65rem;
    text-align: left;
    font-size: 0.82rem;
    font-weight: 700;
}

.menu-action:hover {
    background: rgba(255, 255, 255, 0.2);
}

.menu-action-danger {
    color: #ffbfd8;
    border-color: rgba(255, 79, 159, 0.45);
    background: rgba(255, 79, 159, 0.12);
}

.menu-action-danger:hover {
    background: rgba(255, 79, 159, 0.2);
}

/* Responsive */
@media (max-width: 1200px) {
    :root {
        --sidebar-width: 240px;
    }
    
    .dashboard-header {
        padding: 0 24px;
    }

    .dashboard-content {
        padding: 24px;
    }
}

@media (max-width: 768px) {
    .dashboard-sidebar {
        position: fixed;
        left: -100%;
        width: 280px;
        height: 100vh;
        transition: left 0.3s ease;
        box-shadow: 2px 0 20px rgba(0, 0, 0, 0.3);
        z-index: 1500;
    }

    .dashboard-sidebar.open {
        left: 0;
    }

    .sidebar-backdrop {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(9, 12, 24, 0.45);
        border: none;
        z-index: 1450;
    }

    .dashboard-main {
        width: 100%;
    }

    .sidebar-toggle {
        display: block;
    }

    .dashboard-header {
        padding: 0 16px;
        min-height: 84px;
        height: auto;
        padding-top: 12px;
        padding-bottom: 12px;
    }

    .dashboard-content {
        padding: 16px;
    }

    .page-title {
        font-size: 1.1rem;
        line-height: 1.3;
        margin-top: 0;
    }

    .page-subtitle {
        display: none;
    }

    .header-right {
        gap: 12px;
    }

    .quick-actions {
        gap: 8px;
    }

    .btn-icon {
        width: 38px;
        height: 38px;
    }

    .dropdown-menu-modern {
        right: -6px;
        min-width: 230px;
    }
}

/* Scrollbar Styling */
.dashboard-sidebar::-webkit-scrollbar,
.dashboard-content::-webkit-scrollbar {
    width: 8px;
}

.dashboard-sidebar::-webkit-scrollbar-track,
.dashboard-content::-webkit-scrollbar-track {
    background: transparent;
}

.dashboard-sidebar::-webkit-scrollbar-thumb,
.dashboard-content::-webkit-scrollbar-thumb {
    background: rgba(91, 44, 255, 0.3);
    border-radius: 4px;
}

.dashboard-sidebar::-webkit-scrollbar-thumb:hover,
.dashboard-content::-webkit-scrollbar-thumb:hover {
    background: rgba(91, 44, 255, 0.5);
}
</style>
