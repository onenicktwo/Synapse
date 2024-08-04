<template>
  <div 
    class="variable-block"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="variable-title">Variable</div>
    <select v-model="selectedVariableId" @change="updateVariable">
      <option value="">Select a variable</option>
      <option v-for="variable in variables" :key="variable.id" :value="variable.id">
        {{ variable.name }}
      </option>
    </select>
    <button v-if="isInWorkspace" @click="$emit('remove')" class="remove-btn">X</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';
import { useStore } from 'vuex';
import { VariableBlock as VariableBlockType } from './types';

export default defineComponent({
  name: 'VariableBlock',
  props: {
    block: {
      type: Object as PropType<VariableBlockType>,
      required: true
    },
    isInWorkspace: {
      type: Boolean,
      default: false
    }
  },
  emits: ['remove', 'update'],
  setup(props, { emit }) {
    const store = useStore();
    const selectedVariableId = ref(props.block.variableId || '');

    const variables = computed(() => store.getters['variables/getAllVariables']);

    const selectedVariableValue = computed(() => {
      const variable = store.getters['variables/getVariableById'](selectedVariableId.value);
      return variable ? variable.value : null;
    });

    const updateBlock = () => {
      const updatedBlock: VariableBlockType = {
        ...props.block,
        variableId: selectedVariableId.value 
      };
      emit('update', updatedBlock);
    };

    const updateVariable = () => {
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
      selectedVariableId,
      variables,
      selectedVariableValue,
      updateVariable,
      onDragStart,
      onDragEnd,
    };
  },
});
</script>

<style scoped>
.variable-block {
  width: 200px; /* Set a fixed width similar to PrintBlock */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #ff8c1a;
  padding: 10px;
  border-radius: 5px;
  cursor: move;
  position: relative;
  margin-bottom: 10px;
}

.variable-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.variable-block select,
.variable-block input {
  margin: 5px 0;
  padding: 5px;
  border: none;
  border-radius: 3px;
  background-color: #ffab5e;
  color: white;
}

.variable-block select,
.variable-block input {
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
</style>
