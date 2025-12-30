import { ref, computed } from "vue";

export function useDataManager(storageKey, initialData) {
  // Charger les données depuis le localStorage ou utiliser les données initiales
  const loadData = () => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(`Erreur lors du chargement de ${storageKey}:`, e);
        return initialData;
      }
    }
    return initialData;
  };

  const items = ref(loadData());

  // Sauvegarder les données dans le localStorage
  const saveToStorage = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items.value));
    } catch (e) {
      console.error(`Erreur lors de la sauvegarde de ${storageKey}:`, e);
    }
  };

  // Ajouter un nouvel élément
  const addItem = (newItem) => {
    const id =
      items.value.length > 0
        ? Math.max(...items.value.map((item) => item.id)) + 1
        : 1;
    const item = { ...newItem, id };
    items.value.push(item);
    saveToStorage();
    return item;
  };

  // Mettre à jour un élément
  const updateItem = (id, updatedData) => {
    const index = items.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      items.value[index] = { ...items.value[index], ...updatedData };
      saveToStorage();
      return items.value[index];
    }
    return null;
  };

  // Supprimer un élément
  const deleteItem = (id) => {
    const index = items.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      const deletedItem = items.value.splice(index, 1)[0];
      saveToStorage();
      return deletedItem;
    }
    return null;
  };

  // Réinitialiser aux données par défaut
  const reset = () => {
    items.value = initialData;
    localStorage.removeItem(storageKey);
  };

  // Recherche
  const search = (query, searchFields = []) => {
    if (!query) return items.value;
    const lowerQuery = query.toLowerCase();
    return items.value.filter((item) =>
      searchFields.some((field) =>
        String(item[field]).toLowerCase().includes(lowerQuery)
      )
    );
  };

  return {
    items: computed(() => items.value),
    addItem,
    updateItem,
    deleteItem,
    reset,
    search,
    count: computed(() => items.value.length),
  };
}
