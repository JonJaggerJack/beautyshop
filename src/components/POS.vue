<template>
  <div class="pos-page">
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <div v-if="!canAccess" class="access-denied">
      <div class="denied-content">
        <h2>Accès refusé</h2>
        <p>Vous n'avez pas accès au point de vente.</p>
        <p class="role-info">Votre rôle: {{ currentUser.role }}</p>
      </div>
    </div>

    <div v-else>
      <header class="page-header">
        <div>
          <div class="header-title">
            <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <h1 class="page-title">Point de Vente</h1>
          </div>
          <p class="page-subtitle">Gestion des ventes et encaissements</p>
        </div>
        <div class="header-stats">
          <div class="stat-badge">
            <span class="stat-label">Total du jour</span>
            <span class="stat-value">{{ totalToday }}€</span>
          </div>
          <div class="stat-badge">
            <span class="stat-label">Factures</span>
            <span class="stat-value">{{ invoices.length }}</span>
          </div>
          <div class="stat-badge">
            <span class="stat-label">En attente</span>
            <span class="stat-value">{{ pendingCount }}</span>
          </div>
        </div>
      </header>

      <div class="pos-content">
        <!-- Section Client et Panier -->
        <div class="left-panel">
          <!-- Sélection Client -->
          <div class="client-section">
            <div class="section-header">
              <h2>Client</h2>
            </div>
            <div v-if="selectedClient" class="selected-client">
              <div class="client-info">
                <h3>{{ selectedClient.name }}</h3>
                <p class="client-details">{{ selectedClient.phone }}</p>
                <p class="client-email">{{ selectedClient.email }}</p>
              </div>
              <div class="loyalty-info">
                <span class="loyalty-label">Points fidélité:</span>
                <span class="loyalty-points">{{
                  selectedClient.loyaltyPoints
                }}</span>
              </div>
              <button @click="selectedClient = null" class="btn-change-client">
                Changer de client
              </button>
            </div>
            <div v-else class="client-selector">
              <select v-model="selectedClientId" class="client-select">
                <option value="">-- Sélectionner un client --</option>
                <option
                  v-for="client in clients"
                  :key="client.id"
                  :value="client.id"
                >
                  {{ client.name }} ({{ client.loyaltyPoints }} pts)
                </option>
              </select>
              <button
                @click="showNewClientForm = !showNewClientForm"
                class="btn-new-client"
              >
                + Nouveau client
              </button>
            </div>

            <!-- Formulaire Nouveau Client -->
            <div v-if="showNewClientForm" class="new-client-form">
              <input
                v-model="newClientData.name"
                type="text"
                placeholder="Nom complet"
              />
              <input
                v-model="newClientData.phone"
                type="tel"
                placeholder="Téléphone"
              />
              <input
                v-model="newClientData.email"
                type="email"
                placeholder="Email"
              />
              <button @click="addNewClient" class="btn-add">Ajouter</button>
              <button @click="showNewClientForm = false" class="btn-cancel">
                Annuler
              </button>
            </div>
          </div>

          <!-- Panier -->
          <div class="cart-section">
            <div class="section-header">
              <h2>Panier ({{ cart.length }})</h2>
              <button
                v-if="cart.length > 0"
                @click="clearCart"
                class="btn-clear-small"
              >
                Vider
              </button>
            </div>

            <div class="cart-items">
              <div v-if="cart.length === 0" class="empty-state">
                <p>Panier vide</p>
              </div>
              <div v-for="(item, idx) in cart" :key="idx" class="cart-item">
                <div class="item-info">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-price">{{ item.salePrice }}€</span>
                </div>
                <div class="item-controls">
                  <button @click="decreaseQty(idx)" class="qty-btn">−</button>
                  <span class="qty">{{ item.quantity }}</span>
                  <button @click="increaseQty(idx)" class="qty-btn">+</button>
                  <button @click="removeFromCart(idx)" class="remove-btn">
                    ✕
                  </button>
                </div>
                <div class="item-total">
                  {{ (item.salePrice * item.quantity).toFixed(2) }}€
                </div>
              </div>
            </div>

            <div v-if="cart.length > 0" class="cart-footer">
              <div class="total-row">
                <span>Total:</span>
                <span class="total-amount">{{ cartTotal.toFixed(2) }}€</span>
              </div>
              <button @click="createInvoice" class="btn-create-invoice">
                📄 Créer Facture
              </button>
            </div>
          </div>
        </div>

        <!-- Section Services -->
        <div class="middle-panel">
          <div class="services-section">
            <div class="section-header">
              <h2>📋 Services & Produits</h2>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher..."
                class="search-input"
              />
            </div>

            <!-- Tab Navigation -->
            <div class="tab-navigation">
              <button
                @click="activeTab = 'services'"
                :class="['tab-btn', { active: activeTab === 'services' }]"
              >
                💇 Services
              </button>
              <button
                @click="activeTab = 'products'"
                :class="['tab-btn', { active: activeTab === 'products' }]"
              >
                📦 Produits Stock
              </button>
            </div>

            <!-- Services Grid -->
            <div v-if="activeTab === 'services'" class="services-grid">
              <button
                v-for="service in filteredServices"
                :key="service.id"
                @click="addToCart(service)"
                class="service-btn"
              >
                <span class="service-name">{{ service.name }}</span>
                <span class="service-price">{{ service.salePrice }}€</span>
              </button>
            </div>

            <!-- Products Grid -->
            <div v-if="activeTab === 'products'" class="services-grid">
              <button
                v-for="product in filteredProducts"
                :key="'prod-' + product.id"
                @click="addToCart({ ...product, type: 'product' })"
                class="service-btn product-btn"
              >
                <span class="service-name">{{ product.name }}</span>
                <span class="service-price">{{ product.salePrice }}€</span>
                <span class="product-stock">📦 {{ product.quantity }} en stock</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Section Factures -->
        <div class="right-panel">
          <div class="invoices-section">
            <div class="section-header">
              <h2>Factures ({{ invoices.length }})</h2>
              <select v-model="invoiceFilter" class="filter-select">
                <option value="">Toutes</option>
                <option value="pending">En attente</option>
                <option value="paid">Payées</option>
              </select>
            </div>

            <div class="invoices-list">
              <div v-if="filteredInvoices.length === 0" class="empty-state">
                <p>Aucune facture</p>
              </div>
              <div
                v-for="invoice in filteredInvoices"
                :key="invoice.id"
                class="invoice-card"
                :class="`status-${invoice.status}`"
              >
                <div class="invoice-header">
                  <span class="invoice-number">{{
                    invoice.invoiceNumber
                  }}</span>
                  <span class="invoice-status">{{ invoice.status }}</span>
                </div>
                <div class="invoice-client">
                  {{ getClientName(invoice.clientId) }}
                </div>
                <div class="invoice-items">
                  <div
                    v-for="item in invoice.items"
                    :key="item.id"
                    class="invoice-item"
                  >
                    <span>{{ item.name }} ×{{ item.quantity }}</span>
                    <span
                      >{{ (item.salePrice * item.quantity).toFixed(2) }}€</span
                    >
                  </div>
                </div>
                <div class="invoice-total">
                  <strong>{{ invoice.total.toFixed(2) }}€</strong>
                </div>
                <div class="invoice-actions">
                  <button
                    v-if="invoice.status === 'pending'"
                    @click="showPaymentModal(invoice)"
                    class="btn-pay"
                  >
                    Payer
                  </button>
                  <button
                    v-if="invoice.status === 'pending' && canCancelInvoice"
                    @click="cancelInvoiceDialog(invoice)"
                    class="btn-cancel-invoice"
                  >
                    Annuler
                  </button>
                  <button
                    @click="showInvoicePrint(invoice)"
                    class="btn-print"
                    title="Imprimer facture"
                  >
                    🖨 Imprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Paiement -->
      <div
        v-if="currentInvoiceForPayment"
        class="modal-overlay"
        @click="closePaymentModal"
      >
        <div class="modal-content" @click.stop>
          <h2>Paiement Facture</h2>
          <div class="payment-info">
            <div class="info-row">
              <span>Facture:</span>
              <span class="highlight">{{
                currentInvoiceForPayment.invoiceNumber
              }}</span>
            </div>
            <div class="info-row">
              <span>Montant:</span>
              <span class="highlight"
                >{{ currentInvoiceForPayment.total.toFixed(2) }}€</span
              >
            </div>
          </div>

          <div class="payment-methods">
            <button
              v-for="method in ['card', 'cash', 'check']"
              :key="method"
              @click="processPayment(method)"
              :class="`payment-btn ${method}`"
            >
              <span class="icon">{{ paymentIcons[method] }}</span>
              <span>{{ paymentLabels[method] }}</span>
            </button>
          </div>

          <button @click="closePaymentModal" class="btn-secondary">
            Annuler
          </button>
        </div>
      </div>

      <!-- Modal Annulation Facture -->
      <div
        v-if="invoiceToCancel"
        class="modal-overlay"
        @click="invoiceToCancel = null"
      >
        <div class="modal-content" @click.stop>
          <h2>Annuler la Facture</h2>
          <p>Êtes-vous sûr de vouloir annuler cette facture ?</p>
          <div class="reason-input">
            <label>Raison (optionnel):</label>
            <textarea
              v-model="cancelReason"
              placeholder="Raison de l'annulation..."
              rows="3"
            ></textarea>
          </div>
          <div class="modal-actions">
            <button @click="confirmCancelInvoice" class="btn-danger">
              Oui, annuler
            </button>
            <button @click="invoiceToCancel = null" class="btn-secondary">
              Non, conserver
            </button>
          </div>
        </div>
      </div>

      <!-- Component Impression -->
      <InvoicePrint
        v-if="invoiceToPrint"
        :invoice="invoiceToPrint"
        @close="invoiceToPrint = null"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuth } from "../composables/useAuth";
