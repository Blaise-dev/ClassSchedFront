<template>
  <div class="schedule-shell">
    <div class="schedule-scroll">
      <div class="schedule-stage">
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
                @click="cellClicked(dayIndex, hourIndex)"
                @mouseover="cellMouseOver(dayIndex, hourIndex)"
                @mouseout="cellMouseOut"
                :class="{ 'limited-cell': true, interactive: true, 'cell-hover': isCellHovered(dayIndex, hourIndex), 'cell-selected': isSelectedCell(dayIndex, hourIndex) }"
              >
                <span
                  v-if="isCellHovered(dayIndex, hourIndex) && !isSelectedCell(dayIndex, hourIndex)"
                  class="pencil-icon"
                >
                  <i class="fas fa-pencil"></i>
                </span>
                <div v-if="isSelectedCell(dayIndex, hourIndex)" class="cell-editor">
                  <div class="select-container">
                    <select
                      v-model="selectedData[hour.label][day.label].ue"
                      @change="updateSelectedData(day.label, hour.label, 'ue', selectedData[hour.label][day.label].ue)"
                    >
                      <option value="">Choisir une UE</option>
                      <option v-for="ue in resolvedUeOptions" :key="ue.code" :value="ue.code">{{ ue.intitulé || ue.code }}</option>
                    </select>
                  </div>
                  <div class="select-container">
                    <select
                      v-model="selectedData[hour.label][day.label].teacher"
                      @change="updateSelectedData(day.label, hour.label, 'teacher', selectedData[hour.label][day.label].teacher)"
                    >
                      <option value="">(Facultatif) Enseignant</option>
                      <option v-for="teacher in resolvedTeacherOptions" :key="teacher.email" :value="teacher.email">
                        {{ teacher.email }} ({{ teacher.nom }} {{ teacher.prénom }})
                      </option>
                    </select>
                  </div>
                  <div class="select-container">
                    <select
                      v-model="selectedData[hour.label][day.label].room"
                      @change="updateSelectedData(day.label, hour.label, 'room', selectedData[hour.label][day.label].room)"
                    >
                      <option value="">Choisir une salle</option>
                      <option v-for="room in resolvedRoomOptions" :key="room.code" :value="room.code">{{ room.nom || room.code }}</option>
                    </select>
                  </div>
                </div>
                <div v-else class="cell-content">
                  <template v-if="selectedData[hour.label][day.label].ue && selectedData[hour.label][day.label].room">
                    <strong class="cell-course">{{ selectedData[hour.label][day.label].ue }}</strong>
                    <span v-if="selectedData[hour.label][day.label].teacher" class="cell-detail">{{ getTeacherName(selectedData[hour.label][day.label].teacher) }}</span>
                    <span class="cell-detail cell-room">{{ selectedData[hour.label][day.label].room }}</span>
                  </template>
                  <template v-else>
                    <span class="cell-empty">Aucun cours</span>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    initialData: {
      type: Object,
      default: () => ({})
    },
    ueOptions: {
      type: Array,
      default: () => []
    },
    teacherOptions: {
      type: Array,
      default: () => []
    },
    roomOptions: {
      type: Array,
      default: () => []
    },
    defaultTeacher: {
      type: String,
      default: ''
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
      selectedData: {},
      hoveredCell: { dayIndex: null, hourIndex: null },
      selectedCell: { dayIndex: null, hourIndex: null },
    };
  },
  computed: {
    resolvedUeOptions() {
      if (Array.isArray(this.ueOptions) && this.ueOptions.length) return this.ueOptions;
      return [
        { code: 'INF101', intitulé: 'Algorithmique et structures de données' },
        { code: 'INF201', intitulé: 'Base de données relationnelles' },
        { code: 'MAT101', intitulé: 'Algèbre linéaire' },
      ];
    },
    resolvedTeacherOptions() {
      if (Array.isArray(this.teacherOptions) && this.teacherOptions.length) return this.teacherOptions;
      return [
        { email: 'enseignant1@example.com', nom: 'Enseignant 1', prénom: 'Prénom 1' },
        { email: 'enseignant2@example.com', nom: 'Enseignant 2', prénom: 'Prénom 2' },
      ];
    },
    resolvedRoomOptions() {
      if (Array.isArray(this.roomOptions) && this.roomOptions.length) return this.roomOptions;
      return [
        { code: 'A1', nom: 'Amphi 1' },
        { code: 'S006', nom: 'Salle 006' },
      ];
    },
  },
  watch: {
    initialData: {
      deep: true,
      handler() {
        this.initializeSelectedData();
      }
    }
  },
  created() {
    this.generateHours();
    document.addEventListener('mousedown', this.handleDocumentClick);
    this.initializeSelectedData();
  },
  beforeUnmount() {
    document.removeEventListener('mousedown', this.handleDocumentClick);
  },
  methods: {
    generateHours() {
      const startHour = 7;
      const endHour = 22;
      const hourStep = 2;

      for (let i = startHour; i <= endHour; i += hourStep) {
        this.hours.push({ label: `${i}:00`, height: 60 });
      }
    },
    getHourRowSpan() {
      return 1;
    },
    cellClicked(dayIndex, hourIndex) {
      this.selectedCell.dayIndex = dayIndex;
      this.selectedCell.hourIndex = hourIndex;

      const dayLabel = this.days[dayIndex]?.label;
      const hourLabel = this.hours[hourIndex]?.label;
      if (!dayLabel || !hourLabel) return;

      const cell = this.selectedData[hourLabel]?.[dayLabel];
      if (!cell) return;

      let changed = false;
      if (!cell.ue && this.resolvedUeOptions.length) {
        cell.ue = this.resolvedUeOptions[0].code;
        changed = true;
      }
      if (!cell.room && this.resolvedRoomOptions.length) {
        cell.room = this.resolvedRoomOptions[0].code;
        changed = true;
      }
      if (!cell.teacher && this.defaultTeacher) {
        cell.teacher = this.defaultTeacher;
        changed = true;
      }

      if (changed) {
        this.$emit('selected-data-changed', this.selectedData);
      }
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
      return this.hoveredCell.dayIndex === dayIndex && this.hoveredCell.hourIndex === hourIndex;
    },
    isSelectedCell(dayIndex, hourIndex) {
      return this.selectedCell.dayIndex === dayIndex && this.selectedCell.hourIndex === hourIndex;
    },
    handleDocumentClick(event) {
      if (!event.target.closest('#schedule-table')) {
        this.selectedCell.dayIndex = null;
        this.selectedCell.hourIndex = null;
      }
    },
    initializeSelectedData() {
      this.selectedData = {};
      for (const hour of this.hours) {
        this.selectedData[hour.label] = {};
        for (const day of this.days) {
          if (this.initialData[hour.label] && this.initialData[hour.label][day.label]) {
            this.selectedData[hour.label][day.label] = { ...this.initialData[hour.label][day.label] };
          } else {
            this.selectedData[hour.label][day.label] = { ue: '', teacher: '', room: '' };
          }
        }
      }
    },
    updateSelectedData(dayLabel, hourLabel, field, value) {
      this.selectedData[hourLabel][dayLabel][field] = value;
      this.$emit('selected-data-changed', this.selectedData);
    },
    getTeacherName(email) {
      const teacher = this.resolvedTeacherOptions.find((item) => item.email === email);
      if (teacher) return `${teacher.nom} ${teacher.prénom}`;
      return email || '';
    }
  },
};
</script>

