<template>
  <div
    class="block math-operator-block"
    :class="{ 'in-toolbox': !isInWorkspace, 'in-workspace': isInWorkspace, 'nested': isNested }"
    :style="blockStyle"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="block-title">Math Operator</div>
    <div v-if="!isInWorkspace" class="toolbox-preview">
      A ⊕ B
    </div>
    <div v-else class="block-content">
      <div class="input-container left" :class="{ 'has-block': leftBlock }">
        <component
          v-if="leftBlock"
          :key="leftBlock.id"
          :is="components[getBlockComponent(leftBlock.type)]"
          :block="leftBlock"
          :isInWorkspace="true"
          @remove="removeLeftBlock"
          @update="updateLeftBlock"
          draggable="true"
          @dragstart.stop="(event: DragEvent) => handleInputDragStart(event, 'left')"
        />
        <div v-else class="block-input" @drop.stop="handleInputDrop($event, 'left')" @dragover.prevent>
          <input 
            type="text" 
            v-model="leftInput" 
            placeholder="Left input"
            @input="updateBlock"
          >
        </div>
      </div>

      <select v-model="selectedOperator" @change="updateBlock" class="operator-select">
        <option v-for="op in operators" :key="op" :value="op">{{ op }}</option>
      </select>

      <div class="input-container right" :class="{ 'has-block': rightBlock }">
        <component
          v-if="rightBlock"
          :key="rightBlock.id"
          :is="components[getBlockComponent(rightBlock.type)]"
          :block="rightBlock"
          :isInWorkspace="true"
          @remove="removeRightBlock"
          @update="updateRightBlock"
          draggable="true"
          @dragstart.stop="(event: DragEvent) => handleInputDragStart(event, 'right')"
        />
        <div v-else class="block-input" @drop.stop="handleInputDrop($event, 'right')" @dragover.prevent>
          <input 
            type="text" 
            v-model="rightInput" 
            placeholder="Right input"
            @input="updateBlock"
          >
        </div>
      </div>
    </div>
    <button v-if="isInWorkspace" @click="$emit('remove')" class="remove-btn">X</button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import { Block, MathOperatorBlock as MathOperatorBlockType, blockComponents } from './types'; 
import { getBlockComponent } from '../blockUtils';
import VariableBlock from './VariableBlock.vue';
import PrintBlock from './PrintBlock.vue';
import IfThenBlock from './IfThenBlock.vue';
import CreateVariableBlock from './CreateVariableBlock.vue';
import RepeatBlock from './RepeatBlock.vue';

