<template>
  <div class="heading">
    <b-navbar toggleable="lg" type="dark" variant="primary">
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
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  border-bottom: 3px solid #ffffff; /* Added right border */

}

.navbar {
  background: linear-gradient(45deg, #673ab7, #9c27b0) !important;
  border-bottom: 2px solid #9575cd;
}

.header-container {
  display: flex;
  align-items: center;
}

.synapse-title {
  font-family: 'Roboto Slab', serif;
  font-size: 2.5rem;
  color: #ffffff !important;
  text-shadow: 2px 2px 0 #b367a2, 4px 4px 0 #3d009e;
  letter-spacing: 2px;
  transform: rotate(-2deg);
  display: inline-block;
  padding: 0.5rem 1rem;
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
  margin-left: 2rem;
}

.nav-link-text {
  font-size: 1.1rem;
  color: #ffffff !important;
  text-shadow: 1px 1px 0 #b367a2;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.nav-link-text:hover,
.active-link .nav-link-text {
  transform: translateY(-2px);
  text-shadow: 2px 2px 0 #b367a2;
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
    font-size: 2rem;
    transform: rotate(0deg);
    text-shadow: 1px 1px 0 #b367a2, 2px 2px 0 #3d009e;
  }
}
</style>
