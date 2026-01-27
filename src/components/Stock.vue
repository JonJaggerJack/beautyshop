<template>
  <div class="stock-page">
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
    <header class="page-header">
      <div>
        <div class="header-title">
          <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"></path>
          </svg>
          <h1 class="page-title">Gestion du Stock</h1>
        </div>
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

      <!-- Alertes Stock Faible -->
      <div v-if="lowStockProducts.length > 0" class="alerts-section">
        <div class="alert alert-warning">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          </svg>
          <div>
            <strong>⚠️ {{ lowStockProducts.length }} produit(s) en stock faible !</strong>
            <p>{{ lowStockProducts.map(p => p.name).join(', ') }}</p>
          </div>
        </div>
      </div>

      <!-- Onglets -->
      <div class="tabs-container">
        <button class="tab-btn" :class="{ active: activeTab === 'tableau' }" @click="activeTab = 'tableau'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          Tableau
        </button>
        <button class="tab-btn" :class="{ active: activeTab === 'historique' }" @click="activeTab = 'historique'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          Historique
        </button>
      </div>

      <!-- Vue Tableau -->
      <div v-if="activeTab === 'tableau'" class="products-section">
        <div class="section-header">
          <h2>Produits en stock</h2>
          <div class="header-actions">
            <div class="search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
              <input v-model="searchQuery" type="text" placeholder="Rechercher un produit..." />
            </div>
            <button class="btn-secondary" @click="triggerFileInput" title="Importer depuis CSV">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Importer CSV
            </button>
            <input ref="fileInput" type="file" accept=".csv" style="display: none" @change="importCSV" />
            <button class="btn-secondary" @click="exportCSV" title="Exporter en CSV">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 14 12 9 17 14"></polyline>
                <line x1="12" y1="9" x2="12" y2="21"></line>
              </svg>
              Exporter CSV
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="products-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Stock Min</th>
                <th>Prix Achat</th>
                <th>Prix Vente</th>
                <th>Valeur</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in filteredProducts" :key="product.id" :class="{ 'low-stock': product.quantity <= product.minStock }">
                <td class="product-name">{{ product.name }}</td>
                <td class="quantity">{{ product.quantity }} {{ product.unit }}</td>
                <td class="min-stock">{{ product.minStock }}</td>
                <td>{{ product.purchasePrice }}€</td>
                <td>{{ product.salePrice }}€</td>
                <td class="value">{{ (product.quantity * product.purchasePrice).toFixed(2) }}€</td>
                <td><span class="badge" :class="product.quantity > product.minStock ? 'badge-success' : 'badge-warning'">
                  <svg v-if="product.quantity > product.minStock" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="#e65100" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  {{ product.quantity > product.minStock ? 'OK' : 'Faible' }}
                </span></td>
                <td class="actions">
                  <button type="button" class="btn-icon edit" @click="editProduct(product)" title="Modifier">✏️</button>
                  <button type="button" class="btn-icon delete" @click="deleteProduct(product.id)" title="Supprimer">🗑️</button>
                  <button type="button" class="btn-icon movement" @click="openMovementModal(product)" title="Mouvement">📦</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Vue Historique -->
      <div v-if="activeTab === 'historique'" class="history-section">
        <h2>Historique des mouvements</h2>
        <div v-if="movements.length === 0" class="empty-state">
          <p>Aucun mouvement pour le moment</p>
        </div>
        <div v-else class="movements-list">
          <div v-for="(move, idx) in movements" :key="idx" class="movement-item" :class="move.type">
            <div class="movement-info">
              <span v-if="move.type === 'in'" class="movement-type">
                <svg viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="12 5 19 12 12 19"></polyline>
                  <polyline points="19 12 5 12"></polyline>
                </svg>
                Entrée
              </span>
              <span v-else class="movement-type">
                <svg viewBox="0 0 24 24" fill="none" stroke="#f44336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="12 19 5 12 12 5"></polyline>
                  <polyline points="5 12 19 12"></polyline>
                </svg>
                Sortie
              </span>
              <span class="movement-product">{{ move.productName }}</span>
              <span class="movement-qty">{{ move.quantity }} {{ move.unit }}</span>
            </div>
            <div class="movement-date">{{ move.date }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Mouvement de Stock -->
    <div v-if="showMovementModal" class="modal-overlay" @click="closeMovementModal()">
      <div class="modal-content" @click.stop>
        <h2>Mouvement de stock - {{ movementProduct?.name }}</h2>
        <form @submit.prevent="saveMovement">
          <div class="form-group">
            <label>Type de mouvement</label>
            <div class="radio-group">
              <label><input v-model="movementData.type" type="radio" value="in" /> Entrée (Achat)</label>
              <label><input v-model="movementData.type" type="radio" value="out" /> Sortie (Vente)</label>
            </div>
          </div>
          <div class="form-group">
            <label>Quantité</label>
            <input v-model.number="movementData.quantity" type="number" min="1" required />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="closeMovementModal()">Annuler</button>
            <button type="submit" class="btn-primary">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal d'ajout/édition -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeModal()">
      <div class="modal-content" @click.stop>
        <h2>
          {{ editingProduct ? "Modifier le produit" : "Nouveau produit" }}
        </h2>
        <form @submit.prevent="saveProduct">
          <div class="form-group">
            <label>Nom du produit</label>
            <input v-model="formData.name" type="text" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Quantité</label>
              <input
                v-model.number="formData.quantity"
                type="number"
                min="0"
                required
              />
            </div>
            <div class="form-group">
              <label>Unité</label>
              <select v-model="formData.unit" required>
                <option value="bouteille">Bouteille</option>
                <option value="pot">Pot</option>
                <option value="boîte">Boîte</option>
                <option value="paquet">Paquet</option>
                <option value="kg">Kg</option>
                <option value="L">L</option>
                <option value="ml">ml</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Prix d'achat (€)</label>
              <input
                v-model.number="formData.purchasePrice"
                type="number"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div class="form-group">
              <label>Prix de vente (€)</label>
              <input
                v-model.number="formData.salePrice"
                type="number"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>
          <div class="form-group">
            <label>Stock minimum</label>
            <input
              v-model.number="formData.minStock"
              type="number"
              min="0"
              required
            />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="formData.description" rows="3"></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="closeModal()">
              Annuler
            </button>
            <button type="submit" class="btn-primary">
              {{ editingProduct ? "Modifier" : "Ajouter" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useDataManager } from "../composables/useDataManager";

const initialProducts = [
  {
    id: 1,
    name: "Shampooing Professionnel",
    quantity: 15,
    unit: "bouteille",
    purchasePrice: 8.5,
    salePrice: 15.0,
    minStock: 10,
    description: "Shampooing pour cheveux colorés",
  },
  {
    id: 2,
    name: "Masque Capillaire",
    quantity: 8,
    unit: "pot",
    purchasePrice: 12.0,
    salePrice: 25.0,
    minStock: 10,
    description: "Masque hydratant intensif",
  },
  {
    id: 3,
    name: "Coloration L'Oréal",
    quantity: 25,
    unit: "boîte",
    purchasePrice: 5.5,
    salePrice: 12.0,
    minStock: 15,
    description: "Coloration permanente",
  },
  {
    id: 4,
    name: "Gants Jetables",
    quantity: 5,
    unit: "paquet",
    purchasePrice: 3.0,
    salePrice: 6.0,
    minStock: 10,
    description: "Paquet de 100 gants",
  },
];

const {
  items: products,
  addItem,
  updateItem,
  deleteItem,
  search,
} = useDataManager("stock", initialProducts);

const showAddModal = ref(false);
const editingProduct = ref(null);
const successMessage = ref("");
const searchQuery = ref("");
const activeTab = ref("tableau");
const showMovementModal = ref(false);
const movementProduct = ref(null);
const movements = ref([]);
const movementData = ref({
  type: "in",
  quantity: 0
});
const fileInput = ref(null);

const formData = reactive({
  name: "",
  quantity: 0,
  unit: "bouteille",
  purchasePrice: 0,
  salePrice: 0,
  minStock: 0,
  description: "",
});

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  return search(searchQuery.value, ["name", "description"]);
});

