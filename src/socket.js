import { io } from 'socket.io-client'

const currentUser = JSON.parse(localStorage.getItem('user'))
const socket = io('http://localhost:8080', {
  query: {
    userId: currentUser?.id || 0 // gửi userId cho server
  },
  auth: {
    token: localStorage.getItem('accessToken')
  }
})

export default socket
