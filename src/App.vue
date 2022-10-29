<script setup>
  
</script>

<template>
  <router-view></router-view>
</template>

<style>
body{
  @apply bg-gray-100;
}
#nprogress .bar{
  background: red !important;
}
::-webkit-scrollbar{
  width: 4px;
}
::-webkit-scrollbar-thumb{
  border-radius: 8px;
  background: rgba(0,0,0,.2);
}
::-webkit-scrollbar-track{
  background: rgba(0,0,0,.1);
}
</style>
