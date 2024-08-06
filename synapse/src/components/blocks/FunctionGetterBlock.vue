<template>
  <div 
    class="function-getter-block"
    :style="{ backgroundColor: block.color }"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="function-title">Function Call</div>
    <select v-model="selectedFunctionId" @change="updateFunction">
      <option value="">Select a function</option>
      <option v-for="func in functions" :key="func.id" :value="func.id">
        {{ func.name }}
      </option>
    </select>
    <button v-if="isInWorkspace" @click="$emit('remove')" class="remove-btn">X</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';
import { useStore } from 'vuex';
import { FunctionGetterBlock as FunctionGetterBlockType } from './types';

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

    const updateBlock = () => {
      const updatedBlock: FunctionGetterBlockType = {
        ...props.block,
        functionId: selectedFunctionId.value 
      };
      emit('update', updatedBlock);
    };

    const updateFunction = () => {
      updateBlock();
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

    return {
      selectedFunctionId,
      functions,
      updateFunction,
      onDragStart,
      onDragEnd,
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