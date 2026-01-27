<template>
  <div class="invoice-print-container">
    <div class="print-header">
      <button @click="closePrint" class="btn-close">✕</button>
      <button @click="printInvoice" class="btn-print">� Télécharger PDF</button>
    </div>

    <div class="invoice-document" ref="invoiceRef">
      <div class="invoice-header-section">
        <div class="salon-info">
          <h1 class="salon-name">BeautyShop</h1>
          <p class="salon-address">Adresse du salon</p>
          <p class="salon-contact">Tel: +243997775599</p>
          <p class="salon-website">www.beautyshop.cd</p>
        </div>

        <div class="invoice-info">
          <div class="invoice-title">FACTURE</div>
          <div class="invoice-number">N° {{ invoice.invoiceNumber }}</div>
          <div class="invoice-date">{{ formatDate(invoice.createdAt) }}</div>
        </div>
      </div>

      <div class="separator-line"></div>

      <div class="client-info-section">
        <div class="section-title">CLIENT</div>
        <div class="client-details">
          <p class="client-name"><strong>{{ getClientName }}</strong></p>
          <p v-if="client.email" class="client-item">Email: {{ client.email }}</p>
          <p v-if="client.phone" class="client-item">Tel: {{ client.phone }}</p>
          <p v-if="client.address" class="client-item">Adresse: {{ client.address }}</p>
          <p v-if="client.city" class="client-item">{{ client.city }} {{ client.postalCode }}</p>
        </div>
      </div>

      <div class="separator-line"></div>

      <div class="items-section">
        <table class="items-table">
          <thead>
            <tr class="table-header">
              <th class="col-description">Description</th>
              <th class="col-qty">Quantité</th>
              <th class="col-price">Prix Unitaire</th>
              <th class="col-total">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in invoice.items" :key="index" class="table-row">
              <td class="col-description">{{ item.name }}</td>
              <td class="col-qty">{{ item.quantity }}</td>
              <td class="col-price">{{ item.salePrice.toFixed(2) }}€</td>
              <td class="col-total">{{ (item.salePrice * item.quantity).toFixed(2) }}€</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="separator-line"></div>

      <div class="totals-section">
        <div class="totals-row">
          <span class="totals-label">Sous-total:</span>
          <span class="totals-value">{{ subtotal.toFixed(2) }}€</span>
        </div>

        <div v-if="invoice.discount > 0" class="totals-row discount">
          <span class="totals-label">Réduction:</span>
          <span class="totals-value">-{{ invoice.discount.toFixed(2) }}€</span>
        </div>

        <div v-if="taxAmount > 0" class="totals-row">
          <span class="totals-label">TVA ({{ taxRate }}%):</span>
          <span class="totals-value">{{ taxAmount.toFixed(2) }}€</span>
        </div>

        <div class="totals-row total">
          <span class="totals-label">TOTAL:</span>
          <span class="totals-value">{{ invoice.total.toFixed(2) }}€</span>
        </div>

        <div v-if="invoice.amountPaid > 0" class="totals-row paid">
          <span class="totals-label">Montant payé:</span>
          <span class="totals-value">{{ invoice.amountPaid.toFixed(2) }}€</span>
        </div>

        <div v-if="remainingAmount > 0" class="totals-row remaining">
          <span class="totals-label">Reste à payer:</span>
          <span class="totals-value">{{ remainingAmount.toFixed(2) }}€</span>
        </div>
      </div>

      <div class="separator-line"></div>

      <div class="payment-info-section">
        <div class="section-title">INFORMATIONS DE PAIEMENT</div>
        <p class="payment-method">Méthode: {{ invoice.paymentMethod || "Non spécifié" }}</p>
        <p class="payment-status" :class="invoice.status">
          Statut: <strong>{{ statusLabel(invoice.status) }}</strong>
        </p>
      </div>

      <div class="separator-line"></div>

      <div class="notes-section">
        <p class="notes-title">Merci de votre visite!</p>
        <p class="notes-text">Pour toute question, contactez-nous au +243997775599</p>
        <p class="notes-text">Conditions de retour: 7 jours</p>
      </div>

      <div class="footer">
        <p>{{ formatDate(new Date()) }}</p>
        <p>---</p>
        <p>© 2025 BeautyShop. Tous droits réservés.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useClients } from "../composables/useClients";
import html2pdf from 'html2pdf.js';

