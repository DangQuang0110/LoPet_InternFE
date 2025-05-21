<template>
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
