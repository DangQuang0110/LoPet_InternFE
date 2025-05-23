<template>
  <Layout>
    <!-- Router sẽ render ra component tương ứng với route -->
    <router-view />
  </Layout>
</template>

<script setup>
// Import Layout nếu bạn muốn dùng layout bao quanh các trang
import Layout from '@/components/Layout.vue'
</script>
<style>
#vite-devtools-toggle {
  display: none !important;
}

html, body, #app {
  margin: 0;
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
