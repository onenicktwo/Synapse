<template>
    <base-block :block="block" :isInWorkspace="isInWorkspace">
      <template #preview v-if="!isInWorkspace">
        <div class="toolbox-preview">Invoke Method</div>
      </template>
      <template #content v-else>
        <div class="block-input">
          <select v-model="selectedInstance" @change="updateMethods">
            <option value="">Select an instance</option>
            <option v-for="instance in allInstances" :key="instance.id" :value="instance.name">
              {{ instance.name }}
            </option>
          </select>
          <select v-model="selectedMethod" @change="emitUpdate">
            <option value="">Select a method</option>
            <option v-for="method in availableMethods" :key="method" :value="method">
              {{ method }}
            </option>
          </select>
        </div>
      </template>
    </base-block>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, watch, onMounted, PropType } from 'vue';
  import { useStore } from 'vuex';
  import BaseBlock from './PrintBlockTemplate.vue';
  import { Block, FunctionBlock, InvokeMethodBlock } from './types';
  
  export default defineComponent({
    name: 'InvokeMethodBlock',
    components: {
      BaseBlock
    },
    props: {
      block: {
        type: Object as PropType<InvokeMethodBlock>,
        required: true
      },
      isInWorkspace: {
        type: Boolean,
        default: false
      }
    },
    emits: ['update'],
    setup(props, { emit }) {
      const store = useStore();
      const selectedInstance = ref(props.block.inputs[0].default || '');
      const selectedMethod = ref(props.block.inputs[1].default || '');
      const allInstances = ref(store.getters['classInstances/getAllInstances']);
      const availableMethods = ref<string[]>([]);
  
      const getMethodsForClass = (className: string): string[] => {
  const workspaces = store.getters['workspace/getAllWorkspaces'] || [];

  const workspace = workspaces.find(
    (workspaceName: string) => workspaceName === className
  );

  const workspaceObject = store.state.workspace.workspaces.find((w: { name: any; }) => w.name === workspace);

  if (workspaceObject && workspaceObject.blocks) {
    return workspaceObject.blocks
      .filter((block: Block) => block.type === 'function')
      .map((block: FunctionBlock) => block.functionName);
  }

  return [];
};
  
      const updateMethods = () => {
        const instance = store.getters['classInstances/getInstanceByName'](selectedInstance.value);
        if (instance) {
          availableMethods.value = getMethodsForClass(instance.className);
        } else {
          availableMethods.value = [];
        }
      };
  
      const emitUpdate = () => {
        emit('update', {
          ...props.block,
          inputs: [
            {
              name: 'instanceName',
              type: 'string',
              default: selectedInstance.value
            },
            {
              name: 'methodName',
              type: 'string',
              default: selectedMethod.value
            }
          ]
        });
      };
  
      onMounted(() => {
        updateMethods();
      });
  
      watch(selectedInstance, () => {
        updateMethods();
        emitUpdate();
      });
  
      watch(selectedMethod, () => {
        emitUpdate();
      });
  
      return {
        selectedInstance,
        selectedMethod,
        allInstances,
        availableMethods,
        updateMethods,  
        emitUpdate    
      };
    }
  });
  </script>
  
  <style scoped>
  .block-input select {
  width: 100%;
  padding: 5px;
  margin-bottom: 5px;
  border: none;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.1); 
  color: white; 

  color: black;      
  background-color: white; 
}
  .toolbox-preview {
  font-weight: bold;
  color: white; 
}
  </style>