<template>
  <div class="pos-page">
    <header class="page-header">
      <div>
        <h1 class="page-title">Point de Vente</h1>
        <p class="page-subtitle">Gestion des ventes et encaissements</p>
      </div>
      <div class="header-stats">
        <div class="stat-badge">
          <span class="stat-label">Total du jour</span>
          <span class="stat-value">{{ totalToday }}€</span>
        </div>
      </div>
    </header>

    <div class="pos-content">
      <div class="pos-layout">
        <!-- Panier -->
        <div class="cart-section">
          <div class="cart-header">
            <h2>Panier</h2>
            <button
              v-if="cart.length > 0"
              type="button"
              class="btn-clear"
              @click="clearCart"
            >
              Vider
            </button>
          </div>
          <div class="cart-items">
            <div v-if="cart.length === 0" class="empty-cart">
              <p>Le panier est vide</p>
            </div>
            <div
              v-for="(item, index) in cart"
              :key="index"
              class="cart-item"
            >
              <div class="cart-item-info">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-price">{{ item.price }}€</span>
              </div>
              <div class="cart-item-actions">
                <button
                  type="button"
                  class="btn-qty"
                  @click="decreaseQuantity(index)"
                >
                  -
                </button>
                <span class="quantity">{{ item.quantity }}</span>
                <button
                  type="button"
                  class="btn-qty"
                  @click="increaseQuantity(index)"
                >
                  +
                </button>
                <button
                  type="button"
                  class="btn-remove"
                  @click="removeFromCart(index)"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
          <div v-if="cart.length > 0" class="cart-footer">
            <div class="cart-total">
              <span class="total-label">Total:</span>
              <span class="total-value">{{ cartTotal }}€</span>
            </div>
            <button type="button" class="btn-checkout" @click="processPayment">
              Encaisser
            </button>
          </div>
        </div>

        <!-- Services disponibles -->
        <div class="services-section">
          <h2>Services disponibles</h2>
          <div class="services-grid">
            <button
              v-for="service in availableServices"
              :key="service.id"
              type="button"
              class="service-btn"
              @click="addToCart(service)"
            >
              <div class="service-btn-content">
                <span class="service-name">{{ service.name }}</span>
                <span class="service-price">{{ service.price }}€</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Historique des ventes -->
      <div class="sales-history">
        <h2>Ventes récentes</h2>
        <div v-if="sales.length === 0" class="empty-sales">
          <p>Aucune vente aujourd'hui</p>
        </div>
        <div v-else class="sales-list">
          <div
            v-for="sale in sales"
            :key="sale.id"
            class="sale-item"
          >
            <div class="sale-info">
              <span class="sale-time">{{ sale.time }}</span>
              <span class="sale-items">{{ sale.items.length }} article(s)</span>
            </div>
            <span class="sale-amount">{{ sale.total }}€</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const availableServices = ref([
  { id: 1, name: "Coupe Femme", price: 35 },
  { id: 2, name: "Coupe Homme", price: 25 },
  { id: 3, name: "Coloration", price: 50 },
  { id: 4, name: "Lissage Brésilien", price: 80 },
  { id: 5, name: "Soin Capillaire", price: 40 },
  { id: 6, name: "Brushing", price: 20 },
  { id: 7, name: "Mèches", price: 60 },
  { id: 8, name: "Permanente", price: 70 },
]);

const cart = ref([]);
const sales = ref([]);

const cartTotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const totalToday = computed(() => {
  return sales.value.reduce((sum, sale) => sum + sale.total, 0);
});

const addToCart = (service) => {
  const existingItem = cart.value.find((item) => item.id === service.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.value.push({
      ...service,
      quantity: 1,
    });
  }
};

const removeFromCart = (index) => {
  cart.value.splice(index, 1);
};

const increaseQuantity = (index) => {
  cart.value[index].quantity++;
};

const decreaseQuantity = (index) => {
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

const processPayment = () => {
  if (cart.value.length === 0) return;

  const sale = {
    id: Date.now(),
    time: new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    items: [...cart.value],
    total: cartTotal.value,
  };

  sales.value.unshift(sale);
  cart.value = [];

  alert(`Paiement de ${sale.total}€ enregistré avec succès !`);
};
</script>

<style scoped>
.pos-page {
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

.header-stats {
  display: flex;
  gap: 16px;
}

.stat-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
}

.pos-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
  margin-bottom: 30px;
}

.cart-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: fit-content;
  max-height: 600px;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e0e0e0;
}

.cart-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.btn-clear {
  padding: 6px 12px;
  background: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-clear:hover {
  background: #e0e0e0;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
}

.empty-cart {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: #333;
  font-size: 15px;
}

.item-price {
  font-size: 14px;
  color: #666;
}

.cart-item-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-qty {
  width: 28px;
  height: 28px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-qty:hover {
  background: #f5f5f5;
  border-color: #667eea;
  color: #667eea;
}

.quantity {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
  color: #333;
}

.btn-remove {
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  border-radius: 6px;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: rgba(231, 76, 60, 0.2);
}

.cart-footer {
  padding-top: 20px;
  border-top: 2px solid #e0e0e0;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.total-label {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.total-value {
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
}

.btn-checkout {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-checkout:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.services-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.services-section h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.service-btn {
  padding: 16px;
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.service-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.service-btn-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.service-name {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.service-price {
  font-size: 18px;
  font-weight: 700;
  color: #667eea;
}

.sales-history {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sales-history h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
}

.empty-sales {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.sales-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sale-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
  transition: all 0.2s;
}

.sale-item:hover {
  background: #e8e8e8;
}

.sale-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sale-time {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.sale-items {
  font-size: 12px;
  color: #666;
}

.sale-amount {
  font-size: 18px;
  font-weight: 700;
  color: #27ae60;
}

@media (max-width: 1024px) {
  .pos-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 20px;
  }

  .services-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>
