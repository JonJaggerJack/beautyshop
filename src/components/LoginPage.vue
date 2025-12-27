<template>
  <div class="login-container">
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
          class="icon icon-sun"
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
        <span>Clair</span>
      </button>
      <button
        type="button"
        @click="setDarkMode"
        class="theme-btn dark-btn"
        :class="{ active: isDarkMode }"
        title="Mode sombre"
      >
        <svg
          class="icon icon-moon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
        <span>Sombre</span>
      </button>
    </div>

    <div class="login-card" :class="{ 'dark-mode': isDarkMode }">
      <!-- Header du salon -->
      <div class="login-header">
        <div class="salon-logo">💇‍♀️</div>
        <h1>CHEZ JK</h1>
        <p class="subtitle">Système de Gestion</p>
      </div>

      <!-- Formulaire de connexion -->
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Champ Email -->
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="credentials.email"
            type="email"
            placeholder="Entrez votre email"
            required
            @blur="validateEmail"
          />
          <span v-if="errors.email" class="error-message">{{
            errors.email
          }}</span>
        </div>

        <!-- Champ Mot de passe -->
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            id="password"
            v-model="credentials.password"
            type="password"
            placeholder="Entrez votre mot de passe"
            required
          />
          <span v-if="errors.password" class="error-message">{{
            errors.password
          }}</span>
        </div>

        <!-- Message d'erreur général -->
        <div v-if="errors.general" class="alert alert-danger">
          {{ errors.general }}
        </div>

        <!-- Message de succès -->
        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>

        <!-- Bouton de connexion -->
        <button type="submit" class="btn-login" :disabled="isLoading">
          <span v-if="!isLoading">Se Connecter</span>
          <span v-else>Connexion en cours...</span>
        </button>
      </form>

      <!-- Liens supplémentaires -->
      <div class="login-footer">
        <a href="#" class="forgot-password">Mot de passe oublié?</a>
        <span class="divider">|</span>
        <a href="#" class="signup-link">Créer un compte</a>
      </div>
    </div>

    <!-- Version sombre du fond -->
    <div class="login-background"></div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import "../styles/login.css";

const emit = defineEmits(["login"]);

const isDarkMode = ref(false);

const credentials = reactive({
  email: "",
  password: "",
});

const errors = reactive({
  email: "",
  password: "",
  general: "",
});

const isLoading = ref(false);
const successMessage = ref("");

// Définir le mode clair
const setLightMode = () => {
  isDarkMode.value = false;
  localStorage.setItem("darkMode", "false");
};

// Définir le mode sombre
const setDarkMode = () => {
  isDarkMode.value = true;
  localStorage.setItem("darkMode", "true");
};

// Charger le mode sombre au montage
onMounted(() => {
  const savedDarkMode = localStorage.getItem("darkMode");
  if (savedDarkMode !== null) {
    isDarkMode.value = savedDarkMode === "true";
  }
});

// Validation de l'email
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!credentials.email) {
    errors.email = "L'email est requis";
  } else if (!emailRegex.test(credentials.email)) {
    errors.email = "Veuillez entrer un email valide";
  } else {
    errors.email = "";
  }
};

// Gestion de la connexion
const handleLogin = async () => {
  errors.email = "";
  errors.password = "";
  errors.general = "";
  successMessage.value = "";

  // Validation
  if (!credentials.email) {
    errors.email = "L'email est requis";
    return;
  }
  if (!credentials.password) {
    errors.password = "Le mot de passe est requis";
    return;
  }

  validateEmail();
  if (errors.email) return;

  isLoading.value = true;

  // Simulation d'une requête API
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Utiliser le système d'authentification
    const { useAuth } = await import("../composables/useAuth");
    const { login } = useAuth();
    const result = login(credentials.email, credentials.password);

    if (result.success) {
      successMessage.value = `Bienvenue ${result.user.name}! Connexion réussie.`;
      setTimeout(() => {
        credentials.email = "";
        credentials.password = "";
        successMessage.value = "";
        emit("login", result.user);
      }, 1500);
    } else {
      errors.general = result.error || "Email ou mot de passe incorrect";
    }
  } catch (error) {
    errors.general = "Erreur de connexion. Veuillez réessayer.";
  } finally {
    isLoading.value = false;
  }
};
</script>
