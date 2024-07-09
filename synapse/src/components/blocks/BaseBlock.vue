<template>
    <div 
      class="block"
      :class="blockClass"
      :style="{ backgroundColor: block.color }"
      draggable="true"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
    >
      <div class="block-label">{{ block.label }}</div>
      <slot></slot>
      <button v-if="isInWorkspace" @click="$emit('remove')" class="remove-btn">X</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BaseBlock',
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
    computed: {
      blockClass() {
        return `${this.block.type}-block`;
      }
    },
    methods: {
      onDragStart(event) {
        event.dataTransfer.setData('text/plain', JSON.stringify(this.block));
        event.dataTransfer.effectAllowed = 'copy';
      },
      //onDragEnd(event) {
      //  // Clean up any necessary drag end operations
      //}
    }
  }
  </script>
  
  <style scoped>
  .block {
    width: 150px;
    padding: 10px;
    border-radius: 5px;
    cursor: move;
    position: relative;
  }
  
  .block-label {
    font-weight: bold;
    margin-bottom: 5px;
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