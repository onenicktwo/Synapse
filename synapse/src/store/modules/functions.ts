import { Module, ActionContext } from 'vuex';
import { RootState } from '../index';
import { Block, ParameterBlock } from '@/components/blocks/types';

export interface Function {
  id: string;
  name: string;
  nestedBlocks: Block[];
  parameters: ParameterBlock[];
}

interface FunctionsState {
  functions: Function[];
}

const state: FunctionsState = {
  functions: []
};

const mutations = {
  ADD_FUNCTION(state: FunctionsState, func: Function) {
    state.functions.push(func);
  },
  REMOVE_FUNCTION(state: FunctionsState, functionId: string) {
    state.functions = state.functions.filter(f => f.id !== functionId);
  },
  UPDATE_FUNCTION(state: FunctionsState, updatedFunction: Function) {
    const index = state.functions.findIndex(f => f.id === updatedFunction.id);
    if (index !== -1) {
      state.functions.splice(index, 1, updatedFunction);
    } else {
      state.functions.push(updatedFunction);
    }
  }
};

const actions = {
  addFunction({ commit }: ActionContext<FunctionsState, RootState>, func: Omit<Function, 'id'>) {
    const newFunction: Function = {
      ...func,
      id: Date.now().toString(),
      parameters: func.parameters || []
    };
    commit('ADD_FUNCTION', newFunction);
  },
  removeFunction({ commit }: ActionContext<FunctionsState, RootState>, functionId: string) {
    commit('REMOVE_FUNCTION', functionId);
  },
  updateFunction({ commit }: ActionContext<FunctionsState, RootState>, func: Function) {
    commit('UPDATE_FUNCTION', func);
  }
};

const getters = {
  getAllFunctions: (state: FunctionsState): Function[] => state.functions,
  getFunctionById: (state: FunctionsState) => (id: string): Function | undefined =>
    state.functions.find(f => f.id === id),
  getFunctionByName: (state: FunctionsState) => (name: string): Function | undefined =>
    state.functions.find(f => f.name === name)
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} as Module<FunctionsState, RootState>;