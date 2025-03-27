<template>
  <div class="sidebar">
    <h2>Menu</h2>
    <ul>
      <li><RouterLink to="/">Home</RouterLink></li>
      <li><RouterLink to="/map">Map</RouterLink></li>
    </ul>
  </div>
</template>

<style scoped>
.sidebar {
  width: 250px; /* Adjust the sidebar width */
  flex-shrink: 0;
  height: 100vh;
  background-color: #2c3e50; /* Dark sidebar */
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 10px 0;
}

a {
  color: white;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