const totalProducts = computed(() => products.value.length);

const lowStockProducts = computed(() =>
  products.value.filter((p) => p.quantity <= p.minStock)
);

const lowStockCount = computed(
  () => products.value.filter((p) => p.quantity <= p.minStock).length
);

const totalValue = computed(() =>
  products.value
    .reduce((sum, p) => sum + p.quantity * p.purchasePrice, 0)
    .toFixed(2)
);

const editProduct = (product) => {
  editingProduct.value = { ...product };
  formData.name = product.name;
  formData.quantity = product.quantity;
  formData.unit = product.unit;
  formData.purchasePrice = product.purchasePrice;
  formData.salePrice = product.salePrice;
  formData.minStock = product.minStock;
  formData.description = product.description;
  showAddModal.value = true;
};

const saveProduct = () => {
  if (!formData.name.trim()) {
    alert("Le nom du produit est requis");
    return;
  }
  if (formData.quantity < 0) {
    alert("La quantité ne peut pas être négative");
    return;
  }
  if (formData.purchasePrice <= 0 || formData.salePrice <= 0) {
    alert("Les prix doivent être supérieurs à 0");
    return;
  }

  if (editingProduct.value) {
    updateItem(editingProduct.value.id, { ...formData });
    successMessage.value = "Produit modifié avec succès!";
  } else {
    addItem({ ...formData });
    successMessage.value = "Produit ajouté avec succès!";
  }

  setTimeout(() => {
    successMessage.value = "";
  }, 3000);

  resetForm();
  showAddModal.value = false;
};

