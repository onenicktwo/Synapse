<template>
  <div 
    class="function-getter-block"
    :style="{ backgroundColor: block.color }"
    draggable="true"
    @dragstart="onDragStart"
  >
    <div class="function-title">Function Call</div>
    <select v-model="selectedFunctionId" @change="updateFunction">
      <option value="">Select a function</option>
      <option v-for="func in functions" :key="func.id" :value="func.id">
        {{ func.name }}
      </option>
    </select>

    <div v-if="selectedFunction"> 
      <div
        v-for="(param, index) in selectedFunction.parameters"
        :key="index"
        class="parameter-input"
      >
        <label>{{ param.name }}:</label>
        <div class="input-container" :class="{ 'has-block': nestedBlocks[index] }">
          <component
            v-if="nestedBlocks[index]"
            :key="nestedBlocks[index].id"
            :is="components[getBlockComponent(nestedBlocks[index].type)]"
            :block="nestedBlocks[index]"
            :isInWorkspace="true"
            @remove="() => removeNestedBlock(index)"
            @update="(updatedBlock: Block) => updateNestedBlock(index, updatedBlock)"
            draggable="true"
            @dragstart.stop="(event: DragEvent) => handleInputDragStart(event, index)"
          />
          <div v-else class="block-input" @drop.stop="(event) => handleInputDrop(event, index)" @dragover.prevent>
            <input
              type="text"
              v-model="parameterValues[index]"
              @input="updateFunction"
              :placeholder="param.name"
            >
          </div>
        </div>
      </div>
      <div class="return-value" v-if="selectedFunction.hasReturn">
        <label>Returns a value</label>
      </div>
    </div>

    <button v-if="isInWorkspace" @click="$emit('remove')" class="remove-btn">
      X
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType, watch } from 'vue';
import { useStore } from 'vuex';
import { FunctionBlock, FunctionGetterBlock as FunctionGetterBlockType, Block } from './types';
import { blockComponents } from './types';
import { getBlockComponent } from '../blockUtils';

export default defineComponent({
  name: 'FunctionGetterBlock',
  props: {
    block: {
      type: Object as PropType<FunctionGetterBlockType>,
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
    const store = useStore();
    const selectedFunctionId = ref(props.block.functionId || '');
    const functions = computed(() => store.getters['functions/getAllFunctions']);
    const parameterValues = ref<string[]>(props.block.parameterValues || []);
    const nestedBlocks = ref<(Block | null)[]>(props.block.nestedBlocks || []);
    const components = computed(() => blockComponents);

    const selectedFunction = computed((): FunctionBlock | undefined => {
      if (selectedFunctionId.value) {
        return functions.value.find((f: { id: string; }) => f.id === selectedFunctionId.value);
      }
      return undefined;
    });

    watch(selectedFunction, (newFunction) => {
      if (newFunction) {
        parameterValues.value = newFunction.parameters.map(() => '');
        nestedBlocks.value = newFunction.parameters.map(() => null);
      } else {
        parameterValues.value = [];
        nestedBlocks.value = [];
      }
    });

    const updateFunction = () => {
      if (selectedFunction.value) {
        const validParameterValues = parameterValues.value.map(value => 
          value === '' ? '' : Number(value)
        ).slice(0, selectedFunction.value.parameters.length);
        
        emit('update', {
          ...props.block,
          functionId: selectedFunction.value.id,
          parameterValues: validParameterValues,
          nestedBlocks: nestedBlocks.value,
          hasReturn: selectedFunction.value.hasReturn,
        });
      }
    };

    const onDragStart = (event: DragEvent) => {
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', JSON.stringify(props.block));
      }
    };

    const removeNestedBlock = (index: number) => {
      nestedBlocks.value[index] = null;
      updateFunction();
    };

    const updateNestedBlock = (index: number, updatedBlock: Block) => {
      nestedBlocks.value[index] = updatedBlock;
      updateFunction();
    };

    const handleInputDrop = (event: DragEvent, index: number) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.dataTransfer) {
        const blockData = JSON.parse(event.dataTransfer.getData('text/plain')) as Block;
        if (['variable', 'parameter', 'mathOperator', 'functionGetter'].includes(blockData.type)) {
          const newBlock: Block = {
            ...blockData,
            id: Date.now().toString()
          };
          nestedBlocks.value[index] = newBlock;
          updateFunction();
        }
      }
    };

    const handleInputDragStart = (event: DragEvent, index: number) => {
      if (nestedBlocks.value[index]) {
        event.dataTransfer?.setData('text/plain', JSON.stringify(nestedBlocks.value[index]));
        event.dataTransfer!.effectAllowed = 'copy';
      }
    };

    return {
      selectedFunctionId,
      functions,
      parameterValues,
      selectedFunction,
      nestedBlocks,
      components,
      getBlockComponent,
      updateFunction,
      onDragStart,
      removeNestedBlock,
      updateNestedBlock,
      handleInputDrop,
      handleInputDragStart,
    };
  },
});
</script>

<style scoped>
.return-value {
  margin-top: 10px;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.return-value label {
  font-weight: bold;
}

.return-value .input-container {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 5px;
  border-radius: 3px;
}

.function-getter-block {
  width: 100%;
  max-width: 200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
  border-radius: 5px;
  cursor: move;
  position: relative;
  margin-bottom: 10px;
}

.function-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.function-getter-block select {
  margin: 5px 0;
  padding: 5px;
  border: none;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.2);
  color: black;
  width: 100%;
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

:deep(.input-container) .function-getter-block {
  width: 100%;
  max-width: none;
}

:deep(.input-container) .function-getter-block select {
  width: 100%;
}

.input-container {
  min-height: 30px;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  padding: 5px;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.1);
}

.input-container.has-block {
  width: 100%;
  border: none;
}

.block-input {
  width: 100%;
  display: flex;
  align-items: center;
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
</style>