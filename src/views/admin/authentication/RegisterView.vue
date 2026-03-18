<template>
    <div class="auth-screen py-4">
        <div class="cs-container">
            <div class="auth-topbar mb-4">
                <router-link to="/" class="navbar-brand fw-bolder text-decoration-none d-inline-flex align-items-center gap-2 auth-brand-link">
                    <img src="@/assets/logo.png" alt="logo" width="32" height="26" class="d-inline-block align-text-top"/>
                    <span>ClassSched</span>
                </router-link>
                <router-link to="/admin/login" class="auth-back-link">Déjà inscrit ? Se connecter</router-link>
            </div>

            <div class="row g-0 auth-card overflow-hidden">
                <div class="col-12 col-md-6 p-4 p-md-5 bg-white auth-panel">
                    <span class="auth-kicker">Création de compte</span>
                    <h1 class="auth-heading mt-3">Créer un accès administrateur</h1>
                    <p class="auth-intro mb-4">Renseignez les informations essentielles pour ouvrir un accès d’administration et prendre la main sur la plateforme.</p>

                    <Form @submit="handleRegister" :validation-schema="schema">
                        <div v-if="!successful">
                            <div class="form-group mb-3 auth-field-row">
                                <label for="pseudo" class="auth-label">Pseudo</label>
                                <div class="position-relative">
                                    <span class="auth-field-icon auth-field-icon-left">
                                        <font-awesome-icon icon="id-card"/>
                                    </span>
                                    <Field class="form-control auth-input" name="pseudo" id="pseudo" type="text" placeholder="Pseudo administrateur" />
                                </div>
                                <ErrorMessage name="pseudo" class="error-feedback"/>
                            </div>

                            <div class="form-group mb-3 auth-field-row">
                                <label for="email" class="auth-label">Adresse mail</label>
                                <div class="position-relative">
                                    <span class="auth-field-icon auth-field-icon-left">
                                        <font-awesome-icon icon="user"/>
                                    </span>
                                    <Field class="form-control auth-input" name="email" id="email" type="email" placeholder="Adresse mail" />
                                </div>
                                <ErrorMessage name="email" class="error-feedback"/>
                            </div>

                            <div class="form-group mb-3 auth-field-row">
                                <label for="password" class="auth-label">Mot de passe</label>
                                <div class="position-relative">
                                    <span class="auth-field-icon auth-field-icon-left">
                                        <font-awesome-icon icon="key"/>
                                    </span>
                                    <Field class="form-control auth-input" name="password" id="password" :type="showPassword ? 'text' : 'password'" placeholder="Mot de passe" />
                                    <button type="button" class="password-toggle" :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'" @click="showPassword = !showPassword">
                                        <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'"/>
                                    </button>
                                </div>
                                <ErrorMessage name="password" class="error-feedback"/>
                                <small class="auth-help">Mot de passe entre 6 et 10 caractères selon la contrainte backend actuelle.</small>
                            </div>

                            <div class="form-group">
                                <button type="submit" class="btn cs-btn-primary w-100 auth-submit" :disabled="loading">
                                    <span>{{ loading ? 'Création...' : 'Créer le compte' }}</span>
                                </button>
                            </div>
                        </div>
                    </Form>

                    <div v-if="message" class="auth-message mt-3" :class="successful ? 'auth-message-success' : 'auth-message-error'">
                        {{ message }}
                    </div>

                    <div class="auth-footer-row mt-4">
                        <span class="small text-muted">Vous avez déjà un compte ?</span>
                        <router-link to="/admin/login" class="fw-bold">Connectez-vous</router-link>
                    </div>
                </div>

                <div class="col-md-6 d-none d-md-flex p-0 m-0 position-relative">
                    <div class="right-side position-relative w-100 h-100">
                        <div class="position-absolute color-layer"></div>
                    </div>
                    <div class="bg-text position-absolute top-50 start-50 translate-middle w-75">
                        <img src="@/assets/logo.png" alt="logo" width="44" height="36" class="d-inline-block align-text-top"/>
                        <h2 class="text-white fw-bolder mb-3">Administration plus lisible</h2>
                        <p class="text-white description">Créez un accès et centralisez la gestion académique dans une interface plus homogène, plus claire et plus simple à parcourir.</p>
                        <div class="auth-side-metrics">
                            <div class="auth-side-chip">Accès sécurisé</div>
                            <div class="auth-side-chip">Référentiels unifiés</div>
                            <div class="auth-side-chip">Parcours simplifié</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

export default {
    name: 'RegisterView',
    components: {
        Form,
        Field,
        ErrorMessage
    },
    data() {
        const schema = yup.object().shape({
            pseudo: yup
                .string()
                .required('Le pseudo est requis.')
                .min(3, 'Doit contenir au moins 3 caractères!')
                .max(30, 'Doit contenir au plus 30 caractères!'),
            email: yup
                .string()
                .required("L'adresse mail est requise.")
                .email("L'adresse mail est invalide.")
                .max(70, 'Doit contenir au plus 70 caracteres!'),
            password: yup
                .string()
                .required('Le mot de passe est requis.')
                .min(6, 'Doit contenir au moins 6 caractères!')
                .max(10, 'Doit contenir au plus 10 caractères (contrainte backend).'),
        });

        return {
            successful: false,
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
    mounted() {
        if (this.loggedIn) {
            this.$router.push('/admin');
        }
    },
    methods: {
        handleRegister(admin) {
            this.message = '';
            this.successful = false;
            this.loading = true;

            this.$store.dispatch('auth/register', admin).then(
                (data) => {
                    this.message = data.message;
                    this.successful = true;
                    this.loading = false;
                    this.$router.push('/admin/login');
                },
                (error) => {
                    this.message =
                        (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        (error.message === 'Network Error' ? 'Connexion au serveur impossible. Vérifiez la connexion internet et réessayez.' : error.message) ||
                        error.toString();
                    this.successful = false;
                    this.loading = false;
                }
            );
        },
    },
};
</script>

<style scoped>
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
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: #7d86a3;
}

.auth-field-icon-left {
    left: 1rem;
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

.auth-help {
    display: block;
    margin-top: 0.45rem;
    color: #7a839d;
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

.auth-message-success {
    color: #067647;
    background: #ecfdf3;
    border: 1px solid #abefc6;
}

.error-feedback {
    display: block;
    margin-top: 0.45rem;
    color: #c73645;
    font-size: 0.78rem;
    font-weight: 700;
}

.auth-footer-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
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
    background-color: rgba(91, 44, 255, 0.56);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
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