<style scoped>
  .schedule-shell {
    position: relative;
  }

  .schedule-scroll {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-x pan-y;
    padding-bottom: 0.25rem;
  }

  .schedule-stage {
    min-width: max-content;
  }

  table {
    width: 100%;
    min-width: 1000px;
    border-collapse: separate;
    border-spacing: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.99), rgba(246, 249, 255, 0.98));
    border: 1px solid #d8e0ef;
    border-radius: 22px;
    overflow: hidden;
    box-shadow: 0 22px 44px rgba(12, 18, 42, 0.1);
  }

  th,
  td {
    border-right: 1px solid #dfe5f2;
    border-bottom: 1px solid #dfe5f2;
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
    position: sticky;
    top: 0;
    z-index: 2;
    background: linear-gradient(180deg, #f7f9fe, #eef3fb);
    color: #14203a;
    font-size: 0.82rem;
    font-weight: 800;
    letter-spacing: 0.02em;
  }

  td {
    color: #1a2540;
    font-size: 0.78rem;
    vertical-align: middle;
    background: rgba(255, 255, 255, 0.88);
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
    background: linear-gradient(135deg, #edf2ff, #f8faff);
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
  }

  .interactive {
    cursor: pointer;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(247, 250, 255, 0.98));
    transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
  }

  .interactive:hover,
  .cell-hover {
    background: linear-gradient(180deg, rgba(241, 244, 255, 0.98), rgba(234, 240, 255, 0.98));
    box-shadow: inset 0 0 0 1px rgba(91, 44, 255, 0.08);
  }

  .cell-selected {
    background: linear-gradient(180deg, rgba(233, 239, 255, 0.98), rgba(225, 234, 255, 0.98));
    box-shadow: inset 0 0 0 2px rgba(91, 44, 255, 0.22);
  }

  .pencil-icon {
    position: absolute;
    top: 0.45rem;
    right: 0.45rem;
    width: 24px;
    height: 24px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(91, 44, 255, 0.12);
    color: #5b2cff;
    font-size: 0.74rem;
  }

  .cell-content {
    min-height: 62px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.22rem;
    padding: 0.4rem;
    line-height: 1.4;
    white-space: normal;
    word-break: break-word;
    color: #1d2946;
  }

  .cell-course {
    display: block;
    color: #0f172b;
    font-size: 0.8rem;
    font-weight: 800;
  }

  .cell-detail {
    display: block;
    color: #46546f;
    font-size: 0.72rem;
    font-weight: 600;
  }

  .cell-room {
    color: #5b2cff;
    font-weight: 700;
  }

  .cell-empty {
    color: #7f8aa3;
    font-size: 0.72rem;
    font-style: italic;
    font-weight: 600;
  }

  .cell-editor {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .select-container {
    width: 100%;
  }

  .select-container select {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #d3dbeb;
    border-radius: 10px;
    padding: 0.45rem 0.55rem;
    font-size: 0.75rem;
    background: #ffffff;
    color: #12203b;
    outline: none;
  }

  .select-container select:focus {
    border-color: rgba(91, 44, 255, 0.48);
    box-shadow: 0 0 0 3px rgba(91, 44, 255, 0.12);
  }

  @media (max-width: 768px) {
    table {
      min-width: 920px;
    }

    th,
    td {
      padding: 9px 6px;
    }

    .limited-cell {
      min-width: 140px;
      max-width: 160px;
    }

    .cell-content {
      min-height: 54px;
      padding: 0.3rem;
    }

    .cell-course {
      font-size: 0.74rem;
    }

    .cell-detail,
    .cell-empty,
    .select-container select {
      font-size: 0.68rem;
    }
  }
</style>
