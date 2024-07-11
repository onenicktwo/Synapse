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
  background-color: #eeeeee;
  padding: 10px 0; 
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); 
  max-height: fit-content;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  max-width: 95%;
  margin: 0 auto;
  border: 2px solid #9575cd; 
  border-radius: 10px; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
  background-color: #673ab7; 
}

.nav-links {
  font-family: 'Roboto', sans-serif; /* More professional font */
  font-size: 1rem; 
  color: #ffffff; 
  text-shadow: 2px 2px 0 #b367a2, 
               4px 4px 0 #3d009e; 
  letter-spacing: 1px; 
  transform: rotate(-3deg); 
  margin-right: 20px;
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
  font-family: 'Roboto Slab', serif; /* Professional and bold font */
  font-size: 2.5rem; /* Increased font size */
  color: #ffffff; 
  text-shadow: 2px 2px 0 #b367a2,
               4px 4px 0 #3d009e; 
  letter-spacing: 2px; /* Increased letter spacing */
  margin: 5px 100px;
  flex-grow: 1; 
  text-align: center; 
  transform: rotate(-2deg); 
  display: inline-block; 
}
</style>