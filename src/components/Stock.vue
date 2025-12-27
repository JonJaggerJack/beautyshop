<template>
  <div class="stock-page">
    <header class="page-header">
      <div>
        <h1 class="page-title">Gestion du Stock</h1>
        <p class="page-subtitle">Gestion des produits et inventaire</p>
      </div>
      <button type="button" class="btn-primary" @click="showAddModal = true">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Ajouter un produit
      </button>
    </header>

    <div class="stock-content">
      <!-- Statistiques rapides -->
      <div class="stock-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Total produits</span>
            <span class="stat-value">{{ totalProducts }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon warning">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Stock faible</span>
            <span class="stat-value">{{ lowStockCount }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Valeur totale</span>
            <span class="stat-value">{{ totalValue }}€</span>
          </div>
        </div>
      </div>

      <!-- Liste des produits -->
      <div class="products-section">
        <div class="section-header">
          <h2>Produits en stock</h2>
          <div class="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher un produit..."
            />
          </div>
        </div>

        <div class="products-grid">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-card"
            :class="{ 'low-stock': product.quantity <= product.minStock }"
          >
            <div class="product-header">
              <h3>{{ product.name }}</h3>
              <div class="product-actions">
                <button
                  type="button"
                  class="btn-icon edit"
                  @click="editProduct(product)"
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
                  @click="deleteProduct(product.id)"
                  title="Supprimer"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div class="product-body">
              <div class="product-info">
                <div class="info-row">
                  <span class="label">Quantité:</span>
                  <span class="value" :class="{ 'low-stock-text': product.quantity <= product.minStock }">
                    {{ product.quantity }} {{ product.unit }}
                  </span>
                </div>
                <div class="info-row">
                  <span class="label">Prix d'achat:</span>
                  <span class="value">{{ product.purchasePrice }}€</span>
                </div>
                <div class="info-row">
                  <span class="label">Prix de vente:</span>
                  <span class="value">{{ product.salePrice }}€</span>
                </div>
                <div class="info-row">
                  <span class="label">Stock minimum:</span>
                  <span class="value">{{ product.minStock }} {{ product.unit }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Valeur stock:</span>
                  <span class="value highlight">{{ (product.quantity * product.purchasePrice).toFixed(2) }}€</span>
                </div>
              </div>
              <div v-if="product.description" class="product-description">
                {{ product.description }}
              </div>
              <div v-if="product.quantity <= product.minStock" class="stock-alert">
                ⚠️ Stock faible ! Réapprovisionnement nécessaire
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout/édition -->
    <div v-if="showAddModal" class="modal-overlay" @click="showAddModal = false">
      <div class="modal-content" @click.stop>
        <h2>{{ editingProduct ? 'Modifier le produit' : 'Nouveau produit' }}</h2>
        <form @submit.prevent="saveProduct">
          <div class="form-group">
            <label>Nom du produit</label>
            <input v-model="formData.name" type="text" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Quantité</label>
              <input v-model.number="formData.quantity" type="number" min="0" required />
            </div>
            <div class="form-group">
              <label>Unité</label>
              <select v-model="formData.unit" required>
                <option value="unité">Unité</option>
                <option value="kg">Kg</option>
                <option value="L">L</option>
                <option value="m">M</option>
                <option value="paquet">Paquet</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Prix d'achat (€)</label>
              <input v-model.number="formData.purchasePrice" type="number" step="0.01" min="0" required />
            </div>
            <div class="form-group">
              <label>Prix de vente (€)</label>
              <input v-model.number="formData.salePrice" type="number" step="0.01" min="0" required />
            </div>
          </div>
          <div class="form-group">
            <label>Stock minimum</label>
            <input v-model.number="formData.minStock" type="number" min="0" required />
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
              {{ editingProduct ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";

const products = ref([
  {
    id: 1,
    name: "Shampooing Professionnel",
    quantity: 15,
    unit: "bouteille",
    purchasePrice: 8.50,
    salePrice: 15.00,
    minStock: 10,
    description: "Shampooing pour cheveux colorés",
  },
  {
    id: 2,
    name: "Masque Capillaire",
    quantity: 8,
    unit: "pot",
    purchasePrice: 12.00,
    salePrice: 25.00,
    minStock: 10,
    description: "Masque hydratant intensif",
  },
  {
    id: 3,
    name: "Coloration L'Oréal",
    quantity: 25,
    unit: "boîte",
    purchasePrice: 5.50,
    salePrice: 12.00,
    minStock: 15,
    description: "Coloration permanente",
  },
  {
    id: 4,
    name: "Gants Jetables",
    quantity: 5,
    unit: "paquet",
    purchasePrice: 3.00,
    salePrice: 6.00,
    minStock: 10,
    description: "Paquet de 100 gants",
  },
]);

const showAddModal = ref(false);
const editingProduct = ref(null);
const searchQuery = ref("");

const formData = reactive({
  name: "",
  quantity: 0,
  unit: "unité",
  purchasePrice: 0,
  salePrice: 0,
  minStock: 0,
  description: "",
});

const totalProducts = computed(() => products.value.length);

const lowStockCount = computed(() => {
  return products.value.filter(p => p.quantity <= p.minStock).length;
});

const totalValue = computed(() => {
  return products.value.reduce((sum, p) => sum + (p.quantity * p.purchasePrice), 0).toFixed(2);
});

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  const query = searchQuery.value.toLowerCase();
  return products.value.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.description?.toLowerCase().includes(query)
  );
});

const editProduct = (product) => {
  editingProduct.value = product;
  formData.name = product.name;
  formData.quantity = product.quantity;
  formData.unit = product.unit;
  formData.purchasePrice = product.purchasePrice;
  formData.salePrice = product.salePrice;
  formData.minStock = product.minStock;
  formData.description = product.description || "";
  showAddModal.value = true;
};

const saveProduct = () => {
  if (editingProduct.value) {
    const index = products.value.findIndex(p => p.id === editingProduct.value.id);
    if (index !== -1) {
      products.value[index] = { ...editingProduct.value, ...formData };
    }
  } else {
    const newId = Math.max(...products.value.map(p => p.id), 0) + 1;
    products.value.push({
      id: newId,
      ...formData,
    });
  }
  resetForm();
  showAddModal.value = false;
};

const deleteProduct = (id) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
    products.value = products.value.filter(p => p.id !== id);
  }
};

