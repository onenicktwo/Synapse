<template>
  <div id="app">
    <HeadingArea />
    <div class="main-container">
      <toolbox-area />
      <workspace-area />
      <OutputArea />
    </div>
  </div>
</template>

<script>
import HeadingArea from '@/components/HeadingArea.vue';

import ToolboxArea from './components/ToolboxArea.vue'
import WorkspaceArea from './components/WorkspaceArea.vue'
import OutputArea from './components/OutputArea.vue';

export default {
  name: 'App',
  components: {
    HeadingArea,
    ToolboxArea,
    WorkspaceArea,
    OutputArea,
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