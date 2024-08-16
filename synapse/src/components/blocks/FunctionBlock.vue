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
  <div class="return-title">Return:</div>
  <div class="return-block-container">
    <ReturnBlock 
      :block="createEmptyReturnBlock()"
      :isInWorkspace="false"
      :isEditable="false"
      draggable="true"
      @dragstart="onReturnDragStart"
    /> 
  </div>
    <div
  class="return-drop-zone"
  @dragover.prevent
  @drop.stop="onReturnDrop"
>
  <component
    v-if="returnBlock"
    :is="components[getBlockComponent(returnBlock.type)]"
    :block="returnBlock"
    :isInWorkspace="true"
    @remove="removeReturnBlock"
    @update="updateReturnBlock"
    draggable="true"
    @dragstart.stop="handleReturnDragStart"
  />
  <div v-else class="return-placeholder">
    Drop default return here
  </div>
</div>
  </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, Ref } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { 
  FunctionBlock as FunctionBlockType, 
  Block, 
  blockComponents,
  ParameterBlock as ParameterBlockType,
  ReturnBlock as ReturnBlockType
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
    const returnBlock: Ref<Block | null> = ref(props.block.returnBlock || null);
    const components = blockComponents;
    const newParameterName = ref('');

    const onDragStart = (event: DragEvent) => {
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', JSON.stringify(props.block));
        event.dataTransfer.effectAllowed = 'copy';
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

    const handleParameterDragStart = (event: DragEvent, parameter: ParameterBlockType) => {
      event.stopPropagation();
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', JSON.stringify(parameter));
        event.dataTransfer.effectAllowed = 'move';
      }
    };

    const emptyReturnBlock: ReturnBlockType = {
    id: 'empty',
    type: 'return',
    label: 'Return',
    color: '#FF4500',
    inputs: [],
    valueBlock: null
  };


    return {
      onDragStart,
      functionName,
      nestedBlocks,
      components,
      returnBlock,
      getBlockComponent,
      onReturnDragStart,
      handleParameterDragStart,
      createEmptyReturnBlock,
      parameters, 
      newParameterName,
      emptyReturnBlock
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
        returnBlock: this.returnBlock,
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
          });
        } else {
          this.addFunction({
            name: this.functionName,
            nestedBlocks: this.nestedBlocks,
            parameters: this.parameters, 
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
        'return',
      ];
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
    onReturnDrop(event: DragEvent) {
  event.stopPropagation();
  if (event.dataTransfer) {
    const blockData = JSON.parse(
      event.dataTransfer.getData('text/plain')
    ) as Block;
    if (blockData.type === 'variable') {
      const newBlock: Block = {
        ...blockData,
        id: Date.now().toString(),
      };
      this.returnBlock = newBlock;
      this.updateBlock();
    }
  }
},

    removeReturnBlock() {
      this.returnBlock = null;
      this.updateBlock();
    },

    updateReturnBlock(updatedBlock: Block) {
  this.returnBlock = updatedBlock;
  this.updateBlock();
},

    handleReturnDragStart(event: DragEvent) {
  event.stopPropagation();
  if (event.dataTransfer && this.returnBlock) {
    event.dataTransfer.setData('text/plain', JSON.stringify(this.returnBlock));
    event.dataTransfer.effectAllowed = 'move';
  }
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
.return-section {
  margin-top: 10px;
}

.return-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.return-block-container {
  cursor: move;
}

.return-drop-zone {
  min-height: 30px;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  padding: 5px;
}


.return-placeholder {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
  padding: 5px;
}

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

.nested-blocks {
  min-height: 30px;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  padding: 5px;
  margin-bottom: 10px;
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

.placeholder {
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
  text-align: center;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
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
  font-size: 14px;
}

.remove-btn {
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 2px 5px;
  border-radius: 3px;
  cursor: pointer;
}

.remove-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>