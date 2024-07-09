<template>
  <div class="heading">
    <nav class="navbar">
      <h1 class="synapse-title">Synapse</h1>
      <div class="nav-links">
        <router-link to="/settings">Settings</router-link>
        <router-link to="/about">About</router-link>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'HeadingArea',
};
</script>

<style scoped>
.heading {
  background-color: #7e57c2;
  padding: 10px 0; 
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); 
  max-height: fit-content; /* Allow the heading to adjust to content */
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  max-width: 95%; 
}

.nav-links {
  font-family: 'Bangers', cursive;
  font-size: 1rem; 
  color: #ffffff; 
  text-shadow: 2px 2px 0 #b367a2, 
               4px 4px 0 #3d009e; 
  letter-spacing: 1px; 
  transform: rotate(-3deg); 
  margin: 5px 0; /* Simplified margin */
}

.nav-links router-link {
  color: #fff;
  text-decoration: none;
  margin-left: 20px; 
  font-weight: 500; 
  transition: color 0.3s ease; 
}

.nav-links router-link:hover {
  color: #f2f2f2; 
}

.synapse-title {
  font-family: 'Bangers', cursive;
  font-size: 1.8rem; /* Reduced font size */
  color: #ffffff; 
  text-shadow: 2px 2px 0 #b367a2,
               4px 4px 0 #3d009e; 
  letter-spacing: 1px; /* Reduced letter spacing */
  margin: 5px 0; /* Simplified margin */
}
</style>