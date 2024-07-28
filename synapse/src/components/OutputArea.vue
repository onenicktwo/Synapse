<template>
  <div class="output-area">
    <div class="output-header">
      <h2 class="output-title">Output</h2>
      <button @click="clearOutput" class="clear-button" v-if="output.length > 0">Clear</button>
    </div>
    <div class="output-content" ref="outputContent">
      <pre v-if="output.length > 0">{{ formattedOutput }}</pre>
      <p v-else class="no-output">No output yet. Run your program to see results here.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'OutputArea',
  setup() {
    const store = useStore();
    const outputContent = ref<HTMLElement | null>(null);

    const output = computed(() => store.getters['getOutput']);
    const formattedOutput = computed(() => output.value.join('\n'));

    const clearOutput = () => {
      store.dispatch('clearOutput');
    };

    watch(output, () => {
      if (outputContent.value) {
        outputContent.value.scrollTop = outputContent.value.scrollHeight;
      }
    });

    return {
      output,
      formattedOutput,
      clearOutput,
      outputContent,
    };
  },
});
</script>

<style scoped>
.output-area {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  min-width: 300px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
}

.output-title {
  font-family: 'Roboto', sans-serif;
  font-size: 1.25rem;
  color: #343a40;
  margin: 0;
}

.clear-button {
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.clear-button:hover {
  background-color: #5a6268;
}

.output-content {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  background-color: #ffffff;
  border-radius: 4px;
  padding: 1rem;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #212529;
}

.no-output {
  color: #6c757d;
  font-style: italic;
  margin: 0;
}

/* Custom scrollbar styles */
.output-content::-webkit-scrollbar {
  width: 8px;
}

.output-content::-webkit-scrollbar-track {
  background: #f1f3f5;
}

.output-content::-webkit-scrollbar-thumb {
  background-color: #ced4da;
  border-radius: 4px;
}

.output-content::-webkit-scrollbar-thumb:hover {
  background-color: #adb5bd;
}

@media (max-width: 768px) {
  .output-area {
    min-width: 100%;
    border-radius: 0;
  }

  .output-content {
    max-height: 300px;
  }
}

.output-line {
  margin-bottom: 0.5rem;
}

.output-line:last-child {
  margin-bottom: 0;
}

.output-timestamp {
  color: #6c757d;
  font-size: 0.8rem;
  margin-right: 0.5rem;
}

.output-text {
  color: #212529;
}

.error-text {
  color: #dc3545;
}

.warning-text {
  color: #ffc107;
}

.success-text {
  color: #28a745;
}
</style>
