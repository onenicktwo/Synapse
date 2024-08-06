import { createStore } from 'vuex';
import blocks from './modules/blocks';
import workspace from './modules/workspace';
import variables from './modules/variables';
import functions from './modules/functions';

export interface RootState {
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
  }
});
