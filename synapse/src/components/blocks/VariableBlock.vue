<template>
    <div 
      class="variable-block"
      draggable="true"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
    >
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
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import { useStore } from 'vuex';
  
  export default defineComponent({
    name: 'VariableBlock',
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
    display: flex;
    align-items: center;
    background-color: #ff8c1a;
    padding: 5px;
    border-radius: 5px;
    cursor: move;
    position: relative;
    margin-bottom: 10px;
  }
  
  .variable-block select,
  .variable-block input {
    margin: 0 5px;
    padding: 5px;
    border: none;
    border-radius: 3px;
    background-color: #ffab5e;
    color: white;
  }
  
  .variable-block select {
    flex-grow: 1;
  }
  
  .variable-block input {
    width: 60px;
  }
  </style>
  