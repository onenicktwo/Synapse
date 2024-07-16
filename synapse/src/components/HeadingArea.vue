<template>
  <div class="heading">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-container class="header-container">
        <b-navbar-brand href="#" class="synapse-title">
          Synapse
        </b-navbar-brand>
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/settings" active-class="active-link">
            <span class="nav-link-text">Settings</span>
          </b-nav-item>
          <b-nav-item to="/about" active-class="active-link">
            <span class="nav-link-text">About</span>
          </b-nav-item>
        </b-navbar-nav>
      </b-container>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'HeadingArea',
};
</script>

<style scoped>
.heading {
  border-bottom: 1px solid #e0e0e0;
}

.navbar {
  background-color: #343a40; /* Dark background for a modern look */
}

.header-container {
  display: flex;
  align-items: center;
}

.synapse-title {
  font-family: 'Roboto Slab', serif;
  font-size: 2rem;
  color: #ffffff;
  letter-spacing: 1px;
  margin-right: auto;
}

.navbar-toggler-icon {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 24px;
  width: 30px;
  cursor: pointer;
}

.navbar-toggler-icon span {
  background-color: white;
  height: 3px;
  width: 100%;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.navbar-toggler-icon .animate.top-bar {
  transform: translateY(8px) rotate(45deg);
}

.navbar-toggler-icon .animate.middle-bar {
  opacity: 0;
}

.navbar-toggler-icon .animate.bottom-bar {
  transform: translateY(-8px) rotate(-45deg);
}

.navbar-nav {
  font-family: 'Roboto', sans-serif;
}

.navbar-nav .nav-item {
  margin-left: 1rem;
}

.nav-link-text {
  font-size: 1rem;
  color: #ffffff;
  transition: color 0.3s ease;
}

.nav-link-text:hover,
.active-link .nav-link-text {
  color: #e0e0e0; /* Lighten text on hover */
}

@media (max-width: 991.98px) {
  .navbar-nav {
    margin-left: 0;
  }

  .navbar-nav .nav-item {
    margin-left: 0;
    margin-bottom: 0.5rem;
  }

  .synapse-title {
    font-size: 1.75rem;
  }
}
</style>
