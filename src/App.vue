<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import LoginPage from "./components/LoginPage.vue";
import AppLayout from "./components/AppLayout.vue";
import { useAuth } from "./composables/useAuth";

const { currentUser, initAuth } = useAuth();
const router = useRouter();
const isAuthenticated = computed(() => !!currentUser.value);

onMounted(() => {
  initAuth();
});
</script>

<template>
  <AppLayout v-if="isAuthenticated" />
  <LoginPage v-else />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: #ffffff;
  color: #333;
  transition: background-color 0.3s, color 0.3s;
}

html.dark-mode body {
  background: #1a1a1a;
  color: #e0e0e0;
}

html,
body,
#app {
  height: 100%;
  width: 100%;
}

/* Thème sombre global */
html.dark-mode {
  background: #1a1a1a;
  color: #e0e0e0;
}

html.dark-mode input,
html.dark-mode textarea,
html.dark-mode select {
  background: #2a2a2a;
  color: #e0e0e0;
  border-color: #444;
}

html.dark-mode button {
  color: #e0e0e0;
}

html.dark-mode .login-container {
  background: #1a1a1a;
  color: #e0e0e0;
}

html.dark-mode .dashboard-container {
  background: #1a1a1a;
  color: #e0e0e0;
}
</style>
