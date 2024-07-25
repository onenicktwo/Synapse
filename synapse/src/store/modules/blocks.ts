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
      id: 'changeVariable',
      type: 'changeVariable',
      label: 'Change Variable',
      color: '#FFA500',
      inputs: [
        {
          name: 'variable',
          type: 'string',
          default: ''
        },
        {
          name: 'value',
          type: 'number',
          default: "0"
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
      label: 'ComparisonOperatorBlock',
      color: '#00BFFF',
      inputs: []
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