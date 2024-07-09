<!-- src/components/WorkspaceArea.vue -->

<template>
  <div 
    class="workspace-area"
    @dragover.prevent
    @drop="onDrop"
  >
    <h2>Workspace</h2>
    <div class="workspace-content">
      <component 
        v-for="block in workspaceBlocks" 
        :key="block.id" 
        :is="getBlockComponent(block.type)"
        :block="block"
        :isInWorkspace="true"
        @remove="removeBlock(block.id)"
        @update="updateBlock"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import PrintBlock from './blocks/PrintBlock.vue';

export default {
  name: 'WorkspaceArea',
  components: {
    PrintBlock
  },
  computed: {
    ...mapGetters('workspace', ['getWorkspaceBlocks']),
    workspaceBlocks() {
      return this.getWorkspaceBlocks;
    }
  },
  methods: {
    ...mapActions('workspace', ['addBlock', 'removeBlock', 'updateBlock']),
    getBlockComponent(type) {
      switch (type) {
        case 'output':
          return 'PrintBlock';
        // Add more cases for other block types as you create them
        default:
          console.error(`Unknown block type: ${type}`);
          return null;
      }
    },
    onDrop(event) {
      const blockData = JSON.parse(event.dataTransfer.getData('text/plain'));
      const newBlock = {
        ...blockData,
        id: Date.now(), // Ensure a unique ID
        position: {
          x: event.clientX - event.target.getBoundingClientRect().left,
          y: event.clientY - event.target.getBoundingClientRect().top
        }
      };
      this.addBlock(newBlock);
    }
  }
};
</script>

<style scoped>
.workspace-area {
  flex-grow: 1;
  padding: 10px;
  background-color: #eeeeee;
  min-height: 300px;
}

.workspace-content {
  min-height: 300px;
  border: 2px dashed #ccc;
  padding: 10px;
  position: relative;
}

</style>