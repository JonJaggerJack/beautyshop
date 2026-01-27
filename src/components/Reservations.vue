<template>
  <div class="reservations-page">
    <header class="page-header">
      <div>
        <div class="header-title">
          <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <h1 class="page-title">Réservations</h1>
        </div>
        <p class="page-subtitle">Gérez les réservations de services</p>
      </div>
      <button @click="showAddReservationForm = !showAddReservationForm" class="btn-primary">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Nouvelle réservation
      </button>
    </header>

    <!-- Formulaire d'ajout de réservation -->
    <div v-if="showAddReservationForm" class="add-reservation-form">
      <h2>Nouvelle Réservation</h2>
      <form @submit.prevent="handleAddReservation">
        <div class="form-row">
          <div class="form-group">
            <label>Client *</label>
            <select v-model="newReservation.clientId" required>
              <option value="">-- Sélectionner un client --</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">
                {{ client.name }} ({{ client.phone }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Service *</label>
            <select v-model="newReservation.serviceId" required>
              <option value="">-- Sélectionner un service --</option>
              <option v-for="service in services" :key="service.id" :value="service.id">
                {{ service.name }} - {{ service.salePrice }}€
              </option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Date *</label>
            <input v-model="newReservation.date" type="date" required />
          </div>
          <div class="form-group">
            <label>Heure de début *</label>
            <input v-model="newReservation.startTime" type="time" required />
          </div>
        </div>

        <div class="form-group">
          <label>Notes</label>
          <textarea
            v-model="newReservation.notes"
            placeholder="Notes supplémentaires..."
            rows="3"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-save">Créer réservation</button>
          <button
            type="button"
            @click="showAddReservationForm = false"
            class="btn-cancel"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>

    <!-- Calendrier des réservations -->
    <div class="reservations-container">
      <div class="calendar-section">
        <h2>Vue mensuelle</h2>
        <div class="calendar">
          <div class="calendar-header">
            <button @click="previousMonth" class="btn-prev">‹</button>
            <h3>{{ monthYear }}</h3>
            <button @click="nextMonth" class="btn-next">›</button>
          </div>
          <div class="calendar-grid">
            <div v-for="day in calendarDays" :key="`${day.month}-${day.day}`" class="calendar-day"
              :class="{ 'other-month': day.month !== currentMonth, 'today': isToday(day) }">
              <div class="day-number">{{ day.day }}</div>
              <div class="day-reservations">
                <span v-for="res in getReservationsForDay(day)" :key="res.id" class="res-badge">
                  {{ res.time }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="reservations-list-section">
        <h2>Réservations ({{ filteredReservations.length }})</h2>
        <div class="search-bar">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher une réservation..."
            class="search-input"
          />
          <select v-model="filterStatus" class="filter-select">
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="completed">Terminée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>

        <table class="reservations-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Service</th>
              <th>Date & Heure</th>
              <th>Durée</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reservation in filteredReservations" :key="reservation.id" class="res-row">
              <td class="cell-client">{{ getClientName(reservation.clientId) }}</td>
              <td class="cell-service">{{ getServiceName(reservation.serviceId) }}</td>
              <td class="cell-datetime">
                {{ formatDate(reservation.date) }} {{ reservation.startTime }}
              </td>
              <td class="cell-duration">1h</td>
              <td class="cell-status">
                <span :class="`status-badge status-${reservation.status}`">
                  {{ statusLabel(reservation.status) }}
                </span>
              </td>
              <td class="cell-actions">
                <button
                  v-if="reservation.status === 'pending'"
                  @click="updateReservationStatus(reservation.id, 'confirmed')"
                  class="btn-confirm"
                  title="Confirmer"
                >
                  ✓
                </button>
                <button
                  v-if="reservation.status !== 'cancelled' && reservation.status !== 'completed'"
                  @click="deleteReservation(reservation.id)"
                  class="btn-delete"
                  title="Annuler"
                >
                  ✕
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredReservations.length === 0" class="no-reservations">
          <p>Aucune réservation trouvée</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useClients } from "../composables/useClients";
import { useAuth } from "../composables/useAuth";

const { clients, addReservation, updateReservation, deleteReservation, reservations } = useClients();
const { currentUser } = useAuth();

const showAddReservationForm = ref(false);
const searchQuery = ref("");
const filterStatus = ref("");

const services = ref([
  { id: 1, name: "Coupe Femme", salePrice: 35 },
  { id: 2, name: "Coupe Homme", salePrice: 25 },
  { id: 3, name: "Coloration", salePrice: 50 },
  { id: 4, name: "Lissage Brésilien", salePrice: 80 },
  { id: 5, name: "Soin Capillaire", salePrice: 40 },
  { id: 6, name: "Brushing", salePrice: 20 },
]);

const newReservation = ref({
  clientId: "",
  serviceId: "",
  date: "",
  startTime: "",
  notes: "",
});

const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

const monthYear = computed(() => {
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  return `${months[currentMonth.value]} ${currentYear.value}`;
});

const calendarDays = computed(() => {
  const days = [];
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    days.push({
      day: date.getDate(),
      month: date.getMonth(),
      date: date.toISOString().split("T")[0],
    });
  }
  return days;
});

const filteredReservations = computed(() => {
  return reservations.value.filter((res) => {
    const matchesSearch =
      searchQuery.value === "" ||
      getClientName(res.clientId)
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      getServiceName(res.serviceId)
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());

    const matchesStatus =
      filterStatus.value === "" || res.status === filterStatus.value;

    return matchesSearch && matchesStatus;
  });
});

