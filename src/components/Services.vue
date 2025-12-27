<template>
  <div class="services-page">
    <header class="page-header">
      <div>
        <h1 class="page-title">Services</h1>
        <p class="page-subtitle">Gestion des services proposés par le salon</p>
      </div>
      <button type="button" class="btn-primary" @click="showAddModal = true">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Ajouter un service
      </button>
    </header>

    <div class="services-content">
      <div class="services-grid">
        <div
          v-for="service in services"
          :key="service.id"
          class="service-card"
        >
          <div class="service-header">
            <h3>{{ service.name }}</h3>
            <div class="service-actions">
              <button
                type="button"
                class="btn-icon edit"
                @click="editService(service)"
                title="Modifier"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button
                type="button"
                class="btn-icon delete"
                @click="deleteService(service.id)"
                title="Supprimer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="service-body">
            <div class="service-info">
              <div class="info-item">
                <span class="label">Prix:</span>
                <span class="value">{{ service.price }}€</span>
              </div>
              <div class="info-item">
                <span class="label">Durée:</span>
                <span class="value">{{ service.duration }} min</span>
              </div>
              <div class="info-item">
                <span class="label">Réservations:</span>
                <span class="value">{{ service.bookings }}</span>
              </div>
            </div>
            <div v-if="service.description" class="service-description">
              {{ service.description }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout/édition -->
    <div v-if="showAddModal" class="modal-overlay" @click="showAddModal = false">
      <div class="modal-content" @click.stop>
        <h2>{{ editingService ? 'Modifier le service' : 'Nouveau service' }}</h2>
        <form @submit.prevent="saveService">
          <div class="form-group">
            <label>Nom du service</label>
            <input v-model="formData.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Prix (€)</label>
            <input v-model.number="formData.price" type="number" step="0.01" required />
          </div>
          <div class="form-group">
            <label>Durée (minutes)</label>
            <input v-model.number="formData.duration" type="number" required />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="formData.description" rows="3"></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="showAddModal = false">
              Annuler
            </button>
            <button type="submit" class="btn-primary">
              {{ editingService ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

const services = ref([
  { id: 1, name: "Coupe Femme", price: 35, duration: 45, bookings: 12, description: "Coupe et brushing pour femme" },
  { id: 2, name: "Coupe Homme", price: 25, duration: 30, bookings: 18, description: "Coupe classique pour homme" },
  { id: 3, name: "Coloration", price: 50, duration: 90, bookings: 8, description: "Coloration complète des cheveux" },
  { id: 4, name: "Lissage Brésilien", price: 80, duration: 120, bookings: 5, description: "Lissage brésilien professionnel" },
  { id: 5, name: "Soin Capillaire", price: 40, duration: 60, bookings: 10, description: "Soin profond et hydratant" },
]);

const showAddModal = ref(false);
const editingService = ref(null);

const formData = reactive({
  name: "",
  price: 0,
  duration: 0,
  description: "",
});

const editService = (service) => {
  editingService.value = service;
  formData.name = service.name;
  formData.price = service.price;
  formData.duration = service.duration;
  formData.description = service.description || "";
  showAddModal.value = true;
};

const saveService = () => {
  if (editingService.value) {
    // Modifier
    const index = services.value.findIndex(s => s.id === editingService.value.id);
    if (index !== -1) {
      services.value[index] = { ...editingService.value, ...formData };
    }
  } else {
    // Ajouter
    const newId = Math.max(...services.value.map(s => s.id)) + 1;
    services.value.push({
      id: newId,
      ...formData,
      bookings: 0,
    });
  }
  resetForm();
  showAddModal.value = false;
};

const deleteService = (id) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
    services.value = services.value.filter(s => s.id !== id);
  }
};

const resetForm = () => {
  editingService.value = null;
  formData.name = "";
  formData.price = 0;
  formData.duration = 0;
  formData.description = "";
};
</script>

<style scoped>
.services-page {
  padding: 30px;
  height: 100%;
  overflow-y: auto;
  background: #f5f5f5;
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
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary .icon {
  width: 20px;
  height: 20px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.service-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.service-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.service-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-icon svg {
  width: 18px;
  height: 18px;
}

.btn-icon.edit:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.btn-icon.delete:hover {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.service-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.value {
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.service-description {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

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

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  font-size: 24px;
  margin: 0 0 24px 0;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn-secondary {
  padding: 12px 24px;
  background: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 20px;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style>
