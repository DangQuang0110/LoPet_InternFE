<template>
  <div id="app">
    <Header v-if="!isAdminPage" />
    <router-view />
    <Footer v-if="!isAdminPage" />
  </div>
</template>

<script>
// import Header from "./layout/ComHeader.vue";
// import Footer from "./layout/ComFooter.vue";

export default {
  name: "App",
  components: {
    // Header,
    // Footer,
  },
  computed: {
    isAdminPage() {
      return this.$route.path.startsWith("/admin");
    },
  },
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