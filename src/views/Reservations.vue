<template>
  <default-layout>
    <template #main-title>
      <span class="cs-pill">📅 Réservations</span>
    </template>

    <template #main-content>
      <section class="cs-card p-4 p-md-5 mb-4 reservation-overview">
        <div class="reservation-overview-glow"></div>
        <div class="reservation-overview-row">
          <div class="reservation-overview-head">
            <div>
              <span class="reservation-kicker">Centre de validation</span>
              <h2 class="cs-section-title mb-1 mt-3">Demandes de réservation de salles</h2>
              <p class="cs-section-subtitle mb-0 mt-2">Retrouvez les demandes, validez-les rapidement et gardez une lecture claire des statuts comme sur les autres écrans du front.</p>
            </div>
            <div class="reservation-summary-chip">{{ reservations.length }} demande(s)</div>
          </div>

          <div class="reservation-stats-grid">
            <article class="reservation-stat-card">
              <span class="reservation-stat-label">En attente</span>
              <strong class="reservation-stat-value">{{ pendingCount }}</strong>
              <small>Demandes à traiter</small>
            </article>
            <article class="reservation-stat-card">
              <span class="reservation-stat-label">Acceptées</span>
              <strong class="reservation-stat-value">{{ approvedCount }}</strong>
              <small>Créneaux confirmés</small>
            </article>
            <article class="reservation-stat-card">
              <span class="reservation-stat-label">Refusées</span>
              <strong class="reservation-stat-value">{{ refusedCount }}</strong>
              <small>Demandes clôturées</small>
            </article>
          </div>
        </div>
      </section>

      <section v-if="isLoading" class="d-flex justify-content-center align-items-center py-5">
        <div class="text-center">
          <v-progress-circular indeterminate color="primary" size="80" class="mb-3"></v-progress-circular>
          <p class="text-muted">Chargement des réservations...</p>
        </div>
      </section>

      <template v-else>
        <section v-if="reservations.length > 0" class="cs-card p-4 p-md-5 mb-4 reservation-list-shell">
          <div class="reservation-section-head mb-4">
            <div>
              <span class="reservation-section-kicker">Liste active</span>
              <h3 class="reservation-section-title mb-1 mt-2">Demandes à consulter</h3>
              <p class="reservation-section-subtitle mb-0">Chaque carte reprend les mêmes repères visuels que les autres pages de consultation pour accélérer la lecture.</p>
            </div>
          </div>

          <div class="row g-3">
            <article v-for="reservation in reservations" :key="reservation.id" class="col-12 col-xl-6">
              <div class="reservation-card h-100 cs-card-hover">
                <div class="reservation-card-head">
                  <div class="reservation-card-identity">
                    <span class="status-badge" :class="`status-${reservation.status}`">{{ reservation.statusLabel }}</span>
                    <h3 class="reservation-title mb-0">{{ reservation.teacher }}</h3>
                    <p class="reservation-card-subtitle mb-0">Demande pour la salle {{ reservation.room }}</p>
                  </div>
                  <div v-if="reservation.status === 'pending'" class="reservation-actions">
                    <v-btn class="reservation-action-btn reservation-action-approve" size="small" @click="acceptReservation(reservation)">
                      <v-icon start size="18">mdi-check</v-icon>
                      Accepter
                    </v-btn>
                    <v-btn class="reservation-action-btn reservation-action-refuse" size="small" @click="refuseReservation(reservation)">
                      <v-icon start size="18">mdi-close</v-icon>
                      Refuser
                    </v-btn>
                  </div>
                </div>

                <div class="reservation-meta-grid">
                  <div class="reservation-detail-card">
                    <small>Jour demandé</small>
                    <strong>{{ formatDate(reservation.date) }}</strong>
                  </div>
                  <div class="reservation-detail-card">
                    <small>Créneau</small>
                    <strong>{{ reservation.slot }}</strong>
                  </div>
                  <div class="reservation-detail-card reservation-detail-wide">
                    <small>Motif</small>
                    <p class="reservation-reason mb-0">{{ reservation.reason }}</p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section v-else class="cs-card p-4 p-md-5 text-center reservation-empty-card">
          <v-icon size="64" class="text-muted mb-3">mdi-inbox-multiple</v-icon>
          <h3 class="reservation-empty-title">Aucune réservation à afficher</h3>
          <p class="text-muted mb-0">Les nouvelles demandes apparaîtront ici avec leur statut et leurs informations clés.</p>
          <p v-if="errorMessage" class="text-danger small mt-3 mb-0">{{ errorMessage }}</p>
        </section>
      </template>
    </template>
  </default-layout>