import { useDataManager } from "../composables/useDataManager";
import { useClients } from "../composables/useClients";
import InvoicePrint from "./InvoicePrint.vue";

const { currentUser, ROLES } = useAuth();
const {
  clients,
  invoices,
  createInvoice: createClientInvoice,
  payInvoice,
  cancelInvoice,
  addClient,
} = useClients();

const canAccess = computed(() => {
  if (!currentUser.value) return false;
  return (
    currentUser.value.role === ROLES.CAISSIER ||
    currentUser.value.role === ROLES.GERANTE
  );
});

const isGerante = computed(() => currentUser.value?.role === ROLES.GERANTE);

const canCancelInvoice = computed(() => {
  if (!currentUser.value) return false;
  return currentUser.value.role === ROLES.GERANTE;
});
const initialServices = [
  {
    id: 1,
    name: "Coupe Femme",
    purchasePrice: 15,
    salePrice: 35,
    unit: "service",
  },
  {
    id: 2,
    name: "Coupe Homme",
    purchasePrice: 10,
    salePrice: 25,
    unit: "service",
  },
  {
    id: 3,
    name: "Coloration",
    purchasePrice: 25,
    salePrice: 50,
    unit: "service",
  },
  {
    id: 4,
    name: "Lissage Brésilien",
    purchasePrice: 40,
    salePrice: 80,
    unit: "service",
  },
  {
    id: 5,
    name: "Soin Capillaire",
    purchasePrice: 20,
    salePrice: 40,
    unit: "service",
  },
  { id: 6, name: "Brushing", purchasePrice: 8, salePrice: 20, unit: "service" },
  { id: 7, name: "Mèches", purchasePrice: 30, salePrice: 60, unit: "service" },
  {
    id: 8,
    name: "Permanente",
    purchasePrice: 35,
    salePrice: 70,
    unit: "service",
  },
];