const props = defineProps({
  invoice: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const { clients } = useClients();

const client = computed(() => {
  const foundClient = clients.find((c) => c.id === props.invoice.clientId);
  return foundClient || { name: "Client anonyme", email: "", phone: "", address: "" };
});

const getClientName = computed(() => client.value?.name || "Client anonyme");

const subtotal = computed(() => {
  return props.invoice.items.reduce(
    (sum, item) => sum + item.salePrice * item.quantity,
    0
  );
});

const taxRate = computed(() => 0); // Par défaut pas de taxe
const taxAmount = computed(() => (subtotal.value * taxRate.value) / 100);

const remainingAmount = computed(() => {
  return Math.max(0, props.invoice.total - (props.invoice.amountPaid || 0));
});

const formatDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusLabel = (status) => {
  const labels = {
    pending: "En attente",
    paid: "Payée",
    cancelled: "Annulée",
  };
  return labels[status] || status;
};

const printInvoice = async () => {
  try {
    const invoiceElement = document.querySelector('.invoice-document');
    
    const opt = {
      margin: 10,
      filename: `Facture_${props.invoice.invoiceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    
    // Créer et télécharger le PDF
    html2pdf().set(opt).from(invoiceElement).save();
    
    // Fermer le modal après un délai
    setTimeout(() => {
      emit("close");
    }, 500);
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    alert('Erreur lors de la création du PDF: ' + error.message);
  }
};

const closePrint = () => {
  emit("close");
};
</script>

<style scoped>
.invoice-print-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f5f5f5;
  z-index: 2000;
  overflow: auto;
}

.print-header {
  position: sticky;
  top: 0;
  padding: 15px;
  background: white;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.btn-close,
.btn-print {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-print {
  background: #4bbbfb;
  color: white;
}

.btn-print:hover {
  background: #764ba2;
}

.btn-close {
  background: #95a5a6;
  color: white;
}

.btn-close:hover {
  background: #7f8c8d;
}

.invoice-document {
  max-width: 800px;
  margin: 20px auto;
  background: white;
  padding: 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: "Arial", sans-serif;
  line-height: 1.6;
}

.invoice-header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.salon-info {
  flex: 1;
}

.salon-name {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.salon-address,
.salon-contact,
.salon-website {
  margin: 5px 0;
  font-size: 12px;
  color: #666;
}

.invoice-info {
  text-align: right;
}

.invoice-title {
  font-size: 28px;
  font-weight: bold;
  color: #4bbbfb;
  margin: 0;
}

.invoice-number {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

.invoice-date {
  font-size: 12px;
  color: #999;
}

.separator-line {
  border-top: 2px solid #ddd;
  margin: 20px 0;
}

.client-info-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 12px;
  font-weight: bold;
  color: #333;
  text-transform: uppercase;
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.client-details {
  padding: 10px;
  background: #f9f9f9;
  border-radius: 5px;
}

.client-name {
  margin: 0 0 5px 0;
  font-size: 14px;
}

.client-item {
  margin: 3px 0;
  font-size: 12px;
  color: #666;
}

.items-section {
  margin-bottom: 20px;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  background: #f5f5f5;
  border-bottom: 2px solid #ddd;
}

.table-header th {
  padding: 10px;
  text-align: left;
  font-size: 12px;
  font-weight: bold;
  color: #333;
}

.table-row td {
  padding: 10px;
  border-bottom: 1px solid #eee;
  font-size: 13px;
}

.col-qty,
.col-price,
.col-total {
  text-align: right;
}

.totals-section {
  margin-bottom: 20px;
}

.totals-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 13px;
  border-bottom: 1px solid #eee;
}

.totals-row.discount .totals-value {
  color: #27ae60;
}

.totals-row.total {
  font-weight: bold;
  font-size: 16px;
  border-top: 2px solid #333;
  border-bottom: 2px solid #333;
  padding: 10px 0;
}

.totals-row.paid {
  color: #27ae60;
  font-weight: 500;
}

.totals-row.remaining {
  color: #e74c3c;
  font-weight: 500;
}

.payment-info-section {
  margin-bottom: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 5px;
}

.payment-method,
.payment-status {
  margin: 5px 0;
  font-size: 12px;
}

.payment-status.paid {
  color: #27ae60;
}

.payment-status.pending {
  color: #f39c12;
}

.payment-status.cancelled {
  color: #e74c3c;
}

.notes-section {
  text-align: center;
  margin-bottom: 20px;
}

.notes-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.notes-text {
  font-size: 11px;
  color: #666;
  margin: 3px 0;
}

.footer {
  text-align: center;
  font-size: 10px;
  color: #999;
  margin-top: 30px;
  border-top: 1px solid #ddd;
  padding-top: 15px;
}

.footer p {
  margin: 3px 0;
}

@media print {
  .print-header {
    display: none;
  }

  .invoice-print-container {
    background: white;
  }

  .invoice-document {
    max-width: 100%;
    margin: 0;
    box-shadow: none;
  }

  body {
    margin: 0;
    padding: 0;
  }
}

@media (max-width: 600px) {
  .invoice-document {
    padding: 20px;
  }

  .invoice-header-section {
    flex-direction: column;
  }

  .invoice-info {
    margin-top: 15px;
    text-align: left;
  }

  .items-table {
    font-size: 11px;
  }

  .table-header th,
  .table-row td {
    padding: 5px;
  }
}

@media print {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: white;
  }

  .invoice-print-container {
    position: static;
    background: white;
    z-index: auto;
    overflow: auto;
  }

  .print-header {
    display: none !important;
  }

  .invoice-document {
    max-width: 100%;
    margin: 0;
    box-shadow: none;
    padding: 0;
    page-break-after: avoid;
  }

  .invoice-document * {
    page-break-inside: avoid;
  }

  .separator-line {
    page-break-after: avoid;
  }
}
</style>

