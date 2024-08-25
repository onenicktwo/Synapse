import { Module } from 'vuex';
import { RootState } from '../index';

export interface ClassInstance {
  id: string;
  name: string;
  className: string;
}

interface ClassInstancesState {
  instances: ClassInstance[];
}

const state: ClassInstancesState = {
  instances: []
};

const mutations = {
  ADD_INSTANCE(state: ClassInstancesState, instance: ClassInstance) {
    state.instances.push(instance);
  },
  REMOVE_INSTANCE(state: ClassInstancesState, instanceId: string) {
    state.instances = state.instances.filter(instance => instance.id !== instanceId);
  }
};

const actions = {
  addInstance({ commit }: { commit: Function }, { name, className }: { name: string, className: string }) {
    const newInstance: ClassInstance = {
      id: Date.now().toString(),
      name,
      className
    };
    commit('ADD_INSTANCE', newInstance);
  },
  removeInstance({ commit }: { commit: Function }, instanceId: string) {
    commit('REMOVE_INSTANCE', instanceId);
  }
};

const getters = {
  getAllInstances: (state: ClassInstancesState): ClassInstance[] => state.instances,
  getInstanceById: (state: ClassInstancesState) => (id: string): ClassInstance | undefined =>
    state.instances.find(instance => instance.id === id),
  getInstanceByName: (state: ClassInstancesState) => (name: string): ClassInstance | undefined =>
    state.instances.find(instance => instance.name === name)
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} as Module<ClassInstancesState, RootState>;