const { items: services } = useDataManager("pos_services", initialServices);

// Products from stock - load from the same storage as Stock.vue
const { items: products } = useDataManager("stock", []);

// État
const cart = ref([]);
const selectedClientId = ref("");
const showNewClientForm = ref(false);
const newClientData = ref({ name: "", phone: "", email: "" });
const searchQuery = ref("");
const invoiceFilter = ref("");
const successMessage = ref("");
const currentInvoiceForPayment = ref(null);
const invoiceToCancel = ref(null);
const cancelReason = ref("");
const invoiceToPrint = ref(null);
const activeTab = ref("services");

const paymentIcons = {
  card: "💳",
  cash: "💵",
  check: "✓",
};

const paymentLabels = {
  card: "Carte",
  cash: "Espèces",
  check: "Chèque",
};

// Computed
const selectedClient = computed(() => {
  return clients.value.find((c) => c.id === parseInt(selectedClientId.value));
});

const filteredServices = computed(() => {
  if (!searchQuery.value) return services.value;
  return services.value.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  return products.value.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const cartTotal = computed(() => {
  return cart.value.reduce(
    (sum, item) => sum + item.salePrice * item.quantity,
    0
  );
});

const totalToday = computed(() => {
  return invoices.value
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.total, 0);
});

const filteredInvoices = computed(() => {
  if (!invoiceFilter.value) return invoices.value;
  return invoices.value.filter((i) => i.status === invoiceFilter.value);
});

const pendingCount = computed(() => {
  return invoices.value.filter((i) => i.status === "pending").length;
});

// Fonctions Panier
const addToCart = (service) => {
  // Check if item is a product or service based on type field
  const itemId = service.type === 'product' ? `prod-${service.id}` : service.id;
  const existingItem = cart.value.find((item) => {
    if (service.type === 'product') {
      return item.type === 'product' && item.id === service.id;
    }
    return item.type !== 'product' && item.id === service.id;
  });
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.value.push({
      ...service,
      quantity: 1,
      type: service.type || 'service', // Ensure type is set
    });
  }
};

