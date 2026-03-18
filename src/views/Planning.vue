<template>
    <default-layout>
        <template v-slot:main-title>
        </template>

        <template v-slot:main-content>
            
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

          <section class="cs-card planning-hero p-4 p-md-5 mb-4">
            <div class="planning-hero-glow"></div>
            <div class="row align-items-center g-4 position-relative">
              <div class="col-lg-7">
                <span class="planning-kicker">Consultation publique</span>
                <h1 class="planning-title mt-3">Consultez l'emploi du temps dans une interface plus claire et harmonieuse</h1>
                <p class="planning-subtitle mt-3 mb-0">Filtrez rapidement par filière, niveau et année académique pour retrouver le planning publié sans surcharge visuelle.</p>
              </div>
              <div class="col-lg-5">
                <div class="planning-summary-card">
                  <div class="planning-summary-value">{{ timetables.length || 0 }}</div>
                  <div class="planning-summary-label">planning{{ timetables.length > 1 ? 's' : '' }} chargé{{ timetables.length > 1 ? 's' : '' }}</div>
                  <div class="planning-summary-meta">Année sélectionnée : {{ selectedYear || 'Non définie' }}</div>
                </div>
              </div>
            </div>
          </section>

          <section class="cs-card p-4 p-md-5 mb-4 filters-shell planning-shell">
            <div class="planning-section-head mb-4">
              <div>
                <span class="planning-section-kicker">Filtres</span>
                <h2 class="cs-section-title mb-1 mt-2">Trouver un emploi de temps</h2>
                <p class="cs-section-subtitle mb-0">Choisissez les critères académiques puis affichez le résultat disponible.</p>
              </div>
            </div>

            <div class="select-container w-100">
              <div class="row g-3 align-items-end">
                <div class="col-12 col-md-4">
                  <label class="planning-label">Filière</label>
                  <v-select
                    v-model="selectedMajor"
                    :items="majors"
                    item-title="text"
                    item-value="value"
                    placeholder="Choisir une filière"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    class="planning-field"
                  ></v-select>
                </div>

                <div class="col-12 col-md-4">
                  <label class="planning-label">Niveau</label>
                  <v-select
                    v-model="selectedLevel"
                    :items="levels"
                    item-title="text"
                    item-value="value"
                    placeholder="Choisir un niveau"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    class="planning-field"
                  ></v-select>
                </div>

                <div class="col-12 col-md-4">
                  <label class="planning-label">Option</label>
                  <v-select
                    v-model="selectedOption"
                    :items="options"
                    item-title="text"
                    item-value="value"
                    placeholder="Choisir une option"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    class="planning-field"
                    :disabled="!selectedLevel || !options.length"
                  ></v-select>
                </div>

                <div class="col-12 col-md-4">
                  <label class="planning-label">Année académique</label>
                  <v-select
                    v-model="selectedYear"
                    :items="years"
                    item-title="text"
                    item-value="value"
                    placeholder="Choisir une année"
                    variant="outlined"
                    density="comfortable"
                    class="planning-field"
                  ></v-select>
                </div>

                <div class="col-12">
                  <div class="planning-actions">
                    <v-btn
                      @click="loadEmplois"
                      :disabled="!canSearch"
                      color="primary"
                      class="planning-search-btn"
                      size="large"
                    >
                      <v-icon start>mdi-magnify</v-icon>
                      Afficher le planning
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="mt-4">
            <div v-if="isLoading" class="d-flex justify-content-center align-items-center py-5">
              <div class="text-center">
                <v-progress-circular indeterminate color="primary" size="80" class="mb-3"></v-progress-circular>
                <p class="text-muted">Chargement de l'emploi de temps...</p>
              </div>
            </div>

            <div v-else-if="timetables.length > 0" class="cs-card p-4 p-md-5 planning-result-card">
              <div class="planning-result-head mb-4">
                <div>
                  <span class="planning-section-kicker">Résultat</span>
                  <h3 class="mb-1 mt-2 planning-result-title">{{ selectedMajor }} - {{ selectedLevel }}</h3>
                  <p class="planning-result-subtitle mb-0">Planning publié pour l'année {{ selectedYear }}</p>
                </div>
                <span class="planning-result-chip">{{ timetables.length }} emploi(s)</span>
              </div>

              <div v-if="timetables.length > 1" class="planning-nav d-flex align-items-center justify-content-center gap-2 mb-4">
                <v-btn icon="mdi-chevron-left" @click="prevTimetable" :disabled="currentIndex === 0" size="small" variant="tonal"></v-btn>
                <span class="text-muted">{{ currentIndex + 1 }} / {{ timetables.length }}</span>
                <v-btn icon="mdi-chevron-right" @click="nextTimetable" :disabled="currentIndex === timetables.length - 1" size="small" variant="tonal"></v-btn>
              </div>

              <transition name="fade" mode="out-in">
                <time-table :time-table="currentTimetable" :key="currentIndex" class="w-100"></time-table>
              </transition>
            </div>

            <div v-else class="cs-card p-4 text-center planning-empty-card">
              <v-icon size="64" class="text-muted mb-3">mdi-magnify-close</v-icon>
              <p class="text-muted">
                {{ selectedMajor && selectedLevel && selectedYear ? "Aucun emploi de temps trouvé pour ces critères." : "Sélectionnez les critères de recherche et cliquez sur 'Afficher'." }}
              </p>
            </div>
          </section>
        </template>
    </default-layout>
  <!-- ... le reste du code ... -->
