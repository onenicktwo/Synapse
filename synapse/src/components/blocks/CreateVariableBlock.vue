<template>
  <base-block :block="block" :isInWorkspace="isInWorkspace" @remove="$emit('remove')">
    <template #text-input>
      <div class="block-input">
        <input 
          type="text" 
          v-model="variableName" 
          placeholder="Variable Name"
          @input="updateBlock"
        >
        <input 
          type="number" 
          v-model.number="variableValue" 
          placeholder="Variable Value"
          @input="updateBlock"
        >
      </div>
    </template>
  </base-block>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import BaseBlock from './PrintBlockTemplate.vue';
import { Block } from './types';

export default defineComponent({
  name: 'CreateVariableBlock',
  components: {
    BaseBlock
  },
  props: {
    block: {
      type: Object as PropType<Block>,
      required: true
    },
    isInWorkspace: {
      type: Boolean,
      default: false
    }
  },
  emits: ['remove', 'update'],
  data() {
    return {
      variableName: this.block.inputs[0].default || '',
      variableValue: this.block.inputs[1].default || 0
    };
  },
  methods: {
    updateBlock() {
      this.$emit('update', {
        ...this.block,
        inputs: [
          {
            ...this.block.inputs[0],
            default: this.variableName
          },
          {
            ...this.block.inputs[1],
            default: this.variableValue.toString()
          }
        ]
      });
    }
  }
});
</script>

<style scoped>
.block-input {
  display: flex;
  flex-direction: column;
}
.block-input input {
  width: 100%;
  padding: 5px;
  margin-bottom: 5px;
  border: none;
  border-radius: 3px;
}
</style>