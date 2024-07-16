<template>
  <div class="output-area">
    <h2 class="output-title">Output</h2>
    <div class="output-content">
      <pre v-if="output.length > 0">{{ output.join('\n') }}</pre>
      <p v-else class="no-output">No output yet. Run your program to see results here.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'OutputArea',
  computed: {
    ...mapGetters(['getOutput']),
    output(): string[] {
      return this.getOutput;
    }
  }
});
</script>

<style scoped>
.output-area {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  min-width: 300px; /* Minimum width */
  width: 100%; /* Full width of parent */
  max-width: 800px; /* Maximum width */
  margin: 0 auto; /* Center the output area if it's less than the parent width */
}

.output-title {
  font-family: 'Roboto', sans-serif;
  font-size: 1.25rem;
  color: #343a40;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
}

.output-content {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
}

pre {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 1rem;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #212529;
  width: 100%; /* Ensure pre takes full width of its container */
  box-sizing: border-box; /* Include padding in width calculation */
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
</style>