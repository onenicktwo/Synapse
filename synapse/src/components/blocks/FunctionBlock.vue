<template>
  <div
    class="function-block"
    :class="{ 'in-toolbox': !isInWorkspace, 'in-workspace': isInWorkspace }"
    :style="{ backgroundColor: block.color }"
    draggable="true"
    @dragstart="onDragStart"
  >
    <div class="block-header">
      <div class="block-label">
        <span v-if="isInWorkspace">Function</span>
        <input
          v-if="isInWorkspace"
          type="text"
          v-model="functionName"
          placeholder="Function Name"
          @input="updateBlock"
        >
        <span v-if="!isInWorkspace" class="toolbox-preview">
          Function (parameters)
        </span>
      </div>
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
      class="nested-blocks"
      ref="nestedBlocksContainer"
      @dragover.prevent="handleDragOver"
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
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { 
  FunctionBlock as FunctionBlockType, 
  Block, 
  blockComponents,
  ParameterBlock as ParameterBlockType 
} from './types';
import { getBlockComponent } from '../blockUtils';
import ParameterBlock from './ParameterBlock.vue'; 

export default defineComponent({
  name: 'FunctionBlock',
  components: {
    ParameterBlock,
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

    return {
      onDragStart,
      functionName,
      nestedBlocks,
      components,
      getBlockComponent,
      handleParameterDragStart,
      parameters, 
      newParameterName
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
        'parameter'
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
    handleDragOver(event: DragEvent) {
      event.preventDefault(); // Necessary for drop to work
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
  transition: height 0.3s ease; /* Add transition for height */
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

.block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.block-label {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.block-label input {
  margin-left: 5px;
  padding: 2px 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 14px;
}

.toolbox-preview {
  font-style: italic;
  font-size: 0.9em;
}

.nested-blocks {
  min-height: 30px;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  padding: 5px;
  cursor: pointer; /* Default cursor for the drop area */
}

.nested-blocks:hover {
  background-color: rgba(0, 0, 0, 0.1); /* Subtle background change on hover */
}

.placeholder {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
  padding: 5px;
  cursor: default;
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: #ff0000;
  padding: 2px 5px; 
}
</style>