<template>
  <div class="home-view">
    <div class="workspace-container">
      <Toolbox />
      <Workspace />
      <CodeView />
      <OutputArea />
    </div>
  </div>
</template>

<script>
import '../components/styling/app.css';

import Toolbox from '@/components/ToolboxArea.vue';
import Workspace from '@/components/WorkspaceArea.vue';
import CodeView from '@/components/CodeView.vue';
import OutputArea from '@/components/OutputArea.vue';

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
.home-view {
  background-color: #f0f0f0;
  padding: 20px;
}

.workspace-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 20px;
}
.body
{
  color:grey;
}
</style>
