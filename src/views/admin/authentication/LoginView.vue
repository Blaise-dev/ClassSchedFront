<template>
    <div class="auth-screen">
        <div class="cs-container py-4">
            <div class="mb-3">
                <router-link to="/" class="navbar-brand fw-bolder text-decoration-none d-inline-flex align-items-center gap-2">
                    <img src="@/assets/logo.png" alt="logo" width="32" height="26" class="d-inline-block align-text-top"/>
                    <span>ClassSched</span>
                </router-link>
            </div>

            <div class="row g-0 auth-card overflow-hidden">
                <div class="col-12 col-md-6 p-4 p-md-5 bg-white">
                    <h2 class="fs-6 fw-normal text-uppercase text-center">Bienvenue sur</h2>
                    <p class="fs-2 fw-bold text-center auth-title">CLASS-SCHED</p>
                    <p class="text-center mb-4 text-muted small">Connectez-vous avec votre compte administrateur pour gérer la plateforme.</p>

                    <Form @submit="handleLogin" :validation-schema="schema" class="my-4">
                        <div class="row mb-3">
                            <div class="d-flex align-items-center position-relative">
                                <span class="position-absolute px-4">
                                    <font-awesome-icon icon="user"></font-awesome-icon>
                                </span>
                                <Field class="form-control auth-input" name="login" id="login" placeholder="Email administrateur"/>
                            </div>
                            <ErrorMessage name="login" class="text-danger mt-2 error-field"/>
                        </div>
                        <div class="row mb-3">
                            <div class="d-flex align-items-center position-relative">
                                <span class="position-absolute px-4">
                                    <font-awesome-icon icon="key"></font-awesome-icon>
                                </span>
                                <Field class="form-control auth-input" type="password" name="password" id="password" placeholder="Mot de passe"/>
                                <span class="position-absolute end-0 px-4 mx-2">
                                    <font-awesome-icon icon="eye" id="password-eye"></font-awesome-icon>
                                </span>
                            </div>
                            <ErrorMessage name="password" class="text-danger mt-2 error-field"/>
                        </div>
                        <div class="form-group mb-3">
                            <button type="submit" class="btn cs-btn-primary w-100 py-2" :disabled="loading">
                                <span class="text-white fs-6 fw-bold">Connexion</span>
                            </button>
                        </div>
                        <div class="form-group">
                            <div v-if="message" class="border border-danger text-danger px-4 py-3 rounded">
                                {{ message }}
                            </div>
                        </div>
                    </Form>
                    <p class="text-end small mb-0">Pas encore de compte ? <router-link to="/admin/register" class="fw-bold">Créer un accès admin</router-link></p>
                </div>

                <div class="col-md-6 d-none d-md-flex p-0 m-0 position-relative">
                    <div class="right-side position-relative w-100 h-100">
                        <div class="position-absolute color-layer"></div>
                    </div>
                    <div class="bg-text position-absolute text-center top-50 start-50 translate-middle w-75">
                        <img src="@/assets/logo.png" alt="logo" width="44" height="36" class="d-inline-block align-text-top"/>
                        <h2 class="text-white fw-bolder mb-3">Gestion académique intelligente</h2>
                        <p class="text-white description">Supervisez les emplois du temps, gérez les réservations et maintenez une communication fiable entre les acteurs de l’université.</p>
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
            login: yup.string().required("Le login est requis."),
            password: yup.string().required("Le mot de passe est requis."),
        });

        return {
            loading: false,
            message: "",
            show: true,
            schema,
        }
    },
    mounted() {
        const passwordEye = document.querySelector('#password-eye');
        const password = document.querySelector('#password');
        passwordEye.addEventListener('click', () => {
            const type = password.getAttribute('type') === 'password' ?'text' : 'password';
            password.setAttribute('type', type);
        });
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        },
    },
    created() {
        if (this.loggedIn) {
            // this.$router.push("/admin");
        }
    },
    methods: {
        handleLogin(admin) {
            this.loading = true;

            this.$store.dispatch("auth/login", admin).then(
                () => {
                    this.$router.push("/admin");
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

.auth-card {
    border-radius: 18px;
    background: #fff;
    box-shadow: 0 30px 60px rgba(33, 44, 74, 0.18);
    border: 1px solid rgba(255, 255, 255, 0.92);
}

.auth-title {
    color: var(--cs-accent);
}

.auth-input {
    padding: 0.75rem 3rem;
    border-radius: 12px;
    border: 1px solid #d4daea;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04);
}

.right-side {
    background-image: url("@/assets/management.jpg");
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
    font-size: 0.7rem;
    font-weight: bolder;
}

#password-eye {
    cursor: pointer;
}

.description {
        font-size: 0.95rem;
        line-height: 1.7;
}
</style>