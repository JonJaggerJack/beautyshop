<template>
  <div class="services-page">
    <header class="page-header">
      <div>
        <div class="header-title">
          <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          <h1 class="page-title">Services</h1>
        </div>
        <p class="page-subtitle">Gestion des services proposés</p>
      </div>
      <button class="btn-primary" @click="showModal = true">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Ajouter un service
      </button>
    </header>

    <div class="grid">
      <div v-for="service in services" :key="service.id" class="card">
        <div v-if="service.photo" class="photo-main">
          <img :src="service.photo" :alt="service.name" />
        </div>
        <div v-else class="photo-empty">Pas de photo</div>

        <div class="content">
          <h3>{{ service.name }}</h3>
          <p class="price">{{ service.price }}€</p>
          <p v-if="service.description">{{ service.description }}</p>
          
          <div class="buttons">
            <button @click="edit(service)" class="btn btn-blue" title="Modifier">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button @click="remove(service.id)" class="btn btn-red" title="Supprimer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal" @click.self="showModal = false">
      <div class="modal-box">
        <h2>{{ editing ? 'Modifier' : 'Nouveau service' }}</h2>
        <input v-model="form.name" placeholder="Intitulé du service" />
        <input v-model.number="form.price" type="number" placeholder="Prix (€)" step="0.01" />
        <textarea v-model="form.description" placeholder="Description" rows="3"></textarea>
        
        <div class="photo-upload">
          <label>Photo du service (max 1 MB)</label>
          <input ref="fileInput" type="file" accept="image/*" @change="handleImageUpload" style="display:none" />
          <button type="button" @click="$refs.fileInput.click()" class="btn-upload">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            {{ form.photo ? 'Modifier' : 'Ajouter' }} la photo
          </button>
          <div v-if="form.photo" class="preview">
            <img :src="form.photo" />
            <button type="button" @click="form.photo = null" class="btn-remove">✕</button>
          </div>
        </div>

        <div class="modal-buttons">
          <button @click="showModal = false">Annuler</button>
          <button @click="save" class="primary">{{ editing ? 'Modifier' : 'Ajouter' }}</button>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useDataManager } from '../composables/useDataManager';

const initialServices = [
  { id: 1, name: 'Coupe Femme', price: 35, bookings: 12, description: 'Coupe et brushing', photo: null },
  { id: 2, name: 'Coupe Homme', price: 25, bookings: 18, description: 'Coupe classique', photo: null },
  { id: 3, name: 'Coloration', price: 50, bookings: 8, description: 'Coloration complète', photo: null },
  { id: 4, name: 'Lissage Brésilien', price: 80, bookings: 5, description: 'Lissage professionnel', photo: null },
  { id: 5, name: 'Soin Capillaire', price: 40, bookings: 10, description: 'Soin profond', photo: null },
];

const { items: services, addItem, updateItem, deleteItem } = useDataManager('services', initialServices);

const showModal = ref(false);
const editing = ref(null);
const fileInput = ref(null);

const form = ref({ name: '', price: 0, description: '', photo: null });

const save = () => {
  if (!form.value.name) return alert('Intitulé requis');
  if (form.value.price <= 0) return alert('Prix invalide');

  if (editing.value) {
    updateItem(editing.value, form.value);
  } else {
    addItem({ ...form.value, bookings: 0 });
  }
  showModal.value = false;
  form.value = { name: '', price: 0, description: '', photo: null };
  editing.value = null;
};

const edit = (s) => {
  editing.value = s.id;
  form.value = { name: s.name, price: s.price, description: s.description, photo: s.photo };
  showModal.value = true;
};

const remove = (id) => {
  if (confirm('Supprimer?')) deleteItem(id);
};

const handleImageUpload = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Veuillez sélectionner une image');
    return;
  }

  const maxSize = 1024 * 1024; // 1 MB
  if (file.size > maxSize) {
    alert('L\'image ne doit pas dépasser 1 MB');
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    form.value.photo = event.target.result;
  };
  reader.readAsDataURL(file);
};
</script>

<style scoped>
.services-page { padding: 20px; background: #f5f5f5; min-height: 100vh; }
.page-header h1 { margin: 0; font-size: 24px; }

.btn-add { display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: #4bbbfb; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; }
.btn-add .icon { width: 18px; height: 18px; }
.btn-add:hover { background: #5568d3; transform: translateY(-1px); }

.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.card { background: white; border-radius: 6px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
.photo-main { width: 100%; height: 160px; background: #f0f0f0; position: relative; }
.photo-main img { width: 100%; height: 100%; object-fit: cover; }
.count { position: absolute; bottom: 6px; right: 6px; background: rgba(0,0,0,0.7); color: white; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
.photo-empty { width: 100%; height: 160px; background: #e8e8e8; display: flex; align-items: center; justify-content: center; color: #999; }

.content { padding: 12px; }
.content h3 { margin: 0 0 6px; font-size: 16px; }
.price { margin: 0; color: #4bbbfb; font-weight: 700; }
.content p { margin: 4px 0; font-size: 12px; color: #666; }

.buttons { display: flex; gap: 6px; margin-top: 10px; }
.btn { flex: 1; padding: 8px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.btn svg { width: 16px; height: 16px; }
.btn-green { background: #4caf50; color: white; }
.btn-green:hover { background: #45a049; transform: translateY(-1px); }
.btn-blue { background: #2196f3; color: white; }
.btn-blue:hover { background: #1976d2; transform: translateY(-1px); }
.btn-red { background: #f44336; color: white; }
.btn-red:hover { background: #d32f2f; transform: translateY(-1px); }

.modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-box { background: white; border-radius: 6px; padding: 20px; width: 90%; max-width: 450px; max-height: 80vh; overflow-y: auto; }
.modal-box h2 { margin-top: 0; margin-bottom: 16px; }
.modal-box input, .modal-box textarea { width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px; box-sizing: border-box; }
.modal-buttons { display: flex; gap: 10px; justify-content: flex-end; margin-top: 16px; }
.modal-buttons button { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
.modal-buttons .primary { background: #4bbbfb; color: white; }

.photo-upload { margin-bottom: 12px; }
.photo-upload label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 13px; color: #333; }
.btn-upload { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 16px; background: #4bbbfb; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; width: 100%; transition: all 0.2s; }
.btn-upload svg { width: 18px; height: 18px; }
.btn-upload:hover { background: #5568d3; transform: translateY(-1px); }
.preview { margin-top: 10px; position: relative; width: 100%; max-width: 200px; border-radius: 4px; overflow: hidden; }
.preview img { width: 100%; height: auto; display: block; }
.btn-remove { position: absolute; top: 4px; right: 4px; width: 24px; height: 24px; background: rgba(244,67,54,0.9); color: white; border: none; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 14px; }
.btn-remove:hover { background: #f44336; }

@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr; }
}
</style>

