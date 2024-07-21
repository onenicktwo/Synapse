<template>
  <div
    class="block if-then-block"
    :style="{ backgroundColor: block.color }"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="block-label">
      <span>If</span>
      <slot name="condition-input"></slot>
    </div>
    <div class="block-content">
      <div class="then-section">
        <div class="then-label">then</div>
        <div class="nested-blocks" @dragover.prevent @drop="onDrop">
          <slot name="then-blocks"></slot>
        </div>
      </div>
    </div>
    <button v-if="isInWorkspace" @click="$emit('remove')" class="remove-btn">X</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IfThenBlock } from './types';

export default defineComponent({
  name: 'IfThenBlockTemplate',
  props: {
    block: {
      type: Object as PropType<IfThenBlock>,
      required: true,
    },
    isInWorkspace: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['remove', 'drop'],
  methods: {
    onDragStart(event: DragEvent) {
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', JSON.stringify(this.block));
        event.dataTransfer.effectAllowed = 'copy';
      }
    },
    onDragEnd(event: DragEvent) {
      console.log('Drag ended at:', event.clientX, event.clientY);
    },
    onDrop(event: DragEvent) {
      this.$emit('drop', event);
    },
  },
});
</script>

<style scoped>
.if-then-block {
  width: 200px;
  padding: 10px;
  border-radius: 5px;
  cursor: move;
  position: relative;
  margin-bottom: 10px;
}

.block-label {
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-bottom: 5px;
}

.block-label span {
  margin-right: 10px;
}

.then-section {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  padding: 10px;
}

.then-label {
  font-weight: bold;
  margin-bottom: 5px;
}

.nested-blocks {
  min-height: 30px;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  padding: 5px;
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