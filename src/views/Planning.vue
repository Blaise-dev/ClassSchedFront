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

          <section class="cs-card p-3 p-md-4 mb-4 filters-shell">
          <h2 class="text-center mb-3 cs-section-title">EMPLOI DE TEMPS - TIMETABLE</h2>
          <div class="menu-container w-100 m-auto">
            <div class="text-left mr-16">
              <p class="m-0">
                <span class="font-weight-bold">Faculté</span> : <span>FACSCIENCES</span>
              </p>
              <p class="m-0">
                <span class="font-weight-bold">Niveau</span> : <span v-if="selectedLevel">{{ selectedLevel }}</span><span v-else>TOUS</span>
              </p>
              <p class="m-0">
                <span class="font-weight-bold">Semestre</span> : <span v-if="selectedSemester">{{ selectedSemester }}</span><span v-else>TOUS</span>
              </p>
            </div>

            <div class="select-container ml-2 w-100 row g-2">

              <v-select
                v-model="selectedMajor"
                :items="majors"
                :hint="selectedMajor ? `${selectedMajor}` : ''"
                persistent-hint
                item-title="text"
                item-value="value"
                label="Filière"
                variant="solo"
                class="col-lg-2 col-sm-12 mr-2"
              ></v-select>

              <v-select
                v-model="selectedLevel"
                :items="levels"
                :hint="selectedLevel ? `${selectedLevel}` : ''"
                persistent-hint
                item-title="text"
                item-value="value"
                label="Niveau"
                variant="solo"
                class="col-lg-2 col-sm-12 mr-2"
              ></v-select>

              <div class="form-group col-lg-2 col-sm-12 mr-2">
                  <input type="date" id="date_debut" class="form-control" style="height: 65px; box-shadow: 0 2px 0px rgba(0, 0, 0, .3);" title="Date de début" v-model="selectedDateDebut">
              </div>

              <div class="form-group col-lg-2 col-sm-12 mr-2">
                  <input type="date" id="date_fin" class="form-control" style="height: 65px; box-shadow: 0 2px 0px rgba(0, 0, 0, .3);" title="Date de début" v-model="selectedDateFin">
              </div>

              <v-select
                v-model="selectedYear"
                :items="years"
                :hint="selectedYear ? `${selectedYear}` : ''"
                persistent-hint
                item-title="text"
                item-value="value"
                label="Année"
                variant="solo"
                class="col-lg-2 col-sm-12 mr-2"
              ></v-select>

              <v-btn class="ml-md-16" style="opacity: 0.5; pointer-events: none;" icon color="white" :disabled="!(selectedMajor && selectedLevel && selectedDateDebut && selectedDateFin && selectedYear)" :style="{ opacity: !(selectedMajor && selectedLevel &&  selectedDateDebut && selectedDateFin && selectedYear) ? '0.5' : '1', pointerEvents: !(selectedMajor && selectedLevel &&  selectedDateDebut && selectedDateFin && selectedYear) ? 'none' : 'auto' }" @click="loadEmplois">
                  <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </div>

            <div class="button-container w-25">
              <v-btn icon @click="downloadPDF" class="ml-sm-16">
                <span>
                  <i class="fas fa-file-download"></i>
                </span>
              </v-btn>
            </div>
          </div>
          </section>

          <div class="d-flex m-auto w-25 mt-5">
            <p class="ml-10">
              <span class="font-weight-bold">Année académique</span> : <span v-if="selectedYear">{{ selectedYear }}</span><span v-else>2022/2023</span>
            </p>
            <p class="ml-10">
              <span class="font-weight-bold">Filière</span> : <span v-if="selectedMajor">{{ selectedMajor }}</span><span v-else>TOUTES</span>
            </p>
          </div>

          <div class="carousel-container w-100 m-auto cs-card p-3 p-md-4">
            <div class="carousel-content d-flex justify-content-between align-items-center">
              <v-btn icon @click="prevTimetable" class="carousel-button">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>

              <transition name="time-table-transition">
                <time-table :time-table="currentTimetable" :key="currentIndex" v-if="!isLoading" class="w-100 m-auto mt-3"></time-table>
              </transition>
            
              <div class="loader-container mt-16">

                  <br><br><br><br><br><br><br>
                  <v-progress-circular
                      v-if="isLoading"
                      indeterminate
                      color="primary"
                  ></v-progress-circular>
                  <br><br><br><br><br><br><br><br><br><br><br><br><br><br>

                  <!-- Contenu de votre application -->
              </div>

              <v-btn icon @click="nextTimetable" class="carousel-button">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </div>
        </template>
    </default-layout>
  <!-- ... le reste du code ... -->
