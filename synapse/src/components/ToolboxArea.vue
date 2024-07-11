<!-- src/components/ToolboxArea.vue -->

<template>
  <div class="toolbox-area">
    <div class="card mb-4">
      <div class="card-header custom-card-header text-white">
        <h2 class="h4">Toolbox</h2>
      </div>
      <div class="card-body toolbox-content">
        <div v-for="block in blocks" :key="block.id" class="toolbox-item">
          <component 
            :is="getBlockComponent(block.type)"
            :block="block"
            :isInWorkspace="false"
          />
        </div>
      </div>
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
  background: linear-gradient(to bottom right, #e0c3fc, #8ec5fc);
  width: 250px;
  height: 100%;
  overflow-y: auto;
  border-right: 3px solid #ffffff; /* Added right border */
  box-shadow: 3px 0 5px rgba(0, 0, 0, 0.1); /* Optional: adds a shadow for depth */

}

.toolbox-content {
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

.h4 {
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