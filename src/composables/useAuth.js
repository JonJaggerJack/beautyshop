import { ref, computed } from "vue";

// Rôles disponibles
export const ROLES = {
  GERANTE: "gerante",
  UTILISATEUR: "utilisateur",
  CAISSIER: "caissier",
};

// Permissions par rôle
const PERMISSIONS = {
  [ROLES.GERANTE]: {
    canViewDashboard: true,
    canManageServices: true,
    canManagePersonnel: true,
    canManageStock: true,
    canSell: true,
    canViewReports: true,
  },
  [ROLES.UTILISATEUR]: {
    canViewDashboard: true,
    canManageServices: false,
    canManagePersonnel: false,
    canManageStock: false,
    canSell: false,
    canViewReports: true,
  },
  [ROLES.CAISSIER]: {
    canViewDashboard: true,
    canManageServices: false,
    canManagePersonnel: false,
    canManageStock: false,
    canSell: true,
    canViewReports: false,
  },
};

// Utilisateurs de démo
const DEMO_USERS = [
  {
    email: "gerante@salon.fr",
    password: "gerante123",
    role: ROLES.GERANTE,
    name: "Marie Dupont",
  },
  {
    email: "utilisateur@salon.fr",
    password: "user123",
    role: ROLES.UTILISATEUR,
    name: "Jean Martin",
  },
  {
    email: "caissier@salon.fr",
    password: "caissier123",
    role: ROLES.CAISSIER,
    name: "Sophie Bernard",
  },
];

const currentUser = ref(null);

export function useAuth() {
  const login = (email, password) => {
    const user = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      const userData = {
        email: user.email,
        role: user.role,
        name: user.name,
      };
      currentUser.value = userData;
      localStorage.setItem("userToken", JSON.stringify(userData));
      return { success: true, user: userData };
    }

    return { success: false, error: "Email ou mot de passe incorrect" };
  };

  const logout = () => {
    currentUser.value = null;
    localStorage.removeItem("userToken");
  };

  const initAuth = () => {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        currentUser.value = JSON.parse(token);
      } catch (e) {
        localStorage.removeItem("userToken");
      }
    }
  };

  const hasPermission = (permission) => {
    if (!currentUser.value) return false;
    const rolePermissions = PERMISSIONS[currentUser.value.role];
    return rolePermissions?.[permission] || false;
  };

  const isRole = (role) => {
    return currentUser.value?.role === role;
  };

  const canAccess = (routeName) => {
    if (!currentUser.value) return false;

    const role = currentUser.value.role;

    switch (routeName) {
      case "Dashboard":
        return true; // Tous peuvent voir le dashboard
      case "Services":
        return role === ROLES.GERANTE;
      case "Personnel":
        return role === ROLES.GERANTE;
      case "Stock":
        return role === ROLES.GERANTE;
      case "POS":
        return role === ROLES.CAISSIER || role === ROLES.GERANTE;
      default:
        return false;
    }
  };

  return {
    currentUser: computed(() => currentUser.value),
    login,
    logout,
    initAuth,
    hasPermission,
    isRole,
    canAccess,
    ROLES,
  };
}

