<template>
  <div
    class="if-then-block"
    :class="{ 'in-toolbox': !isInWorkspace, 'in-workspace': isInWorkspace }"
    draggable="true"
    @dragstart="handleDragStart"
  >
    <div class="block-title">If-Then-Else</div>
    <div v-if="!isInWorkspace" class="toolbox-preview">
      If (condition) Then ... Else ...
    </div>
    <template v-else>
      <div class="area-container">
        <div class="condition-area">
          <component
            v-if="conditionBlock"
            :key="conditionBlock.id"
            :is="components[getBlockComponent(conditionBlock.type)]"
            :block="conditionBlock"
            :isInWorkspace="true"
            @remove="removeConditionBlock"
            @update="updateConditionBlock"
          />
          <div v-else class="placeholder" @drop.stop="handleConditionDrop" @dragover.prevent>
            Drop condition here
          </div>
        </div>
      </div>
      <div class="area-container">
        <div class="then-area">
          <div class="then-label">Then</div>
          <div class="nested-blocks-container">
            <component
              v-for="nestedBlock in thenBlocks"
              :key="nestedBlock.id"
              :is="components[getBlockComponent(nestedBlock.type)]"
              :block="nestedBlock"
              :isInWorkspace="true"
              @remove="removeNestedBlock(nestedBlock.id)"
              @update="updateNestedBlock"
            />
            <div v-if="thenBlocks.length === 0" class="placeholder" @drop.stop="handleNestedDrop" @dragover.prevent>
              Drop blocks here
            </div>
          </div>
        </div>
      </div>
      <div class="area-container">
        <div class="else-area">
          <div class="else-label">Else</div>
          <div class="nested-blocks-container">
            <component
              v-for="elseBlock in elseBlocks"
              :key="elseBlock.id"
              :is="components[getBlockComponent(elseBlock.type)]"
              :block="elseBlock"
              :isInWorkspace="true"
              @remove="removeElseBlock(elseBlock.id)"
              @update="updateElseBlock"
            />
            <div v-if="elseBlocks.length === 0" class="placeholder" @drop.stop="handleElseDrop" @dragover.prevent>
              Drop blocks here
            </div>
          </div>
        </div>
      </div>
    </template>
    <button v-if="isInWorkspace" @click="$emit('remove')" class="remove-btn">X</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed } from 'vue';
import { Block, IfThenBlock as IfThenBlockType, blockComponents } from './types';
import { getBlockComponent } from '../blockUtils';

