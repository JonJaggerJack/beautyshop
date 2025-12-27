<template>
  <div class="personnel-page">
    <header class="page-header">
      <div>
        <h1 class="page-title">Personnel</h1>
        <p class="page-subtitle">Gestion du personnel du salon</p>
      </div>
      <button type="button" class="btn-primary" @click="showAddModal = true">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Ajouter un membre
      </button>
    </header>

    <div class="personnel-content">
      <div class="personnel-grid">
        <div
          v-for="member in personnel"
          :key="member.id"
          class="personnel-card"
        >
          <div class="personnel-avatar">
            <span>{{ member.initials }}</span>
          </div>
          <div class="personnel-info">
            <h3>{{ member.name }}</h3>
            <p class="role">{{ member.role }}</p>
            <div class="personnel-details">
              <div class="detail-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>{{ member.email }}</span>
              </div>
              <div class="detail-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>{{ member.phone }}</span>
              </div>
              <div class="detail-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>{{ member.schedule }}</span>
              </div>
            </div>
          </div>
          <div class="personnel-actions">
            <button
              type="button"
              class="btn-icon edit"
              @click="editMember(member)"
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
              @click="deleteMember(member.id)"
              title="Supprimer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout/édition -->
    <div v-if="showAddModal" class="modal-overlay" @click="showAddModal = false">
      <div class="modal-content" @click.stop>
        <h2>{{ editingMember ? 'Modifier le membre' : 'Nouveau membre' }}</h2>
        <form @submit.prevent="saveMember">
          <div class="form-group">
            <label>Nom complet</label>
            <input v-model="formData.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Rôle</label>
            <select v-model="formData.role" required>
              <option value="">Sélectionner un rôle</option>
              <option value="Coiffeur/Coiffeuse">Coiffeur/Coiffeuse</option>
              <option value="Styliste">Styliste</option>
              <option value="Coloriste">Coloriste</option>
              <option value="Esthéticienne">Esthéticienne</option>
              <option value="Gérant">Gérant</option>
            </select>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="formData.email" type="email" required />
          </div>
          <div class="form-group">
            <label>Téléphone</label>
            <input v-model="formData.phone" type="tel" required />
          </div>
          <div class="form-group">
            <label>Horaires</label>
            <input v-model="formData.schedule" type="text" placeholder="Ex: Lun-Ven 9h-18h" />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="showAddModal = false">
              Annuler
            </button>
            <button type="submit" class="btn-primary">
              {{ editingMember ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";

const personnel = ref([
  {
    id: 1,
    name: "Marie Dupont",
    role: "Coiffeuse",
    email: "marie.dupont@salon.fr",
    phone: "06 12 34 56 78",
    schedule: "Lun-Ven 9h-18h",
  },
  {
    id: 2,
    name: "Jean Martin",
    role: "Coiffeur",
    email: "jean.martin@salon.fr",
    phone: "06 23 45 67 89",
    schedule: "Mar-Sam 10h-19h",
  },
  {
    id: 3,
    name: "Sophie Bernard",
    role: "Coloriste",
    email: "sophie.bernard@salon.fr",
    phone: "06 34 56 78 90",
    schedule: "Mer-Dim 9h-17h",
  },
]);

const showAddModal = ref(false);
const editingMember = ref(null);

const formData = reactive({
  name: "",
  role: "",
  email: "",
  phone: "",
  schedule: "",
});

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const editMember = (member) => {
  editingMember.value = member;
  formData.name = member.name;
  formData.role = member.role;
  formData.email = member.email;
  formData.phone = member.phone;
  formData.schedule = member.schedule;
  showAddModal.value = true;
};

const saveMember = () => {
  if (editingMember.value) {
    // Modifier
    const index = personnel.value.findIndex((p) => p.id === editingMember.value.id);
    if (index !== -1) {
      personnel.value[index] = {
        ...editingMember.value,
        ...formData,
        initials: getInitials(formData.name),
      };
    }
  } else {
    // Ajouter
    const newId = Math.max(...personnel.value.map((p) => p.id), 0) + 1;
    personnel.value.push({
      id: newId,
      ...formData,
      initials: getInitials(formData.name),
    });
  }
  resetForm();
  showAddModal.value = false;
};

const deleteMember = (id) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce membre du personnel ?")) {
    personnel.value = personnel.value.filter((p) => p.id !== id);
  }
};

const resetForm = () => {
  editingMember.value = null;
  formData.name = "";
  formData.role = "";
  formData.email = "";
  formData.phone = "";
  formData.schedule = "";
};
</script>

<style scoped>
.personnel-page {
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

.personnel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.personnel-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.personnel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.personnel-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0 auto;
}

.personnel-info {
  text-align: center;
}

.personnel-info h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.role {
  font-size: 14px;
  color: #667eea;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.personnel-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #666;
}

.detail-item svg {
  width: 18px;
  height: 18px;
  color: #999;
}

.personnel-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
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
.form-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus {
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

  .personnel-grid {
    grid-template-columns: 1fr;
  }
}
</style>
