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
      id: 'return',
      type: 'return',
      label: 'Return',
      color: '#FF4500', 
      inputs: []
    },
    {
      id: 'parameter',
      type: 'parameter',
      label: 'Parameter', 
      color: '#CCCCCC', 
      inputs: []
    },
    {
      id: 'function',
      type: 'function',
      label: 'Function',
      color: '#800080',
      inputs: [
        {
          name: 'functionName',
          type: 'string',
          default: ''
        }
      ]
    },
    {
      id: 'functionGetter',
      type: 'functionGetter',
      label: 'Function Getter',
      color: '#FFA500',
      inputs: [
        {
          name: 'functionId',
          type: 'string',
          default: ''
        }
      ]
    },
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
      id: 'variableChange',
      type: 'variableChange',
      label: 'Variable Change',
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
      inputs: [],
    },
    {
      id: 'compareLogic',
      type: 'compareLogic',
      label: 'Comparison Logic',
      color: '#d850fa',
      inputs: [],
    },
    {
      id: 'repeat',
      type: 'repeat',
      label: 'Repeat',
      color: '#9C27B0', // You can choose a different color if you prefer
      inputs: [
        {
          name: 'repeatCount',
          type: 'number',
          default: '1'
        }
      ]
    },
    {
      id: 'mathOperator',
      type: 'mathOperator',
      label: 'Math Operator',
      color: '#FF5722', // You can choose a different color if you prefer
      inputs: [
        {
          name: 'leftInput',
          type: 'number',
          default: '0'
        },
        {
          name: 'rightInput',
          type: 'number',
          default: '0'
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
