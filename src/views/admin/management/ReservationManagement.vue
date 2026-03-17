<template>
    <BasicLayout>
        <template v-slot:main-title>
            <h1 class="fs-4 fw-bold m-0">Réservations de salle</h1>
        </template>

        <template v-slot:main-content>
            
            <v-alert
                v-if="isSuccess"
                dismissible
                type="success"
                prominent
                :class="{ 'fade-enter-active': isSuccess, 'fade-leave-active': !isSuccess }"
                class="alert-width position-fixed top-0 start-50 translate-middle-x mt-10"
                @input="dismissAlert"
            >
                Succès ! Votre opération a été effectuée avec succès.
            </v-alert>
            
            <v-alert
                v-if="isError"
                dismissible
                type="error"
                prominent
                :class="{ 'fade-enter-active': !isError, 'fade-leave-active': isError }"
                class="alert-width position-fixed top-0 start-50 translate-middle-x mt-10"
                @input="dismissAlert"
            >
                Erreur ! Une erreur s'est produite lors de l'opération.
            </v-alert>

            <div class="cs-card p-3 p-md-4">
            <p class="text-h6 text-grey-darken-1 w-100 text-left m-auto">Faites une réservation de salle</p>
            <br>
            <p class="text-block alert alert-danger text-body-1 w-100 text-left m-auto">
                <span class="font-weight-bold">Attention</span> ! vous ne pouvez pas faire de demande de réservation pour une salle, à une même heure déjà réservée.
            </p>
            <h1 class="text-h6 w-100 text-left m-auto">Remplissez le formulaire ci-dessous pour demander une salle</h1>

            <div class="d-flex justify-center pr-16 w-100">

                <form class="block-reservation text-left mt-4 p-4 border w-100 row" v-if="!isLoading">
                <div class="container">
                    <p class="text-body-1 font-weight-bold col-md-10">Les champs marqués d’un (<span class="font-weight-bold text-danger">*</span>) sont obligatoires</p>

                    <div class="form-group">
                    <label class="text-grey font-weight-bold" for="salle">Quelle salle voulez-vous réserver ? <span class="font-weight-bold text-danger">*</span></label>
                    <select id="salle" class="form-control" v-model="selectedSalle">
                        <option value="">Salle</option>
                        <option value="salle1">Salle 1</option>
                        <option value="salle2">Salle 2</option>
                        <option value="salle3">Salle 3</option>
                    </select>
                    </div>

                    <div class="form-group">
                    <label class="text-grey font-weight-bold mt-10" for="date_reservation">A quelle date voulez-vous réserver cette salle ? <span class="font-weight-bold text-danger">*</span></label>
                    <input type="date" id="date_reservation" class="form-control" v-model="selectedDate" required>
                    </div>

                    <div class="form-group">
                    <label class="text-grey font-weight-bold mt-10" for="heure_debut">Heure de début <span class="font-weight-bold text-danger">*</span></label>
                    <input type="text" id="heure_debut" class="form-control" v-model="selectedHeureDebut" required>
                    </div>

                    <div class="form-group">
                    <label class="text-grey font-weight-bold mt-10" for="heure_fin">Heure de fin <span class="font-weight-bold text-danger">*</span></label>
                    <input type="text" id="heure_fin" class="form-control" v-model="selectedHeureFin" required>
                    </div>

                    <div class="form-group">
                    <label class="text-grey font-weight-bold mt-10" for="motif">Pour quelle raison souhaitez-vous réserver cette salle ?</label>
                    <textarea id="motif" class="form-control" v-model="motif"></textarea>
                    </div>

                    <v-btn class="btn cs-btn-primary text-white w-100 mt-6" @click="newReservation">
                        Consulter
                    </v-btn>
                </div>
                </form>
            
                <div class="loader-container mt-16">

                    <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
                    <v-progress-circular
                        v-if="isLoading"
                        indeterminate
                        color="primary"
                    ></v-progress-circular>
                    <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

                    <!-- Contenu de votre application -->
                </div>

            </div>
            </div>
            <!-- ... le reste du code ... -->
        </template>
    </BasicLayout>
</template>

<script>
    import BasicLayout from '@/components/BasicLayout.vue'
    import { Form, Field, ErrorMessage } from 'vee-validate'
    import adminService from '@/services/admin.service'

    export default {
        name: 'ReservationManagement',
        components: {
            Form,
            Field,
            ErrorMessage,
            BasicLayout
        },
        data() {
            return {
                selectedSalle: '',
                selectedDate: '',
                selectedHeureDebut: '',
                selectedHeureFin: '',
                motif: '',
    
                isLoading: false, // Variable indiquant si le chargement est en cours
                isSuccess: false, // Variable indiquant si l'opération a réussi
                isError: false, // Variable indiquant si l'opération a réussi
            };
        },
        mounted() {},
        created() {},
        computed: {},
        methods: {
            // ... le reste du code ...

            newReservation() {
                this.isLoading = true; // Début du chargement au clic sur le bouton "Valider"

                // Effectuez ici votre logique de traitement ou d'appel à l'API

                // Simulez une pause de 2 secondes avant de terminer le chargement
                setTimeout(() => {
                    this.isLoading = false; // Fin du chargement après un délai simulé
                    this.isSuccess = true; // Affiche l'alerte de succès

                    // Masque l'alerte de succès après 3 secondes (ajustez selon vos besoins)
                    setTimeout(() => {
                        this.isSuccess = false;
                    }, 3000);
                }, 2000);
            
                // Logique de réservation d'une salle.
            },

            dismissAlert() {
                // Masque l'alerte de succès si l'utilisateur la ferme manuellement
                this.isSuccess = false;
            },
        },
    }
</script>

<style scoped>
    .reservation-section {
        background-color: #f1f1f1;
        border-radius: 5px;
    }

    .reservations {
        border-top: none;
        border-left: none;
        border-right: none;
        border-bottom: 1px solid #cfcfcf;
        padding: 0.7%;
    }

    .new-dot {
        font-size: 0.6rem;
        color: #f73b66;
        margin-left: 5%;
    }

    .alert-width {
        max-width: 33.33%; /* 4 colonnes sur 12 */
        z-index: 9999;
    }

    .block-reservation {
        border-radius: 14px;
        border-color: var(--cs-border) !important;
        box-shadow: var(--cs-shadow);
    }

</style>