
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
import apiService from '@/api/apiService'

const token = localStorage.getItem('accessToken')
if (token) {
  apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

