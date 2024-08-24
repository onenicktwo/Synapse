<template>
  <div 
    class="variable-change-block"
    :class="{ 'in-toolbox': !isInWorkspace, 'in-workspace': isInWorkspace }"
    draggable="true"
    @dragstart="handleDragStart"
  >
    <!-- Toolbox preview -->
    <div v-if="!isInWorkspace" class="toolbox-preview">
      Change Variable...
    </div>
    
    <!-- Workspace block -->
    <div v-else class="block-container">
      <div class="variable-title">Variable Change</div>
      <select v-model="selectedVariableId" @change="updateVariable">
        <option value="">Select a variable</option>
        <option v-for="variable in availableVariables" :key="variable.id" :value="variable.id">
          {{ variable.name }}: {{ variable.value }}
        </option>
      </select>
      
      <!-- Math Operator Container -->
      <div class="math-operator-container" @drop.stop="handleMathOperatorDrop" @dragover.prevent>
        <component
          v-if="mathOperator"
          :is="components.MathOperatorBlock"
          :block="mathOperator"
          :isInWorkspace="true"
          :isNested="true"
          @remove="removeMathOperator"
          @update="updateMathOperator"
        />
        <div v-else class="math-operator-placeholder">
          Drop Math Operator here
        </div>
      </div>
      
      <!-- Remove button -->
      <button v-if="isInWorkspace" @click="$emit('remove')" class="remove-btn">X</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';
import { useStore } from 'vuex';
import { VariableChangeBlock as VariableChangeBlockType, MathOperatorBlock as MathOperatorBlockType } from './types';
import MathOperatorBlock from './MathOperatorBlock.vue';

export default defineComponent({
  name: 'VariableChangeBlock',
  components: {
    MathOperatorBlock,
  },
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
    const mathOperator = ref<MathOperatorBlockType | null>(props.block.mathOperator || null);

    const availableVariables = computed(() => {
      const storeVariables = store.getters['variables/getAllVariables'];
      if (props.isInWorkspace && props.block.parentFunctionId) {
        const parentFunction = store.getters['functions/getFunctionById'](props.block.parentFunctionId);
        return parentFunction ? storeVariables.filter((v: any) => parentFunction.variableIds.includes(v.id)) : storeVariables;
      }
      return storeVariables;
    });

    const components = computed(() => ({ MathOperatorBlock }));

    const updateBlock = () => {
      const updatedBlock: VariableChangeBlockType = {
        ...props.block,
        variableId: selectedVariableId.value,
        mathOperator: mathOperator.value
      };
      emit('update', updatedBlock);
    };

    const updateVariable = () => {
      updateBlock();
    };

    const handleMathOperatorDrop = (event: DragEvent) => {
      event.preventDefault();
      if (event.dataTransfer) {
        const blockData = JSON.parse(event.dataTransfer.getData('text/plain')) as MathOperatorBlockType;
        if (blockData.type === 'mathOperator') {
          mathOperator.value = {
            ...blockData,
            id: Date.now().toString()
          };
          updateBlock();
        }
      }
    };

    const removeMathOperator = () => {
      mathOperator.value = null;
      updateBlock();
    };

    const updateMathOperator = (updatedBlock: MathOperatorBlockType) => {
      mathOperator.value = updatedBlock;
      updateBlock();
    };

    const handleDragStart = (event: DragEvent) => {
      if (!props.isInWorkspace) { // Only allow dragging from toolbox
        if (event.dataTransfer) {
          event.dataTransfer.setData('text/plain', JSON.stringify(props.block));
          event.dataTransfer.effectAllowed = 'copy';
        }
      }
    };

    return {
      selectedVariableId,
      availableVariables,
      mathOperator,
      components,
      updateVariable,
      handleMathOperatorDrop,
      removeMathOperator,
      updateMathOperator,
      handleDragStart,
    };
  }
});
</script>

<style scoped>
.variable-change-block {
  display: inline-block;
  cursor: move;
  position: relative;
  margin-bottom: 10px;
}

.in-toolbox,
.block-container {
  padding: 5px 10px;
  border-radius: 5px;
  background-color: lightblue;
  color: #333;
}

.toolbox-preview {
  font-weight: bold;
}

.variable-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.math-operator-container {
  display: flex;
  align-items: center;
  padding: 5px;
  border: 2px dashed rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  margin-top: 5px;
}

.math-operator-placeholder {
  color: rgba(0, 0, 0, 0.7);
  font-style: italic;
  text-align: center;
  padding: 5px;
  border: 1px dashed rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  cursor: pointer;
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
