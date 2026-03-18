<template>
    <admin-dashboard-layout>
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

            <section class="reservation-page">
                <div class="reservation-hero">
                    <div>
                        <span class="reservation-kicker">Demande encadrée</span>
                        <h2>Faites une réservation de salle</h2>
                        <p>Remplissez le formulaire ci-dessous pour envoyer une demande claire et exploitable par l'administration.</p>
                    </div>
                    <div class="reservation-hero-note">
                        <i class="fas fa-calendar-check"></i>
                        <span>Validation plus rapide avec des informations complètes</span>
                    </div>
                </div>

                <div class="reservation-warning" role="alert">
                    <i class="fas fa-triangle-exclamation"></i>
                    <span><strong>Attention :</strong> vous ne pouvez pas réserver une salle déjà occupée au même horaire.</span>
                </div>

                <form class="reservation-form" v-if="!isLoading" @submit.prevent="newReservation">
                    <p class="required-note">Les champs marqués d’un <span>*</span> sont obligatoires.</p>

                    <div class="form-grid">
                        <div class="form-group form-group-full">
                            <label for="salle">Salle <span>*</span></label>
                            <select id="salle" class="form-control" v-model="selectedSalle" required>
                                <option value="">Choisir une salle</option>
                                <option v-for="salle in salles" :key="salle.codeSalle" :value="salle.codeSalle">{{ salle.nomSalle }} ({{ salle.codeSalle }})</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="date_reservation">Date <span>*</span></label>
                            <input type="date" id="date_reservation" class="form-control" v-model="selectedDate" required>
                        </div>

                        <div class="form-group">
                            <label for="heure_debut">Heure de début <span>*</span></label>
                            <input type="time" id="heure_debut" class="form-control" v-model="selectedHeureDebut" required>
                        </div>

                        <div class="form-group">
                            <label for="heure_fin">Heure de fin <span>*</span></label>
                            <input type="time" id="heure_fin" class="form-control" v-model="selectedHeureFin" required>
                        </div>

                        <div class="form-group form-group-full">
                            <label for="motif">Motif</label>
                            <textarea id="motif" class="form-control" rows="4" v-model="motif" placeholder="Précisez le contexte de la réservation..."></textarea>
                        </div>
                    </div>

                    <v-btn type="submit" class="cs-btn-primary reservation-submit" block>
                        Envoyer la demande
                    </v-btn>
                </form>

                <div class="loader-container" v-else>
                    <v-progress-circular indeterminate color="primary" size="68"></v-progress-circular>
                </div>
            </section>
    </admin-dashboard-layout>
</template>

<script>
    import AdminDashboardLayout from '@/layouts/AdminDashboardLayout.vue'
    import adminService from '@/services/admin.service'

    export default {
        name: 'ReservationManagement',
        components: {
            AdminDashboardLayout
        },
        data() {
            return {
                salles: [],
                selectedSalle: '',
                selectedDate: '',
                selectedHeureDebut: '',
                selectedHeureFin: '',
                motif: '',
                message: '',
    
                isLoading: false, // Variable indiquant si le chargement est en cours
                isSuccess: false, // Variable indiquant si l'opération a réussi
                isError: false, // Variable indiquant si l'opération a réussi
            };
        },
        mounted() {
            this.loadSalles();
        },
        created() {},
        computed: {},
        methods: {
            async loadSalles() {
                try {
                    const response = await adminService.getSalles();
                    this.salles = Array.isArray(response?.data) ? response.data : [];
                } catch (error) {
                    this.message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                    this.isError = true;
                }
            },

            async newReservation() {
                if (!this.selectedSalle || !this.selectedDate || !this.selectedHeureDebut || !this.selectedHeureFin) {
                    this.isError = true;
                    this.message = 'Veuillez renseigner tous les champs obligatoires.';
                    return;
                }

                this.isLoading = true;
                this.isError = false;
                this.isSuccess = false;

                try {
                    await adminService.addReservation({
                        salle: this.selectedSalle,
                        date: this.selectedDate,
                        debut: this.selectedHeureDebut,
                        fin: this.selectedHeureFin,
                        motif: this.motif,
                    });

                    this.isSuccess = true;
                    this.selectedSalle = '';
                    this.selectedDate = '';
                    this.selectedHeureDebut = '';
                    this.selectedHeureFin = '';
                    this.motif = '';
                } catch (error) {
                    this.message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                    this.isError = true;
                } finally {
                    this.isLoading = false;
                }
            },

            dismissAlert() {
                this.isSuccess = false;
                this.isError = false;
            },
        },
    }
