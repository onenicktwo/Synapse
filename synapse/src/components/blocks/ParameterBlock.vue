<template>
  <div
    class="parameter-block"
    :style="{ backgroundColor: block.color }"
    draggable="true"
    @dragstart="onDragStart"
    @drag="onDrag"
  >
    <span>{{ block.name }}</span>
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
  },
  emits: ['dragstart', 'drag'],
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
  display: inline-flex;
  align-items: center;
  padding: 5px;
  border-radius: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
  cursor: move;
  user-select: none; /* Prevent text selection during drag */
}
</style>