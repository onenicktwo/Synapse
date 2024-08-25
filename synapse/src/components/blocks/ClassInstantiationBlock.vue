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
          @input="debouncedUpdateBlock"
        >
      </div>
    </template>
  </base-block>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, PropType } from 'vue';
import { useStore } from 'vuex';
import BaseBlock from './PrintBlockTemplate.vue';
import { ClassInstantiationBlock as ClassInstantiationBlockType } from './types';

export default defineComponent({
  name: 'ClassInstantiationBlock',
  components: {
    BaseBlock
  },
  props: {
    block: {
      type: Object as PropType<ClassInstantiationBlockType>,
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
    const previousInstanceName = ref('');
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

      updateOrCreateInstance();
    };

    const updateOrCreateInstance = () => {
      if (instanceName.value && instanceName.value !== previousInstanceName.value) {
        const previousInstance = store.getters['classInstances/getInstanceByName'](previousInstanceName.value);
        if (previousInstance) {
          store.dispatch('classInstances/removeInstance', previousInstance.id);
        }

        const existingInstance = store.getters['classInstances/getInstanceByName'](instanceName.value);
        if (!existingInstance) {
          store.dispatch('classInstances/addInstance', {
            name: instanceName.value,
            className: selectedClass.value
          });
        }

        previousInstanceName.value = instanceName.value;
      } else if (instanceName.value) {
        const existingInstance = store.getters['classInstances/getInstanceByName'](instanceName.value);
        if (existingInstance && existingInstance.className !== selectedClass.value) {
          store.dispatch('classInstances/addInstance', {
            name: instanceName.value,
            className: selectedClass.value
          });
        }
      }
    };

    const removeInstanceAndEmit = () => {
      const existingInstance = store.getters['classInstances/getInstanceByName'](instanceName.value);
      if (existingInstance) {
        store.dispatch('classInstances/removeInstance', existingInstance.id);
      }
      emit('remove');
    };

    const debounce = (func: Function, delay: number) => {
      let timeout: number;
      return function(...args: any[]) {
        if (timeout) clearTimeout(timeout);
        timeout = window.setTimeout(() => {
          func(...args);
        }, delay);
      };
    };

    const debouncedUpdateBlock = debounce(updateBlock, 300);

    onMounted(() => {
      refreshClassList();
      if (props.isInWorkspace && instanceName.value) {
        updateOrCreateInstance();
      }
    });

    watch(selectedClass, () => {
      updateBlock();
    });

    watch(instanceName, (newName, oldName) => {
      if (newName !== oldName) {
        debouncedUpdateBlock();
      }
    });

    return {
      selectedClass,
      instanceName,
      availableClasses,
      debouncedUpdateBlock,
      removeInstanceAndEmit,
      updateBlock
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

.block-input select {
  color: black;
}

.toolbox-preview {
  font-weight: bold;
  color: white;
}
</style>