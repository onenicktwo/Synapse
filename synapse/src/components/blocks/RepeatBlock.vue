<template>
  <div
    class="repeat-block"
    :class="{ 'in-toolbox': !isInWorkspace, 'in-workspace': isInWorkspace }"
    draggable="true"
    @dragstart="handleDragStart"
  >
    <div v-if="!isInWorkspace" class="toolbox-preview">
      Repeat...
    </div>
    <template v-else>
      <div
        class="block-container"
        @dragstart="onDragStart"
        @dragend="onDragEnd"
      >
        <div class="block-label">
          <span>Repeat</span>
          <input
            v-model.number="repeatCount"
            type="number"
            min="1"
            class="repeat-input"
            @input="updateRepeatCount"
          />
          <span>times</span>
        </div>
        <div class="nested-blocks-container">
          <div
            class="nested-blocks"
            ref="nestedBlocksContainer"
            @dragover.prevent
            @drop.stop="onDrop"
          >
            <component
              v-for="nestedBlock in nestedBlocks"
              :key="nestedBlock.id"
              :is="components[getBlockComponent(nestedBlock.type)]"
              :block="nestedBlock"
              :isInWorkspace="isInWorkspace"
              @remove="removeNestedBlock(nestedBlock.id)"
              @update="updateNestedBlock"
              draggable="true"
              @dragstart.stop="(event: DragEvent) => handleNestedDragStart(event, nestedBlock)"
            />
            <div
              v-if="nestedBlocks.length === 0"
              class="placeholder"
              @drop.stop="onDrop"
              @dragover.prevent
            >
              Drop blocks here
            </div>
          </div>
        </div>
        <button v-if="isInWorkspace" @click="$emit('remove')" class="remove-btn">
          X
        </button>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted } from 'vue';
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

    const allowedNestedBlocks = ['print', 'ifThen', 'createVariable', 'variable', 'repeat', 'functionGetter'];

    onMounted(() => {
      if (nestedBlocksContainer.value) {
        const resizeObserver = new ResizeObserver(() => {
          nestedBlocksContainer.value!.style.height = 'auto';
        });

        resizeObserver.observe(nestedBlocksContainer.value);
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

    const handleDragStart = (event: DragEvent) => {
      if (!props.isInWorkspace) {
        if (event.dataTransfer) {
          event.dataTransfer.setData('text/plain', JSON.stringify(props.block));
          event.dataTransfer.effectAllowed = 'copy';
        }
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
      handleDragStart,
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
  display: inline-block;
  cursor: move;
  position: relative;
  margin-bottom: 10px;
}

.in-toolbox,
.block-container {
  padding: 5px 10px;
  border-radius: 5px;
  background-color: purple;
  color: #fff;
}

.toolbox-preview {
  font-weight: bold;
}

.repeat-count {
  color: #fff;
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

.nested-blocks-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 5px;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 5px;
}

.nested-blocks {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.placeholder {
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
  text-align: center;
  padding: 5px;
  border: 1px dashed rgba(255, 255, 255, 0.5);
  border-radius: 3px;
  cursor: pointer;
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