const deleteProduct = (id) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
    deleteItem(id);
    successMessage.value = "Produit supprimé avec succès!";
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  }
};

const resetForm = () => {
  editingProduct.value = null;
  formData.name = "";
  formData.quantity = 0;
  formData.unit = "bouteille";
  formData.purchasePrice = 0;
  formData.salePrice = 0;
  formData.minStock = 0;
  formData.description = "";
};

const closeModal = () => {
  resetForm();
  showAddModal.value = false;
};

const openMovementModal = (product) => {
  movementProduct.value = product;
  movementData.value = { type: "in", quantity: 0 };
  showMovementModal.value = true;
};

const closeMovementModal = () => {
  showMovementModal.value = false;
  movementProduct.value = null;
  movementData.value = { type: "in", quantity: 0 };
};

const saveMovement = () => {
  if (!movementProduct.value || movementData.value.quantity <= 0) {
    alert("Veuillez entrer une quantité valide");
    return;
  }

  const product = products.value.find((p) => p.id === movementProduct.value.id);
  if (!product) return;

  if (movementData.value.type === "in") {
    product.quantity += movementData.value.quantity;
  } else {
    if (product.quantity < movementData.value.quantity) {
      alert("Quantité insuffisante");
      return;
    }
    product.quantity -= movementData.value.quantity;
  }

  // Enregistrer le mouvement
  const now = new Date();
  const dateStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  movements.value.push({
    type: movementData.value.type,
    productName: product.name,
    quantity: movementData.value.quantity,
    unit: product.unit,
    date: dateStr,
  });

  successMessage.value = "Mouvement enregistré avec succès";
  setTimeout(() => (successMessage.value = ""), 3000);
  closeMovementModal();
};

