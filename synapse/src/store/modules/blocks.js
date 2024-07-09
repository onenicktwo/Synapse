const state = {
  blocks: [
    {
      id: 'print',
      type: 'output',
      label: 'Print',
      color: '#4CAF50',
      inputs: [
        {
          name: 'message',
          type: 'string',
          default: ''
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
  getAllBlocks: (state) => state.blocks,
  getBlockById: (state) => (id) => state.blocks.find(block => block.id === id)
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};