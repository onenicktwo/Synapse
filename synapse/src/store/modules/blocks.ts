// store/modules/blocks.ts

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
      id: 'variable',
      type: 'variable',
      label: 'Variable',
      color: '#2196F3',
      inputs: [
        {
          name: 'value',
          type: 'number',
          default: '0'  // This is a string '0', not a number 0
        }
      ]
    }
  ]
};


const mutations = {
  // We'll add mutations later if needed
};

const actions = {
  // We'll add actions later if needed
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
};