export default defineComponent({
  name: 'MathOperatorBlock',
  components: {
    VariableBlock,
    PrintBlock,
    IfThenBlock,
    CreateVariableBlock,
    RepeatBlock,
    MathOperatorBlock: () => import('./MathOperatorBlock.vue'),
  },
  props: {
    block: {
      type: Object as PropType<MathOperatorBlockType>,
      required: true,
    },
    isInWorkspace: {
      type: Boolean,
      default: false,
    },
    isNested: {
      type: Boolean,
      default: false
    },
  },
  emits: ['remove', 'update'],
  setup(props, { emit }) {
    const components = computed(() => blockComponents);
    const operators = ['+', '-', '*', '/', '%'];
    const selectedOperator = ref(props.block.operator || '+');
    const leftBlock = ref<Block | null>(props.block.leftBlock || null);
    const rightBlock = ref<Block | null>(props.block.rightBlock || null);
    const leftInput = ref(props.block.leftInput || '');
    const rightInput = ref(props.block.rightInput || '');

    const allowedInputBlocks = ['variable', 'mathOperator', 'print', 'ifThen', 'createVariable', 'repeat', 'functionGetter'];

    const blockStyle = computed(() => {
      return props.block && props.block.color
        ? { backgroundColor: props.block.color }
        : {};
    });

    const updateBlock = () => {
      const updatedBlock: MathOperatorBlockType = {
        ...props.block,
        operator: selectedOperator.value,
        leftBlock: leftBlock.value,
        rightBlock: rightBlock.value,
        leftInput: leftInput.value,
        rightInput: rightInput.value,
      };
      emit('update', updatedBlock);
    };

    const removeLeftBlock = () => {
      leftBlock.value = null;
      updateBlock();
    };

    const removeRightBlock = () => {
      rightBlock.value = null;
      updateBlock();
    };

    const updateLeftBlock = (updatedBlock: Block) => {
      leftBlock.value = updatedBlock;
      updateBlock();
    };

    const updateRightBlock = (updatedBlock: Block) => {
      rightBlock.value = updatedBlock;
      updateBlock();
    };

    const handleInputDrop = (event: DragEvent, side: 'left' | 'right') => {
      event.preventDefault();
      event.stopPropagation();
      if (event.dataTransfer) {
        const blockData = JSON.parse(event.dataTransfer.getData('text/plain')) as Block;
        if (allowedInputBlocks.includes(blockData.type)) {
          const newBlock: Block = {
            ...blockData,
            id: Date.now().toString()
          };
          if (side === 'left') {
            leftBlock.value = newBlock;
          } else {
            rightBlock.value = newBlock;
          }
          updateBlock();
        }
      }
    };

    const handleInputDragStart = (event: DragEvent, side: 'left' | 'right') => {
      const block = side === 'left' ? leftBlock.value : rightBlock.value;
      if (block && event.dataTransfer) {
        event.dataTransfer.setData('text/plain', JSON.stringify(block));
        event.dataTransfer.effectAllowed = 'copy';
      }
    };

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
      components,
      operators,
      selectedOperator,
      leftBlock,
      rightBlock,
      leftInput,
      rightInput,
      blockStyle,
      getBlockComponent,
      removeLeftBlock,
      removeRightBlock,
      updateLeftBlock,
      updateRightBlock,
      handleInputDrop,
      handleInputDragStart,
      onDragStart,
      onDragEnd,
      updateBlock,
    };
  }
});
</script>





































<style scoped>
.math-operator-block {
padding: 10px;
border-radius: 5px;
cursor: move;
position: relative;
margin-bottom: 10px;
display: flex;
flex-direction: column;
box-sizing: border-box;
background-color: #f8f9fa;
}

.block-title {
font-weight: bold;
margin-bottom: 10px;
color: #333;
}

.math-operator-block.in-toolbox {
width: 180px;
font-size: 0.8em;
}

.math-operator-block.in-workspace {
  width: auto;
  min-width: 250px;
  max-width: 100%;
  font-size: 1em;
}

.toolbox-preview {
  font-size: 1.2em;
  text-align: center;
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.block-content {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  flex-wrap: nowrap;
}

.input-container {
  flex: 1;
  min-height: 30px;
  border: 2px dashed rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  padding: 5px;
  margin: 0 5px;
  display: flex;
  align-items: center;
  overflow: visible;
  width: auto;
  min-width: 80px;
}

.nested .input-container {
  min-width: unset;
  width: 45%; 
}

.nested .operator-select {
  width: 10%; 
}

.input-container.has-block {
  width: auto;
  border: 2px solid #007bff;
}

.input-container > * {
  width: 100%;
}

.block-input {
  width: 100%;
  display: flex;
  align-items: center;
}

.operator-select {
  margin: 0 10px;
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

/* Adjustments for toolbox */
.in-toolbox .block-title {
  font-size: 0.9em;
  margin-bottom: 5px;
}

.in-toolbox .toolbox-preview {
  font-size: 1em;
  padding: 3px;
}

.in-toolbox .input-container,
.in-toolbox .operator-select {
  display: none;
}

.in-workspace .toolbox-preview {
  display: none;
}

.in-workspace .input-container {
  min-height: 30px;
  padding: 5px;
}

.in-workspace .operator-select {
  display: block;
  margin: 0 10px;
}

.in-workspace input {
  font-size: 1em;
}
</style>
