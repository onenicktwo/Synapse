<template>
    <div class="home-view">
      <h1>Visual Programming Language</h1>
      <div class="workspace-container">
        <Toolbox />
        <Workspace />
        <CodeView />
        <OutputArea />
      </div>
    </div>
  </template>
  
  <script>
  import Toolbox from '@/components/ToolboxArea.vue'
  import Workspace from '@/components/WorkspaceArea.vue'
  import CodeView from '@/components/CodeView.vue'
  import OutputArea from '@/components/OutputArea.vue'
  
  export default {
    name: 'HomeView',
    components: {
      Toolbox,
      Workspace,
      CodeView,
      OutputArea
    }
  }
  </script>
  
  <style scoped>
  .workspace-container {
    display: flex;
    justify-content: space-between;
    height: calc(100vh - 100px);
  }
  </style>