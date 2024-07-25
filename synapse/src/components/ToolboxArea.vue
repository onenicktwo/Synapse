<template>
  <div class="toolbox-area">
    <div class="toolbox-header">
      <h2 class="h4">Toolbox</h2>
    </div>
    <div class="toolbox-content">
      <div v-for="block in blocks" :key="block.id" class="toolbox-item">
        <component 
          :is="getBlockComponent(block.type)"
          :block="block"
          :isInWorkspace="false"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import PrintBlock from './blocks/PrintBlock.vue';
import IfThenBlock from './blocks/IfThenBlock.vue';
import VariableBlock from './blocks/VariableBlock.vue';
import CreateVariableBlock from './blocks/CreateVariableBlock.vue'; 
import { Block } from './blocks/types';
import { getBlockComponent } from './blockUtils';
import ComparisonOperatorBlock from './blocks/ComparisonOperatorBlock.vue';

export default defineComponent({
  name: 'ToolboxArea',
  components: {
    PrintBlock,
    IfThenBlock,
    VariableBlock,
    CreateVariableBlock,
    ComparisonOperatorBlock
  },
  computed: {
    ...mapGetters('blocks', ['getAllBlocks']),
    blocks(): Block[] {
      return this.getAllBlocks;
    }
  },
  methods: {
    getBlockComponent
  }
});
</script>

<style scoped>
.toolbox-area {
  padding-top: 1rem;
  background-color: #f8f9fa; /* Light background for a clean look */
  width: 250px;
  height: 100%;
  overflow-y: auto;
  border-right: 1px solid #e0e0e0;
}

.toolbox-header {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.h4 {
  font-family: 'Roboto', sans-serif;
  font-size: 1.5rem;
  color: #343a40; /* Dark color for header */
  margin-left: 25%;
}

.toolbox-content {
  min-height: 300px;
  padding: 1rem;
}
</style>