</template>
  
  <script>
  import adminService from '@/services/admin.service'
  import DefaultLayout from "@/components/DefaultLayout.vue"
  import TimeTable from './components/TimeTable.vue';
  import { convertToTimetable } from '@/views/utils.js'
  import 'animate.css';

  
  export default {
    name: 'PlanningView',
    components: {
        DefaultLayout,
        TimeTable,
    },
    data() {
      return {
        majors: [],
        levels: [],
        options: [],
        selectedOption: null,
        semesters: [],
        years: [
          { text: '2023/2024', value: '2023/2024' },
          { text: '2022/2023', value: '2022/2023' },
        ],
        selectedMajor: null,
        selectedLevel: null,
        selectedDateDebut: '2023-10-19',
        selectedDateFin: '2024-02-27',
        selectedYear: "2023/2024",
        
        timetables: [],
        currentIndex: 0,
        isAnimating: false,
    
        isLoading: false, // Variable indiquant si le chargement est en cours
        isError: false, // Variable indiquant si l'opération a réussi
        message: '',
      };
    },
    computed: {
      currentTimetable() {
        return this.timetables[this.currentIndex];
      },
      canSearch() {
        const hasMainSelection = !!(this.selectedMajor && this.selectedLevel && this.selectedYear);
        if (!hasMainSelection) return false;
        if (!this.options.length) return true;
        return !!this.selectedOption;
      }
    },
    watch: {
      selectedDateDebut() {
            this.currentIndex = 0;
        },
      selectedDateFin() {
            this.currentIndex = 0;
        },
      selectedYear() {
            this.currentIndex = 0;
        },
        selectedMajor(selectedMajor) {
          if (!selectedMajor) {
            this.levels = [];
            this.options = [];
            this.selectedLevel = null;
            this.selectedOption = null;
            return;
          }

            // On rempli la liste des niveaux de la filière.
            adminService.getLevelsFiliere(selectedMajor).then(
                (response) => {
                    var niveaux = response.data;

                    this.levels = niveaux.map((niveau) => {
                        return {
                            text: niveau.nom,
                            value: niveau.codeNiveau,
                        };
                    });
                    this.selectedLevel = null;
                },
                (error) => {
                    this.message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                    console.log("Error : " + this.message)
                }
            )
        },
        selectedLevel(selectedLevel) {
          if (!selectedLevel) {
            this.options = [];
            this.selectedOption = null;
            return;
          }

            // On rempli la liste des niveaux de la filière.
            adminService.getOptionsLevel(selectedLevel).then(
                (response) => {
                    var options = response.data;

                    this.options = options.map((option) => {
                        return {
                            text: option.nom,
                            value: option.codeOption,
                        };
                    });
                    this.selectedOption = null;
                },
                (error) => {
                    this.message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                    console.log("Error : " + this.message)
                }
            )
        }
    },
    created() {

      // On rempli la liste des filières.
      adminService.getAllFilieres().then(
          (response) => {
              var filieres = response.data;

              this.majors = filieres.map((filiere) => {
                  return {
                      text: filiere.nom,
                      value: filiere.codeFiliere,
                  };
              });
          },
          (error) => {
              this.message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
              console.log("Error : " + this.message)
          }
      )

    },
    methods: {
      async loadEmplois() {
        if (!this.canSearch) {
          return;
        }

        this.isLoading = true;
        this.isError = false;

        try {
          const annee = String(this.selectedYear).split('/')[0];
          const response = await adminService.getTimeTable({ id: this.selectedLevel, annee });
          let payload = response?.data || {};

          if (this.selectedOption) {
            const optionUesResponse = await adminService.getUesByOption(this.selectedOption);
            const optionUeCodes = new Set((optionUesResponse?.data || []).map((ue) => ue.codeUE));

            if (Array.isArray(payload)) {
              payload = payload.filter((item) => optionUeCodes.has(item?.codeUE || item?.ue));
            } else if (payload && typeof payload === 'object') {
              payload = Object.entries(payload).reduce((acc, [day, courses]) => {
                const filtered = Array.isArray(courses)
                  ? courses.filter((item) => optionUeCodes.has(item?.codeUE || item?.ue))
                  : [];
                acc[day] = filtered;
                return acc;
              }, {});
            }
          }

          const mapped = convertToTimetable(payload);
          this.timetables = Object.keys(mapped).length ? [mapped] : [];
          this.currentIndex = 0;
        } catch (error) {
          this.message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
          this.isError = true;
        } finally {
          this.isLoading = false;
        }
      },

      downloadPDF() {
        window.print();
      },

      nextTimetable() {
        if (this.currentIndex < this.timetables.length - 1) {
          this.isAnimating = true;
          setTimeout(() => {
            this.currentIndex++;
            this.isAnimating = false;
          }, 500); // Temps de l'animation en millisecondes
        }
      },

      prevTimetable() {
        if (this.currentIndex > 0) {
          this.isAnimating = true;
          setTimeout(() => {
            this.currentIndex--;
            this.isAnimating = false;
          }, 500); // Temps de l'animation en millisecondes
        }
      },

      dismissAlert() {
        this.isError = false;
      },
  
      // ... le reste du code ...
    },
  };
  </script>
  
