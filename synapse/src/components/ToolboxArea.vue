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
.toolbox-area {
  padding: 10px;
  background-color: #f0f0f0;
  border-right: 1px solid #ccc;
  width: 200px;
  height: 100%;
  overflow-y: auto;
}

.toolbox-item {
  margin-bottom: 10px;
}
</style>