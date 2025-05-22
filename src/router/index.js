import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/ComHome.vue'
import CreatePost from '@/components/CreatePost.vue'


const routes = [
  { path: '/home',    name: 'Home',       component: Home },
  { path: '/create-post',    name: 'CreatePost',       component: CreatePost },
 
  // ... các route khác
]

export default createRouter({
  history: createWebHistory(),
  routes
})

