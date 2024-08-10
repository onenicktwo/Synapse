import { Block } from "@/components/blocks/types";

interface Workspace {
  id: string;
  name: string;
  blocks: Block[];
}

interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
}

const state: WorkspaceState = {
  workspaces: [],
  activeWorkspaceId: null
};

const mutations = {
  ADD_WORKSPACE(state: WorkspaceState, workspace: Workspace) {
    state.workspaces.push(workspace);
  },
  SET_ACTIVE_WORKSPACE(state: WorkspaceState, workspaceId: string) {
    state.activeWorkspaceId = workspaceId;
  },
  REMOVE_WORKSPACE(state: WorkspaceState, workspaceId: string) {
    state.workspaces = state.workspaces.filter(w => w.id !== workspaceId);
    // Reset the active workspace if it was the one deleted
    if (state.activeWorkspaceId === workspaceId) {
      state.activeWorkspaceId = state.workspaces.length > 0 ? state.workspaces[0].id : null;
    }
  },
  ADD_BLOCK(state: WorkspaceState, { workspaceId, block }: { workspaceId: string, block: Block }) {
    const workspace = state.workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      workspace.blocks.push(block);
    }
  },
  REMOVE_BLOCK(state: WorkspaceState, { workspaceId, blockId }: { workspaceId: string, blockId: string }) {
    const workspace = state.workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      workspace.blocks = workspace.blocks.filter(block => block.id !== blockId);
    }
  },
  UPDATE_BLOCK(state: WorkspaceState, { workspaceId, updatedBlock }: { workspaceId: string, updatedBlock: Block }) {
    const workspace = state.workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      const index = workspace.blocks.findIndex(block => block.id === updatedBlock.id);
      if (index !== -1) {
        workspace.blocks.splice(index, 1, updatedBlock);
      }
    }
  }
};

const actions = {
  addWorkspace({ commit }: { commit: Function }, name: string) {
    const newWorkspace: Workspace = {
      id: Date.now().toString(),
      name,
      blocks: []
    };
    commit('ADD_WORKSPACE', newWorkspace);
    commit('SET_ACTIVE_WORKSPACE', newWorkspace.id);
  },
  setActiveWorkspace({ commit }: { commit: Function }, workspaceId: string) {
    commit('SET_ACTIVE_WORKSPACE', workspaceId);
  },
  deleteWorkspace({ commit, state }: { commit: Function, state: WorkspaceState }, workspaceId: string) {
    commit('REMOVE_WORKSPACE', workspaceId);
    // Automatically set a new active workspace if the deleted one was active
    if (state.activeWorkspaceId === workspaceId && state.workspaces.length > 0) {
      commit('SET_ACTIVE_WORKSPACE', state.workspaces[0].id);
    }
  },
  addBlock({ commit, state }: { commit: Function, state: WorkspaceState }, block: Omit<Block, 'id'>) {
    if (state.activeWorkspaceId) {
      commit('ADD_BLOCK', { workspaceId: state.activeWorkspaceId, block: { ...block, id: Date.now().toString() } });
    }
  },
  removeBlock({ commit, state }: { commit: Function, state: WorkspaceState }, blockId: string) {
    if (state.activeWorkspaceId) {
      commit('REMOVE_BLOCK', { workspaceId: state.activeWorkspaceId, blockId });
    }
  },
  updateBlock({ commit, state }: { commit: Function, state: WorkspaceState }, block: Block) {
    if (state.activeWorkspaceId) {
      commit('UPDATE_BLOCK', { workspaceId: state.activeWorkspaceId, updatedBlock: block });
    }
  }
};

const getters = {
  getAllWorkspaces: (state: WorkspaceState): string[] => state.workspaces.map(w => w.name),
  getActiveWorkspace: (state: WorkspaceState): string | null => {
    const activeWorkspace = state.workspaces.find(w => w.id === state.activeWorkspaceId);
    return activeWorkspace ? activeWorkspace.name : null;
  },
  getWorkspaceBlocks: (state: WorkspaceState): Block[] => {
    const activeWorkspace = state.workspaces.find(w => w.id === state.activeWorkspaceId);
    return activeWorkspace ? activeWorkspace.blocks : [];
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};