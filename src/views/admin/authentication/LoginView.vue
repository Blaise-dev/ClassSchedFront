<template>
    <div class="auth-screen">
        <div class="cs-container py-4">
            <div class="auth-topbar mb-4">
                <router-link to="/" class="navbar-brand fw-bolder text-decoration-none d-inline-flex align-items-center gap-2 auth-brand-link">
                    <img src="@/assets/logo.png" alt="logo" width="32" height="26" class="d-inline-block align-text-top"/>
                    <span>ClassSched</span>
                </router-link>
                <router-link to="/accueil/" class="auth-back-link">Retour à l'espace public</router-link>
            </div>

            <div class="row g-0 auth-card overflow-hidden">
                <div class="col-12 col-md-6 p-4 p-md-5 bg-white auth-panel">
                    <span class="auth-kicker">Connexion administrateur</span>
                    <h1 class="auth-heading mt-3">Accédez au pilotage de la plateforme</h1>
                    <p class="auth-intro mb-4">Connectez-vous avec votre compte administrateur pour gérer les emplois du temps, les réservations et les référentiels académiques.</p>

                    <Form @submit="handleLogin" :validation-schema="schema" class="my-4">
                        <div class="row mb-3 auth-field-row">
                            <label for="login" class="auth-label">Adresse administrateur</label>
                            <div class="d-flex align-items-center position-relative">
                                <span class="position-absolute px-4 auth-field-icon">
                                    <font-awesome-icon icon="user"></font-awesome-icon>
                                </span>
                                <Field class="form-control auth-input" name="login" id="login" placeholder="Email administrateur"/>
                            </div>
                            <ErrorMessage name="login" class="text-danger mt-2 error-field"/>
                        </div>

                        <div class="row mb-3 auth-field-row">
                            <label for="password" class="auth-label">Mot de passe</label>
                            <div class="d-flex align-items-center position-relative">
                                <span class="position-absolute px-4 auth-field-icon">
                                    <font-awesome-icon icon="key"></font-awesome-icon>
                                </span>
                                <Field class="form-control auth-input" :type="showPassword ? 'text' : 'password'" name="password" id="password" placeholder="Mot de passe"/>
                                <button type="button" class="password-toggle" :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'" @click="showPassword = !showPassword">
                                    <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'"></font-awesome-icon>
                                </button>
                            </div>
                            <ErrorMessage name="password" class="text-danger mt-2 error-field"/>
                        </div>

                        <div class="form-group mb-3">
                            <button type="submit" class="btn cs-btn-primary w-100 py-2 auth-submit" :disabled="loading">
                                <span class="text-white fs-6 fw-bold">{{ loading ? 'Connexion...' : 'Connexion' }}</span>
                            </button>
                        </div>

                        <div class="form-group">
                            <div v-if="message" class="auth-message auth-message-error">
                                {{ message }}
                            </div>
                        </div>
                    </Form>

                    <div class="auth-footer-row">
                        <span class="small text-muted">Pas encore de compte ?</span>
                        <router-link to="/admin/register" class="fw-bold">Créer un accès admin</router-link>
                    </div>
                </div>

                <div class="col-md-6 d-none d-md-flex p-0 m-0 position-relative">
                    <div class="right-side position-relative w-100 h-100">
                        <div class="position-absolute color-layer"></div>
                    </div>
                    <div class="bg-text position-absolute top-50 start-50 translate-middle w-75">
                        <img src="@/assets/logo.png" alt="logo" width="44" height="36" class="d-inline-block align-text-top"/>
                        <h2 class="text-white fw-bolder mb-3">Gestion académique intelligente</h2>
                        <p class="text-white description">Une interface unifiée pour piloter les référentiels, suivre les réservations et publier les plannings sans friction.</p>
                        <div class="auth-side-metrics">
                            <div class="auth-side-chip">Planning centralisé</div>
                            <div class="auth-side-chip">Réservations suivies</div>
                            <div class="auth-side-chip">Administration simplifiée</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

