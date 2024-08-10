<template>
  <div id="app">
    <HeadingArea />
    <div class="main-container">
      <toolbox-area />
      <div class="workspace-container">
        <workspace-tabs />
        <workspace-area v-if="activeWorkspace" />
      </div>
      <OutputArea />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import HeadingArea from '@/components/HeadingArea.vue';
import ToolboxArea from './components/ToolboxArea.vue'
import WorkspaceArea from './components/WorkspaceArea.vue'
import WorkspaceTabs from './components/WorkspaceTabs.vue'
import OutputArea from './components/OutputArea.vue';

export default defineComponent({
  name: 'App',
  components: {
    HeadingArea,
    ToolboxArea,
    WorkspaceArea,
    WorkspaceTabs,
    OutputArea,
  },
  computed: {
    ...mapGetters('workspace', ['getActiveWorkspace']),
    activeWorkspace(): string | null {
      return this.getActiveWorkspace;
    },
  },
});
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

.workspace-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>