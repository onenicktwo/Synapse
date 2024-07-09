<!-- src/components/ToolboxArea.vue -->

<template>
  <div class="toolbox-area">
    <h2>Toolbox</h2>
    <div v-for="block in blocks" :key="block.id" class="toolbox-item">
      <component 
        :is="getBlockComponent(block.type)"
        :block="block"
        :isInWorkspace="false"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PrintBlock from './blocks/PrintBlock.vue';

export default {
  name: 'ToolboxArea',
  components: {
    PrintBlock
  },
  computed: {
    ...mapGetters('blocks', ['getAllBlocks']),
    blocks() {
      return this.getAllBlocks;
    }
  },
  methods: {
    getBlockComponent(type) {
      switch (type) {
        case 'output':
          return 'PrintBlock';
        // Add more cases for other block types as you create them
        default:
          console.error(`Unknown block type: ${type}`);
          return null;
      }
    }
  }
};
</script>

<style scoped>
/* src/components/styling/toolbox-area.css */

.toolbox-area {
  padding: 10px;
  background-color: #f0f0f0;
  border-right: 1px solid #ccc;
  width: 200px;
  height: 100%;
  overflow-y: auto;
}

.toolbox-title {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 10px;
}

.toolbox-item {
  margin-bottom: 10px;
  cursor: pointer;
  padding: 8px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.toolbox-item:hover {
  background-color: #f0f0f0;
}

.toolbox-item h3 {
  margin: 0;
  font-size: 1em;
}

.toolbox-item p {
  margin: 5px 0;
  color: #666;
}

.toolbox-item.selected {
  background-color: #e0e0e0;
}

</style>