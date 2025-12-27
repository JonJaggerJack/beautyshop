<template>
  <div class="layout-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <span class="sidebar-logo">💇‍♀️</span>
        <span class="sidebar-title">CHEZ JK</span>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/dashboard" class="nav-link" active-class="active"
          >Dashboard</router-link
        >
        <router-link to="/services" class="nav-link" active-class="active"
          >Services</router-link
        >
        <router-link to="/personnel" class="nav-link" active-class="active"
          >Personnel</router-link
        >
        <router-link to="/pos" class="nav-link" active-class="active"
          >POS</router-link
        >
        <button class="nav-link logout" @click="logout">Déconnexion</button>
      </nav>
    </aside>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
const emit = defineEmits(["logout"]);
function logout() {
  emit("logout");
}
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
</style>
