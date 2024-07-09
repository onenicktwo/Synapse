const state = {
  blocks: []
};

const mutations = {
  ADD_BLOCK(state, block) {
    state.blocks.push(block);
  },
  REMOVE_BLOCK(state, blockId) {
    state.blocks = state.blocks.filter(block => block.id !== blockId);
  },
  UPDATE_BLOCK(state, updatedBlock) {
    const index = state.blocks.findIndex(block => block.id === updatedBlock.id);
    if (index !== -1) {
      state.blocks.splice(index, 1, updatedBlock);
    }
  }
};

const actions = {
  addBlock({ commit }, block) {
    commit('ADD_BLOCK', { ...block, id: Date.now() });
  },
  removeBlock({ commit }, blockId) {
    commit('REMOVE_BLOCK', blockId);
  },
  updateBlock({ commit }, block) {
    commit('UPDATE_BLOCK', block);
  }
};

const getters = {
  getWorkspaceBlocks: (state) => state.blocks
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};