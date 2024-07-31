<template>
  <div 
    class="workspace-area"
    @dragover.prevent
    @drop="onDrop"
  >
    <div class="workspace-header">
      <h2 class="h4">Workspace</h2>
      <button @click="executeBlocks" class="btn btn-primary">Execute Blocks</button>
    </div>
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

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { Block, blockComponents } from './blocks/types';
import JavaBlockInterpreter from './blocks/JavaBlockInterpreter';
import { getBlockComponent } from './blockUtils';
import axios from 'axios';

export default defineComponent({
  name: 'WorkspaceArea',
  components: blockComponents,
  data() {
    return {
      interpreter: new JavaBlockInterpreter(),
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
    ...mapActions(['setOutput']),

    onDrop(event: DragEvent) {
      if (event.dataTransfer) {
        const blockData = JSON.parse(event.dataTransfer.getData('text/plain')) as Block;
        const newBlock: Block = {
          ...blockData,
          id: Date.now().toString(),
          position: {
            x: event.clientX - (event.target as HTMLElement).getBoundingClientRect().left,
            y: event.clientY - (event.target as HTMLElement).getBoundingClientRect().top
          }
        };
        this.addBlock(newBlock);
      }
    },
    async executeJavaCode(javaCode: string): Promise<string> {
    try {
      console.log(javaCode);
      const response = await axios.post('http://localhost:3000/execute', { code: javaCode });
      return response.data.output;
    } catch (error) {
      console.error('Error executing Java code:', error);
      throw error;
    }
    },
    async executeBlocks() {
      try {
      const javaCode = this.interpreter.generateJavaCode(this.workspaceBlocks);
      const output = await this.executeJavaCode(javaCode);
      this.setOutput(output.split('\n'));
    } catch (error) {
      console.error('Error executing blocks:', error);
      this.setOutput(['Error executing blocks. Please check the console for details.']);
    }
    },
    getBlockComponent
  },
});
</script>

<style scoped>
.workspace-area {
  flex-grow: 1;
  padding: 1rem;
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  overflow-x: auto; /* Add horizontal scrolling if content overflows */
}


.workspace-header {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.h4 {
  font-family: 'Roboto', sans-serif;
  font-size: 1.5rem;
  color: #343a40;
  margin: 0;
}

.workspace-content {
  flex-grow: 1;
  padding: 1rem;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: min-content; /* Ensures content doesn't shrink below its minimum size */
}


.btn-primary {
  background-color: #6c757d;
  border-color: #6c757d;
  font-size: 0.9rem;
  padding: 0.375rem 0.75rem;
}

.btn-primary:hover {
  background-color: #5a6268;
  border-color: #5a6268;
}

pre {
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 0.25rem;
  padding: 1rem;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-top: 1rem;
}
</style>
