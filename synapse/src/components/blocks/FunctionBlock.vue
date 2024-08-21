<template>
  <div
    class="function-block"
    :class="{ 'in-toolbox': !isInWorkspace, 'in-workspace': isInWorkspace }"
    :style="{ backgroundColor: block.color }"
    draggable="true"
    @dragstart="onDragStart"
  >
    <div class="title-bar"> 
      <span v-if="isInWorkspace" class="block-title">Function</span>
      <input
        v-if="isInWorkspace"
        type="text"
        v-model="functionName"
        placeholder="Function Name"
        @input="updateBlock"
        class="function-name-input" 
      >
      <span v-if="!isInWorkspace" class="block-title">
        Function (parameters)
      </span>
      <button v-if="isInWorkspace" @click="removeFunctionAndEmit" class="remove-btn">
        X
      </button>
    </div>

    <div v-if="isInWorkspace" class="parameters">
      <div class="add-parameter">
        <input type="text" v-model="newParameterName" placeholder="Parameter Name">
        <button @click="addParameter">Add Parameter</button>
      </div>
      <div
        v-for="(parameter, index) in parameters"
        :key="index"
        class="parameter"
      >
        <ParameterBlock
          :block="parameter"
          :isEditable="false"
          draggable="true"
          @dragstart.stop="(event: DragEvent) => handleParameterDragStart(event, parameter)"
        />
      </div>
    </div>

    <div
    v-if="isInWorkspace"
    class="nested-blocks-container"
    @drop.stop="onDrop"
  >
    <component
      v-for="nestedBlock in nestedBlocks"
      :key="nestedBlock.id"
      :is="components[getBlockComponent(nestedBlock.type)]"
      :block="nestedBlock"
      :isInWorkspace="true"
      @remove="removeNestedBlock(nestedBlock.id)"
      @update="updateNestedBlock"
      draggable="true"
      @dragstart.stop="(event: DragEvent) => handleNestedDragStart(event, nestedBlock)"
    />
    <div v-if="nestedBlocks.length === 0" class="placeholder">
      Drop blocks here
    </div>
  </div>

  <div v-if="isInWorkspace" class="return-section">
      <label>
        <input type="checkbox" v-model="hasReturn" @change="toggleReturn">
        Function returns a value
      </label>
    </div>

    <div v-if="isInWorkspace && hasReturn" class="return-block-container">
      <div class="return-title">Drag return block to function body:</div>
      <ReturnBlock 
        :block="createEmptyReturnBlock()"
        :isInWorkspace="false"
        :isEditable="false"
        draggable="true"
        @dragstart="onReturnDragStart"
      />
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { 
  FunctionBlock as FunctionBlockType, 
  Block, 
  blockComponents,
  ParameterBlock as ParameterBlockType,
  ReturnBlock as ReturnBlockType,
} from './types';
import { getBlockComponent } from '../blockUtils';
import ParameterBlock from './ParameterBlock.vue';
import ReturnBlock from './ReturnBlock.vue';

