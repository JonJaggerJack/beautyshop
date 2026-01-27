import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "./components/Dashboard.vue";
import Services from "./components/Services.vue";
import Personnel from "./components/Personnel.vue";
import Clients from "./components/Clients.vue";
import Reservations from "./components/Reservations.vue";
import POS from "./components/POS.vue";
import Stock from "./components/Stock.vue";
import LoginPage from "./components/LoginPage.vue";
import { useAuth } from "./composables/useAuth";

const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/services",
    name: "Services",
    component: Services,
    meta: { requiresAuth: true, requiresRole: "gerante" },
  },
  {
    path: "/personnel",
    name: "Personnel",
    component: Personnel,
    meta: { requiresAuth: true, requiresRole: "gerante" },
  },
  {
    path: "/clients",
    name: "Clients",
    component: Clients,
    meta: { requiresAuth: true, requiresRole: "gerante" },
  },
  {
    path: "/reservations",
    name: "Reservations",
    component: Reservations,
    meta: { requiresAuth: true, requiresRole: "gerante" },
  },
  {
    path: "/stock",
    name: "Stock",
    component: Stock,
    meta: { requiresAuth: true, requiresRole: "gerante" },
  },
  {
    path: "/pos",
    name: "POS",
    component: POS,
    meta: { requiresAuth: true, requiresRole: ["gerante", "caissier"] },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const { currentUser, initAuth } = useAuth();

  // Initialiser l'authentification
  initAuth();

  const isAuthenticated = currentUser.value !== null;
  const requiresAuth = to.meta.requiresAuth;

  // Rediriger vers login si non authentifié
  if (requiresAuth && !isAuthenticated) {
    next({ name: "Login" });
    return;
  }

  // Rediriger vers dashboard si authentifié et accès à login
  if (to.name === "Login" && isAuthenticated) {
    next({ name: "Dashboard" });
    return;
  }

  // Vérifier les permissions par rôle
  if (requiresAuth && to.meta.requiresRole && isAuthenticated) {
    const allowedRoles = Array.isArray(to.meta.requiresRole)
      ? to.meta.requiresRole
      : [to.meta.requiresRole];

    if (!allowedRoles.includes(currentUser.value.role)) {
      next({ name: "Dashboard" });
      return;
    }
  }

  next();
});

export default router;
