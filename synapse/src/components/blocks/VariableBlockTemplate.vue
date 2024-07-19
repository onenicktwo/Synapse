<template>
    <div 
      class="block variable-block"
      :style="{ backgroundColor: block.color }"
      draggable="true"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
    >
      <div class="block-label">{{ block.label }}</div>
      <div class="block-content">
        <slot name="number-input"></slot>
      </div>
      <button v-if="isInWorkspace" @click="$emit('remove')" class="remove-btn">X</button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { Block } from './types';
  
  export default defineComponent({
    name: 'VariableBlockTemplate',
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
    emits: ['remove'],
    methods: {
      onDragStart(event: DragEvent) {
        if (event.dataTransfer) {
          event.dataTransfer.setData('text/plain', JSON.stringify(this.block));
          event.dataTransfer.effectAllowed = 'copy';
        }
      },
      onDragEnd(event: DragEvent) {
        console.log('Drag ended at:', event.clientX, event.clientY);
      }
    }
  });
  </script>
  
  <style scoped>
  .variable-block {
    width: 200px;
    padding: 10px;
    border-radius: 5px;
    cursor: move;
    position: relative;
    margin-bottom: 10px;
  }
  
  .block-label {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .block-content {
    display: flex;
    flex-direction: column;
  }
  
  .remove-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    background: none;
    border: none;
    cursor: pointer;
    font-weight: bold;
    color: #ff0000;
  }
  </style>
  