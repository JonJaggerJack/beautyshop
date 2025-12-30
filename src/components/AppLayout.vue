<template>
  <div class="layout-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <span class="sidebar-logo">💇‍♀️</span>
        <span class="sidebar-title">CHEZ JK</span>
      </div>

      <!-- Profil Utilisateur -->
      <div class="user-profile">
        <div class="profile-avatar">{{ userInitial }}</div>
        <div class="profile-info">
          <p class="profile-name">{{ currentUser.name }}</p>
          <p class="profile-role">{{ roleLabel }}</p>
        </div>
        <button class="logout-btn" @click="handleLogout" title="Déconnexion">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <!-- Boutons de basculement du thème -->
        <div class="theme-buttons">
          <button
            type="button"
            @click="setLightMode"
            class="theme-btn light-btn"
            :class="{ active: !isDarkMode }"
            title="Mode clair"
          >
            <svg
              class="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </button>
          <button
            type="button"
            @click="setDarkMode"
            class="theme-btn dark-btn"
            :class="{ active: isDarkMode }"
            title="Mode sombre"
          >
            <svg
              class="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
        </div>

        <router-link to="/dashboard" class="nav-link" active-class="active">
          <svg
            class="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span class="nav-label">Dashboard</span>
        </router-link>

        <router-link to="/services" class="nav-link" active-class="active">
          <svg
            class="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="1"></circle>
            <path d="M12 1v6m0 6v6"></path>
            <path d="M4.22 4.22l4.24 4.24m2.12 2.12l4.24 4.24"></path>
            <path d="M1 12h6m6 0h6"></path>
            <path d="M4.22 19.78l4.24-4.24m2.12-2.12l4.24-4.24"></path>
          </svg>
          <span class="nav-label">Services</span>
        </router-link>

        <router-link to="/personnel" class="nav-link" active-class="active">
          <svg
            class="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span class="nav-label">Personnel</span>
        </router-link>

        <router-link to="/stock" class="nav-link" active-class="active">
          <svg
            class="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="16" y1="3" x2="16" y2="21"></line>
            <line x1="8" y1="3" x2="8" y2="21"></line>
            <line x1="3" y1="8" x2="21" y2="8"></line>
            <line x1="3" y1="16" x2="21" y2="16"></line>
            <path d="M3 3h18v18H3z"></path>
          </svg>
          <span class="nav-label">Stock</span>
        </router-link>

        <router-link to="/pos" class="nav-link" active-class="active">
          <svg
            class="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="3" y="4" width="18" height="14" rx="1" ry="1"></rect>
            <line x1="3" y1="21" x2="21" y2="21"></line>
            <line x1="9" y1="12" x2="9" y2="8"></line>
            <line x1="15" y1="12" x2="15" y2="8"></line>
          </svg>
          <span class="nav-label">POS</span>
        </router-link>
      </nav>
    </aside>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth, ROLES } from "../composables/useAuth";

const { currentUser, logout } = useAuth();
const router = useRouter();
const isDarkMode = ref(false);

const userInitial = computed(() => {
  return currentUser.value?.name?.charAt(0).toUpperCase() || "U";
});

const roleLabel = computed(() => {
  const roleMap = {
    [ROLES.GERANTE]: "Gérante",
    [ROLES.UTILISATEUR]: "Utilisateur",
    [ROLES.CAISSIER]: "Caissier",
  };
  return roleMap[currentUser.value?.role] || "Utilisateur";
});

const setLightMode = () => {
  isDarkMode.value = false;
  localStorage.setItem("darkMode", "false");
  document.documentElement.classList.remove("dark-mode");
};

const setDarkMode = () => {
  isDarkMode.value = true;
  localStorage.setItem("darkMode", "true");
  document.documentElement.classList.add("dark-mode");
};

const handleLogout = async () => {
  logout();
  await router.push("/");
};

onMounted(() => {
  const savedDarkMode = localStorage.getItem("darkMode");
  if (savedDarkMode !== null) {
    isDarkMode.value = savedDarkMode === "true";
    if (isDarkMode.value) {
      document.documentElement.classList.add("dark-mode");
    }
  }
});
</script>

<style scoped>
@import "../styles/sidebar.css";
.layout-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.main-content {
  flex: 1;
  background: #f5f5f5;
  overflow: hidden;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.main-content > * {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  margin-left: 10px;
  margin-right: 10px;
}

.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.profile-name {
  margin: 0;
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-role {
  margin: 2px 0 0 0;
  font-size: 11px;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: currentColor;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.theme-buttons {
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  margin: 8px 0 16px 0;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  justify-content: center;
  align-items: center;
}

.theme-btn {
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: #e0e0e0;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.theme-btn.active {
  background: rgba(102, 126, 234, 0.3);
  border-color: #667eea;
  color: #667eea;
}

.theme-btn .icon {
  width: 20px;
  height: 20px;
}
</style>
