<template>
  <base-block :block="block" :isInWorkspace="isInWorkspace" @remove="$emit('remove')">
    <template #text-input>
      <div class="block-input">
        <input 
          type="text" 
          v-model="inputValue" 
          :placeholder="block.inputs[0].name"
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
  name: 'PrintBlock',
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
      inputValue: this.block.inputs[0].default || ''
    };
  },
  methods: {
    updateBlock() {
      this.$emit('update', {
        ...this.block,
        inputs: [
          {
            ...this.block.inputs[0],
            default: this.inputValue
          }
        ]
      });
    }
  }
});
</script>

<style scoped>
.block-input input {
  width: 100%;
  padding: 5px;
  border: none;
  border-radius: 3px;
}
</style>