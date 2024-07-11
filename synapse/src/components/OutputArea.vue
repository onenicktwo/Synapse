<!--
    This component displays the output of the program when it's run. It could show print statements, error messages, or other program results.
-->
<template>
  <div class="output-area">
    {{ output }} 
  </div>
</template>

<script>
export default {
  name: 'OutputArea',
  props: {
    output: {
      type: String,
      default: ''
    }
  }
};
</script>
  
  <style scoped>
  .output-area {
    width: 300px;
    background-color: #e0e0e0;
    padding: 10px;
  }
  </style>