const removeFromCart = (index) => {
  cart.value.splice(index, 1);
};

const increaseQty = (index) => {
  cart.value[index].quantity++;
};

const decreaseQty = (index) => {
  if (cart.value[index].quantity > 1) {
    cart.value[index].quantity--;
  } else {
    removeFromCart(index);
  }
};

const clearCart = () => {
  if (confirm("Vider le panier ?")) {
    cart.value = [];
  }
};

// Fonctions Client
const addNewClient = () => {
  if (!newClientData.value.name.trim()) {
    alert("Le nom est requis");
    return;
  }
  const newClient = addClient(newClientData.value);
  selectedClientId.value = newClient.id;
  newClientData.value = { name: "", phone: "", email: "" };
  showNewClientForm.value = false;
  successMessage.value = "✓ Client ajouté";
  setTimeout(() => {
    successMessage.value = "";
  }, 2000);
};

const getClientName = (clientId) => {
  const client = clients.value.find((c) => c.id === clientId);
  return client ? client.name : "Client inconnu";
};

// Fonctions Facturation
const createInvoice = () => {
  if (cart.value.length === 0) {
    alert("Le panier est vide");
    return;
  }

  const invoice = createClientInvoice({
    clientId: selectedClientId.value ? parseInt(selectedClientId.value) : null,
    items: [...cart.value],
    subtotal: cartTotal.value,
    total: cartTotal.value,
    cashier: currentUser.value.name,
  });

  cart.value = [];
  successMessage.value = `✓ Facture créée: ${invoice.invoiceNumber}`;
  setTimeout(() => {
    successMessage.value = "";
  }, 2000);
};

const showPaymentModal = (invoice) => {
  currentInvoiceForPayment.value = invoice;
};

const closePaymentModal = () => {
  currentInvoiceForPayment.value = null;
};

const processPayment = (method) => {
  if (!currentInvoiceForPayment.value) return;

  payInvoice(currentInvoiceForPayment.value.id, method);
  successMessage.value = `✓ Facture payée (${paymentLabels[method]})`;
  setTimeout(() => {
    successMessage.value = "";
  }, 2000);

  currentInvoiceForPayment.value = null;
};

