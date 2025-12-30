<template>
  <div class="login-container">
    <div class="login-card">
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
