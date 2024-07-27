import { Module } from 'vuex';
import { RootState } from '../index';

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
}

interface BlocksState {
  blocks: Block[];
}

const state: BlocksState = {
  blocks: [
    {
      id: 'print',
      type: 'print',
      label: 'Print',
      color: '#4CAF50',
      inputs: [
        {
          name: 'message',
          type: 'string',
          default: ''
        }
      ]
    },
    {
      id: 'ifThen',
      type: 'ifThen',
      label: 'If-Then',
      color: '#e7a15c',
      inputs: [
        {
          name: 'condition',
          type: 'Block',
          default: 'null'
        }
      ]
    },
    {
      id: 'createVariable',
      type: 'createVariable',
      label: 'Create Variable',
      color: '#FFD700',
      inputs: [
        {
          name: 'variable',
          type: 'string',
          default: ''
        },
        {
          name: 'value',
          type: 'number',
          default: '0'
        }
      ]
    },
    {
      id: 'variable',
      type: 'variable',
      label: 'Variable',
      color: '#00BFFF',
      inputs: [
        {
          name: 'variable',
          type: 'string',
          default: ''
        }
      ]
    },
    {
      id: 'compareOperator',
      type: 'compareOperator',
      label: 'Comparison Operator',
      color: '#00BFFF',
      inputs: []
    },
    {
      id: 'mathOperator',
      type: 'mathOperator',
      label: 'Math Operator',
      color: '#FF5733',
      inputs: [
        {
          name: 'leftOperand',
          type: 'number',
          default: '0'
        },
        {
          name: 'rightOperand',
          type: 'number',
          default: '0'
        },
        {
          name: 'operator',
          type: 'string',
          default: '+'
        }
      ]
    }
  ]
};

const mutations = {
  ADD_BLOCK(state: BlocksState, block: Block) {
    state.blocks.push(block);
  },
  REMOVE_BLOCK(state: BlocksState, blockId: string) {
    state.blocks = state.blocks.filter(block => block.id !== blockId);
  },
  UPDATE_BLOCK(state: BlocksState, updatedBlock: Block) {
    const index = state.blocks.findIndex(block => block.id === updatedBlock.id);
    if (index !== -1) {
      state.blocks.splice(index, 1, updatedBlock);
    }
  }
};

const actions = {
  addBlock({ commit }: { commit: Function }, block: Block) {
    commit('ADD_BLOCK', block);
  },
  removeBlock({ commit }: { commit: Function }, blockId: string) {
    commit('REMOVE_BLOCK', blockId);
  },
  updateBlock({ commit }: { commit: Function }, block: Block) {
    commit('UPDATE_BLOCK', block);
  }
};

const getters = {
  getAllBlocks: (state: BlocksState): Block[] => state.blocks,
  getBlockById: (state: BlocksState) => (id: string): Block | undefined => 
    state.blocks.find(block => block.id === id)
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} as Module<BlocksState, RootState>;
