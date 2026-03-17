<template>
    <default-layout>
      <template #main-title>
        <span class="cs-pill">Réservations</span>
      </template>

      <template #main-content>
        <section class="cs-card p-4 mb-4">
          <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <h2 class="cs-section-title">Demandes de réservation de salles</h2>
          <span class="cs-pill">Traitement en temps réel</span>
          </div>
          <p class="cs-section-subtitle mt-2">Consultez les demandes en cours, traitez les priorités et gardez une visibilité claire sur l’occupation des salles.</p>
        </section>

        <section class="row g-3">
          <article v-for="reservation in reservations" :key="reservation.id" class="col-12 col-lg-6">
            <div class="cs-card p-3 reservation-card h-100 cs-card-hover">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <span class="status-badge" :class="`status-${reservation.status}`">{{ reservation.statusLabel }}</span>
                  <h3 class="reservation-title mt-2">{{ reservation.teacher }}</h3>
                </div>
                <div class="reservation-actions" v-if="reservation.status === 'pending'">
                  <v-btn size="small" icon color="green" @click="acceptReservation">
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                  <v-btn size="small" icon color="red" @click="refuseReservation">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>
              </div>
              <p class="reservation-meta mt-3">Salle: <strong>{{ reservation.room }}</strong> • Date: <strong>{{ reservation.date }}</strong></p>
              <p class="reservation-meta">Créneau: <strong>{{ reservation.slot }}</strong></p>
              <p class="reservation-motif mt-2">{{ reservation.reason }}</p>
            </div>
          </article>
        </section>
      </template>
    </default-layout>
</template>
  
  <script>
  import DefaultLayout from '@/components/DefaultLayout.vue'
  
  export default {
    components: {
      DefaultLayout,
    },
    data() {
      return {
        reservations: [
          { id: 1, teacher: 'Pr. Atsa Roger Minkoulou', room: 'S006', date: '15/12/2026', slot: '08:00 - 10:00', reason: 'Cours INF4027, séance de rattrapage.', status: 'pending', statusLabel: 'En attente' },
          { id: 2, teacher: 'Dr. Nzekon Armel', room: 'A135', date: '25/11/2026', slot: '14:00 - 16:00', reason: 'Conférence départementale.', status: 'pending', statusLabel: 'En attente' },
          { id: 3, teacher: 'Pr. Kouokam Etienne', room: 'A135', date: '22/11/2026', slot: '10:00 - 12:00', reason: 'TD INF4048 — compilation.', status: 'approved', statusLabel: 'Acceptée' },
        ],
      };
    },
    methods: {
      // ... le reste du code ...

      refuseReservation() {
        // Logique de suppression de l'option
      },
      acceptReservation() {
        // Logique de confirmation de l'option
      },
    },
  };
  </script>
  
<style scoped>
.reservation-card {
  border: 1px solid var(--cs-border);
  border-radius: var(--cs-radius-lg);
}

.reservation-title {
  font-size: 1.1rem;
  font-weight: 800;
}

.reservation-meta {
  color: var(--cs-muted);
}

.reservation-motif {
  color: #3e4658;
  line-height: 1.7;
}

.reservation-actions {
  display: flex;
  gap: 0.4rem;
}

.status-badge {
  border-radius: 999px;
  padding: 0.25rem 0.7rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.status-pending {
  background: #fff1d2;
  color: #8b6000;
  border: 1px solid #ffd787;
}

.status-approved {
  background: #dcf7e8;
  color: #14693f;
  border: 1px solid #8be2b3;
}
</style>