</script>

<style scoped>
    .alert-width {
        max-width: 33.33%;
        z-index: 9999;
    }

    .reservation-page {
        background: linear-gradient(180deg, #ffffff, #fbfcff);
        color: #151b31;
        border: 1px solid #e5e8f2;
        border-radius: 24px;
        padding: 1.4rem;
        box-shadow: 0 18px 38px rgba(17, 24, 52, 0.08);
    }

    .reservation-hero {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #edf1f8;
    }

    .reservation-kicker {
        display: inline-flex;
        align-items: center;
        padding: 0.38rem 0.78rem;
        border-radius: 999px;
        background: rgba(91, 44, 255, 0.1);
        color: #5b2cff;
        font-size: 0.78rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.04em;
    }

    .reservation-hero h2 {
        margin: 0.85rem 0 0;
        font-size: 1.4rem;
        font-weight: 800;
        color: #1a2240;
    }

    .reservation-hero p {
        margin: 0.45rem 0 0;
        color: #5d6683;
        max-width: 640px;
        line-height: 1.7;
    }

    .reservation-hero-note {
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
        padding: 0.85rem 1rem;
        border-radius: 16px;
        background: #f7f8ff;
        border: 1px solid #e5e9f6;
        color: #39425f;
        font-weight: 700;
        font-size: 0.88rem;
    }

    .reservation-warning {
        margin-top: 1rem;
        display: flex;
        align-items: flex-start;
        gap: 0.65rem;
        background: linear-gradient(180deg, #fff8eb, #fff3df);
        border: 1px solid #ffd7a1;
        border-radius: 16px;
        padding: 0.95rem 1rem;
        color: #7f4c08;
        font-size: 0.94rem;
    }

    .reservation-form {
        margin-top: 1.25rem;
    }

    .required-note {
        margin: 0 0 0.8rem;
        color: #596385;
        font-weight: 600;
    }

    .required-note span,
    .form-group label span {
        color: #d74252;
        font-weight: 800;
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.9rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
    }

    .form-group-full {
        grid-column: 1 / -1;
    }

    .form-group label {
        font-weight: 700;
        color: #2b3452;
        font-size: 0.92rem;
    }

    .form-control {
        height: 52px;
        border-radius: 16px;
        border: 1px solid #d8dff0;
        color: #1a223d;
        background: #fbfcff;
        padding: 0 0.95rem;
        transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
    }

    textarea.form-control {
        height: auto;
        min-height: 136px;
        resize: vertical;
        padding-top: 0.9rem;
    }

    .form-control:focus {
        border-color: #7d63f8;
        background: #ffffff;
        box-shadow: 0 0 0 4px rgba(125, 99, 248, 0.12);
    }

    .reservation-submit {
        margin-top: 1.15rem;
        width: 100%;
        min-height: 52px;
        font-weight: 700;
        border-radius: 16px;
        letter-spacing: 0.01em;
    }

    .loader-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 260px;
    }

    @media (max-width: 900px) {
        .reservation-hero {
            flex-direction: column;
        }

        .form-grid {
            grid-template-columns: 1fr;
        }

        .alert-width {
            max-width: 92%;
        }
    }

    @media (max-width: 576px) {
        .reservation-page {
            padding: 0.85rem;
        }

        .reservation-hero h2 {
            font-size: 1.14rem;
        }

        .reservation-warning {
            font-size: 0.88rem;
        }

        .form-control {
            height: 44px;
            font-size: 0.92rem;
        }
    }

</style>