export default defineComponent({
  name: 'IfThenBlock',
  props: {
    block: {
      type: Object as PropType<IfThenBlockType>,
      required: true,
    },
    isInWorkspace: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['remove', 'update'],
  setup(props, { emit }) {
    const components = computed(() => blockComponents);
    const conditionBlock = ref<Block | null>(props.block.conditionBlock || null);
    const thenBlocks = ref<Block[]>(props.block.thenBlocks || []);
    const elseBlocks = ref<Block[]>(props.block.elseBlocks || []);
    
    const allowedNestedBlocks = ['print', 'ifThen', 'createVariable', 'variable', 'repeat', 'mathOperator'];
    const allowedConditionBlocks = ['compareOperator', 'compareLogic', 'variable'];

    const updateBlock = () => {
      const updatedBlock: IfThenBlockType = {
        ...props.block,
        conditionBlock: conditionBlock.value,
        thenBlocks: thenBlocks.value,
        elseBlocks: elseBlocks.value
      };
      emit('update', updatedBlock);
    };

    const removeConditionBlock = () => {
      conditionBlock.value = null;
      updateBlock();
    };

    const updateConditionBlock = (updatedBlock: Block) => {
      conditionBlock.value = updatedBlock;
      updateBlock();
    };

    const removeNestedBlock = (id: string) => {
      thenBlocks.value = thenBlocks.value.filter(block => block.id !== id);
      updateBlock();
    };

    const updateNestedBlock = (updatedBlock: Block) => {
      const index = thenBlocks.value.findIndex(block => block.id === updatedBlock.id);
      if (index !== -1) {
        thenBlocks.value[index] = updatedBlock;
        updateBlock();
      }
    };

    const removeElseBlock = (id: string) => {
      elseBlocks.value = elseBlocks.value.filter(block => block.id !== id);
      updateBlock();
    };

    const updateElseBlock = (updatedBlock: Block) => {
      const index = elseBlocks.value.findIndex(block => block.id === updatedBlock.id);
      if (index !== -1) {
        elseBlocks.value[index] = updatedBlock;
        updateBlock();
      }
    };

    const handleConditionDrop = (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.dataTransfer) {
        const blockData = JSON.parse(event.dataTransfer.getData('text/plain')) as Block;
        if (allowedConditionBlocks.includes(blockData.type)) {
          const newBlock: Block = {
            ...blockData,
            id: Date.now().toString()
          };
          conditionBlock.value = newBlock;
          updateBlock();
        }
      }
    };

    const handleNestedDrop = (event: DragEvent) => {
      event.stopPropagation();
      if (event.dataTransfer) {
        const blockData = JSON.parse(event.dataTransfer.getData('text/plain')) as Block;
        if (allowedNestedBlocks.includes(blockData.type)) {
          const newBlock: Block = {
            ...blockData,
            id: Date.now().toString()
          };
          thenBlocks.value.push(newBlock);
          updateBlock();
        }
      }
    };

    const handleElseDrop = (event: DragEvent) => {
      event.stopPropagation();
      if (event.dataTransfer) {
        const blockData = JSON.parse(event.dataTransfer.getData('text/plain')) as Block;
        if (allowedNestedBlocks.includes(blockData.type)) {
          const newBlock: Block = {
            ...blockData,
            id: Date.now().toString()
          };
          elseBlocks.value.push(newBlock);
          updateBlock();
        }
      }
    };

    const handleDragStart = (event: DragEvent) => {
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', JSON.stringify(props.block));
        event.dataTransfer.effectAllowed = 'copy';
      }
    };

    return {
      conditionBlock,
      thenBlocks,
      elseBlocks,
      components,
      getBlockComponent,
      removeConditionBlock,
      updateConditionBlock,
      removeNestedBlock,
      updateNestedBlock,
      removeElseBlock,
      updateElseBlock,
      handleConditionDrop,
      handleNestedDrop,
      handleElseDrop,
      handleDragStart,
    };
  }
});
</script>

<style scoped>
.if-then-block {
  padding: 10px;
  border-radius: 5px;
  cursor: move;
  position: relative;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: #6c5ce7;
  color: white;
}

.if-then-block.in-toolbox {
  width: 180px;
  font-size: 0.8em;
}

.if-then-block.in-workspace {
  width: auto;
  min-width: 250px;
  max-width: 100%;
  font-size: 1em;
}

.block-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.condition-area,
.then-area,
.else-area {
  margin-bottom: 15px;
}

.area-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.then-area,
.else-area {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.nested-blocks-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.then-area > *,
.else-area > * {
  width: 100%;
  margin-bottom: 10px;
}

.then-area > *:last-child,
.else-area > *:last-child {
  margin-bottom: 0;
}

.then-label,
.else-label {
  font-weight: bold;
  margin-bottom: 5px;
}

.placeholder {
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
  text-align: center;
  padding: 10px;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 5px;
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
  color: #ffffff;
}

/* Adjustments for toolbox */
.in-toolbox .condition-area,
.in-toolbox .then-area,
.in-toolbox .else-area {
  display: none;
}

.in-toolbox .block-title {
  font-size: 0.9em;
  margin-bottom: 5px;
}

.in-toolbox .toolbox-preview {
  font-size: 1em;
  padding: 3px;
  text-align: center;
}

.in-workspace .toolbox-preview {
  display: none;
}
</style>