export default {
    name: 'LoginView',
    components: {
        Form,
        Field,
        ErrorMessage
    },
    data() {
        const schema = yup.object().shape({
            login: yup.string().required('Le login est requis.'),
            password: yup.string().required('Le mot de passe est requis.'),
        });

        return {
            loading: false,
            message: '',
            showPassword: false,
            schema,
        }
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        },
    },
    created() {
        if (this.loggedIn) {
            this.$router.push('/admin');
        }
    },
    methods: {
        handleLogin(admin) {
            this.loading = true;

            this.$store.dispatch('auth/login', admin).then(
                () => {
                    this.$router.push('/admin');
                },
                (error) => {
                    this.loading = false;
                    this.message =
                        (error.response && error.response.data && error.response.data.message) ||
                        (error.message === 'Network Error' ? 'Connexion au serveur impossible. Vérifiez la connexion internet et réessayez.' : error.message) ||
                        error.toString();
                }
            );
        },
    },
}
</script>

<style>
.auth-screen {
    min-height: 100vh;
    background: radial-gradient(circle at top right, #d5c9ff, #f4f7ff 45%);
}

.auth-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.auth-brand-link {
    color: #1a2340;
}

.auth-back-link {
    color: #4e38cf;
    font-weight: 700;
}

.auth-card {
    border-radius: 24px;
    background: #fff;
    box-shadow: 0 30px 60px rgba(33, 44, 74, 0.18);
    border: 1px solid rgba(255, 255, 255, 0.92);
}

.auth-panel {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.auth-kicker {
    display: inline-flex;
    width: fit-content;
    padding: 0.38rem 0.78rem;
    border-radius: 999px;
    background: rgba(91, 44, 255, 0.1);
    color: #4f32d2;
    font-size: 0.76rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.auth-heading {
    font-size: clamp(1.6rem, 2vw, 2.2rem);
    font-weight: 800;
    color: #161f3a;
    line-height: 1.15;
}

.auth-intro {
    color: #65708d;
    line-height: 1.75;
}

.auth-field-row {
    margin-left: 0;
    margin-right: 0;
}

.auth-label {
    display: block;
    margin-bottom: 0.55rem;
    color: #2d3754;
    font-size: 0.88rem;
    font-weight: 700;
}

.auth-field-icon {
    color: #7d86a3;
}

.auth-input {
    min-height: 52px;
    padding: 0.75rem 3rem;
    border-radius: 16px;
    border: 1px solid #d4daea;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04);
    background: #fbfcff;
}

.auth-input:focus {
    border-color: #7d63f8;
    box-shadow: 0 0 0 4px rgba(125, 99, 248, 0.12);
    background: #fff;
}

.right-side {
    background-image: url('@/assets/management.jpg');
    filter: blur(4px);
    -webkit-filter: blur(4px);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

.color-layer {
    background-color: rgba(153, 95, 119, 0.7);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
}

.error-field {
    font-size: 0.78rem;
    font-weight: 700;
}

.password-toggle {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: transparent;
    color: #6f7895;
    width: 34px;
    height: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.auth-submit {
    min-height: 52px;
    border-radius: 16px;
}

.auth-message {
    padding: 0.9rem 1rem;
    border-radius: 14px;
    font-weight: 600;
}

.auth-message-error {
    color: #b42318;
    background: #fff1f1;
    border: 1px solid #fecaca;
}

.auth-footer-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.bg-text {
    text-align: left;
}

.description {
    font-size: 0.95rem;
    line-height: 1.7;
}

.auth-side-metrics {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: 1.2rem;
}

.auth-side-chip {
    padding: 0.45rem 0.8rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.16);
    color: #fff;
    font-size: 0.8rem;
    font-weight: 700;
}

@media (max-width: 768px) {
    .auth-topbar,
    .auth-footer-row {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>