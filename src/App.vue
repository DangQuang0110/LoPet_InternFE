<template>
  <Layout>
    <!-- Router sẽ render ra component tương ứng với route -->
    <router-view />
  </Layout>
</template>

<script setup>
// Không cần import router-view nếu bạn đã .use(router) trong main.js
// Chỉ import Layout thôi:
import Layout from '@/components/Layout.vue'
</script>

<style>
/* nế﻿u có style chung cho App thì để ở đây */
</style>
=======
  <div id="app">
    <!-- <Header v-if="!isAdminPage" /> -->
    <router-view />
    <!-- <Footer v-if="!isAdminPage" /> -->
  </div>
</template>

<script>
// import Header from "./layout/ComHeader.vue";


export default {
  name: "App",
  components: {
   // header,
    
  },
  // computed: {
  //   isAdminPage() {
  //     return this.$route.path.startsWith("/admin");
  //   },
  // },
};
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


