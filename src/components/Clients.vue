<template>
  <div class="clients-page">
    <header class="page-header">
      <div>
        <div class="header-title">
          <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <h1 class="page-title">Gestion des Clients</h1>
        </div>
        <p class="page-subtitle">Gérez votre base de données clients</p>
      </div>
      <button @click="showAddClientForm = !showAddClientForm" class="btn-primary">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Ajouter un client
      </button>
    </header>

    <!-- Formulaire d'ajout de client -->
    <div v-if="showAddClientForm" class="add-client-form">
      <h2>Nouveau Client</h2>
      <form @submit.prevent="handleAddClient">
        <div class="form-row">
          <div class="form-group">
            <label>Nom complet *</label>
            <input
              v-model="newClient.name"
              type="text"
              placeholder="Nom et prénom"
              required
            />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input
              v-model="newClient.email"
              type="email"
              placeholder="email@example.com"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Téléphone *</label>
            <input
              v-model="newClient.phone"
              type="tel"
              placeholder="06 12 34 56 78"
              required
            />
          </div>
          <div class="form-group">
            <label>Adresse</label>
            <input
              v-model="newClient.address"
              type="text"
              placeholder="Adresse complète"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Ville</label>
            <input v-model="newClient.city" type="text" placeholder="Ville" />
          </div>
          <div class="form-group">
            <label>Code postal</label>
            <input
              v-model="newClient.postalCode"
              type="text"
              placeholder="Code postal"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Notes</label>
          <textarea
            v-model="newClient.notes"
            placeholder="Notes supplémentaires..."
            rows="3"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-save">Ajouter client</button>
          <button
            type="button"
            @click="showAddClientForm = false"
            class="btn-cancel"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>

    <!-- Tableau des clients -->
    <div class="clients-table-container">
      <div class="clients-header">
        <h2>Clients ({{ clients.length }})</h2>
        <div class="search-bar">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un client..."
            class="search-input"
          />
        </div>
      </div>

      <table class="clients-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Téléphone</th>
            <th>Email</th>
            <th>Adresse</th>
            <th>Ville</th>
            <th>Points fidélité</th>
            <th>Total dépensé</th>
            <th>Depuis</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in filteredClients" :key="client.id" class="client-row">
            <td class="cell-name">{{ client.name }}</td>
            <td>{{ client.phone }}</td>
            <td>{{ client.email || "-" }}</td>
            <td>{{ client.address || "-" }}</td>
            <td>{{ client.city || "-" }}</td>
            <td class="cell-points">
              <span class="points-badge">{{ client.loyaltyPoints }}</span>
            </td>
            <td class="cell-spent">{{ client.totalSpent.toFixed(2) }}€</td>
            <td>{{ formatDate(client.joinDate) }}</td>
            <td class="cell-actions">
              <button
                @click="editClient(client)"
                class="btn-edit"
                title="Modifier"
              >
                ✎
              </button>
              <button
                @click="deleteClient(client.id)"
                class="btn-delete"
                title="Supprimer"
              >
                ✕
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredClients.length === 0" class="no-clients">
        <p>Aucun client trouvé</p>
      </div>
    </div>

    <!-- Modal d'édition -->
    <div v-if="editingClient" class="modal-overlay" @click="editingClient = null">
      <div class="modal-content" @click.stop>
        <h2>Modifier Client</h2>
        <form @submit.prevent="handleUpdateClient">
          <div class="form-row">
            <div class="form-group">
              <label>Nom complet</label>
              <input v-model="editingClient.name" type="text" required />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="editingClient.email" type="email" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Téléphone</label>
              <input v-model="editingClient.phone" type="tel" required />
            </div>
            <div class="form-group">
              <label>Adresse</label>
              <input v-model="editingClient.address" type="text" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Ville</label>
              <input v-model="editingClient.city" type="text" />
            </div>
            <div class="form-group">
              <label>Code postal</label>
              <input v-model="editingClient.postalCode" type="text" />
            </div>
          </div>

          <div class="form-group">
            <label>Notes</label>
            <textarea v-model="editingClient.notes" rows="3"></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-save">Mettre à jour</button>
            <button
              type="button"
              @click="editingClient = null"
              class="btn-cancel"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useClients } from "../composables/useClients";
