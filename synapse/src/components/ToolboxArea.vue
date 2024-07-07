<!-- 
    This component displays the available programming blocks that users can drag into the workspace. 
    It will contain categories of blocks (like Logic, Loops, Math, etc.) and individual block types.
-->
<template>
    <div class="toolbox-area">
      <h2>Toolbox</h2>
      <!-- Add block categories here -->
    </div>
  </template>
  
  <script>
  export default {
    name: 'ToolboxArea'
  }
  </script>
  
  <style scoped>
  .toolbox {
    width: 200px;
    background-color: #f0f0f0;
    padding: 10px;
  }
  </style>