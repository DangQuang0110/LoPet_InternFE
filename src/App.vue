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
