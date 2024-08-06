<template>
  <div
    class="block function-block"
    :style="{ backgroundColor: block.color }"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="block-header">
      <div class="block-label">
        <span>Function</span>
        <input
          type="text"
          v-model="functionName"
          placeholder="Function Name"
          @input="updateBlock"
        >
      </div>
      <button v-if="isInWorkspace" @click="$emit('remove')" class="remove-btn">X</button>
    </div>
    <div class="nested-blocks" ref="nestedBlocksContainer" @dragover.prevent @drop.stop="onDrop">
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
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { FunctionBlock as FunctionBlockType, Block, blockComponents } from './types';
import { getBlockComponent } from '../blockUtils';

export default defineComponent({
  name: 'FunctionBlock',
  props: {
    block: {
      type: Object as PropType<FunctionBlockType>,
      required: true
    },
    isInWorkspace: {
      type: Boolean,
      default: false
    }
  },
  emits: ['remove', 'update'],
  setup(props) {
    const functionName = ref(props.block.functionName || '');
    const nestedBlocks = ref<Block[]>(props.block.nestedBlocks || []);
    const components = blockComponents;
    const previousFunctionName = ref(functionName.value);


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
      onDragStart,
      onDragEnd,
      functionName,
      nestedBlocks,
      components,
      getBlockComponent,
      previousFunctionName
    };
  },
  computed: {
    ...mapGetters('functions', ['getFunctionByName'])
  },
  methods: {
    ...mapActions('functions', ['addFunction', 'removeFunction', 'updateFunction']),
    updateBlock() {
      this.$emit('update', {
        ...this.block,
        functionName: this.functionName,
        nestedBlocks: this.nestedBlocks
      });

      this.updateOrCreateFunction();
    },
    updateOrCreateFunction() {
      if (typeof this.functionName === 'string' && this.functionName !== '') {
        const existingFunction = this.getFunctionByName(this.functionName);
        if (existingFunction) {
          this.updateFunction({
            ...existingFunction,
            nestedBlocks: this.nestedBlocks
          });
        } else {
          this.addFunction({
            name: this.functionName,
            nestedBlocks: this.nestedBlocks
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
      this.nestedBlocks = this.nestedBlocks.filter(block => block.id !== id);
      this.updateBlock();
    },
    updateNestedBlock(updatedBlock: Block) {
      const index = this.nestedBlocks.findIndex(block => block.id === updatedBlock.id);
      if (index !== -1) {
        this.nestedBlocks[index] = updatedBlock;
        this.updateBlock();
      }
    },
    onDrop(event: DragEvent) {
      const allowedNestedBlocks = ['print', 'ifThen', 'createVariable', 'variable', 'repeat', 'functionGetter'];
      event.stopPropagation();
      if (event.dataTransfer) {
        const blockData = JSON.parse(event.dataTransfer.getData('text/plain')) as Block;
        if (allowedNestedBlocks.includes(blockData.type)) {
          const newBlock: Block = {
          ...blockData,
          id: Date.now().toString()
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
    }
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
    }
  },
  mounted() {
    if (this.isInWorkspace && this.functionName) {
      this.updateOrCreateFunction();
    }
  }
});
</script>

<style scoped>
.function-block {
  width: 200px; /* Adjusted width */
  padding: 10px;
  border-radius: 5px;
  cursor: move;
  position: relative;
  margin-bottom: 10px;
  transition: height 0.3s ease;
}

.block-label {
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-bottom: 5px;
}

.block-label input { 
  flex-grow: 1; /* Input takes up available space */
  padding: 2px 5px; /* Reduced padding */
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 14px; /* Slightly smaller font size */
}

.nested-blocks {
  min-height: 30px;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  padding: 5px;
}

.placeholder {
  text-align: center;
  color: #999;
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