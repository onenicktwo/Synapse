<!--
    This component displays the textual representation of the visual program. 
    As users build their program with blocks, this view will show the equivalent code in a text format.
-->
<template>
    <div class="code-view">
      <h2>Code View</h2>
      <!-- Add code display here -->
    </div>
  </template>
  
  <script>
  export default {
    name: 'Code-View'
  }
  </script>
  
  <style scoped>
  .code-view {
    width: 300px;
    background-color: #f8f8f8;
    padding: 10px;
  }
  </style>