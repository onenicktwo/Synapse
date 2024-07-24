<template>
  <div 
    class="variable-block"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="variable-title">Variable</div>
    <select v-model="selectedVariable" @change="updateVariable">
      <option value="">Select a variable</option>
      <option v-for="variable in variables" :key="variable.id" :value="variable.id">
        {{ variable.name }}: {{ variable.value }}
      </option>
    </select>
    <input 
      v-if="selectedVariable" 
      type="number" 
      :value="selectedVariableValue" 
      @input="updateVariableValue"
    >
    <button v-if="isInWorkspace" @click="$emit('remove')" class="remove-btn">X</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'VariableBlock',
  props: {
    isInWorkspace: {
      type: Boolean,
      default: false
    }
  },
  emits: ['remove'],
  setup() {
    const store = useStore();
    const selectedVariable = ref('');

    const variables = computed(() => store.getters['variables/getAllVariables']);

    const selectedVariableValue = computed(() => {
      const variable = store.getters['variables/getVariableById'](selectedVariable.value);
      return variable ? variable.value : null;
    });

    const updateVariable = () => {
      // You can add any additional logic here when a variable is selected
    };

    const updateVariableValue = (event: Event) => {
      const value = Number((event.target as HTMLInputElement).value);
      if (!isNaN(value)) {
        store.dispatch('variables/updateVariable', {
          id: selectedVariable.value,
          name: store.getters['variables/getVariableById'](selectedVariable.value).name,
          value: value
        });
      }
    };

    const onDragStart = (event: DragEvent) => {
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', JSON.stringify({ type: 'variable', id: selectedVariable.value }));
        event.dataTransfer.effectAllowed = 'copy';
      }
    };

    const onDragEnd = (event: DragEvent) => {
      console.log('Drag ended at:', event.clientX, event.clientY);
    };

    return {
      selectedVariable,
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
