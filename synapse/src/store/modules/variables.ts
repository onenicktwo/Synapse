interface Variable {
    id: string;
    name: string;
    value: number;
  }
  
  interface VariablesState {
    variables: Variable[];
  }
  
  const state: VariablesState = {
    variables: []
  };
  
  const mutations = {
    ADD_VARIABLE(state: VariablesState, variable: Variable) {
      state.variables.push(variable);
    },
    REMOVE_VARIABLE(state: VariablesState, variableId: string) {
      state.variables = state.variables.filter(v => v.id !== variableId);
    },
    UPDATE_VARIABLE(state: VariablesState, updatedVariable: Variable) {
      const index = state.variables.findIndex(v => v.id === updatedVariable.id);
      if (index !== -1) {
        state.variables.splice(index, 1, updatedVariable);
      }
    }
  };
  
  const actions = {
    addVariable({ commit }: { commit: Function }, { name, value }: { name: string, value: number }) {
      const newVariable: Variable = {
        id: Date.now().toString(),
        name,
        value
      };
      commit('ADD_VARIABLE', newVariable);
    },
    removeVariable({ commit }: { commit: Function }, variableId: string) {
      commit('REMOVE_VARIABLE', variableId);
    },
    updateVariable({ commit }: { commit: Function }, variable: Variable) {
      commit('UPDATE_VARIABLE', variable);
    }
  };
  
  const getters = {
    getAllVariables: (state: VariablesState): Variable[] => state.variables,
    getVariableById: (state: VariablesState) => (id: string): Variable | undefined =>
      state.variables.find(v => v.id === id),
    getVariableByName: (state: VariablesState) => (name: string): Variable | undefined =>
      state.variables.find(v => v.name === name)
  };
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  };