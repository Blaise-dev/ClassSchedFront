<template>
    <div class="public-timetable-shell">
      <div class="public-timetable-scroll">
        <table id="schedule-table">
        <thead>
          <tr>
            <th class="slash-header">
              <div class="slash-text">Jour</div>
              <div class="slash"></div>
              <div class="slash-text">Heure</div>
            </th>
            <th v-for="(day, dayIndex) in days" :key="dayIndex">{{ day.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(hour, hourIndex) in hours" :key="hourIndex">
            <td class="hour-cell">{{ hour.label }}</td>
            <td
              v-for="(day, dayIndex) in days"
              :key="dayIndex"
              :rowspan="getHourRowSpan(dayIndex, hourIndex)"
              :style="{ height: hour.height + 'px' }"
              @mouseover="cellMouseOver(dayIndex, hourIndex)"
              @mouseout="cellMouseOut"
              :class="{'limited-cell': true , 'cell-hover': isCellHovered(dayIndex, hourIndex) }"
            >
                <div v-if="selectedData[hour.label][day.label].ue && selectedData[hour.label][day.label].room" class="cell-content">
                  <strong class="cell-course">{{ selectedData[hour.label][day.label].ue }}</strong>
                  <span v-if="selectedData[hour.label][day.label].teacher" class="cell-detail">{{ selectedData[hour.label][day.label].teacher }}</span>
                  <span class="cell-detail cell-room">{{ selectedData[hour.label][day.label].room }}</span>
                </div>
                <div v-else class="cell-empty">
                  Non programmé
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </template>
    
    <script>
  
    export default {
      props: {
        timeTable: {
          type: Object,  // Mettez à jour le type en Object
          default: () => ({})  // Définissez un objet vide comme valeur par défaut
        }
      },
      data() {
        return {
          days: [
            { label: 'Lundi' },
            { label: 'Mardi' },
            { label: 'Mercredi' },
            { label: 'Jeudi' },
            { label: 'Vendredi' },
            { label: 'Samedi' },
            { label: 'Dimanche' },
          ],
          hours: [],
          selectedData: {}, // Structure de données pour stocker les contenus sélectionnés
          hoveredCell: { dayIndex: null, hourIndex: null },
          ueOptions: [
            { code: 'MAT141', intitulé: 'Analyse 1' },
            { code: 'INF4065', intitulé: 'Théorie des codes 1' },
            { code: 'PHY245', intitulé: 'Thermodynamique' },
            { code: 'MAT122', intitulé: 'Algèbre 1' },
            // ... autres options pour les UE
          ],
          teacherOptions: [
            { email: 'enseignant1@example.com', nom: 'Enseignant 1', prénom: 'Prénom 1' },
            { email: 'enseignant2@example.com', nom: 'Enseignant 2', prénom: 'Prénom 2' },
            { email: 'enseignant3@example.com', nom: 'Enseignant 3', prénom: 'Prénom 3' },
            // ... autres options pour les enseignants
          ],
          roomOptions: [
            { code: 'S006', nom: 'Salle 006' },
            { code: 'AIII', nom: 'Amphi III' },
            { code: 'AI', nom: 'Amphi I' },
            // ... autres options pour les salles
          ],
        };
      },
      watch: {
        timeTable: {
          deep: true,
          handler() {
            this.initializeSelectedData();
          }
        }
      },
      created() {
        this.generateHours();
        this.initializeSelectedData(); // Appel de la méthode pour initialiser le selectedData
      },
      methods: {
        generateHours() {
          const startHour = 7; // Heure de début
          const endHour = 22; // Heure de fin
          const hourStep = 2; // Pas entre chaque heure
    
          for (let i = startHour; i <= endHour; i += hourStep) {
            const hourLabel = `${i}:00`;
            const hourHeight = 60; // Hauteur de chaque cellule heure en pixels
    
            this.hours.push({ label: hourLabel, height: hourHeight });
          }
        },
        getHourRowSpan() {
          return 1;
        },
        cellMouseOver(dayIndex, hourIndex) {
          this.hoveredCell.dayIndex = dayIndex;
          this.hoveredCell.hourIndex = hourIndex;
        },
        cellMouseOut() {
          this.hoveredCell.dayIndex = null;
          this.hoveredCell.hourIndex = null;
        },
        isCellHovered(dayIndex, hourIndex) {
          return (
            this.hoveredCell.dayIndex === dayIndex && this.hoveredCell.hourIndex === hourIndex
          );
        },
        initializeSelectedData() {
          this.selectedData = {};
          for (const hour of this.hours) {
            this.selectedData[hour.label] = {};
            for (const day of this.days) {
              if (this.timeTable[hour.label] && this.timeTable[hour.label][day.label]) {
                this.selectedData[hour.label][day.label] = { ...this.timeTable[hour.label][day.label] };
              }
              else
                this.selectedData[hour.label][day.label] = { ue: '', teacher: '', room: '' };
            }
          }
        },
      },
    };
    </script>
    
    <style scoped>
      .public-timetable-shell {
        border: 1px solid #dfe6f3;
        border-radius: 26px;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(247, 250, 255, 0.96));
        box-shadow: 0 22px 42px rgba(17, 24, 52, 0.08);
        padding: 1rem;
      }

      .public-timetable-scroll {
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 0.2rem;
      }

      table {
        width: 100%;
        min-width: 980px;
        border-collapse: separate;
        border-spacing: 0;
        background: #ffffff;
        border: 1px solid #dde5f3;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 16px 30px rgba(16, 22, 44, 0.06);
      }

      th,
      td {
        border-right: 1px solid #e1e8f4;
        border-bottom: 1px solid #e1e8f4;
        text-align: center;
        padding: 12px 10px;
      }

      th:last-child,
      td:last-child {
        border-right: none;
      }

      tbody tr:last-child td {
        border-bottom: none;
      }

      th {
        background: linear-gradient(180deg, #f7f9fd, #eef3fb);
        color: #14203a;
        font-size: 0.82rem;
        font-weight: 800;
      }

      td {
        vertical-align: middle;
        color: #1b2742;
        font-size: 0.78rem;
        background: rgba(255, 255, 255, 0.95);
      }

      .hour-cell {
        min-width: 92px;
        background: linear-gradient(180deg, #f4f7fc, #edf2f8);
        color: #18223c;
        font-weight: 800;
        font-size: 0.82rem;
        white-space: nowrap;
      }

      .slash-header {
        position: relative;
        min-width: 110px;
        background: linear-gradient(135deg, #edf2ff, #f8fbff);
        overflow: hidden;
      }

      .slash-header .slash {
        position: absolute;
        inset: 50% auto auto 50%;
        width: 140%;
        height: 2px;
        background: linear-gradient(90deg, rgba(91, 44, 255, 0.08), rgba(91, 44, 255, 0.45), rgba(91, 44, 255, 0.08));
        transform: translate(-50%, -50%) rotate(-31deg);
      }

      .slash-text {
        position: relative;
        z-index: 1;
        display: flex;
        color: #30405f;
        font-size: 0.72rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .slash-text:first-child {
        justify-content: flex-start;
        padding-left: 0.15rem;
        margin-bottom: 1.4rem;
      }

      .slash-text:last-child {
        justify-content: flex-end;
        padding-right: 0.15rem;
        margin-top: 1.4rem;
      }

      .limited-cell {
        min-width: 160px;
        max-width: 180px;
        min-height: 66px;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(247, 250, 255, 0.98));
        transition: background 0.18s ease, box-shadow 0.18s ease;
      }

      .limited-cell:hover,
      .cell-hover {
        background: linear-gradient(180deg, rgba(242, 246, 255, 0.98), rgba(235, 241, 255, 0.98));
        box-shadow: inset 0 0 0 1px rgba(91, 44, 255, 0.08);
      }

      .cell-content {
        min-height: 60px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.22rem;
        padding: 0.45rem;
        line-height: 1.4;
        white-space: normal;
        word-break: break-word;
        color: #1c2844;
      }

      .cell-course {
        display: block;
        color: #0f172b;
        font-size: 0.8rem;
        font-weight: 800;
      }

      .cell-detail {
        display: block;
        color: #4a5872;
        font-size: 0.72rem;
        font-weight: 600;
      }

      .cell-room {
        color: #5b2cff;
        font-weight: 700;
      }

      .cell-empty {
        color: #7f8aa3;
        font-style: italic;
        font-size: 0.72rem;
        font-weight: 600;
      }

      @media (max-width: 768px) {
        .public-timetable-shell {
          padding: 0.75rem;
          border-radius: 20px;
        }

        table {
          min-width: 900px;
          border-radius: 16px;
        }

        th,
        td {
          padding: 9px 6px;
        }

        .limited-cell {
          min-width: 142px;
          max-width: 160px;
          min-height: 58px;
        }

        .cell-course {
          font-size: 0.74rem;
        }

        .cell-detail,
        .cell-empty {
          font-size: 0.68rem;
        }
      }
    </style>
    