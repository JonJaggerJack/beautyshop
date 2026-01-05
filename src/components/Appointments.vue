<template>
  <div class="appointments-page">
    <header class="page-header">
      <div>
        <h1 class="page-title">Rendez-vous</h1>
        <p class="page-subtitle">Gestion des rendez-vous des clients</p>
      </div>
      <button type="button" class="btn-primary" @click="openCreateModal">
        <svg
          class="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Nouveau Rendez-vous
      </button>
    </header>

    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <!-- Error state -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Filters -->
    <div class="appointments-content">
      <div class="filters-bar">
        <div class="filter-group">
          <label>Filtrer par date:</label>
          <input type="date" v-model="selectedDate" class="filter-input" />
        </div>
        <div class="filter-group">
          <label>Filtrer par statut:</label>
          <select v-model="selectedStatus" class="filter-select">
            <option value="">Tous les statuts</option>
            <option value="scheduled">Planifié</option>
            <option value="in-progress">En cours</option>
            <option value="completed">Complété</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="loading-state">
        <p>Chargement des rendez-vous...</p>
      </div>

      <!-- Appointments list -->
      <div
        v-else-if="filteredAppointments.length > 0"
        class="appointments-grid"
      >
        <div
          v-for="appointment in filteredAppointments"
          :key="appointment._id"
          class="appointment-card"
        >
          <div class="appointment-header">
            <div class="appointment-time">
              <span class="time">{{ formatTime(appointment.date) }}</span>
              <span class="date">{{ formatDate(appointment.date) }}</span>
            </div>
            <span :class="['status-badge', appointment.status]">{{
              getStatusLabel(appointment.status)
            }}</span>
          </div>

          <div class="appointment-body">
            <h3>{{ appointment.client_id?.name }}</h3>
            <div class="appointment-details">
              <p>
                <strong>Service:</strong>
                {{ appointment.service_id?.name }} -
                {{ appointment.service_id?.price }}€
              </p>
              <p>
                <strong>Coiffeur/Coiffeuse:</strong>
                {{ appointment.staff_id?.username }}
              </p>
              <p>
                <strong>Durée:</strong>
                {{ appointment.duration }} minutes
              </p>
              <p v-if="appointment.notes">
                <strong>Notes:</strong>
                {{ appointment.notes }}
              </p>
            </div>
          </div>

          <div class="appointment-actions">
            <button
              @click="openEditModal(appointment)"
              class="btn-icon edit"
              title="Modifier"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                ></path>
                <path
                  d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                ></path>
              </svg>
            </button>
            <select
              :value="appointment.status"
              @change="(e) => updateStatus(appointment._id, e.target.value)"
              class="status-select"
            >
              <option value="scheduled">Planifié</option>
              <option value="in-progress">En cours</option>
              <option value="completed">Complété</option>
              <option value="cancelled">Annulé</option>
            </select>
            <button
              @click="deleteAppointmentConfirm(appointment._id)"
              class="btn-icon delete"
              title="Supprimer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path
                  d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                ></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="empty-state">
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
        <p>Aucun rendez-vous trouvé</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2>
            {{ isEditing ? "Modifier Rendez-vous" : "Nouveau Rendez-vous" }}
          </h2>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label>Client *</label>
            <select v-model="formData.client_id" required>
              <option value="">Sélectionner un client</option>
              <option
                v-for="client in clients"
                :key="client._id"
                :value="client._id"
              >
                {{ client.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Service *</label>
            <select
              v-model="formData.service_id"
              required
              @change="updateDurationFromService"
            >
              <option value="">Sélectionner un service</option>
              <option
                v-for="service in services"
                :key="service._id"
                :value="service._id"
              >
                {{ service.name }} - {{ service.price }}€
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Coiffeur/Coiffeuse *</label>
            <select v-model="formData.staff_id" required>
              <option value="">Sélectionner un coiffeur</option>
              <option
                v-for="staff in staffList"
                :key="staff._id"
                :value="staff._id"
              >
                {{ staff.username }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Date et Heure *</label>
            <input v-model="formData.date" type="datetime-local" required />
          </div>

          <div class="form-group">
            <label>Durée (minutes) *</label>
            <input
              v-model.number="formData.duration"
              type="number"
              required
              min="15"
              step="15"
            />
          </div>

          <div class="form-group">
            <label>Notes</label>
            <textarea
              v-model="formData.notes"
              rows="3"
              placeholder="Ajouter des notes..."
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="btn-secondary">Annuler</button>
          <button @click="saveAppointment" class="btn-primary">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAppointments } from "../composables/useAppointments";
import { useClients } from "../composables/useClients";
import { useDataManager } from "../composables/useDataManager";

const {
  appointments,
  loading,
  error,
  fetchAppointments,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} = useAppointments();
const { clients, fetchClients } = useClients();
const { services, users, fetchServices, fetchUsers } = useDataManager();

const showModal = ref(false);
const isEditing = ref(false);
const selectedDate = ref("");
const selectedStatus = ref("");
const editingId = ref(null);
const successMessage = ref("");

const formData = ref({
  client_id: "",
  service_id: "",
  staff_id: "",
  date: "",
  duration: 30,
  notes: "",
});

const staffList = computed(() =>
  users.value.filter((user) => user.role !== "admin")
);

const filteredAppointments = computed(() => {
  let filtered = appointments.value;

  if (selectedDate.value) {
    const selectedDateObj = new Date(selectedDate.value);
    filtered = filtered.filter((app) => {
      const appDate = new Date(app.date);
      return appDate.toDateString() === selectedDateObj.toDateString();
    });
  }

  if (selectedStatus.value) {
    filtered = filtered.filter((app) => app.status === selectedStatus.value);
  }

  return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
});

const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = null;
  resetForm();
  showModal.value = true;
};

const openEditModal = (appointment) => {
  isEditing.value = true;
  editingId.value = appointment._id;
  formData.value.client_id = appointment.client_id._id;
  formData.value.service_id = appointment.service_id._id;
  formData.value.staff_id = appointment.staff_id._id;
  formData.value.date = new Date(appointment.date).toISOString().slice(0, 16);
  formData.value.duration = appointment.duration;
  formData.value.notes = appointment.notes;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const resetForm = () => {
  formData.value.client_id = "";
  formData.value.service_id = "";
  formData.value.staff_id = "";
  formData.value.date = "";
  formData.value.duration = 30;
  formData.value.notes = "";
};

const updateDurationFromService = () => {
  const service = services.value.find(
    (s) => s._id === formData.value.service_id
  );
  if (service) {
    formData.value.duration = service.duration;
  }
};

const saveAppointment = async () => {
  try {
    if (
      !formData.value.client_id ||
      !formData.value.service_id ||
      !formData.value.staff_id ||
      !formData.value.date
    ) {
      alert("Veuillez remplir tous les champs requis");
      return;
    }

    const appointmentData = {
      ...formData.value,
      date: new Date(formData.value.date).toISOString(),
    };

    if (isEditing.value) {
      await updateAppointment(editingId.value, appointmentData);
      successMessage.value = "Rendez-vous modifié avec succès";
    } else {
      await createAppointment(appointmentData);
      successMessage.value = "Rendez-vous créé avec succès";
    }

    setTimeout(() => {
      successMessage.value = "";
    }, 3000);

    closeModal();
    await fetchAppointments();
  } catch (err) {
    alert("Erreur lors de l'enregistrement du rendez-vous");
  }
};

const updateStatus = async (id, status) => {
  try {
    await updateAppointmentStatus(id, status);
    successMessage.value = "Statut mis à jour";
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
    await fetchAppointments();
  } catch (err) {
    alert("Erreur lors de la mise à jour du statut");
  }
};

const deleteAppointmentConfirm = async (id) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce rendez-vous?")) {
    try {
      await deleteAppointment(id);
      successMessage.value = "Rendez-vous supprimé";
      setTimeout(() => {
        successMessage.value = "";
      }, 3000);
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  }
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
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

onMounted(async () => {
  try {
    await Promise.all([
      fetchAppointments(),
      fetchClients(),
      fetchServices(),
      fetchUsers(),
    ]);
  } catch (err) {
    console.error("Erreur lors du chargement des données:", err);
  }
});
</script>

<style scoped>
.appointments-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #667eea;
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
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary .icon {
  width: 20px;
  height: 20px;
}

.success-message {
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
}

.appointments-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filters-bar {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 6px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-size: 12px;
  font-weight: 600;
  color: #666;
}

.filter-input,
.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.loading-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.appointments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.appointment-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.appointment-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f9f9f9;
  border-bottom: 1px solid #eee;
}

.appointment-time {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.time {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
}

.date {
  font-size: 12px;
  color: #666;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.scheduled {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status-badge.in-progress {
  background-color: #fff3e0;
  color: #f57c00;
}

.status-badge.completed {
  background-color: #e8f5e9;
  color: #388e3c;
}

.status-badge.cancelled {
  background-color: #ffebee;
  color: #d32f2f;
}

.appointment-body {
  padding: 15px;
}

.appointment-body h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #1a1a1a;
}

.appointment-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.appointment-details p {
  margin: 0;
  font-size: 14px;
  color: #555;
  line-height: 1.5;
}

.appointment-details strong {
  color: #333;
}

.appointment-details small {
  font-size: 12px;
  color: #999;
}

.appointment-actions {
  display: flex;
  gap: 8px;
  padding: 12px 15px;
  border-top: 1px solid #eee;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-icon:hover {
  background: #f5f5f5;
  border-color: #bbb;
}

.btn-icon.edit:hover {
  border-color: #1976d2;
  color: #1976d2;
}

.btn-icon.delete:hover {
  border-color: #d32f2f;
  color: #d32f2f;
}

.btn-icon svg {
  width: 18px;
  height: 18px;
}

.status-select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s;
}

.status-select:hover {
  border-color: #bbb;
}

.status-select:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state svg {
  width: 48px;
  height: 48px;
  margin-bottom: 15px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 16px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: #1a1a1a;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #999;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.form-group textarea {
  resize: vertical;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #eee;
}

.btn-secondary {
  padding: 10px 20px;
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

.btn-secondary:hover {
  background-color: #eeeeee;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
  }

  .filters-bar {
    flex-direction: column;
  }

  .appointments-grid {
    grid-template-columns: 1fr;
  }

  .appointment-actions {
    flex-wrap: wrap;
  }

  .modal {
    width: 95%;
    max-height: 95vh;
  }
}
</style>
