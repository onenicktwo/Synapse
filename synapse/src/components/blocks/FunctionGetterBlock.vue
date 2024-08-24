<template>
  <div 
    class="function-getter-block"
    :class="{ 'in-toolbox': !isInWorkspace, 'in-workspace': isInWorkspace }"
    :style="{ backgroundColor: block.color }"
    draggable="true"
    @dragstart="onDragStart"
  >
    <div v-if="!isInWorkspace" class="toolbox-preview">
      Function Call
    </div>
    <template v-else>
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
    </template>
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
        event.dataTransfer.effectAllowed = 'copy';
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
      event.stopPropagation();
      if (event.dataTransfer && nestedBlocks.value[index]) {
        event.dataTransfer.setData('text/plain', JSON.stringify(nestedBlocks.value[index]));
        event.dataTransfer.effectAllowed = 'copy';
      }
    };

    return {
      selectedFunctionId,
      functions,
      selectedFunction,
      parameterValues,
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
  }
});
</script>

<style scoped>
.function-getter-block {
  display: inline-block;
  cursor: move;
  position: relative;
  margin-bottom: 10px;
}

.in-toolbox,
.in-workspace {
  padding: 5px 10px;
  border-radius: 5px;
  color: #fff;
}

.toolbox-preview {
  font-weight: bold;
}

.function-title {
  font-weight: bold;
  margin-bottom: 5px;
}

select {
  width: 100%;
  margin-bottom: 10px;
}

.parameter-input {
  margin-bottom: 5px;
}
.input-container {
  display: flex;
  align-items: center;
}

.block-input {
  flex-grow: 1;
  padding: 2px;
  border: 1px dashed #fff;
  border-radius: 3px;
  min-height: 30px;
}

.block-input input {
  width: 100%;
  background: transparent;
  border: none;
  color: #fff;
}

.has-block {
  border: none;
}

.return-value {
  margin-top: 5px;
  font-style: italic;
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