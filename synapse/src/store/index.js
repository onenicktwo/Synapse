import { createStore } from 'vuex'
import blocks from './modules/blocks'
import workspace from './modules/workspace'

const store = createStore({
  modules: {
    blocks,
    workspace
  }
})

export default store