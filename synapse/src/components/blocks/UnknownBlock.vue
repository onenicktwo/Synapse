<template>
    <div>Unknown Block Type: {{ block.type }}</div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { Block } from './types';
  
  export default defineComponent({
    name: 'UnknownBlock',
    props: {
      block: {
        type: Object as PropType<Block>,
        required: true
      }
    }
  });
  </script>