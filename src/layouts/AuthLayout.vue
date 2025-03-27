<template>
  <div class="auth-layout">
    <div class="auth-box">
      <router-view /> <!-- Renders Login or Register inside this layout -->
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  display: flex;
  justify-content: center; /* Centers horizontally */
  align-items: center; /* Centers vertically */
  height: 100vh; /* Full viewport height */
  width: 100vw; /* Full viewport width */
}

.auth-box {
  width: 400px; /* Set a fixed width */
  padding: 2rem;
}
</style>
