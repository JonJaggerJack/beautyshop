<template>
  <div class="layout-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <span class="sidebar-title">BeautyShop</span>
      </div>

      <!-- Profil Utilisateur -->
      <div class="user-profile">
        <div class="profile-avatar">
          <img
            v-if="currentUser.photo"
            :src="currentUser.photo"
            :alt="currentUser.name"
            class="profile-photo"
          />
          <span v-else>{{ userInitial }}</span>
        </div>
        <div class="profile-info">
          <p class="profile-name">{{ currentUser.name }}</p>
          <p class="profile-role">{{ roleLabel }}</p>
          <p class="profile-email">{{ currentUser.email }}</p>
        </div>
        <input
          ref="photoInput"
          type="file"
          accept="image/*"
          class="photo-upload"
          @change="handlePhotoUpload"
          style="display: none"
        />
        <button
          class="photo-btn"
          @click="$refs.photoInput.click()"
          title="Changer photo"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="1"></circle>
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7"></path>
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
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
        <router-link to="/clients" class="nav-link" active-class="active">
          <svg
            class="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span class="nav-label">Clients</span>
        </router-link>

        <router-link to="/reservations" class="nav-link" active-class="active">
          <svg
            class="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span class="nav-label">Réservations</span>
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

        <button
          class="nav-link logout-link"
          @click="handleLogout"
          title="Déconnexion"
        >
          <svg
            class="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span class="nav-label">Déconnexion</span>
        </button>
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

const handleLogout = async () => {
  logout();
  await router.push("/");
};

const photoInput = ref(null);

const handlePhotoUpload = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      currentUser.value.photo = e.target.result;
      localStorage.setItem(
        "users",
        JSON.stringify(
          JSON.parse(localStorage.getItem("users") || "[]").map((u) =>
            u.id === currentUser.value.id ? currentUser.value : u
          )
        )
      );
    };
    reader.readAsDataURL(file);
  }
};
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
  margin: 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
}

.profile-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4bbbfb 0%, #2a2970 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
  flex-shrink: 0;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.profile-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-email {
  margin: 2px 0 0 0;
  font-size: 10px;
  opacity: 0.6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.photo-btn {
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.5);
  color: #4bbbfb;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.photo-btn:hover {
  background: rgba(102, 126, 234, 0.3);
  border-color: #4bbbfb;
}

.photo-upload {
  display: none;
}

/* Logout button in nav */
.logout-link {
  margin-top: auto;
  color: #e74c3c !important;
  font-weight: 600;
  border-top: 1px solid #333;
  padding-top: 20px !important;
  margin-top: 20px !important;
}

.logout-link:hover {
  background: rgba(231, 76, 60, 0.15) !important;
  color: #ff6b6b !important;
  transform: translateX(4px);
}

.logout-link::before {
  background: #e74c3c;
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
  border-color: #4bbbfb;
  color: #4bbbfb;
}

.theme-btn .icon {
  width: 20px;
  height: 20px;
}

@media (max-width: 900px) {
  .user-profile {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 8px;
    margin: 8px;
  }

  .profile-avatar {
    width: 45px;
    height: 45px;
    font-size: 14px;
  }

  .profile-info {
    display: none;
  }

  .photo-btn {
    display: flex;
    width: 32px;
    height: 32px;
    padding: 6px;
  }

  .logout-link {
    margin-top: auto;
    border-top: 1px solid #333;
    padding-top: 12px !important;
    margin-top: 12px !important;
  }

  .logout-link .nav-icon {
    width: 24px;
    height: 24px;
  }

  .logout-link .nav-label {
    display: block;
    text-align: center;
    width: 100%;
  }
}
</style>

