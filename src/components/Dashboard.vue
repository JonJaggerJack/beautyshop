<template>
  <div class="dashboard-container" :class="{ 'dark-mode': isDarkMode }">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-left">
        <h1 class="dashboard-title">CHEZ JK</h1>
        <p class="dashboard-subtitle">Tableau de Bord</p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="dashboard-main" :class="{ 'dark-mode': isDarkMode }">
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
          <h2 class="section-title">Services</h2>
          <button type="button" class="btn-add">+ Ajouter Service</button>
        </div>
        <div class="table-responsive">
          <table class="services-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Prix</th>
                <th>Réservations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="service in services" :key="service.id">
                <td>{{ service.name }}</td>
                <td>{{ service.price }}€</td>
                <td>{{ service.bookings }}</td>
                <td class="actions-cell">
                  <button
                    type="button"
                    class="btn-action edit"
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    class="btn-action delete"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Upcoming Appointments -->
      <section class="appointments-section">
        <h2 class="section-title">Rendez-vous Aujourd'hui</h2>
        <div v-if="todayAppointments.length > 0" class="appointments-list">
          <div
            v-for="appointment in todayAppointments"
            :key="appointment._id"
            class="appointment-card"
          >
            <div class="appointment-time">
              <span class="time">{{ formatTime(appointment.date) }}</span>
              <span class="date">Aujourd'hui</span>
            </div>
            <div class="appointment-info">
              <h4>{{ appointment.client_id?.name }}</h4>
              <p>{{ appointment.service_id?.name }}</p>
              <small>{{ appointment.staff_id?.username }}</small>
            </div>
            <div class="appointment-status" :class="appointment.status">
              {{ getStatusLabel(appointment.status) }}
            </div>
          </div>
        </div>
        <div v-else class="no-appointments">
          Aucun rendez-vous pour aujourd'hui
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAppointments } from "../composables/useAppointments";
import { useClients } from "../composables/useClients";

const emit = defineEmits(["logout"]);

const isDarkMode = ref(false);

const { todayAppointments, fetchTodayAppointments } = useAppointments();
const { clients, fetchClients } = useClients();

const stats = ref({
  clients: 0,
  appointments: 0,
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

// Charger le thème et les données
onMounted(async () => {
  const savedDarkMode = localStorage.getItem("darkMode");
  if (savedDarkMode !== null) {
    isDarkMode.value = savedDarkMode === "true";
  }

  // Charger les données
  await Promise.all([fetchClients(), fetchTodayAppointments()]);

  // Mettre à jour les stats
  stats.value.clients = clients.value.length;
  stats.value.appointments = todayAppointments.value.length;
});

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem("darkMode", isDarkMode.value);
};

const logout = () => {
  localStorage.removeItem("token");
  emit("logout");
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusLabel = (status) => {
  const labels = {
    scheduled: "Planifié",
    "in-progress": "En cours",
    completed: "Complété",
    cancelled: "Annulé",
  };
  return labels[status] || status;
};
</script>

<style scoped>
@import "../styles/dashboard.css";
</style>