</template>

<script>
import DefaultLayout from '@/components/DefaultLayout.vue'
import adminService from '@/services/admin.service'

const STATUS_LABELS = {
  pending: 'En attente',
  approved: 'Acceptée',
  refused: 'Refusée',
}

const normalizeStatus = (value) => {
  const raw = String(value || '').toLowerCase();
  if (['approved', 'acceptee', 'acceptée', 'validee', 'validée'].includes(raw)) return 'approved';
  if (['refused', 'refusee', 'refusée', 'rejetee', 'rejetée'].includes(raw)) return 'refused';
  return 'pending';
}

export default {
  name: 'ReservationsView',
  components: {
    DefaultLayout,
  },
  data() {
    return {
      isLoading: false,
      reservations: [],
      errorMessage: '',
    };
  },
  computed: {
    pendingCount() {
      return this.reservations.filter((item) => item.status === 'pending').length;
    },
    approvedCount() {
      return this.reservations.filter((item) => item.status === 'approved').length;
    },
    refusedCount() {
      return this.reservations.filter((item) => item.status === 'refused').length;
    },
  },
  mounted() {
    this.loadReservations()
  },
  methods: {
    formatDate(date) {
      if (!date) return '-';
      try {
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      } catch (_) {
        return date;
      }
    },

    formatApiReservation(item, index) {
      const status = normalizeStatus(item?.statutReservation || item?.etatReservation || item?.status)
      const date = item?.dateReservation || item?.date || ''
      const start = item?.heureDebut || item?.start || ''
      const end = item?.heureFin || item?.end || ''

      return {
        id: item?.id || item?.codeReservation || index + 1,
        teacher: item?.enseignant || item?.teacher || item?.demandeur || 'Demandeur non renseigné',
        room: item?.Salle || item?.salle || item?.room || '-',
        date,
        slot: start && end ? `${start} - ${end}` : (item?.slot || 'Creneau non precis'),
        reason: item?.motifReservation || item?.reason || 'Aucun motif',
        status,
        statusLabel: STATUS_LABELS[status],
      }
    },

    async loadReservations() {
      this.isLoading = true
      this.errorMessage = ''
      try {
        const response = await adminService.getReservations()
        const reservations = Array.isArray(response?.data) ? response.data : []
        this.reservations = reservations.map((item, index) => this.formatApiReservation(item, index))
      } catch (error) {
        this.errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || 'Impossible de charger les réservations.'
      } finally {
        this.isLoading = false
      }
    },

    updateLocalReservationStatus(reservationId, status) {
      this.reservations = this.reservations.map((item) => {
        if (item.id !== reservationId) return item
        return {
          ...item,
          status,
          statusLabel: STATUS_LABELS[status],
        }
      })
    },

    async refuseReservation(reservation) {
      this.updateLocalReservationStatus(reservation.id, 'refused')
      try {
        await adminService.updateReservationStatus(reservation.id, 'refused')
      } catch (_) {
        // API non disponible: mise à jour locale conservée.
      }
    },

    async acceptReservation(reservation) {
      this.updateLocalReservationStatus(reservation.id, 'approved')
      try {
        await adminService.updateReservationStatus(reservation.id, 'approved')
      } catch (_) {
        // API non disponible: mise à jour locale conservée.
      }
    },
  },
};
</script>

<style scoped>
.reservation-overview {
  position: relative;
  overflow: hidden;
}

.reservation-overview-glow {
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  right: -90px;
  top: -130px;
  background: radial-gradient(circle, rgba(91, 44, 255, 0.22), rgba(91, 44, 255, 0));
}