export default defineComponent({
  name: 'FunctionBlock',
  components: {
    ParameterBlock,
    ReturnBlock,
  },
  props: {
    block: {
      type: Object as PropType<FunctionBlockType>,
      required: true,
    },
    isInWorkspace: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['remove', 'update'],
  setup(props) {
    const functionName = ref(props.block.functionName || '');
    const nestedBlocks = ref<Block[]>(props.block.nestedBlocks || []);
    const parameters = ref<ParameterBlockType[]>(props.block.parameters || []);
    const components = blockComponents;
    const newParameterName = ref('');
    const hasReturn = ref(props.block.hasReturn || false);

    const onDragStart = (event: DragEvent) => {
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', JSON.stringify(props.block));
        event.dataTransfer.effectAllowed = 'copy';
      }
    };
    
    const handleParameterDragStart = (event: DragEvent, parameter: ParameterBlockType) => {
      event.stopPropagation();
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', JSON.stringify(parameter));
        event.dataTransfer.effectAllowed = 'move';
      }
    };

    const createEmptyReturnBlock = (): ReturnBlockType => ({
      id: Date.now().toString(),
      type: 'return',
      label: 'Return',
      color: '#FF4500',
      inputs: [],
      valueBlock: null
    });

    const onReturnDragStart = (event: DragEvent) => {
      event.stopPropagation();
      if (event.dataTransfer) {
        const newReturnBlock = createEmptyReturnBlock();
        event.dataTransfer.setData('text/plain', JSON.stringify(newReturnBlock));
        event.dataTransfer.effectAllowed = 'copy';
      }
    };

    return {
      onDragStart,
      functionName,
      nestedBlocks,
      components,
      getBlockComponent,
      handleParameterDragStart,
      parameters, 
      newParameterName,
      hasReturn,
      createEmptyReturnBlock,
      onReturnDragStart,
    };
  },

  computed: {
    ...mapGetters('functions', ['getFunctionByName']),
  },

  methods: {
    ...mapActions('functions', ['addFunction', 'removeFunction', 'updateFunction']),
    
    updateBlock() {
      this.$emit('update', {
        ...this.block,
        functionName: this.functionName,
        nestedBlocks: this.nestedBlocks,
        parameters: this.parameters,
        hasReturn: this.hasReturn,
      });
      
      this.updateOrCreateFunction();
    },

    updateOrCreateFunction() {
      if (typeof this.functionName === 'string' && this.functionName !== '') {
        const existingFunction = this.getFunctionByName(this.functionName);
        if (existingFunction) {
          this.updateFunction({
            ...existingFunction,
            nestedBlocks: this.nestedBlocks,
            parameters: this.parameters,
            hasReturn: this.hasReturn,
          });
        } else {
          this.addFunction({
            name: this.functionName,
            nestedBlocks: this.nestedBlocks,
            parameters: this.parameters,
            hasReturn: this.hasReturn,
          });
        }
      } else {
        console.error('Function block has invalid name');
      }
    },

    removeFunctionAndEmit() {
      const existingFunction = this.getFunctionByName(this.functionName);
      if (existingFunction) {
        this.removeFunction(existingFunction.id).then(() => {
          this.$emit('remove');
        });
      } else {
        this.$emit('remove');
      }
    },

    removeNestedBlock(id: string) {
      this.nestedBlocks = this.nestedBlocks.filter((block) => block.id !== id);
      this.updateBlock();
    },

    updateNestedBlock(updatedBlock: Block) {
      const index = this.nestedBlocks.findIndex(
        (block) => block.id === updatedBlock.id
      );
      if (index !== -1) {
        this.nestedBlocks[index] = updatedBlock;
        this.updateBlock();
      }
    },

    onDrop(event: DragEvent) {
      const allowedNestedBlocks = [
        'print',
        'ifThen',
        'createVariable',
        'variable',
        'repeat',
        'functionGetter',
        'parameter',
        'variableChange'
      ];
      if (this.hasReturn) {
        allowedNestedBlocks.push('return');
      }
      event.stopPropagation();
      if (event.dataTransfer) {
        const blockData = JSON.parse(
          event.dataTransfer.getData('text/plain')
        ) as Block;
        if (allowedNestedBlocks.includes(blockData.type)) {
          const newBlock: Block = {
            ...blockData,
            id: Date.now().toString(),
          };
          this.nestedBlocks.push(newBlock);
          this.updateBlock();
        }
      }
    },

    handleNestedDragStart(event: DragEvent, block: Block) {
      event.stopPropagation();
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', JSON.stringify(block));
        event.dataTransfer.effectAllowed = 'copy';
      }
    },

    addParameter() {
      if (this.newParameterName.trim() !== '') {
        this.parameters.push({
          id: Date.now().toString(),
          type: 'parameter',
          name: this.newParameterName,
          value: null,
          label: 'Parameter',
          color: '#CCCCCC',
          inputs: [],
        });
        this.newParameterName = ''; // Clear the input
        this.updateBlock();
      }
    },

    updateParameter(index: number, updatedParameter: ParameterBlockType) {
      if (index >= 0 && index < this.parameters.length) {
        this.parameters[index] = updatedParameter;
        this.updateBlock();
      }
    },

    removeParameter(index: number) {
      if (index >= 0 && index < this.parameters.length) {
        this.parameters.splice(index, 1);
        this.updateBlock();
      }
    },

    toggleReturn() {
      if (!this.hasReturn) {
        // Remove all return blocks when turning off the return checkbox
        this.nestedBlocks = this.nestedBlocks.filter(block => block.type !== 'return');
      }
      this.updateBlock();
    },
  },

  watch: {
    functionName(newName, oldName) {
      if (oldName && oldName !== newName) {
        const existingFunction = this.getFunctionByName(oldName);
        if (existingFunction) {
          this.removeFunction(existingFunction.id);
        }
      }
      this.updateOrCreateFunction();
    },
  },

  mounted() {
    if (this.isInWorkspace && this.functionName) {
      this.updateOrCreateFunction();
    }
  },
});
</script>

<style scoped>
.function-block {
  padding: 10px;
  border-radius: 5px;
  cursor: move;
  position: relative;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  background-color: #6c5ce7;
  color: white;
  transition: height 0.3s ease; 
}

.function-block.in-toolbox {
  width: 180px;
  font-size: 0.8em;
}

.function-block.in-workspace {
  width: auto;
  min-width: 250px;
  max-width: 100%;
  font-size: 1em;
}

.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.block-title {
  font-weight: bold;
  white-space: nowrap;
}

.function-name-input {
  flex-grow: 1;
  margin-left: 5px;
  padding: 2px 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 14px;
}

.nested-blocks-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  min-height: 30px;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  padding: 5px;
  margin-bottom: 10px;
}

.return-block-container {
  margin-top: 10px;
}

.return-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.placeholder {
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  width: 100%;
  padding: 10px;
}

.return-section {
  margin-top: 10px;
  margin-bottom: 10px;
}

.return-section label {
  display: flex;
  align-items: center;
}

.return-section input[type="checkbox"] {
  margin-right: 5px;
}

.return-block-container {
  margin-top: 10px;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}

.return-title {
  font-weight: bold;
  margin-bottom: 5px;
}

/* Style for the draggable return block */
.return-block-container :deep(.return-block) {
  cursor: move;
  padding: 5px;
  background-color: #FF4500;
  border-radius: 3px;
  display: inline-block;
  margin-top: 5px;
}

.parameters {
  margin-bottom: 10px;
}

.add-parameter {
  display: flex;
  margin-bottom: 5px;
}

.add-parameter input {
  flex-grow: 1;
  margin-right: 5px;
  padding: 2px 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.add-parameter button {
  padding: 2px 5px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.parameter {
  margin-bottom: 5px;
}
</style>