const exportCSV = () => {
  if (!products.value || products.value.length === 0) {
    alert("Aucun produit à exporter");
    return;
  }

  const headers = [
    "Produit",
    "Quantité",
    "Unité",
    "Stock Min",
    "Prix Achat",
    "Prix Vente",
    "Valeur",
    "Statut",
  ];
  const rows = products.value.map((p) => [
    p.name,
    p.quantity,
    p.unit,
    p.minStock,
    p.purchasePrice,
    p.salePrice,
    (p.quantity * p.purchasePrice).toFixed(2),
    p.quantity > p.minStock ? "OK" : "Faible",
  ]);

  let csv = headers.join(",") + "\n";
  rows.forEach((row) => {
    csv += row.map((cell) => `"${cell}"`).join(",") + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.setAttribute("href", URL.createObjectURL(blob));
  link.setAttribute(
    "download",
    `stock-${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  successMessage.value = "Fichier exporté avec succès";
  setTimeout(() => (successMessage.value = ""), 3000);
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const importCSV = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const csv = e.target?.result;
      if (typeof csv !== "string") {
        alert("Erreur lors de la lecture du fichier");
        return;
      }

      const lines = csv.trim().split("\n");
      if (lines.length < 2) {
        alert("Le fichier CSV doit contenir au moins un en-tête et une ligne");
        return;
      }

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const nameIdx = headers.indexOf("produit");
      const qtyIdx = headers.indexOf("quantité");
      const unitIdx = headers.indexOf("unité");
      const minIdx = headers.indexOf("stock min");
      const buyPriceIdx = headers.indexOf("prix achat");
      const sellPriceIdx = headers.indexOf("prix vente");
      const descIdx = headers.indexOf("description");

      if (nameIdx === -1 || qtyIdx === -1 || unitIdx === -1) {
        alert(
          "Le CSV doit contenir les colonnes : Produit, Quantité, Unité"
        );
        return;
      }

      let importedCount = 0;
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cells = line
          .split(",")
          .map((c) => c.replace(/^"|"$/g, "").trim());
        const newProduct = {
          id: Date.now() + i,
          name: cells[nameIdx] || `Produit ${i}`,
          quantity: parseInt(cells[qtyIdx]) || 0,
          unit: cells[unitIdx] || "unité",
          minStock: minIdx !== -1 ? parseInt(cells[minIdx]) || 10 : 10,
          purchasePrice:
            buyPriceIdx !== -1 ? parseFloat(cells[buyPriceIdx]) || 0 : 0,
          salePrice:
            sellPriceIdx !== -1 ? parseFloat(cells[sellPriceIdx]) || 0 : 0,
          description: descIdx !== -1 ? cells[descIdx] || "" : "",
        };

        products.value.push(newProduct);
        importedCount++;
      }

      successMessage.value = `${importedCount} produit(s) importé(s) avec succès`;
      setTimeout(() => (successMessage.value = ""), 3000);
      fileInput.value.value = "";
    } catch (error) {
      alert("Erreur lors de l'import : " + error.message);
      console.error(error);
    }
  };

  reader.readAsText(file);
};
</script>

<style scoped>
.stock-page {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.page-subtitle {
  font-size: 14px;
  color: #666;
  flex-grow: 1;
  margin: 0;
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
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-primary:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary .icon {
  width: 18px;
  height: 18px;
}

.success-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #27ae60;
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-weight: 500;
  animation: slideIn 0.3s ease-out;
  z-index: 2000;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
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
  color: #4bbbfb;
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

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
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
  font-size: 16px;
}

.btn-icon svg {
  width: 16px;
  height: 16px;
  display: block;
}

.btn-icon.edit:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #4bbbfb;
}

.btn-icon.delete:hover {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.product-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  color: #4bbbfb;
  font-size: 16px;
}

.low-stock-text {
  color: #e74c3c;
}

.product-description {
  margin-top: 4px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.03);
  border-left: 3px solid #4bbbfb;
  border-radius: 4px;
  font-size: 13px;
  color: #555;
  line-height: 1.6;
}

.stock-alert {
  margin-top: 4px;
  padding: 10px;
  background: rgba(241, 196, 15, 0.15);
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
  border-color: #4bbbfb;
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

/* Styles pour les onglets */
.tabs-container {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 1px solid #e0e0e0;
}

.tab-btn {
  padding: 12px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: #999;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}

.tab-btn.active {
  color: #4bbbfb;
  border-bottom-color: #4bbbfb;
}

.tab-btn svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  margin-right: 6px;
  display: inline-block;
  vertical-align: middle;
}

.btn-icon svg {
  width: 18px;
  height: 18px;
  display: block;
}

.btn-icon.edit:hover {
  background: #c3e9ff !important;
}

.btn-icon.delete:hover {
  background: #ffcdd2 !important;
}

.btn-icon.movement:hover {
  background: #c3e9ff !important;
}

.badge svg {
  width: 14px;
  height: 14px;
  margin-right: 4px;
  display: inline-block;
  vertical-align: middle;
}

.movement-type svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  margin-right: 6px;
  display: inline-block;
  vertical-align: middle;
}

.btn-secondary svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  margin-right: 6px;
  display: inline-block;
}

/* Styles pour le tableau */
.table-responsive {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.products-table thead {
  background: #f9f9f9;
  border-bottom: 2px solid #e0e0e0;
}

.products-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #333;
  font-size: 14px;
  text-transform: uppercase;
}

.products-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0;
  font-size: 14px;
}

.products-table tbody tr:hover {
  background: #f9f9f9;
}

.products-table tbody tr.low-stock {
  background: #fff3e0;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge-success {
  background: #c8e6c9;
  color: #2e7d32;
}

.badge-warning {
  background: #ffe0b2;
  color: #e65100;
}

/* Styles pour l'historique */
.history-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}

.movements-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.movement-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-left: 4px solid;
  border-radius: 4px;
  background: #f9f9f9;
}

.movement-item.in {
  border-left-color: #4caf50;
}

.movement-item.out {
  border-left-color: #f44336;
}

.movement-info {
  display: flex;
  gap: 15px;
  align-items: center;
  flex: 1;
}

.movement-type {
  font-weight: 600;
  font-size: 16px;
  min-width: 80px;
}

.movement-product {
  font-weight: 600;
  color: #333;
  flex: 1;
}

.movement-qty {
  color: #666;
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
}

.movement-date {
  color: #999;
  font-size: 12px;
  white-space: nowrap;
}

/* Styles pour les alertes */
.alerts-section {
  margin-bottom: 30px;
}

.alert {
  display: flex;
  gap: 15px;
  padding: 15px 20px;
  border-radius: 8px;
  border-left: 4px solid;
}

.alert-warning {
  background: #fff3e0;
  border-left-color: #ff9800;
}

.alert svg {
  width: 24px;
  height: 24px;
  color: #ff9800;
  flex-shrink: 0;
  margin-top: 2px;
}

.alert strong {
  color: #e65100;
}

.alert p {
  margin: 5px 0 0 0;
  color: #f57c00;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

@media (max-width: 768px) {
  .stock-page {
    padding: 20px;
  }

  .page-header {
    flex-direction: column;
    gap: 20px;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
  }

  .stock-stats {
    grid-template-columns: 1fr;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-content {
    width: 95%;
    padding: 20px;
  }

  .search-box {
    min-width: auto;
    width: 100%;
  }

  .table-responsive {
    overflow-x: auto;
  }

  .movement-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    flex-direction: column;
    width: 100%;
  }
}
</style>


