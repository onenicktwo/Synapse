<!-- src/components/blocks/PrintBlock.vue -->

<template>
    <base-block :block="block" :isInWorkspace="isInWorkspace" @remove="$emit('remove')">
      <div class="block-input">
        <input 
          type="text" 
          v-model="inputValue" 
          :placeholder="block.inputs[0].name"
          @input="updateBlock"
        >
      </div>
    </base-block>
  </template>
  
  <script>
  import BaseBlock from './BaseBlock.vue';
  
  export default {
    name: 'PrintBlock',
    components: {
      BaseBlock
    },
    props: {
      block: {
        type: Object,
        required: true
      },
      isInWorkspace: {
        type: Boolean,
        default: false
      }
    },
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
  };
  </script>
  
  <style scoped>
  .block-input input {
    width: 100%;
    padding: 5px;
    border: none;
    border-radius: 3px;
  }
  </style>