import { ref, reactive } from "vue";

// État singleton pour les clients
const currentClients = ref([]);
const currentInvoices = ref([]);

// Initialiser les données au chargement du module
function initClientsOnLoad() {
  try {
    const savedClients = localStorage.getItem("clients");
    const savedInvoices = localStorage.getItem("invoices");

    if (savedClients) {
      currentClients.value = JSON.parse(savedClients);
    } else {
      currentClients.value = [
        {
          id: 1,
          name: "Marie Dupont",
          email: "marie@example.com",
          phone: "06 12 34 56 78",
          joinDate: "2024-01-15",
          loyaltyPoints: 450,
          totalSpent: 1250,
          notes: "Cliente régulière",
        },
        {
          id: 2,
          name: "Jean Martin",
          email: "jean@example.com",
          phone: "06 98 76 54 32",
          joinDate: "2024-03-20",
          loyaltyPoints: 200,
          totalSpent: 600,
          notes: "",
        },
        {
          id: 3,
          name: "Sophie Laurent",
          email: "sophie@example.com",
          phone: "06 45 67 89 01",
          joinDate: "2024-06-10",
          loyaltyPoints: 850,
          totalSpent: 2100,
          notes: "VIP - Cliente premium",
        },
      ];
      saveClientsToStorage();
    }

    if (savedInvoices) {
      currentInvoices.value = JSON.parse(savedInvoices);
    }
  } catch (error) {
    console.error("Error loading clients:", error);
  }
}

// Appeler au chargement du module
initClientsOnLoad();

export function useClients() {
  const saveClientsToStorage = () => {
    try {
      localStorage.setItem("clients", JSON.stringify(currentClients.value));
    } catch (error) {
      console.error("Error saving clients to storage:", error);
    }
  };

  const saveInvoicesToStorage = () => {
    try {
      localStorage.setItem("invoices", JSON.stringify(currentInvoices.value));
    } catch (error) {
      console.error("Error saving invoices to storage:", error);
    }
  };

  // Récupérer tous les clients
  const getClients = () => currentClients.value;

  // Ajouter un nouveau client
  const addClient = (clientData) => {
    const newId = Math.max(...currentClients.value.map((c) => c.id), 0) + 1;
    const newClient = {
      id: newId,
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone,
      joinDate: new Date().toISOString().split("T")[0],
      loyaltyPoints: 0,
      totalSpent: 0,
      notes: clientData.notes || "",
    };
    currentClients.value.push(newClient);
    saveClientsToStorage();
    return newClient;
  };

  // Mettre à jour un client
  const updateClient = (id, clientData) => {
    const index = currentClients.value.findIndex((c) => c.id === id);
    if (index !== -1) {
      currentClients.value[index] = {
        ...currentClients.value[index],
        ...clientData,
      };
      saveClientsToStorage();
      return currentClients.value[index];
    }
    return null;
  };

  // Supprimer un client
  const deleteClient = (id) => {
    const index = currentClients.value.findIndex((c) => c.id === id);
    if (index !== -1) {
      currentClients.value.splice(index, 1);
      saveClientsToStorage();
      return true;
    }
    return false;
  };

  // Ajouter des points de fidélité
  const addLoyaltyPoints = (clientId, points) => {
    const client = currentClients.value.find((c) => c.id === clientId);
    if (client) {
      client.loyaltyPoints += points;
      saveClientsToStorage();
      return client;
    }
    return null;
  };

  // Utiliser des points de fidélité
  const useLoyaltyPoints = (clientId, points) => {
    const client = currentClients.value.find((c) => c.id === clientId);
    if (client && client.loyaltyPoints >= points) {
      client.loyaltyPoints -= points;
      saveClientsToStorage();
      return client;
    }
    return null;
  };

  // Mettre à jour le montant total dépensé
  const updateTotalSpent = (clientId, amount) => {
    const client = currentClients.value.find((c) => c.id === clientId);
    if (client) {
      client.totalSpent += amount;
      // Ajouter des points automatiquement (1 point pour 5€ dépensés)
      const earnedPoints = Math.floor(amount / 5);
      client.loyaltyPoints += earnedPoints;
      saveClientsToStorage();
      return client;
    }
    return null;
  };

  // Créer une facture
  const createInvoice = (invoiceData) => {
    const newId = Math.max(...currentInvoices.value.map((i) => i.id), 0) + 1;
    const newInvoice = {
      id: newId,
      invoiceNumber: `FAC-${Date.now()}`,
      clientId: invoiceData.clientId,
      items: invoiceData.items,
      subtotal: invoiceData.subtotal,
      discount: invoiceData.discount || 0,
      total: invoiceData.total,
      status: "pending", // pending, paid, cancelled
      paymentMethod: null,
      createdAt: new Date().toISOString(),
      paidAt: null,
      notes: invoiceData.notes || "",
      cashier: invoiceData.cashier || "Caissier",
    };
    currentInvoices.value.push(newInvoice);
    saveInvoicesToStorage();
    return newInvoice;
  };

  // Récupérer toutes les factures
  const getInvoices = () => currentInvoices.value;

  // Récupérer les factures en attente pour un client
  const getPendingInvoices = (clientId) => {
    return currentInvoices.value.filter(
      (i) => i.clientId === clientId && i.status === "pending"
    );
  };

  // Payer une facture
  const payInvoice = (invoiceId, paymentMethod) => {
    const invoice = currentInvoices.value.find((i) => i.id === invoiceId);
    if (invoice) {
      invoice.status = "paid";
      invoice.paymentMethod = paymentMethod;
      invoice.paidAt = new Date().toISOString();
      saveInvoicesToStorage();

      // Mettre à jour les points de fidélité du client
      updateTotalSpent(invoice.clientId, invoice.total);

      return invoice;
    }
    return null;
  };

  // Annuler une facture (seulement si statut = pending)
  const cancelInvoice = (invoiceId, reason = "") => {
    const invoice = currentInvoices.value.find((i) => i.id === invoiceId);
    if (invoice && invoice.status === "pending") {
      invoice.status = "cancelled";
      invoice.cancelReason = reason;
      invoice.cancelledAt = new Date().toISOString();
      saveInvoicesToStorage();
      return invoice;
    }
    return null;
  };

  // Obtenir les statistiques d'un client
  const getClientStats = (clientId) => {
    const client = currentClients.value.find((c) => c.id === clientId);
    if (!client) return null;

    const clientInvoices = currentInvoices.value.filter(
      (i) => i.clientId === clientId && i.status === "paid"
    );
    const totalInvoices = clientInvoices.length;
    const averageInvoice =
      totalInvoices > 0 ? client.totalSpent / totalInvoices : 0;

    return {
      client,
      totalInvoices,
      totalSpent: client.totalSpent,
      averageInvoice,
      loyaltyPoints: client.loyaltyPoints,
    };
  };

  return {
    clients: currentClients,
    invoices: currentInvoices,
    getClients,
    addClient,
    updateClient,
    deleteClient,
    addLoyaltyPoints,
    useLoyaltyPoints,
    updateTotalSpent,
    createInvoice,
    getInvoices,
    getPendingInvoices,
    payInvoice,
    cancelInvoice,
    getClientStats,
  };
}
