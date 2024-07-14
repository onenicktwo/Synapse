import { createStore } from 'vuex'
import blocks from './modules/blocks'
import workspace from './modules/workspace'

export default createStore({
  modules: {
    blocks,
    workspace
  }
})