const resetForm = () => {
  editingProduct.value = null;
  formData.name = "";
  formData.quantity = 0;
  formData.unit = "unité";
  formData.purchasePrice = 0;
  formData.salePrice = 0;
  formData.minStock = 0;
  formData.description = "";
};
</script>

<style scoped>
.stock-page {
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

.stock-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-icon.warning {
  background: rgba(241, 196, 15, 0.1);
  color: #f39c12;
}

.stat-icon.success {
  background: rgba(39, 174, 96, 0.1);
  color: #27ae60;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.products-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
  min-width: 250px;
}

.search-box svg {
  width: 18px;
  height: 18px;
  color: #999;
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  flex: 1;
  font-size: 14px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.product-card {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  border: 2px solid #e0e0e0;
  transition: all 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.product-card.low-stock {
  border-color: #f39c12;
  background: #fff9e6;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
}

.product-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.product-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 32px;
  height: 32px;
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
  width: 16px;
  height: 16px;
}

.btn-icon.edit:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.btn-icon.delete:hover {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
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
  font-size: 15px;
  color: #333;
  font-weight: 600;
}

.value.highlight {
  color: #667eea;
  font-size: 16px;
}

.low-stock-text {
  color: #e74c3c;
}

.product-description {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

.stock-alert {
  margin-top: 12px;
  padding: 10px;
  background: rgba(241, 196, 15, 0.1);
  border-left: 3px solid #f39c12;
  border-radius: 4px;
  font-size: 13px;
  color: #d68910;
  font-weight: 600;
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  font-size: 24px;
  margin: 0 0 24px 0;
  color: #333;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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
.form-group select,
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
.form-group select:focus,
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

  .products-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>

