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
    <button @click="executeBlocks" class="btn btn-primary mt-3">Execute Blocks</button>
    <div v-if="output.length > 0" class="mt-3">
      <h3>Output:</h3>
      <pre>{{ output.join('\n') }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import PrintBlock from './blocks/PrintBlock.vue';
import { Block } from './blocks/types';
import BlockInterpreter from './blocks/BlockInterpreter';

export default defineComponent({
  name: 'WorkspaceArea',
  components: {
    PrintBlock
  },
  data() {
    return {
      interpreter: new BlockInterpreter(),
      output: [] as string[]
    };
  },
  computed: {
    ...mapGetters('workspace', ['getWorkspaceBlocks']),
    workspaceBlocks(): Block[] {
      return this.getWorkspaceBlocks;
    }
  },
  methods: {
    ...mapActions('workspace', ['addBlock', 'removeBlock', 'updateBlock']),
    getBlockComponent(type: string): string | null {
      switch (type) {
        case 'print':
          return 'PrintBlock';
        // Add more cases for other block types as you create them
        default:
          console.error(`Unknown block type: ${type}`);
          return null;
      }
    },
    onDrop(event: DragEvent) {
      if (event.dataTransfer) {
        const blockData = JSON.parse(event.dataTransfer.getData('text/plain')) as Block;
        const newBlock: Block = {
          ...blockData,
          id: Date.now().toString(), // Ensure a unique ID
          position: {
            x: event.clientX - (event.target as HTMLElement).getBoundingClientRect().left,
            y: event.clientY - (event.target as HTMLElement).getBoundingClientRect().top
          }
        };
        this.addBlock(newBlock);
      }
    },
    executeBlocks() {
      this.output = this.interpreter.execute(this.workspaceBlocks);
    }
  }
});
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

.btn-primary {
  background-color: #b39ddb;
  border-color: #b39ddb;
  margin-top: 1rem;
}

.btn-primary:hover {
  background-color: #9575cd;
  border-color: #9575cd;
}

pre {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 0.25rem;
  padding: 1rem;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-top: 1rem;
}

</style>
