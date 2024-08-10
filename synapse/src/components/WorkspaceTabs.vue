<template>
  <div class="workspace-tabs">
    <div v-for="workspace in workspaces" :key="workspace" class="tab" :class="{ active: workspace === activeWorkspace }">
      <span @click="setActiveWorkspace(workspace)">
        {{ workspace }}
      </span>
      <button class="delete-tab" @click.stop="deleteWorkspace(workspace)">×</button>
    </div>
    <div class="tab new-tab" @click="createNewWorkspace">+</div>
  </div>
</template>

<script lang="ts">
import store from '@/store';
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default defineComponent({
  name: 'WorkspaceTabs',
  computed: {
    ...mapGetters('workspace', ['getAllWorkspaces', 'getActiveWorkspace']),
    workspaces(): string[] {
      return this.getAllWorkspaces;
    },
    activeWorkspace(): string | null {
      return this.getActiveWorkspace;
    },
  },
  methods: {
    ...mapActions('workspace', ['setActiveWorkspace', 'addWorkspace', 'deleteWorkspace']),
    createNewWorkspace() {
      const name = prompt('Enter class name:');
      if (name) {
        this.addWorkspace(name);
      }
    },
    setActiveWorkspace(workspaceName: string) {
      const workspace = (store.state.workspace as any).workspaces.find((w: any) => w.name === workspaceName);
      if (workspace) {
        store.dispatch('workspace/setActiveWorkspace', workspace.id);
      }
    },
    deleteWorkspace(workspaceName: string) {
      const workspace = (store.state.workspace as any).workspaces.find((w: any) => w.name === workspaceName);
      if (workspace) {
        store.dispatch('workspace/deleteWorkspace', workspace.id);
      }
    }
  },
});
</script>


<style scoped>
.workspace-tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
}

.tab {
  padding: 10px 20px;
  cursor: pointer;
  border-right: 1px solid #e0e0e0;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
}

.tab:hover {
  background-color: #e9ecef;
}

.tab.active {
  background-color: #fff;
  border-bottom: 2px solid #007bff;
}

.new-tab {
  font-weight: bold;
  color: #007bff;
}

.delete-tab {
  margin-left: 5px;
  color: red;
  font-weight: bold;
  background: none;
  border: none;
  cursor: pointer;
}

.delete-tab:hover {
  color: darkred;
}
</style>