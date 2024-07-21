<template>
  <if-then-block-template
    :block="block"
    :isInWorkspace="isInWorkspace"
    @remove="$emit('remove')"
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
      />
    </template>
  </if-then-block-template>
</template>
  
  <script lang="ts">
  import { defineComponent, PropType, ref } from 'vue';
  import { IfThenBlock as IfThenBlockType, BlockTypes } from './types';
  import IfThenBlockTemplate from './IfThenBlockTemplate.vue';
  
  export default defineComponent({
    name: 'IfThenBlock',
    components: {
      IfThenBlockTemplate,
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
      const thenBlocks = ref<BlockTypes[]>(props.block.thenBlocks || []);
  
      const updateBlock = () => {
        const updatedBlock: IfThenBlockType = {
          ...props.block,
          inputs: [{ name: 'condition', type: 'string', default: condition.value }],
          thenBlocks: thenBlocks.value
        };
        emit('update', updatedBlock);
      };
  
      const getBlockComponent = (type: string): string => {
        switch (type) {
          case 'print': return 'PrintBlock';
          case 'ifThen': return 'IfThenBlock';
          default: return 'UnknownBlock';
        }
      };
  
      const removeNestedBlock = (id: string) => {
        thenBlocks.value = thenBlocks.value.filter(block => block.id !== id);
        updateBlock();
      };
  
      const updateNestedBlock = (updatedBlock: BlockTypes) => {
        const index = thenBlocks.value.findIndex(block => block.id === updatedBlock.id);
        if (index !== -1) {
          thenBlocks.value[index] = updatedBlock;
          updateBlock();
        }
      };
  
      return {
        condition,
        thenBlocks,
        updateBlock,
        getBlockComponent,
        removeNestedBlock,
        updateNestedBlock
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