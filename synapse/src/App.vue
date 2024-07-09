<template>
  <div id="app">
    <h1>Visual Programming Environment</h1>
    <div class="main-container">
      <toolbox-area />
      <workspace-area />
    </div>
  </div>
</template>

<script>
import ToolboxArea from './components/ToolboxArea.vue'
import WorkspaceArea from './components/WorkspaceArea.vue'

export default {
  name: 'App',
  components: {
    ToolboxArea,
    WorkspaceArea
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
}

.main-container {
  display: flex;
  height: 100%;
}
</style>