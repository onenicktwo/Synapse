<template>
  <div 
    class="variable-block"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="variable-title">Variable Change</div>
    <select v-model="selectedVariableId" @change="updateVariable">
      <option value="">Select a variable</option>
      <option v-for="variable in variables" :key="variable.id" :value="variable.id">
        {{ variable.name }}: {{ variable.value }}
      </option>
    </select>
    <input 
      v-if="selectedVariableId" 
      type="number" 
      :value="selectedVariableValue" 
      @input="updateVariableValue"
    >
    <button v-if="isInWorkspace" @click="$emit('remove')" class="remove-btn">X</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';
import { useStore } from 'vuex';
import { VariableChangeBlock as VariableChangeBlockType } from './types';

export default defineComponent({
  name: 'VariableChangeBlock',
  props: {
    block: {
      type: Object as PropType<VariableChangeBlockType>,
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
    const selectedVariableValue = ref(props.block.value);

    const variables = computed(() => store.getters['variables/getAllVariables']);

    const updateBlock = () => {
      const updatedBlock: VariableChangeBlockType = {
        ...props.block,
        variableId: selectedVariableId.value,
        value: selectedVariableValue.value
      };
      emit('update', updatedBlock);
    };

    const updateVariable = () => {
      updateBlock();
    };

    const updateVariableValue = (event: Event) => {
      const value = Number((event.target as HTMLInputElement).value);
      if (!isNaN(value) && selectedVariableId.value) {
        store.dispatch('variables/updateVariable', {
          id: selectedVariableId.value,
          name: store.getters['variables/getVariableById'](selectedVariableId.value).name,
          value: value
        });
        selectedVariableValue.value = value;
        updateBlock(); // Update the block after updating the variable
      }
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
      updateVariableValue,
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