</template>
  
  <script>
  import adminService from '@/services/admin.service'
  import DefaultLayout from "@/components/DefaultLayout.vue"
  import TimeTable from './components/TimeTable.vue';
  import 'animate.css';

  
  export default {
    components: {
        DefaultLayout,
        TimeTable,
    },
    data() {
      return {
        initialData: {
            // Les données initiales de l'emploi du temps
            '7:00': {
                Lundi: { ue: 'MAT141', teacher: 'enseignant1@example.com', room: 'S006' },
                Jeudi: { ue: 'INF4065', teacher: 'enseignant2@example.com', room: 'S006' },
                // ... autres jours de la semaine
            },
            '8:00': {
                Lundi: { ue: 'PHY245', teacher: 'enseignant2@example.com', room: 'AIII' },
                Mardi: { ue: 'MAT122', teacher: 'enseignant2@example.com', room: 'AI' },
                // ... autres jours de la semaine
            },
            // ... autres heures de la journée
        },
        initialData1: {
            // Les données initiales de l'emploi du temps
            '9:00': {
                Lundi: { ue: 'MAT141', teacher: 'enseignant1@example.com', room: 'S006' },
                Jeudi: { ue: 'INF4065', teacher: 'enseignant2@example.com', room: 'S006' },
                // ... autres jours de la semaine
            },
            '11:00': {
                Jeudi: { ue: 'PHY245', teacher: 'enseignant2@example.com', room: 'AIII' },
                Vendredi: { ue: 'MAT122', teacher: 'enseignant2@example.com', room: 'AI' },
                // ... autres jours de la semaine
            },
            // ... autres heures de la journée
        },
        majors: [],
        levels: [],
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
      };
    },
    computed: {
      currentTimetable() {
        return this.timetables[this.currentIndex];
      }
    },
    watch: {
        selectedDateDebut(selectedDateDebut) {
            // Code à exécuter.
        },
        selectedDateFin(selectedDateFin) {
            // Code à exécuter.
        },
        selectedYear(selectedYear) {
            // Code à exécuter.
        },
        selectedMajor(selectedMajor) {

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

      // Vérification que initialData est bien défini
      if (this.initialData) {
        // Ajout de initialData en tant que premier élément de timetables
        this.timetables.push(this.initialData);
      }

      if (this.initialData1) {
        // Ajout de initialData en tant que premier élément de timetables
        this.timetables.push(this.initialData1);
      }

    },
    methods: {
      // ... le reste du code ...

      loadEmplois() {
          this.isLoading = true; // Début du chargement au clic sur le bouton "Valider"

          // Effectuez ici votre logique de traitement ou d'appel à l'API

          // Simulez une pause de 2 secondes avant de terminer le chargement
          setTimeout(() => {
              this.isLoading = false; // Fin du chargement après un délai simulé
          }, 2000);
           // Logique de suppression de l'emploi
      },

      downloadPDF() {
        // Logique de téléchargement du fichier PDF
        // Vous pouvez utiliser une bibliothèque ou un script de génération de PDF ici
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
  
      // ... le reste du code ...
    },
  };
  </script>
  
<style>
  .select-container {
    display: flex;
    width: 100%;
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
    border-radius: var(--cs-radius-lg);
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
</style>