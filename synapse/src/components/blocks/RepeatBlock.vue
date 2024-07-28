<template>
    <div
      class="block repeat-block"
      :style="{ backgroundColor: block.color }"
      draggable="true"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
    >
      <div class="block-label">
        <span>Repeat</span>
        <input
          v-model="repeatCount"
          type="number"
          min="1"
          class="repeat-input"
          @input="updateRepeatCount"
        />
        <span>times</span>
      </div>
      <div class="nested-blocks" ref="nestedBlocksContainer" @dragover.prevent @drop.stop="onDrop">
        <component
          v-for="nestedBlock in nestedBlocks"
          :key="nestedBlock.id"
          :is="components[getBlockComponent(nestedBlock.type)]"
          :block="nestedBlock"
          :isInWorkspace="true"
          @remove="removeNestedBlock(nestedBlock.id)"
          @update="updateNestedBlock"
          draggable="true"
          @dragstart.stop="(event: DragEvent) => handleNestedDragStart(event, nestedBlock)"
        />
      </div>
      <button v-if="isInWorkspace" @click="$emit('remove')" class="remove-btn">X</button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType, ref, onMounted} from 'vue';
  import { Block, blockComponents, RepeatBlock as RepeatBlockType } from './types';
  import { getBlockComponent } from '../blockUtils';

  export default defineComponent({
    name: 'RepeatBlock',
    props: {
      block: {
        type: Object as PropType<RepeatBlockType>,
        required: true,
      },
      isInWorkspace: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['remove', 'update'],
    setup(props, { emit }) {
    const components = blockComponents;
      const repeatCount = ref(props.block.repeatCount || 1);
      const nestedBlocks = ref<Block[]>(props.block.nestedBlocks || []);
      const nestedBlocksContainer = ref<HTMLElement | null>(null);
  
      const allowedNestedBlocks = ['print', 'ifThen', 'createVariable', 'variable', 'repeat'];
  
      onMounted(() => {
        if (nestedBlocksContainer.value) {
          const resizeObserver = new ResizeObserver(() => {
            nestedBlocksContainer.value!.style.height = 'auto';
          });
  
          nestedBlocksContainer.value.childNodes.forEach((childNode) => {
            resizeObserver.observe(childNode as HTMLElement);
          });
        }
      });
  
      const updateBlock = () => {
        const updatedBlock: RepeatBlockType = {
          ...props.block,
          repeatCount: repeatCount.value,
          nestedBlocks: nestedBlocks.value
        };
        emit('update', updatedBlock);
      };
  
      const updateRepeatCount = () => {
        updateBlock();
      };
  
      const removeNestedBlock = (id: string) => {
        nestedBlocks.value = nestedBlocks.value.filter(block => block.id !== id);
        updateBlock();
      };
  
      const updateNestedBlock = (updatedBlock: Block) => {
      const index = nestedBlocks.value.findIndex(block => block.id === updatedBlock.id);
      if (index !== -1) {
        nestedBlocks.value[index] = updatedBlock;
        updateBlock();
      }
    };

    const onDragStart = (event: DragEvent) => {
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', JSON.stringify(props.block));
        event.dataTransfer.effectAllowed = 'copy';
      }
    };

    const onDragEnd = (event: DragEvent) => {
      console.log('Drag ended at:', event.clientX, event.clientY);
    };

    const onDrop = (event: DragEvent) => {
      event.stopPropagation();
      if (event.dataTransfer) {
        const blockData = JSON.parse(event.dataTransfer.getData('text/plain')) as Block;
        if (allowedNestedBlocks.includes(blockData.type)) {
          const newBlock: Block = {
            ...blockData,
            id: Date.now().toString()
          };
          nestedBlocks.value.push(newBlock);
          updateBlock();
        }
      }
    };

    const handleNestedDragStart = (event: DragEvent, block: Block) => {
      event.stopPropagation();
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', JSON.stringify(block));
        event.dataTransfer.effectAllowed = 'copy';
      }
    };

    return {
      repeatCount,
      nestedBlocks,
      nestedBlocksContainer,
      getBlockComponent,
      updateRepeatCount,
      removeNestedBlock,
      updateNestedBlock,
      onDragStart,
      onDragEnd,
      onDrop,
      handleNestedDragStart,
      components
    };
  }
});
</script>

<style scoped>
.repeat-block {
  width: 200px;
  padding: 10px;
  border-radius: 5px;
  cursor: move;
  position: relative;
  margin-bottom: 10px;
  transition: height 0.3s ease;
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

.repeat-input {
  width: 50px;
  margin: 0 10px;
  padding: 2px 5px;
  border-radius: 3px;
  border: 1px solid #ccc;
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