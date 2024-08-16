<template>
  <div
    class="return-block"
    :style="{ backgroundColor: block.color }"
    draggable="true"
    @dragstart="onDragStart"
  >
    <span class="block-title">Return</span>
    <div
      class="value-container"
      @dragover.prevent
      @drop.stop="onValueDrop"
    >
      <component
        v-if="valueBlock"
        :is="components[getBlockComponent(valueBlock.type)]"
        :block="valueBlock"
        :isInWorkspace="true"
        @remove="removeValueBlock"
        @update="updateValueBlock"
        draggable="true"
        @dragstart.stop="handleValueDragStart"
      />
      <div v-else class="value-placeholder">
        Drop value block here
      </div>
    </div>
    <button v-if="isInWorkspace" @click="$emit('remove')" class="remove-btn">
      X
    </button>
  </div>
</template>
  
  <script lang="ts">
  import { defineComponent, PropType, ref } from 'vue';
  import { ReturnBlock, Block, blockComponents } from './types';
  import { getBlockComponent } from '../blockUtils';
  
  export default defineComponent({
  name: 'ReturnBlock',
  props: {
    block: {
      type: Object as PropType<ReturnBlock>,
      required: true,
    },
    isInWorkspace: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['remove', 'update'],
  setup(props, { emit }) {
    const valueBlock = ref<Block | null>(props.block.valueBlock);
    const components = blockComponents;

    const onDragStart = (event: DragEvent) => {
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', JSON.stringify(props.block));
        event.dataTransfer.effectAllowed = 'move';
      }
    };

    const onValueDrop = (event: DragEvent) => {
      event.preventDefault();
      const blockData = JSON.parse(event.dataTransfer?.getData('text/plain') || '{}');
      if (['variable', 'mathOperator', 'functionGetter'].includes(blockData.type)) {
        valueBlock.value = blockData;
        updateBlock();
      }
    };

    const removeValueBlock = () => {
      valueBlock.value = null;
      updateBlock();
    };

    const updateValueBlock = (updatedBlock: Block) => {
      valueBlock.value = updatedBlock;
      updateBlock();
    };

    const handleValueDragStart = (event: DragEvent) => {
      event.stopPropagation();
      if (event.dataTransfer && valueBlock.value) {
        event.dataTransfer.setData('text/plain', JSON.stringify(valueBlock.value));
        event.dataTransfer.effectAllowed = 'move';
      }
    };

    const updateBlock = () => {
      emit('update', {
        ...props.block,
        valueBlock: valueBlock.value,
      });
    };

    return {
      valueBlock,
      components,
      getBlockComponent,
      onDragStart,
      onValueDrop,
      removeValueBlock,
      updateValueBlock,
      handleValueDragStart,
    };
  },
});
</script>

<style scoped>
.return-block {
  padding: 10px;
  border-radius: 5px;
  cursor: move;
  position: relative;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  background-color: #FF4500;
  color: white;
}

.block-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.value-container {
  min-height: 30px;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  padding: 5px;
}

.value-placeholder {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
  padding: 5px;
}

.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  color: white;
  font-weight: bold;
  cursor: pointer;
}
</style>