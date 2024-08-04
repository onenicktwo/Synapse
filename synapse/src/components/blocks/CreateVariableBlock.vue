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
  data() {
    return {
      variableName: this.block.inputs[0].default || '',
      variableValue: parseFloat(this.block.inputs[1].default) || 0,
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
      if (typeof this.variableName === 'string' && this.variableName !== '' && this.variableValue !== undefined) {
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
      } else {
        console.error('CreateVariable block has invalid inputs');
      }
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