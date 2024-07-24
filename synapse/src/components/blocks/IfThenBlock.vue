<template>
  <if-then-block-template
    :block="block"
    :isInWorkspace="isInWorkspace"
    @remove="$emit('remove')"
    @drop="handleNestedDrop"
    @conditionDrop="handleConditionDrop"
    @dragstart="handleDragStart"
  >
    <template #condition-input>
      <component
        v-for="conditionBlock in conditionBlocks"
        :key="conditionBlock.id"
        :is="getBlockComponent(conditionBlock.type)"
        :block="conditionBlock"
        :isInWorkspace="true"
        @remove="removeConditionBlock(conditionBlock.id)"
        @update="updateConditionBlock"
        draggable="true"
        @dragstart.stop="(event: DragEvent) => handleNestedDragStart(event, conditionBlock)"
      />
    </template>
    <template #then-blocks>
      <component
        v-for="nestedBlock in thenBlocks"
        :key="nestedBlock.id"
        :is="getBlockComponent(nestedBlock.type)"
        :block="nestedBlock"
        :isInWorkspace="true"
        @remove="removeNestedBlock(nestedBlock.id)"
        @update="updateNestedBlock"
        draggable="true"
        @dragstart.stop="(event: DragEvent) => handleNestedDragStart(event, nestedBlock)"
      />
    </template>
  </if-then-block-template>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { Block, IfThenBlock as IfThenBlockType } from './types';
import IfThenBlockTemplate from './IfThenBlockTemplate.vue';
import { getBlockComponent } from '../blockUtils';
import PrintBlock from './PrintBlock.vue';
import ChangeVariableBlock from './ChangeVariableBlock.vue';
import CreateVariableBlock from './CreateVariableBlock.vue';

export default defineComponent({
  name: 'IfThenBlock',
  components: {
    IfThenBlockTemplate,
    PrintBlock,
    ChangeVariableBlock,
    CreateVariableBlock
  },
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
    const conditionBlocks = ref<Block[]>(props.block.conditionBlocks || []);
    const thenBlocks = ref<Block[]>(props.block.thenBlocks || []);

    const allowedNestedBlocks = ['print', 'ifThen', 'changeVariable', 'createVariable'];
    const allowedConditionBlocks = ['print'];

    const updateBlock = () => {
      const updatedBlock: IfThenBlockType = {
        ...props.block,
        conditionBlocks: conditionBlocks.value,
        thenBlocks: thenBlocks.value
      };
      emit('update', updatedBlock);
    };

    const removeConditionBlock = (id: string) => {
      conditionBlocks.value = conditionBlocks.value.filter(block => block.id !== id);
      updateBlock();
    };

    const removeNestedBlock = (id: string) => {
      thenBlocks.value = thenBlocks.value.filter(block => block.id !== id);
      updateBlock();
    };


    const updateConditionBlock = (updatedBlock: Block) => {
      const index = conditionBlocks.value.findIndex(block => block.id === updatedBlock.id);
      if (index !== -1) {
        conditionBlocks.value[index] = updatedBlock;
        updateBlock();
      }
    };

    const updateNestedBlock = (updatedBlock: Block) => {
      const index = thenBlocks.value.findIndex(block => block.id === updatedBlock.id);
      if (index !== -1) {
        thenBlocks.value[index] = updatedBlock;
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
      conditionBlocks.value = [newBlock]; // Replace existing condition block
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

    const handleNestedDragStart = (event: DragEvent, block: Block) => {
      event.stopPropagation();
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', JSON.stringify(block));
        event.dataTransfer.effectAllowed = 'copy';
      }
    };

    const handleDragStart = (event: DragEvent) => {
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', JSON.stringify(props.block));
        event.dataTransfer.effectAllowed = 'copy';
      }
    };

    return {
      conditionBlocks,
      thenBlocks,
      updateBlock,
      getBlockComponent,
      removeConditionBlock,
      updateConditionBlock,
      removeNestedBlock,
      updateNestedBlock,
      handleConditionDrop,
      handleNestedDrop,
      handleNestedDragStart,
      handleDragStart
    };
  }
});
</script>

<style scoped>
.condition-blocks {
  min-height: 30px;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  padding: 5px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder {
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
}
</style>