<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import LoginPage from "./components/LoginPage.vue";
import AppLayout from "./components/AppLayout.vue";
import { useAuth } from "./composables/useAuth";

const { currentUser, initAuth, logout: authLogout } = useAuth();
const router = useRouter();

onMounted(() => {
  initAuth();
  if (currentUser.value && router.currentRoute.value.path === "/") {
    router.replace("/dashboard");
  }
});

const handleLogin = () => {
  router.replace("/dashboard");
};

const handleLogout = () => {
  authLogout();
  router.replace("/");
};
</script>

<template>
  <AppLayout v-if="currentUser" @logout="handleLogout" />
  <LoginPage v-else @login="handleLogin" />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

html,
body,
#app {
  height: 100%;
  width: 100%;
}
</style>
