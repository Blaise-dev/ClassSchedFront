<template>
    <admin-dashboard-layout>
        <section class="tt-page-intro tt-surface p-4 mb-4">
            <div class="tt-page-intro-copy">
                <span class="tt-kicker">Pilotage du planning</span>
                <h2 class="tt-title">Construisez et mettez à jour les emplois du temps avec plus de contrôle</h2>
                <p class="tt-subtitle">Sélectionnez la filière, l'année et la période souhaitées puis modifiez directement la grille.</p>
            </div>
        </section>
            
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

            <div class="menu-container tt-surface p-3 p-md-4 mb-3">
            <div class="select-container tt-controls-grid">
                <v-select
                v-model="selectedTeacher"
                :items="teachers"
                :hint="selectedTeacher ? `${selectedTeacher}` : ''"
                persistent-hint
                item-title = "text"
                item-value = "value"
                label="Enseignant"
                variant="outlined"
                density="comfortable"
                class="tt-field"
                ></v-select>

                <v-select
                v-model="selectedMajor"
                :items="majors"
                :hint="selectedMajor ? `${selectedMajor}` : ''"
                persistent-hint
                item-title = "text"
                item-value = "value"
                label="Filière"
                variant="outlined"
                density="comfortable"
                class="tt-field"
                ></v-select>

                <v-select
                v-model="selectedLevel"
                :items="levels"
                :hint="selectedLevel ? `${selectedLevel}` : ''"
                persistent-hint
                item-title = "text"
                item-value = "value"
                label="Niveau"
                variant="outlined"
                density="comfortable"
                class="tt-field"
                :disabled="!selectedMajor"
                ></v-select>

                <v-select
                v-model="selectedOption"
                :items="options"
                :hint="selectedOption ? `${selectedOption}` : ''"
                persistent-hint
                item-title = "text"
                item-value = "value"
                label="Option"
                variant="outlined"
                density="comfortable"
                class="tt-field"
                :disabled="!selectedLevel"
                ></v-select>

                <v-btn class="tt-action-btn tt-action-search" icon variant="tonal" color="primary" :disabled="!(selectedOption && selectedDateDebut && selectedDateFin)" :class="{ 'disabled': !(selectedOption && selectedDateDebut && selectedDateFin) }" @click="loadEmploi">
                    <v-icon>mdi-magnify</v-icon>
                </v-btn>
            </div>

            <div class="button-container tt-button-group">
                <v-btn class="tt-action-btn" icon variant="tonal" color="error" @click="deleteEmploi">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>

                <v-btn class="tt-action-btn" icon variant="tonal" color="success" @click="confirmEmploi">
                    <v-icon>mdi-check</v-icon>
                </v-btn>
            </div>

            </div>

            <div class="row mt-2 mb-3">
                <div class="row w-100 m-auto tt-date-row tt-surface tt-date-panel p-3 p-md-4">

                    <div class="form-group col-12 col-md-4">
                        <label class="tt-label" for="date_debut">Date de début</label>
                        <input type="date" id="date_debut" class="form-control tt-input" title="Date de début" v-model="selectedDateDebut">
                    </div>

                    <div class="form-group col-12 col-md-4">
                        <label class="tt-label" for="date_fin">Date de fin</label>
                        <input type="date" id="date_fin" class="form-control tt-input" title="Date de fin" v-model="selectedDateFin">
                    </div>

                    <v-select
                        v-model="selectedYear"
                        :items="years"
                        :hint="selectedYear ? `${selectedYear}` : ''"
                        persistent-hint
                        item-title="text"
                        item-value="value"
                        label="Année"
                        variant="outlined"
                        density="comfortable"
                        class="col-12 col-md-4 tt-year-field"
                    ></v-select>
                </div>
            </div>
            <time-table-edit
                :initial-data="initialData"
                :ue-options="ueCatalog"
                :teacher-options="teacherCatalog"
                :room-options="roomCatalog"
                :default-teacher="selectedTeacher"
                @selected-data-changed="handleSelectedDataChange"
                v-if="!isLoading"
                class="w-100 m-auto tt-surface p-2 tt-table-wrap"
            ></time-table-edit>
            
            <div class="loader-container mt-16">

                <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
                <v-progress-circular
                    v-if="isLoading"
                    indeterminate
                    color="primary"
                ></v-progress-circular>

                <!-- Contenu de votre application -->
            </div>
            <!-- ... le reste du code ... -->
    </admin-dashboard-layout>
