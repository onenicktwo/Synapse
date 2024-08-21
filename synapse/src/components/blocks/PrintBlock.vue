<template>
  <print-block-template 
    :block="block" 
    :isInWorkspace="isInWorkspace" 
    @remove="$emit('remove')"
  >
    <template #text-input>
      <div class="block-input-container">
        <div class="input-container" :class="{ 'has-block': nestedBlock }">
          <component
            v-if="nestedBlock"
            :key="nestedBlock.id"
            :is="components[getBlockComponent(nestedBlock.type)]"
            :block="nestedBlock"
            :isInWorkspace="true" 
            @remove="removeNestedBlock"
            @update="updateNestedBlock"
            draggable="true"
            @dragstart.stop="handleInputDragStart"
          />
          <div v-else class="block-input" @drop.stop="handleInputDrop" @dragover.prevent>
            <input 
              type="text" 
              v-model="inputValue" 
              :placeholder="block.inputs[0].name"
              @input="updateBlock"
            >
          </div>
        </div>
      </div>
    </template>
  </print-block-template>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import PrintBlockTemplate from './PrintBlockTemplate.vue';
import { blockComponents, PrintBlock as PrintBlockType } from './types'; 
import { Block } from './types'; 
import { getBlockComponent } from '../blockUtils'; 

export default defineComponent({
  name: 'PrintBlock', 
  components: {
    PrintBlockTemplate 
  },
  props: {
    block: {
      type: Object as PropType<PrintBlockType>,
      required: true
    },
    isInWorkspace: {
      type: Boolean,
      default: false
    },
    isNested: {
      type: Boolean,
      default: false
    },
  },
  emits: ['remove', 'update'],
  setup(props, { emit }) {
    const components = computed(() => blockComponents);
    const inputValue = ref(props.block.inputs[0].default || '');
    const nestedBlock = ref<Block | null>(props.block.nestedBlock || null);

const allowedInputBlocks = ['variable', 'parameter', 'functionGetter'];

    const updateBlock = () => {
      const updatedBlock: PrintBlockType = {
        ...props.block,
        inputs: [
          {
            ...props.block.inputs[0],
            default: inputValue.value
          }
        ],
        nestedBlock: nestedBlock.value
      };
      emit('update', updatedBlock);
    };

    const removeNestedBlock = () => {
      nestedBlock.value = null;
      updateBlock();
    };

    const updateNestedBlock = (updatedBlock: Block) => {
      nestedBlock.value = updatedBlock;
      updateBlock();
    };

    const handleInputDrop = (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.dataTransfer) {
        const blockData = JSON.parse(event.dataTransfer.getData('text/plain')) as Block;
        if (allowedInputBlocks.includes(blockData.type)) { 
          const newBlock: Block = {
            ...blockData,
            id: Date.now().toString()
          };
          nestedBlock.value = newBlock;
          updateBlock();
        }
      }
    };

    const handleInputDragStart = (event: DragEvent) => {
      if (nestedBlock.value) {
        event.dataTransfer?.setData('text/plain', JSON.stringify(nestedBlock.value));
        event.dataTransfer!.effectAllowed = 'copy'; 
      }
    };

    return {
      inputValue,
      nestedBlock,
      components,
      getBlockComponent,
      removeNestedBlock,
      updateNestedBlock,
      handleInputDrop,
      handleInputDragStart,
      updateBlock
    };
  }
});
</script>

<style scoped>
/* Container for the PrintBlock component */
.print-block-container {
  display: flex;
  flex-direction: column; /* Stacks children vertically */
  width: 100%; /* Ensures it takes full width */
  box-sizing: border-box; /* Includes padding and border in element's total width and height */
}

/* Styling for the input container within the PrintBlock */
.block-input-container,
.input-container {
  display: flex;
  flex-direction: column; /* Allows vertical stacking */
  align-items: stretch; /* Stretches items to fill container width */
  width: 100%; /* Ensures it takes full width */
}

.input-container {
  min-height: 30px;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  padding: 5px;
  display: flex;
  flex-direction: column; /* Allows vertical stacking */
  align-items: stretch; /* Ensures content fills container width */
  overflow: auto; /* Allows scrolling if content overflows */
  background-color: rgba(255, 255, 255, 0.1); 
}

.input-container.has-block {
  width: 100%;
  border: none; 
  overflow: visible; /* Ensures nested block is fully visible */
}

.block-input {
  width: 100%;
  display: flex;
  flex-direction: column; /* Stacks input and nested block vertically */
  align-items: stretch; /* Ensures children stretch to fit container */
}

.block-input input {
  width: 100%;
  padding: 5px;
  border: none;
  border-radius: 3px;
  background-color: transparent; 
  color: white; 
}

.block-input input::placeholder {
  color: rgba(255, 255, 255, 0.7); 
}

/* Styling for nested blocks */
.math-block, .print-block {
  flex-shrink: 0; /* Prevents block from shrinking */
  box-sizing: border-box;
  overflow: visible; /* Ensures block is not clipped */
  width: 100%; /* Ensures it stretches to fill parent width */
}

</style>