import { useAuth } from "../composables/useAuth";

const { clients, addClient, updateClient, deleteClient } = useClients();
const { currentUser } = useAuth();

const showAddClientForm = ref(false);
const editingClient = ref(null);
const searchQuery = ref("");

const newClient = ref({
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  notes: "",
});

const filteredClients = computed(() => {
  if (!searchQuery.value) return clients.value;
  const query = searchQuery.value.toLowerCase();
  return clients.value.filter(
    (client) =>
      client.name.toLowerCase().includes(query) ||
      client.phone.toLowerCase().includes(query) ||
      client.email?.toLowerCase().includes(query)
  );
});

const handleAddClient = () => {
  if (!newClient.value.name || !newClient.value.phone) {
    alert("Veuillez remplir au moins le nom et le téléphone");
    return;
  }

  addClient(newClient.value);

  newClient.value = {
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  };

  showAddClientForm.value = false;
};

const editClient = (client) => {
  editingClient.value = { ...client };
};

const handleUpdateClient = () => {
  updateClient(editingClient.value.id, editingClient.value);
  editingClient.value = null;
};

const handleDeleteClient = (id) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
    deleteClient(id);
  }
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("fr-FR");
};

onMounted(() => {
  // Page loaded
});
</script>

<style scoped>
.clients-page {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #1c1b57;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #1c1b57;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(28, 27, 87, 0.3);
}

.btn-primary .icon {
  width: 20px;
  height: 20px;
}

.btn-add-client {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #1c1b57;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-add-client:hover {
  background: #1c1b57;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(28, 27, 87, 0.3);
}

.btn-add-client .icon {
  width: 18px;
  height: 18px;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.page-subtitle {
  color: #666;
  margin: 5px 0 0 0;
  font-size: 14px;
}

.btn-add-client {
  padding: 10px 20px;
  background: #1c1b57;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-add-client:hover {
  background: #764ba2;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.add-client-form {
  background: white;
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.add-client-form h2 {
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
.form-group textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1c1b57;
  box-shadow: 0 0 5px rgba(28, 27, 87, 0.3);
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-save,
.btn-cancel {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-save {
  background: #27ae60;
  color: white;
}

.btn-save:hover {
  background: #229954;
}

.btn-cancel {
  background: #95a5a6;
  color: white;
}

.btn-cancel:hover {
  background: #7f8c8d;
}

.clients-table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.clients-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.clients-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.search-bar {
  flex: 1;
  max-width: 300px;
  margin-left: 20px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #1c1b57;
}

.clients-table {
  width: 100%;
  border-collapse: collapse;
}

.clients-table thead {
  background: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
}

.clients-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #333;
  font-size: 13px;
}

.clients-table td {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  font-size: 14px;
}

.client-row:hover {
  background: #f9f9f9;
}

.cell-name {
  font-weight: 500;
  color: #333;
}

.points-badge {
  display: inline-block;
  background: #1c1b57;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.cell-spent {
  font-weight: 500;
  color: #27ae60;
}

.cell-actions {
  display: flex;
  gap: 10px;
}

.btn-edit,
.btn-delete {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-edit {
  background: #3498db;
  color: white;
}

.btn-edit:hover {
  background: #2980b9;
}

.btn-delete {
  background: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background: #c0392b;
}

.no-clients {
  padding: 40px;
  text-align: center;
  color: #999;
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
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin: 0 0 20px 0;
  color: #333;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .clients-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-bar {
    width: 100%;
    margin-left: 0;
    margin-top: 15px;
  }

  .clients-table {
    font-size: 12px;
  }

  .clients-table th,
  .clients-table td {
    padding: 10px;
  }
}
</style>

