<template>
  <div
    class="parameter-block"
    :style="{ backgroundColor: block.color }"
    draggable="true"
    @dragstart="onDragStart"
    @drag="onDrag"
  >
    <span class="block-name">{{ block.name }}</span>
    <button v-if="isInWorkspace" @click="$emit('remove')" class="remove-btn">
      X
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ParameterBlock as ParameterBlockType } from './types';

export default defineComponent({
  name: 'ParameterBlock',
  props: {
    block: {
      type: Object as PropType<ParameterBlockType>,
      required: true,
    },
    isInWorkspace: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['dragstart', 'drag', 'remove'],
  setup(props, { emit }) {
    const onDragStart = (event: DragEvent) => {
      if (event.dataTransfer) {
        event.dataTransfer.setData('application/json', JSON.stringify(props.block));
        event.dataTransfer.effectAllowed = 'move';
        emit('dragstart', event);
      }
    };

    const onDrag = (event: DragEvent) => {
      emit('drag', event);
    };

    return {
      onDragStart,
      onDrag,
    };
  },
});
</script>

<style scoped>
.parameter-block {
  width: 100%;
  max-width: 200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-radius: 5px;
  cursor: move;
  position: relative;
  margin-bottom: 10px;
}

.block-name {
  font-weight: bold;
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: #ff0000;
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>