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
        <input
          type="text"
          v-model="parameterValues[index]"
          @input="updateFunction"
          :disabled="index >= selectedFunction.parameters.length"
        >
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
import { FunctionBlock, FunctionGetterBlock as FunctionGetterBlockType } from './types';

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

    const selectedFunction = computed((): FunctionBlock | undefined => {
      if (selectedFunctionId.value) {
        return functions.value.find((f: { id: string; }) => f.id === selectedFunctionId.value);
      }
      return undefined;
    });

    watch(selectedFunction, (newFunction) => {
      if (newFunction) {
        parameterValues.value = newFunction.parameters.map(() => ''); 
      } else {
        parameterValues.value = []; 
      }
    });

    const updateFunction = () => {
      if (selectedFunction.value) {
        const validParameterValues = parameterValues.value.slice(0, selectedFunction.value.parameters.length);
        emit('update', {
          ...props.block,
          functionId: selectedFunction.value.id,
          parameterValues: validParameterValues,
        });
      }
    };

    const onDragStart = (event: DragEvent) => {
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', JSON.stringify(props.block));
      }
    };

    return {
      selectedFunctionId,
      functions,
      parameterValues,
      selectedFunction,
      updateFunction,
      onDragStart,
    };
  },
});
</script>


<style scoped>
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
</style>