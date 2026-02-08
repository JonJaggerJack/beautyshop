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
@import "./styles/headers.css";

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Poppins", sans-serif;
  background: #ffffff;
  color: #333;
  transition: background-color 0.3s, color 0.3s;
}

html,
body,
#app {
  height: 100%;
  width: 100%;
}
</style>

