<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Header du salon -->
      <div class="login-header">
        <svg class="salon-logo" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <!-- Ciseaux à gauche -->
          <g transform="translate(20, 35)">
            <!-- Anneau gauche -->
            <circle cx="8" cy="20" r="8" fill="none" stroke="currentColor" stroke-width="2.5"/>
            <!-- Anneau droit -->
            <circle cx="32" cy="20" r="8" fill="none" stroke="currentColor" stroke-width="2.5"/>
            <!-- Lame supérieure gauche -->
            <path d="M 16 15 Q 20 5 20 -5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <!-- Lame supérieure droite -->
            <path d="M 24 15 Q 20 5 20 -5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <!-- Lame inférieure gauche -->
            <path d="M 16 25 Q 20 35 20 45" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <!-- Lame inférieure droite -->
            <path d="M 24 25 Q 20 35 20 45" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </g>
          
          <!-- Peigne à droite -->
          <g transform="translate(70, 30)">
            <!-- Manche -->
            <rect x="0" y="0" width="12" height="28" rx="3" fill="none" stroke="currentColor" stroke-width="2.5"/>
            <!-- Dents -->
            <line x1="3" y1="28" x2="3" y2="50" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="9" y1="28" x2="9" y2="50" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="15" y1="28" x2="15" y2="50" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </g>
        </svg>
        <h1>BeautyShop</h1>
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
        <p class="support-text">
          Besoin de support ? 
          <a href="tel:+243997775599">appelez le +243997775599</a>
        </p>
        <p class="info-text">
          Pour plus d'infos: 
          <a href="https://effyiskey.com" target="_blank">effyiskey.com</a>
        </p>
      </div>
    </div>

    <!-- Version sombre du fond -->
    <div class="login-background"></div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import "../styles/login.css";

const router = useRouter();

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
    // Utiliser le système d'authentification
    const { useAuth } = await import("../composables/useAuth");
    const { login } = useAuth();
    const result = login(credentials.email, credentials.password);

    if (result.success) {
      credentials.email = "";
      credentials.password = "";
      successMessage.value = "";
      await router.push("/dashboard");
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