</template>

<script>
import AdminDashboardLayout from "@/layouts/AdminDashboardLayout.vue"
import adminService from '@/services/admin.service'
import TimeTableEdit from '@/components/admin/TimeTableEdit.vue'
import { convertToTimetable } from '@/views/utils.js';

const DAY_TO_API = {
    Lundi: 'lundi',
    Mardi: 'mardi',
    Mercredi: 'mercredi',
    Jeudi: 'jeudi',
    Vendredi: 'vendredi',
    Samedi: 'samedi',
    Dimanche: 'dimanche',
};

export default {
    name: "TimeTable",
    components: {
        AdminDashboardLayout,
        TimeTableEdit,
    },
    data() {
        return {
            initialData: {},
            parentSelectedData: {},
            teachers: [],
            options: [],
            majors: [],
            levels: [],
            ueCatalog: [],
            allUeCatalog: [],
            roomCatalog: [],
            teacherCatalog: [],
            years: [
                { text: '2023/2024', value: '2023/2024' },
                { text: '2022/2023', value: '2022/2023' },
            ],
            selectedTeacher: null,
            selectedOption: null,
            selectedMajor: null,
            selectedLevel: null,
            selectedDateDebut: '2023-10-19',
            selectedDateFin: '2024-02-27',
            selectedYear: "2023/2024",
            isLoading: false,
            isSuccess: false,
            isError: false,
            message: '',
        };
    },
    watch: {
        selectedDateDebut() {
            this.isSuccess = false;
        },
        selectedDateFin() {
            this.isSuccess = false;
        },
        selectedYear() {
            this.isSuccess = false;
        },
        async selectedMajor(selectedMajor) {
            if (!selectedMajor) {
                this.levels = [];
                this.selectedLevel = null;
                return;
            }
            try {
                const response = await adminService.getLevelsFiliere(selectedMajor);
                const niveaux = Array.isArray(response?.data) ? response.data : [];
                this.levels = niveaux.map((niveau) => ({
                    text: niveau.nom,
                    value: niveau.codeNiveau,
                }));
                this.selectedLevel = null;
            } catch (error) {
                this.message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                this.isError = true;
            }
        },
        async selectedLevel(selectedLevel) {
            if (!selectedLevel) {
                this.options = [];
                this.selectedOption = null;
                this.ueCatalog = [...this.allUeCatalog];
                return;
            }
            try {
                const response = await adminService.getOptionsLevel(selectedLevel);
                const options = Array.isArray(response?.data) ? response.data : [];
                this.options = options.map((option) => ({
                    text: option.nom,
                    value: option.codeOption,
                }));
                this.selectedOption = null;
            } catch (error) {
                this.message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                this.isError = true;
            }
        },
        async selectedOption(selectedOption) {
            if (!selectedOption) {
                this.ueCatalog = [...this.allUeCatalog];
                return;
            }

            try {
                const response = await adminService.getUesByOption(selectedOption);
                const ues = Array.isArray(response?.data) ? response.data : [];
                const mapped = ues.map((item) => ({
                    code: item.codeUE,
                    intitulé: item.intitulé || item.codeUE,
                }));
                this.ueCatalog = mapped.length ? mapped : [...this.allUeCatalog];
            } catch (error) {
                this.ueCatalog = [...this.allUeCatalog];
                this.message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                this.isError = true;
            }
        }
    },
    async created() {
        await Promise.all([this.loadFilieres(), this.loadReferenceData()]);
    },
    methods: {
        async loadReferenceData() {
            try {
                const [uesResponse, sallesResponse, enseignantsResponse] = await Promise.all([
                    adminService.getUEs(),
                    adminService.getSalles(),
                    adminService.getEnseignants(),
                ]);

                const ues = Array.isArray(uesResponse?.data) ? uesResponse.data : [];
                const salles = Array.isArray(sallesResponse?.data) ? sallesResponse.data : [];
                const enseignants = Array.isArray(enseignantsResponse?.data) ? enseignantsResponse.data : [];

                this.allUeCatalog = ues.map((item) => ({
                    code: item.codeUE,
                    intitulé: item.intitulé || item.codeUE,
                }));
                this.ueCatalog = [...this.allUeCatalog];

                this.roomCatalog = salles.map((item) => ({
                    code: item.codeSalle,
                    nom: item.nomSalle || item.codeSalle,
                }));

                this.teacherCatalog = enseignants.map((item) => {
                    const user = item?.utilisateur || {};
                    return {
                        id: item?.id,
                        email: user.email,
                        nom: user.nom || '',
                        prénom: user.prenom || '',
                    };
                }).filter((item) => item.email);

                this.teachers = this.teacherCatalog.map((item) => ({
                    text: `${item.nom} ${item.prénom} (${item.email})`.trim(),
                    value: item.email,
                }));

                this.selectedTeacher = this.teachers[0]?.value || null;
            } catch (error) {
                this.message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                this.isError = true;
            }
        },

        async loadFilieres() {
            try {
                const response = await adminService.getAllFilieres();
                const filieres = Array.isArray(response?.data) ? response.data : [];
                this.majors = filieres.map((filiere) => ({
                    text: filiere.nom,
                    value: filiere.codeFiliere,
                }));
            } catch (error) {
                this.message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                this.isError = true;
            }
        },

        async loadEmploi() {
            if (!(this.selectedOption && this.selectedDateDebut && this.selectedDateFin && this.selectedYear && this.selectedLevel)) return;
            this.isLoading = true;
            this.isError = false;
            this.isSuccess = false;
            try {
                const annee = String(this.selectedYear).split('/')[0];
                const response = await adminService.getTimeTable({ id: this.selectedLevel, annee });
                const timetable = convertToTimetable(response?.data);
                this.initialData = timetable;
                this.parentSelectedData = JSON.parse(JSON.stringify(timetable));
            } catch (error) {
                this.message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                this.isError = true;
            } finally {
                this.isLoading = false;
            }
        },

        async resolvePeriodeId() {
            const annee = Number(String(this.selectedYear).split('/')[0]);
            const dateDebut = this.selectedDateDebut;
            const dateFin = this.selectedDateFin;
            const baseUrl = (process.env.VUE_APP_API_URL || 'https://classsched-backend.onrender.com').replace(/\/$/, '');

            if (!annee || !dateDebut || !dateFin) {
                throw new Error('Période invalide: année et dates requises.');
            }

            const createPeriodPayload = {
                DateDebut: dateDebut,
                DateFin: dateFin,
                annee,
            };

            try {
                await fetch(`${baseUrl}/plannification/periodes/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(createPeriodPayload),
                });
            } catch (_) {
                // period may already exist
            }

            for (let id = 1; id <= 280; id += 1) {
                try {
                    const response = await fetch(`${baseUrl}/plannification/periodes/${id}/`);
                    if (!response.ok) continue;
                    const row = await response.json();
                    if (
                        row?.DateDebut === dateDebut &&
                        row?.DateFin === dateFin &&
                        Number(row?.annee) === annee
                    ) {
                        return id;
                    }
                } catch (_) {
                    // continue probing
                }
            }

            throw new Error('Impossible de résoudre l\'identifiant de période.');
        },

        async serializeGridToCours(data) {
            const entries = [];
            const period = await this.resolvePeriodeId();

            Object.entries(data || {}).forEach(([hourLabel, dayMap]) => {
                Object.entries(dayMap || {}).forEach(([dayLabel, cell]) => {
                    if (!cell || !cell.ue || !cell.room) return;
                    const startHour = Number(String(hourLabel).split(':')[0]);
                    if (Number.isNaN(startHour)) return;

                    const endHour = Math.min(startHour + 2, 23);
                    const heureDebut = `${String(startHour).padStart(2, '0')}:00`;
                    const heureFin = `${String(endHour).padStart(2, '0')}:00`;

                    entries.push({
                        heureDebut,
                        heureFin,
                        ue: cell.ue,
                        salle: cell.room,
                        periode: period,
                        jourDeCours: DAY_TO_API[dayLabel] || dayLabel.toLowerCase(),
                    });
                });
            });

            return entries;
        },

        async deleteEmploi() {
            this.isLoading = true;
            this.isError = false;
            this.isSuccess = false;

            try {
                const response = await adminService.getCours();
                const cours = Array.isArray(response?.data) ? response.data : [];
                const targetPeriod = this.selectedOption || this.selectedLevel || String(this.selectedYear).split('/')[0];

                const toDelete = cours.filter((coursItem) => {
                    const periodMatch = coursItem.periode && String(coursItem.periode) === String(targetPeriod);
                    const niveauMatch = coursItem.niveau && String(coursItem.niveau) === String(this.selectedLevel);
                    const optionMatch = coursItem.option && String(coursItem.option) === String(this.selectedOption);
                    return periodMatch || niveauMatch || optionMatch;
                });

                const deletePromises = toDelete
                    .map((item) => item.id)
                    .filter(Boolean)
                    .map((id) => adminService.deleteCours(id));

                if (deletePromises.length) {
                    await Promise.allSettled(deletePromises);
                }

                this.initialData = {};
                this.parentSelectedData = {};
                this.isSuccess = true;
            } catch (error) {
                this.message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                this.isError = true;
            } finally {
                this.isLoading = false;
            }
        },

        async confirmEmploi() {
            this.isLoading = true;
            this.isError = false;
            this.isSuccess = false;

            try {
                const sourceData = Object.keys(this.parentSelectedData || {}).length ? this.parentSelectedData : this.initialData;
                const payloads = await this.serializeGridToCours(sourceData);
                if (!payloads.length) {
                    this.isLoading = false;
                    this.isError = true;
                    this.message = 'Aucun cours à enregistrer.';
                    return;
                }

                const results = await Promise.allSettled(payloads.map((payload) => adminService.createCours(payload)));
                const successCount = results.filter((result) => result.status === 'fulfilled').length;

                if (!successCount) {
                    throw new Error('Échec de l’enregistrement des cours.');
                }

                this.isSuccess = true;
            } catch (error) {
                this.message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                this.isError = true;
            } finally {
                this.isLoading = false;
            }
        },

        handleSelectedDataChange(selectedData) {
            this.parentSelectedData = JSON.parse(JSON.stringify(selectedData || {}));
            this.initialData = JSON.parse(JSON.stringify(selectedData || {}));
        },

        dismissAlert() {
            this.isSuccess = false;
            this.isError = false;
        },
    },
}
</script>



<style scoped>
    .tt-page-intro {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    .tt-kicker {
        display: inline-flex;
        align-items: center;
        padding: 0.4rem 0.78rem;
        border-radius: 999px;
        background: rgba(91, 44, 255, 0.1);
        color: #5b2cff;
        font-size: 0.78rem;
        font-weight: 800;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }

    .tt-title {
        margin: 0.9rem 0 0;
        font-size: clamp(1.2rem, 2vw, 1.65rem);
        font-weight: 800;
        color: #131b34;
    }

    .tt-subtitle {
        margin: 0.5rem 0 0;
        color: #68728f;
        max-width: 680px;
        line-height: 1.65;
    }

    .tt-surface {
        background: #ffffff;
        color: #111423;
        border: 1px solid #e4e7f2;
        border-radius: 18px;
        box-shadow: 0 16px 38px rgba(15, 23, 52, 0.08);
    }

    .tt-surface :deep(.v-field__input),
    .tt-surface :deep(.v-label),
    .tt-surface :deep(.v-icon) {
        color: #1b2339 !important;
    }

    .tt-surface :deep(.v-field) {
        border-radius: 16px;
        background: #fbfcff;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }

    .tt-surface :deep(.v-field--variant-outlined .v-field__outline__start),
    .tt-surface :deep(.v-field--variant-outlined .v-field__outline__notch::before),
    .tt-surface :deep(.v-field--variant-outlined .v-field__outline__end) {
        border-color: #d8deef !important;
    }

    .tt-surface :deep(.v-messages) {
        color: #69738f !important;
    }

    .select-container {
        display: flex;
        width: 100%;
        margin: auto;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .tt-controls-grid {
        align-items: center;
        row-gap: 0.9rem;
    }

    .tt-field {
        min-width: 220px;
        flex: 1 1 220px;
    }

    .menu-container {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        border: 1px solid var(--cs-border);
    }

    .button-container {
        display: flex;
        align-items: center;
        gap: 0.4rem;
    }

    .tt-button-group {
        justify-content: flex-end;
        width: 100%;
        margin-top: 0.25rem;
    }

    .tt-action-btn {
        border-radius: 14px;
        width: 42px;
        height: 42px;
        border: 1px solid rgba(91, 44, 255, 0.16);
        box-shadow: 0 10px 18px rgba(91, 44, 255, 0.08);
    }

    .tt-action-search {
        margin-left: auto;
    }

    .tt-date-row {
        row-gap: 0.8rem;
    }

    .tt-date-panel {
        border-radius: 18px;
    }

    .tt-label {
        display: block;
        margin-bottom: 0.5rem;
        color: #313b59;
        font-size: 0.9rem;
        font-weight: 700;
    }

    .tt-input {
        height: 52px;
        border-radius: 16px;
        border: 1px solid #d8deef;
        box-shadow: none;
        background: #fbfcff;
        color: #131b34;
        padding: 0 1rem;
    }

    .tt-input:focus {
        border-color: #7d63f8;
        box-shadow: 0 0 0 4px rgba(125, 99, 248, 0.12);
    }

    .tt-year-field {
        min-width: 220px;
    }

    .tt-year-field :deep(.v-field__input) {
        min-height: 52px;
        padding-top: 0.65rem;
        padding-bottom: 0.3rem;
    }

    .tt-table-wrap {
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
    }

    .tt-table-wrap :deep(.schedule-scroll) {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }

    .loader-container {
        position: relative;
        height: 100%;
    }

    .v-progress-circular {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }


    .fade-transition-enter-active,
    .fade-transition-leave-active {
        transition: opacity 0.5s;
    }

    .fade-transition-enter,
    .fade-transition-leave-to {
        opacity: 0;
    }
    .alert-width {
        max-width: 33.33%; /* 4 colonnes sur 12 */
        z-index: 9999;
    }

    .disabled {
        opacity: 0.5; /* Réduire l'opacité pour indiquer qu'il est désactivé */
        pointer-events: none; /* Désactiver les interactions avec le bouton */
    }

    @media (max-width: 992px) {
        .button-container {
            width: 100%;
            justify-content: flex-start;
        }

        .row.w-50.m-auto {
            width: 100% !important;
        }

        .tt-page-intro {
            padding: 1.15rem !important;
        }
    }

    @media (max-width: 768px) {
        .menu-container {
            padding: 0.85rem !important;
        }

        .tt-field {
            min-width: 100%;
            flex-basis: 100%;
        }

        .tt-button-group {
            width: 100%;
            justify-content: center;
            gap: 0.7rem;
            margin-top: 0.25rem;
        }

        .tt-action-btn {
            width: 44px;
            height: 44px;
        }

        .tt-action-search {
            margin-left: 0;
        }

        .tt-input {
            height: 48px;
            font-size: 0.92rem;
        }
    }
</style>