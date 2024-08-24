<template>
  <base-block :block="block" :isInWorkspace="isInWorkspace" @remove="removeVariableAndEmit">
    <template #preview v-if="!isInWorkspace">
      <div class="toolbox-preview">Create Variable</div>
    </template>
    <template #content v-else>
      <div class="block-input">
        <input 
          type="text" 
          v-model="variableName" 
          placeholder="Variable Name"
          @input="updateBlock"
        >
        <input 
          type="number" 
          v-model.number="variableValue" 
          placeholder="Variable Value"
          @input="updateBlock"
        >
      </div>
    </template>
  </base-block>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import BaseBlock from './PrintBlockTemplate.vue';
import { CreateVariableBlock as CreateVariableBlockType } from './types';

export default defineComponent({
  name: 'CreateVariableBlock',
  components: {
    BaseBlock
  },
  props: {
    block: {
      type: Object as PropType<CreateVariableBlockType>,
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
    const variableName = ref(props.block.inputs[0].default || '');
    const variableValue = ref(parseFloat(props.block.inputs[1].default) || 0);
    const previousVariableName = ref('');

    const updateBlock = () => {
      emit('update', {
        ...props.block,
        inputs: [
          {
            ...props.block.inputs[0],
            default: variableName.value
          },
          {
            ...props.block.inputs[1],
            default: variableValue.value.toString()
          }
        ]
      });

      updateOrCreateVariable();
    };

    const updateOrCreateVariable = () => {
      if (variableName.value && variableName.value !== previousVariableName.value) {
        // Remove the previous variable if it exists
        const previousVariable = store.getters['variables/getVariableByName'](previousVariableName.value);
        if (previousVariable) {
          store.dispatch('variables/removeVariable', previousVariable.id);
        }

        // Add or update the new variable
        const existingVariable = store.getters['variables/getVariableByName'](variableName.value);
        if (existingVariable) {
          store.dispatch('variables/updateVariable', {
            ...existingVariable,
            value: variableValue.value
          });
        } else {
          store.dispatch('variables/addVariable', {
            name: variableName.value,
            value: variableValue.value
          });
        }

        previousVariableName.value = variableName.value;
      } else if (variableName.value) {
        // Just update the value if the name hasn't changed
        const existingVariable = store.getters['variables/getVariableByName'](variableName.value);
        if (existingVariable) {
          store.dispatch('variables/updateVariable', {
            ...existingVariable,
            value: variableValue.value
          });
        }
      }
    };

    const removeVariableAndEmit = () => {
      const existingVariable = store.getters['variables/getVariableByName'](variableName.value);
      if (existingVariable) {
        store.dispatch('variables/removeVariable', existingVariable.id);
      }
      emit('remove');
    };

    onMounted(() => {
      if (props.isInWorkspace && variableName.value) {
        updateOrCreateVariable();
      }
    });

    watch(variableName, (newName, oldName) => {
      if (newName !== oldName) {
        updateOrCreateVariable();
      }
    });

    watch(variableValue, () => {
      updateOrCreateVariable();
    });

    return {
      variableName,
      variableValue,
      updateBlock,
      removeVariableAndEmit
    };
  }
});
</script>

<style scoped>
.block-input {
  display: flex;
  flex-direction: column;
}

.block-input input {
  width: 100%;
  padding: 5px;
  margin-bottom: 5px;
  border: none;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.block-input input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.toolbox-preview {
  font-weight: bold;
  color: white;
}
</style>
