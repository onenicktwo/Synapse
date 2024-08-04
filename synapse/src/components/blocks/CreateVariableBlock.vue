<template>
  <base-block :block="block" :isInWorkspace="isInWorkspace" @remove="removeVariableAndEmit">
    <template #text-input>
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
import { defineComponent, PropType } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import BaseBlock from './PrintBlockTemplate.vue';
import { Block } from './types';

export default defineComponent({
  name: 'CreateVariableBlock',
  components: {
    BaseBlock
  },
  props: {
    block: {
      type: Object as PropType<Block>,
      required: true
    },
    isInWorkspace: {
      type: Boolean,
      default: false
    }
  },
  emits: ['remove', 'update'],
  data() {
    return {
      variableName: this.block.inputs[0].default || '',
      variableValue: this.block.inputs[1].default || 0,
      previousVariableName: this.block.inputs[0].default || '',
    };
  },
  computed: {
    ...mapGetters('variables', ['getVariableByName'])
  },
  methods: {
    ...mapActions('variables', ['addVariable', 'removeVariable', 'updateVariable']),
    updateBlock() {
    this.$emit('update', {
      ...this.block,
      inputs: [
        {
          ...this.block.inputs[0],
          default: this.variableName
        },
        {
          ...this.block.inputs[1],
          default: this.variableValue.toString()
        }
      ]
    });

    this.updateOrCreateVariable();
  },
    updateOrCreateVariable() {
    // Remove the previous variable if it exists and is different from the current one
    if (this.previousVariableName && this.previousVariableName !== this.variableName) {
      const previousVariable = this.getVariableByName(this.previousVariableName);
      if (previousVariable) {
        this.removeVariable(previousVariable.id);
      }
    }

    // Create or update the current variable
    const existingVariable = this.getVariableByName(this.variableName);
    if (existingVariable) {
      this.updateVariable({
        ...existingVariable,
        value: this.variableValue
      });
    } else {
      this.addVariable({
        name: this.variableName,
        value: this.variableValue
      });
    }

    // Update the previousVariableName
    this.previousVariableName = this.variableName;
  },
    removeVariableAndEmit() {
      const existingVariable = this.getVariableByName(this.variableName);
      if (existingVariable) {
        this.removeVariable(existingVariable.id);
      }
      this.$emit('remove');
    }
  },
  mounted() {
  if (this.isInWorkspace && this.variableName) {
    this.previousVariableName = this.variableName;
    this.updateOrCreateVariable();
  }
},
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
}
</style>