.reservation-overview-row {
  position: relative;
  z-index: 1;
}

.reservation-overview-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.reservation-kicker,
.reservation-section-kicker {
  display: inline-flex;
  align-items: center;
  padding: 0.38rem 0.78rem;
  border-radius: 999px;
  background: rgba(91, 44, 255, 0.12);
  color: #4d2dd1;
  font-size: 0.78rem;
  font-weight: 800;
}

.reservation-summary-chip {
  min-width: 148px;
  text-align: center;
  padding: 0.9rem 1rem;
  border-radius: 18px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #fff;
  font-weight: 800;
  box-shadow: 0 16px 28px rgba(91, 44, 255, 0.22);
}

.reservation-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
  margin-top: 1.5rem;
}

.reservation-stat-card {
  padding: 1rem 1.1rem;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(248, 250, 255, 0.96), rgba(241, 244, 252, 0.96));
  border: 1px solid rgba(91, 44, 255, 0.1);
}

.reservation-stat-label {
  display: block;
  color: #65708f;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.reservation-stat-value {
  display: block;
  margin-top: 0.35rem;
  font-size: clamp(1.5rem, 2.4vw, 2rem);
  line-height: 1;
  color: #121c3b;
}

.reservation-stat-card small {
  display: block;
  margin-top: 0.35rem;
  color: #7c86a3;
}

.reservation-list-shell {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(249, 251, 255, 0.9));
}

.reservation-section-head {
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(91, 44, 255, 0.08);
}

.reservation-section-title {
  font-size: clamp(1.2rem, 1.8vw, 1.5rem);
  font-weight: 800;
  color: #141b35;
}

.reservation-section-subtitle {
  color: #5f6880;
}

.reservation-card {
  height: 100%;
  padding: 1.3rem;
  border: 1px solid rgba(91, 44, 255, 0.12);
  border-radius: 24px;
  transition: all 0.3s ease;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 255, 0.98));
  box-shadow: 0 18px 34px rgba(18, 24, 52, 0.08);
}

.reservation-card:hover {
  border-color: rgba(91, 44, 255, 0.2);
}

.reservation-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.reservation-card-identity {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.status-badge {
  display: inline-flex;
  width: fit-content;
  padding: 0.42rem 0.78rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
  white-space: nowrap;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-approved {
  background-color: #d4edda;
  color: #155724;
}

.status-refused {
  background-color: #f8d7da;
  color: #721c24;
}

.reservation-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #141b35;
}

.reservation-card-subtitle {
  color: #68728f;
  font-size: 0.92rem;
}

.reservation-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.reservation-action-btn {
  border-radius: 12px;
  font-weight: 700;
  text-transform: none;
  letter-spacing: normal;
  box-shadow: none;
}

.reservation-action-approve {
  background: rgba(24, 173, 110, 0.12);
  color: #137a50;
}

.reservation-action-refuse {
  background: rgba(229, 70, 92, 0.12);
  color: #b02337;
}

.reservation-meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

.reservation-detail-card {
  padding: 0.95rem 1rem;
  border-radius: 16px;
  background: #f8faff;
  border: 1px solid #e5e9f6;
}

.reservation-detail-card small {
  display: block;
  margin-bottom: 0.35rem;
  color: #76809d;
  font-weight: 700;
}

.reservation-detail-card strong {
  color: #132043;
}

.reservation-detail-wide {
  grid-column: 1 / -1;
}

.reservation-reason {
  color: #24304f;
  line-height: 1.55;
}

.reservation-empty-card {
  min-height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.reservation-empty-title {
  margin-bottom: 0.65rem;
  color: #131d3b;
  font-size: 1.25rem;
  font-weight: 800;
}

@media (max-width: 992px) {
  .reservation-overview-head,
  .reservation-card-head {
    flex-direction: column;
  }

  .reservation-stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .reservation-card {
    padding: 1rem;
  }

  .reservation-title {
    font-size: 1rem;
    line-height: 1.35;
  }

  .reservation-meta-grid {
    grid-template-columns: 1fr;
  }

  .reservation-summary-chip {
    width: 100%;
  }
}
</style>