const handleAddReservation = () => {
  if (
    !newReservation.value.clientId ||
    !newReservation.value.serviceId ||
    !newReservation.value.date ||
    !newReservation.value.startTime
  ) {
    alert("Veuillez remplir tous les champs obligatoires");
    return;
  }

  addReservation({
    clientId: parseInt(newReservation.value.clientId),
    serviceId: parseInt(newReservation.value.serviceId),
    date: newReservation.value.date,
    startTime: newReservation.value.startTime,
    endTime: calculateEndTime(newReservation.value.startTime),
    notes: newReservation.value.notes,
    status: "pending",
  });

  newReservation.value = {
    clientId: "",
    serviceId: "",
    date: "",
    startTime: "",
    notes: "",
  };
  showAddReservationForm.value = false;
};

const calculateEndTime = (startTime) => {
  const [hours, minutes] = startTime.split(":").map(Number);
  const endHours = (hours + 1) % 24;
  return `${String(endHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const getClientName = (clientId) => {
  const client = clients.value.find((c) => c.id === clientId);
  return client ? client.name : "Inconnu";
};

const getServiceName = (serviceId) => {
  const service = services.value.find((s) => s.id === serviceId);
  return service ? service.name : "Inconnu";
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("fr-FR");
};

const isToday = (day) => {
  const today = new Date();
  return (
    day.day === today.getDate() &&
    day.month === today.getMonth() &&
    day.month === currentMonth.value
  );
};

const getReservationsForDay = (day) => {
  return reservations.value
    .filter((res) => res.date === day.date)
    .map((res) => ({
      ...res,
      time: res.startTime.substring(0, 5),
    }));
};

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const updateReservationStatus = (id, status) => {
  const reservation = reservations.find((r) => r.id === id);
  if (reservation) {
    updateReservation(id, { ...reservation, status });
  }
};

const handleDeleteReservation = (id) => {
  if (confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
    deleteReservation(id);
  }
};

const statusLabel = (status) => {
  const labels = {
    pending: "En attente",
    confirmed: "Confirmée",
    completed: "Terminée",
    cancelled: "Annulée",
  };
  return labels[status] || status;
};

onMounted(() => {
  // Initialize
});
</script>

<style scoped>
.reservations-page {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #4bbbfb;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary .icon {
  width: 20px;
  height: 20px;
}

.btn-add-reservation {
  padding: 10px 20px;
  background: #4bbbfb;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-add-reservation:hover {
  background: #764ba2;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.add-reservation-form {
  background: white;
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.add-reservation-form h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #333;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4bbbfb;
  box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-save {
  padding: 10px 20px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
}

.btn-save:hover {
  background: #229954;
}

.btn-cancel {
  padding: 10px 20px;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
}

.btn-cancel:hover {
  background: #7f8c8d;
}

.reservations-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
}

.calendar-section,
.reservations-list-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.calendar-section h2,
.reservations-list-section h2 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #333;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-prev,
.btn-next {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.3s ease;
}

.btn-prev:hover,
.btn-next:hover {
  background: #f5f5f5;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.calendar-day {
  min-height: 80px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 8px;
  background: white;
  position: relative;
}

.calendar-day.other-month {
  background: #f9f9f9;
  color: #ccc;
}

.calendar-day.today {
  background: #e3f2fd;
  border-color: #2196f3;
}

.day-number {
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.day-reservations {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.res-badge {
  display: inline-block;
  font-size: 11px;
  background: #4bbbfb;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.search-input,
.filter-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.search-input {
  flex: 1;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #4bbbfb;
}

.reservations-table {
  width: 100%;
  border-collapse: collapse;
}

.reservations-table thead {
  background: #f5f5f5;
}

.reservations-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  font-size: 13px;
}

.reservations-table td {
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  font-size: 14px;
}

.res-row:hover {
  background: #f9f9f9;
}

.cell-client {
  font-weight: 500;
}

.cell-status {
  text-align: center;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-confirmed {
  background: #d4edda;
  color: #155724;
}

.status-completed {
  background: #cfe2ff;
  color: #084298;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.cell-actions {
  display: flex;
  gap: 8px;
}

.btn-confirm {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background: #27ae60;
  color: white;
  cursor: pointer;
  font-weight: 600;
}

.btn-confirm:hover {
  background: #229954;
}

.btn-delete {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background: #e74c3c;
  color: white;
  cursor: pointer;
  font-weight: 600;
}

.btn-delete:hover {
  background: #c0392b;
}

.no-reservations {
  text-align: center;
  padding: 40px;
  color: #999;
}

@media (max-width: 1024px) {
  .reservations-container {
    grid-template-columns: 1fr;
  }
}
</style>