const cancelInvoiceDialog = (invoice) => {
  invoiceToCancel.value = invoice;
  cancelReason.value = "";
};

const confirmCancelInvoice = () => {
  if (!invoiceToCancel.value) return;
  cancelInvoice(invoiceToCancel.value.id, cancelReason.value);
  successMessage.value = "✓ Facture annulée";
  setTimeout(() => {
    successMessage.value = "";
  }, 2000);
  invoiceToCancel.value = null;
};

const showInvoicePrint = (invoice) => {
  invoiceToPrint.value = invoice;
};
</script>

<style scoped>
.pos-page {
  padding: 20px;
  height: 100%;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.success-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #27ae60;
  color: white;
  padding: 12px 20px;
  border-radius: 6px;
  font-size: 14px;
  z-index: 2000;
  animation: slideIn 0.3s ease-out;
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

.access-denied {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60vh;
}

.denied-content {
  text-align: center;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.denied-content h2 {
  color: #e74c3c;
  margin: 0 0 16px 0;
}

.denied-content p {
  color: #666;
  margin: 8px 0;
}

.role-info {
  font-size: 12px;
  color: #999;
  font-style: italic;
}

.header-stats {
  display: flex;
  gap: 12px;
}

.stat-badge {
  background: white;
  padding: 10px 16px;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 11px;
  color: #999;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.pos-content {
  display: grid;
  grid-template-columns: 300px 1fr 350px;
  gap: 20px;
  flex: 1;
  overflow: hidden;
}

.left-panel,
.middle-panel,
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.section-header h2 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.search-input,
.client-select,
.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
}

.search-input {
  width: 100%;
}

.client-select,
.filter-select {
  flex: 1;
}

.client-section {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.selected-client {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.client-info h3 {
  margin: 0;
  font-size: 15px;
  color: #333;
}

.client-details,
.client-email {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.loyalty-info {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 4px;
}

.loyalty-label {
  font-size: 12px;
  color: #666;
}

.loyalty-points {
  font-size: 14px;
  font-weight: 700;
  color: #4bbbfb;
}

.btn-change-client,
.btn-new-client,
.btn-add,
.btn-cancel {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-change-client {
  background: #f5f5f5;
  color: #333;
}

.btn-change-client:hover {
  background: #e0e0e0;
}

.btn-new-client,
.btn-add {
  background: #4bbbfb;
  color: white;
}

.btn-new-client:hover,
.btn-add:hover {
  background: #5568d3;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.client-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.new-client-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 4px;
  margin-top: 8px;
}

.new-client-form input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
}

.cart-section {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  height: 400px;
  max-height: 400px;
}

.btn-clear-small {
  padding: 4px 8px;
  font-size: 11px;
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  flex-shrink: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 12px;
  min-height: 0;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 13px;
}

.cart-item {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 8px;
  border-left: 3px solid #4bbbfb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  display: block;
  font-weight: 500;
  color: #333;
}

.item-price {
  font-size: 11px;
  color: #999;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.qty-btn {
  width: 20px;
  height: 20px;
  border: none;
  background: white;
  border-radius: 3px;
  cursor: pointer;
  font-weight: 600;
  color: #4bbbfb;
  font-size: 11px;
}

.qty-btn:hover {
  background: #4bbbfb;
  color: white;
}

.qty {
  width: 18px;
  text-align: center;
  font-weight: 600;
}

.remove-btn {
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #e74c3c;
  font-size: 14px;
}

.item-total {
  font-weight: 600;
  color: #4bbbfb;
  width: 40px;
  text-align: right;
}

.cart-footer {
  border-top: 1px solid #e0e0e0;
  padding-top: 12px;
  flex-shrink: 0;
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-weight: 600;
}

.total-amount {
  color: #27ae60;
  font-size: 16px;
}

.btn-create-invoice {
  width: 100%;
  padding: 10px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
}

.btn-create-invoice:hover {
  background: #229954;
}

.services-section {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  height: 450px;
  max-height: 450px;
}

.tab-navigation {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
  flex-shrink: 0;
}

.tab-btn {
  padding: 10px 16px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-weight: 500;
  color: #999;
  transition: all 0.2s;
  font-size: 13px;
  flex-shrink: 0;
}

.tab-btn:hover {
  color: #4bbbfb;
}

.tab-btn.active {
  color: #4bbbfb;
  border-bottom-color: #4bbbfb;
}

.services-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  max-height: 100%;
}

.service-btn {
  padding: 16px 8px;
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}

.service-btn:hover {
  background: white;
  border-color: #4bbbfb;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.2);
}

.service-name {
  display: block;
  font-weight: 500;
  color: #333;
}

.service-price {
  display: block;
  color: #4bbbfb;
  font-weight: 600;
}

.product-btn {
  border-left: 3px solid #e65100;
}

.product-stock {
  display: block;
  font-size: 11px;
  color: #999;
}

.invoices-section {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.invoices-list {
  flex: 1;
  overflow-y: auto;
}

.invoice-card {
  background: #f9f9f9;
  border-left: 3px solid #999;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 10px;
  font-size: 12px;
}

.invoice-card.status-pending {
  border-left-color: #f39c12;
}

.invoice-card.status-paid {
  border-left-color: #27ae60;
}

.invoice-card.status-cancelled {
  border-left-color: #e74c3c;
  opacity: 0.6;
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-weight: 600;
}

.invoice-number {
  color: #333;
}

.invoice-status {
  font-size: 10px;
  text-transform: uppercase;
  color: #666;
}

.invoice-client {
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
}

.invoice-items {
  border-top: 1px solid #e0e0e0;
  padding-top: 6px;
  margin-bottom: 6px;
  max-height: 60px;
  overflow-y: auto;
}

.invoice-item {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 11px;
}

.invoice-total {
  border-top: 1px solid #e0e0e0;
  padding-top: 6px;
  margin-bottom: 8px;
  text-align: right;
  color: #27ae60;
}

.invoice-actions {
  display: flex;
  gap: 4px;
}

.btn-pay,
.btn-cancel-invoice,
.btn-danger,
.btn-secondary {
  flex: 1;
  padding: 6px 8px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
}

.btn-pay {
  background: #27ae60;
  color: white;
}

.btn-pay:hover {
  background: #229954;
}

.btn-cancel-invoice {
  background: #f5f5f5;
  color: #e74c3c;
}

.btn-cancel-invoice:hover {
  background: #e0e0e0;
}

.btn-print {
  background: #3498db;
  color: white;
  padding: 8px 15px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.btn-print:hover {
  background: #2980b9;
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
}

.modal-content h2 {
  font-size: 20px;
  margin: 0 0 20px 0;
  color: #333;
}

.payment-info {
  background: #f9f9f9;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.highlight {
  font-weight: 700;
  color: #4bbbfb;
}

.payment-methods {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.payment-btn {
  padding: 16px 12px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.payment-btn:hover {
  border-color: #4bbbfb;
  background: #f9f9f9;
}

.icon {
  font-size: 24px;
}

.reason-input {
  margin-bottom: 20px;
}

.reason-input label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 13px;
}

.reason-input textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 12px;
}

.modal-actions {
  display: flex;
  gap: 10px;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.btn-danger,
.btn-secondary {
  flex: 1;
}

@media (max-width: 1400px) {
  .pos-content {
    grid-template-columns: 280px 1fr 300px;
  }
}

@media (max-width: 1024px) {
  .pos-content {
    grid-template-columns: 250px 1fr 280px;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .pos-page {
    padding: 10px;
  }

  .pos-content {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .left-panel,
  .right-panel {
    max-height: 40vh;
  }

  .modal-content {
    width: 95%;
  }

  .payment-methods {
    grid-template-columns: 1fr;
  }
}
</style>

