<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  margin: 0;
  padding: 0;
  display: flex;
  height: 100vh;
  width: 100vw;
}

.content {
  flex: 1;
  display: flex;
}

/* html, body, #app {
  margin: 0 !important;
  padding: 0 !important;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
} */
</style>
