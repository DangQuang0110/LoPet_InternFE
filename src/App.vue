<template>
    <router-view />
</template>
<script setup>
</script>
<style>
#vite-devtools-toggle {
  display: none !important;
}
html, body, #app {
  margin: 0;
    overflow-x: hidden; /* ✅ chặn luôn tràn ngang */
  padding: 0;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
}
</style>
