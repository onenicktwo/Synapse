<template>
  <div 
    class="workspace-area"
    @dragover.prevent
    @drop="onDrop"
  >
    <div class="card mb-4">
      <div class="card-header custom-card-header text-white">
        <h2 class="h4">Workspace</h2>
      </div>
      <div class="card-body workspace-content">
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
  background: linear-gradient(to bottom right, #e0c3fc, #8ec5fc);
  min-height: 300px;
}

.workspace-content {
  min-height: 300px;
  border: 3px solid #ffffff;
  padding: 10px;
  position: relative;
  background: linear-gradient(to bottom right, #e0c3fc, #8ec5fc);
  border-radius: 0.25rem;
}

.card {
  background: linear-gradient(to bottom right, #e0c3fc, #8ec5fc);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-card-header {
  background: #b39ddb; /* Light purple color */
}

h2 {
  margin: 0;
}

.h4{
  font-family: 'Roboto Slab', serif;
  font-size: 2rem;
  color: #ffffff !important;
  text-shadow: 2px 2px 0 #b367a2, 4px 4px 0 #3d009e;
  letter-spacing: 2px;
  transform: rotate(-2deg);
  display: inline-block;
  padding: 0.5rem 1rem;
  margin-right: auto;
}

</style>
