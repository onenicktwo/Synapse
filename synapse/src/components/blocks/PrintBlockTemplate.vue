<template>
  <div 
    class="block base-block"
    :class="{ 'in-toolbox': !isInWorkspace, 'in-workspace': isInWorkspace }"
    :style="{ backgroundColor: block.color }"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <slot name="preview" v-if="!isInWorkspace"></slot>
    <template v-else>
      <div class="block-label">{{ block.label }}</div>
      <div class="block-content">
        <slot name="content"></slot>
      </div>
      <button v-if="isInWorkspace" @click="$emit('remove')" class="remove-btn">X</button>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Block } from './types';

export default defineComponent({
  name: 'BaseBlock',
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
.base-block {
  width: 200px;
  padding: 10px;
  border-radius: 5px;
  cursor: move;
  position: relative;
  margin-bottom: 10px;
}

.in-toolbox {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
}

.in-workspace {
  display: flex;
  flex-direction: column;
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