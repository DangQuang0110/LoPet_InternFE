<template>
    <router-view />
</template>
<script setup>
import apiService from '@/api/apiService'

const token = localStorage.getItem('accessToken')
if (token) {
  apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

</script>
<style>
#vite-devtools-toggle {
  display: none !important;
}

html, body, #app {
  margin: 0;
    overflow-y: auto; /* ✅ chặn luôn tràn ngang */
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
