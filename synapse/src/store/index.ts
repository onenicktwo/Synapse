import { createStore } from 'vuex';
import blocks from './modules/blocks';
import variables from './modules/variables';
import functions from './modules/functions';
import workspace from './modules/workspace';
import classInstances from './modules/classInstances';

export interface RootState {
  [x: string]: any;
  output: string[];
}

export default createStore({
  state: {
    output: []
  } as RootState,
  mutations: {
    SET_OUTPUT(state: RootState, output: string[]) {
      state.output = output;
    }
  },
  actions: {
    setOutput({ commit }, output: string[]) {
      commit('SET_OUTPUT', output);
    }
  },
  getters: {
    getOutput: (state: RootState) => state.output
  },
  modules: {
    blocks,
    functions,
    workspace,
    variables,
    classInstances
  }
});
