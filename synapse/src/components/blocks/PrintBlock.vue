<template>
  <print-block-template 
    :block="block" 
    :isInWorkspace="isInWorkspace" 
    @remove="$emit('remove')"
  >
    <template #preview v-if="!isInWorkspace">
      <div class="toolbox-preview">Print</div>
    </template>
    <template #content v-else>
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

    const allowedInputBlocks = ['variable', 'parameter', 'functionGetter', 'invokeMethod'];

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
.print-block-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}

.block-input-container,
.input-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
}

.input-container {
  min-height: 30px;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: auto;
  background-color: rgba(255, 255, 255, 0.1); 
}

.input-container.has-block {
  width: 100%;
  border: none; 
  overflow: visible;
}

.block-input {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
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

.math-block, .print-block {
  flex-shrink: 0;
  box-sizing: border-box;
  overflow: visible;
  width: 100%;
}

.toolbox-preview {
  font-weight: bold;
  color: white;
}
</style>