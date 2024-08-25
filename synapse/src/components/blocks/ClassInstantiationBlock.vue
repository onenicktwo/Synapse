<template>
    <base-block :block="block" :isInWorkspace="isInWorkspace" @remove="removeInstanceAndEmit">
      <template #preview v-if="!isInWorkspace">
        <div class="toolbox-preview">Create Class Instance</div>
      </template>
      <template #content v-else>
        <div class="block-input">
          <select v-model="selectedClass" @change="updateBlock">
            <option value="">Select a class</option>
            <option v-for="className in availableClasses" :key="className" :value="className">
              {{ className }}
            </option>
          </select>
          <input 
            type="text" 
            v-model="instanceName" 
            placeholder="Instance Name"
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
  import { ClassInstantiationBlock } from './types';
  
  export default defineComponent({
    name: 'ClassInstantiationBlock',
    components: {
      BaseBlock
    },
    props: {
      block: {
        type: Object as PropType<ClassInstantiationBlock>,
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
      const selectedClass = ref(props.block.inputs[0].default || '');
      const instanceName = ref(props.block.inputs[1].default || '');
      const availableClasses = ref<string[]>([]);
  
      const refreshClassList = () => {
        availableClasses.value = store.getters['workspace/getAllWorkspaces'];
      };
  
      const updateBlock = () => {
        emit('update', {
          ...props.block,
          inputs: [
            {
              ...props.block.inputs[0],
              default: selectedClass.value
            },
            {
              ...props.block.inputs[1],
              default: instanceName.value
            }
          ]
        });
  
        createClassInstance();
        refreshClassList();
      };
  
      const createClassInstance = () => {
        if (selectedClass.value && instanceName.value) {
          console.log(`Created instance '${instanceName.value}' of class '${selectedClass.value}'`);
        }
      };
  
      const removeInstanceAndEmit = () => {
        if (instanceName.value) {
          console.log(`Removed instance '${instanceName.value}'`);
        }
        emit('remove');
      };
  
      onMounted(() => {
        refreshClassList();
        if (props.isInWorkspace && selectedClass.value && instanceName.value) {
          createClassInstance();
        }
      });
  
      watch([selectedClass, instanceName], () => {
        if (props.isInWorkspace) {
          createClassInstance();
        }
      });
  
      watch(() => store.state.workspace.workspaces, () => {
        refreshClassList();
      }, { deep: true });
  
      return {
        selectedClass,
        instanceName,
        availableClasses,
        updateBlock,
        removeInstanceAndEmit
      };
    }
  });
  </script>
  
  <style scoped>
  .block-input select,
  .block-input input {
    width: 100%;
    padding: 5px;
    margin-bottom: 5px;
    border: none;
    border-radius: 3px;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  .block-input select option {
    background-color: #333;
  }
  
  .toolbox-preview {
    font-weight: bold;
    color: white;
  }
  </style>