<style>
  .select-container {
    display: flex;
    width: 100%;
  }

  .planning-hero {
    position: relative;
    overflow: hidden;
    border-radius: 28px;
  }

  .planning-hero-glow {
    position: absolute;
    width: 420px;
    height: 420px;
    border-radius: 50%;
    right: -130px;
    top: -160px;
    background: radial-gradient(circle, rgba(91, 44, 255, 0.24), rgba(91, 44, 255, 0));
  }

  .planning-kicker,
  .planning-section-kicker {
    display: inline-flex;
    align-items: center;
    padding: 0.4rem 0.78rem;
    border-radius: 999px;
    background: rgba(91, 44, 255, 0.1);
    color: #4c2fd0;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .planning-title {
    font-size: clamp(1.6rem, 2.3vw, 2.45rem);
    font-weight: 800;
    line-height: 1.14;
    max-width: 720px;
  }

  .planning-subtitle {
    color: var(--cs-muted);
    max-width: 680px;
    line-height: 1.8;
  }

  .planning-summary-card {
    border-radius: 24px;
    padding: 1.35rem;
    background: linear-gradient(145deg, rgba(79, 70, 229, 0.96), rgba(124, 58, 237, 0.9));
    color: #fff;
    box-shadow: 0 22px 44px rgba(79, 70, 229, 0.24);
  }

  .planning-summary-value {
    font-size: 2.4rem;
    font-weight: 800;
    line-height: 1;
  }

  .planning-summary-label {
    margin-top: 0.5rem;
    font-size: 0.96rem;
    font-weight: 700;
  }

  .planning-summary-meta {
    margin-top: 0.55rem;
    font-size: 0.84rem;
    color: rgba(255, 255, 255, 0.82);
  }

  .menu-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .button-container {
      display: flex;
      justify-content: flex-end;
      align-items: center;
  }

  .carousel-container {
    border: 1px solid var(--cs-border);
    border-radius: var(--cs-radius-lg);
  }

  .filters-shell {
    border-radius: 24px;
  }

  .planning-result-card,
  .planning-empty-card {
    border-radius: 24px;
  }

  .planning-section-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  .planning-label {
    display: block;
    margin-bottom: 0.55rem;
    color: #2f3957;
    font-size: 0.86rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .planning-field .v-field {
    border-radius: 16px;
    background: #fbfcff;
  }

  .planning-actions {
    display: flex;
    justify-content: flex-end;
  }

  .planning-search-btn {
    min-width: 220px;
    min-height: 50px;
    border-radius: 16px;
    font-weight: 700;
    letter-spacing: 0.01em;
    box-shadow: 0 16px 28px rgba(91, 44, 255, 0.18);
  }

  .planning-result-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  .planning-result-title {
    font-size: clamp(1.12rem, 2vw, 1.45rem);
    font-weight: 800;
    color: #14203a;
  }

  .planning-result-subtitle {
    color: var(--cs-muted);
  }

  .planning-result-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 120px;
    padding: 0.7rem 0.95rem;
    border-radius: 999px;
    background: rgba(79, 70, 229, 0.1);
    color: #4930d3;
    font-weight: 800;
  }

  .planning-nav .v-btn {
    border-radius: 14px;
  }

  .planning-empty-card {
    min-height: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .time-table-transition-enter {
    opacity: 0;
    transform: translateY(50px);
  }

  .time-table-transition-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.2s, transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .time-table-transition-leave {
    opacity: 1;
    transform: translateY(0);
  }

  .time-table-transition-leave-active {
    opacity: 0;
    transform: translateY(-50px);
    transition: opacity 0.3s, transform 0.2s cubic-bezier(0.19, 1, 0.22, 1);
  }

    .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .alert-width {
      max-width: 33.33%; /* 4 colonnes sur 12 */
      z-index: 9999;
  }

  @media (max-width: 992px) {
    .menu-container {
      flex-direction: column;
    }

    .button-container {
      justify-content: flex-start;
      width: 100% !important;
    }
  }

  @media (max-width: 768px) {
    .planning-shell {
      padding: 1rem !important;
    }

    .planning-hero {
      padding: 1rem !important;
    }

    .planning-title {
      font-size: 1.4rem;
    }

    .planning-actions {
      justify-content: stretch;
    }

    .planning-search-btn {
      width: 100%;
    }

    .planning-result-head {
      flex-direction: column;
      align-items: flex-start;
    }

    .planning-shell .cs-section-title {
      font-size: 1.05rem;
      margin-bottom: 0.5rem !important;
    }

    .planning-result-card,
    .planning-empty-card {
      padding: 1rem !important;
    }

    .planning-result-card h3 {
      font-size: 0.95rem;
      line-height: 1.3;
    }

    .planning-result-card .badge {
      font-size: 0.72rem;
      padding: 0.35rem 0.5rem;
    }

    .alert-width {
      max-width: 90%;
    }
  }
</style>