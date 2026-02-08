<template>
  <div class="dashboard-container">
    <!-- Header -->
    <header class="page-header">
      <div>
        <div class="header-title">
          <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <h1 class="page-title">Tableau de Bord</h1>
        </div>
        <p class="page-subtitle">Statistiques et résumé d'activité</p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="dashboard-main">
      <!-- Statistiques Cards -->
      <section class="stats-section">
        <h2 class="section-title">Statistiques</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon clients">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="stat-content">
              <h3>Clients</h3>
              <p class="stat-value">{{ stats.clients }}</p>
              <span class="stat-change positive">+12% ce mois</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon appointments">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div class="stat-content">
              <h3>Rendez-vous</h3>
              <p class="stat-value">{{ stats.appointments }}</p>
              <span class="stat-change positive">+8 cette semaine</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon revenue">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path
                  d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                ></path>
              </svg>
            </div>
            <div class="stat-content">
              <h3>Chiffre d'affaires</h3>
              <p class="stat-value">{{ stats.revenue }}€</p>
              <span class="stat-change positive">+25% vs mois dernier</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon rating">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                stroke-width="1"
              >
                <polygon
                  points="12 2 15.09 10.26 23.77 11.27 17.77 17.27 19.24 25.77 12 21.27 4.76 25.77 6.23 17.27 0.23 11.27 8.91 10.26 12 2"
                ></polygon>
              </svg>
            </div>
            <div class="stat-content">
              <h3>Avis Clients</h3>
              <p class="stat-value">{{ stats.rating }}/5</p>
              <span class="stat-change positive">Excellent</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Services Table -->
      <section class="services-section">
        <div class="section-header">
          <h2 class="section-title">Services populaires</h2>
        </div>
        <div class="table-responsive">
          <table class="services-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Prix</th>
                <th>Réservations</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="service in services" :key="service.id">
                <td>{{ service.name }}</td>
                <td>{{ service.price }}€</td>
                <td>{{ service.bookings }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Upcoming Appointments -->
      <section class="appointments-section">
        <h2 class="section-title">Rendez-vous à venir</h2>
        <div class="appointments-list">
          <div
            v-for="appointment in upcomingAppointments"
            :key="appointment.id"
            class="appointment-card"
          >
            <div class="appointment-time">
              <span class="time">{{ appointment.time }}</span>
              <span class="date">{{ appointment.date }}</span>
            </div>
            <div class="appointment-info">
              <h4>{{ appointment.clientName }}</h4>
              <p>{{ appointment.service }}</p>
            </div>
            <div class="appointment-status" :class="appointment.status">
              {{ appointment.statusLabel }}
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const emit = defineEmits(["logout"]);

const stats = ref({
  clients: 128,
  appointments: 24,
  revenue: 3450,
  rating: 4.8,
});

const services = ref([
  { id: 1, name: "Coupe Femme", price: 35, bookings: 12 },
  { id: 2, name: "Coupe Homme", price: 25, bookings: 18 },
  { id: 3, name: "Coloration", price: 50, bookings: 8 },
  { id: 4, name: "Lissage Brésilien", price: 80, bookings: 5 },
  { id: 5, name: "Soin Capillaire", price: 40, bookings: 10 },
]);

const upcomingAppointments = ref([
  {
    id: 1,
    clientName: "Marie Dupont",
    service: "Coupe Femme",
    time: "10:00",
    date: "Aujourd'hui",
    status: "confirmed",
    statusLabel: "Confirmé",
  },
  {
    id: 2,
    clientName: "Jean Martin",
    service: "Coupe Homme",
    time: "11:30",
    date: "Aujourd'hui",
    status: "confirmed",
    statusLabel: "Confirmé",
  },
  {
    id: 3,
    clientName: "Sophie Bernard",
    service: "Coloration",
    time: "14:00",
    date: "Demain",
    status: "pending",
    statusLabel: "En attente",
  },
  {
    id: 4,
    clientName: "Pierre Lefevre",
    service: "Soin Capillaire",
    time: "15:30",
    date: "Demain",
    status: "confirmed",
    statusLabel: "Confirmé",
  },
]);

const logout = () => {
  localStorage.removeItem("userToken");
  emit("logout");
};
</script>

<style scoped>
@import "../styles/dashboard.css";

.page-header h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #333;
}

.dashboard-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 30px;
  background: linear-gradient(135deg, #1c1b57 0%, #1c1b57 100%);
  color: white;
  margin-bottom: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(75, 187, 251, 0.3);
}
</style>

