<template>
  <if-then-block-template
    :block="block"
    :isInWorkspace="isInWorkspace"
    @remove="$emit('remove')"
    @drop="handleNestedDrop"
    @dragstart="handleDragStart"
  >
    <template #condition-input>
      <input
        v-model="condition"
        @input="updateBlock"
        placeholder="condition"
        class="condition-input"
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

export default defineComponent({
  name: 'IfThenBlock',
  components: {
    IfThenBlockTemplate,
    PrintBlock
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
    const condition = ref(
      props.block.inputs.find((input) => input.name === 'condition')?.default || ''
    );
    const thenBlocks = ref<Block[]>(props.block.thenBlocks || []);

    const allowedNestedBlocks = ['print', 'ifThen']; // Add other allowed block types here

    const updateBlock = () => {
      const updatedBlock: IfThenBlockType = {
        ...props.block,
        inputs: [{ name: 'condition', type: 'string', default: condition.value }],
        thenBlocks: thenBlocks.value
      };
      emit('update', updatedBlock);
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

    const handleNestedDrop = (event: DragEvent) => {
  event.stopPropagation(); // Prevent the event from bubbling up to the workspace
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
      event.stopPropagation(); // Prevent the parent block from being dragged
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
      condition,
      thenBlocks,
      updateBlock,
      getBlockComponent,
      removeNestedBlock,
      updateNestedBlock,
      handleNestedDrop,
      handleNestedDragStart,
      handleDragStart
    };
  }
});
</script>

<style scoped>
.condition-input {
  flex-grow: 1;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  min-width: 30px;   /* Ensure a minimum width for the input */
  /* Set an initial width that's not too large */ 
}
</style>