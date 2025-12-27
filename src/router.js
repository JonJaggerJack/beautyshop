import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "./components/Dashboard.vue";
import Services from "./components/Services.vue";
import Personnel from "./components/Personnel.vue";
import POS from "./components/POS.vue";
import Stock from "./components/Stock.vue";
import { useAuth } from "./composables/useAuth";

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/services",
    name: "Services",
    component: Services,
    meta: { requiresRole: "gerante" },
  },
  {
    path: "/personnel",
    name: "Personnel",
    component: Personnel,
    meta: { requiresRole: "gerante" },
  },
  {
    path: "/stock",
    name: "Stock",
    component: Stock,
    meta: { requiresRole: "gerante" },
  },
  {
    path: "/pos",
    name: "POS",
    component: POS,
    meta: { requiresRole: ["gerante", "caissier"] },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const { currentUser, canAccess } = useAuth();

  if (!currentUser.value && to.name !== "Login") {
    next("/");
    return;
  }

  if (currentUser.value) {
    const routeMeta = to.meta;
    if (routeMeta.requiresRole) {
      const allowedRoles = Array.isArray(routeMeta.requiresRole)
        ? routeMeta.requiresRole
        : [routeMeta.requiresRole];

      if (!allowedRoles.includes(currentUser.value.role)) {
        next("/dashboard");
        return;
      }
    }
  }

  next();
});

export default router;
