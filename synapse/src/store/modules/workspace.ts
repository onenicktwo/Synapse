interface BlockInput {
  name: string;
  type: string;
  default: string;
}

interface Block {
  id: string;
  type: string;
  label: string;
  color: string;
  inputs: BlockInput[];
  position?: {
    x: number;
    y: number;
  };
}

interface WorkspaceState {
  blocks: Block[];
}

const state: WorkspaceState = {
  blocks: []
};

const mutations = {
  ADD_BLOCK(state: WorkspaceState, block: Block) {
    state.blocks.push(block);
  },
  REMOVE_BLOCK(state: WorkspaceState, blockId: string) {
    state.blocks = state.blocks.filter(block => block.id !== blockId);
  },
  UPDATE_BLOCK(state: WorkspaceState, updatedBlock: Block) {
    const index = state.blocks.findIndex(block => block.id === updatedBlock.id);
    if (index !== -1) {
      state.blocks.splice(index, 1, updatedBlock);
    }
  }
};

const actions = {
  addBlock({ commit }: { commit: Function }, block: Omit<Block, 'id'>) {
    commit('ADD_BLOCK', { ...block, id: Date.now().toString() });
  },
  removeBlock({ commit }: { commit: Function }, blockId: string) {
    commit('REMOVE_BLOCK', blockId);
  },
  updateBlock({ commit }: { commit: Function }, block: Block) {
    commit('UPDATE_BLOCK', block);
  }
};

const getters = {
  getWorkspaceBlocks: (state: WorkspaceState): Block[] => state.blocks
};



export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};