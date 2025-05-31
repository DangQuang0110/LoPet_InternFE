<template>
  <div class="auth-container">
    <div class="auth-box">
      <img src="@/assets/logoPetGram.png" alt="LOPET Logo" class="logo" />
      <p>Gặp sự cố khi đăng nhập?</p>
      <p>
        Nhập email đã liên kết để đăng nhập vào tài khoản.
      </p>
      <div class="input-group">
        <input
         
         v-model="contact"
  type="email"
  placeholder="Nhập email"
  @blur="validateEmail"
  class="input"
/>
<p v-if="emailError" style="color: red; font-size: 14px; margin-top: 4px">
  {{ emailError }}
</p>
      </div>
      <button class="btn" @click="sendLink">Gửi mã OTP</button>
      <router-link to="/login" class="back">← Trở về trang đăng nhập</router-link>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { sendOTP } from '@/service/otpService'

const router = useRouter()
const contact = ref('')
const contactFocus = ref(false)
const emailError = ref('')



// onMounted(()=>{

const validateEmail = () => {
  const email = contact.value.trim()

  if (!email) {
    emailError.value = 'Vui lòng nhập email!'
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    emailError.value = 'Email không đúng định dạng!'
    return false
  }

  emailError.value = ''
  return true
}

// })
const sendLink = async () => {
  if (!validateEmail()) return

  try {
    await sendOTP(contact.value.trim())

    localStorage.setItem('reset_flow', 'true')
    localStorage.setItem('email_otp', contact.value.trim())

    router.push('/verificationCode')
  } catch (err) {
    emailError.value = err.message || 'Lỗi gửi OTP!'
  }
}

</script>

<style scoped>
.auth-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/background.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-box {
  background-color: #fff9ef;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.logo {
  width: 125px;
  margin: 0 auto 1rem;
    margin: 0 auto 1rem; 
  display: block;
}

/* .error-message {
  color: red;
  font-size: 14px;
  margin-top: 4px;
} */

.auth-box h1 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.auth-box p {
  font-size: 0.875rem;
  color: #374151;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

.input-group {
  position: relative;
  margin-bottom: 1rem;
  text-align: left;
}

.input-group input {
  width: 100%;
  padding: 14px 10px;
  font-size: 1rem;
  border: 1px solid #f4ae18;
  border-radius: 4px;
  background: transparent;
  outline: none;
}

.input-group label {
  position: absolute;
  left: 10px;
  top: 14px;
  color: #999;
  pointer-events: none;
  transition: all 0.2s ease;
  background-color: #fff9ef;
  padding: 0 4px;
  font-size: 1rem;
}

.input-group label.active {
  top: -8px;
  left: 8px;
  font-size: 0.75rem;
  color: #ff9800;
  font-weight: 500;
}

.input-group label.active {
  top: -10px;
  left: 8px;
  font-size: 0.75rem;
  color: #ffa726;
  font-weight: 600;
}

.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #ffa726;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 0.5rem;
}

.btn:hover {
  background-color: #fb8c00;
}

.auth-box a {
  color: #3b82f6;
  font-size: 0.875rem;
  margin-top: 1rem;
  display: block;
  text-decoration: none;
  background-color: transparent !important;
  outline: none;
  -webkit-tap-highlight-color: transparent; /* Ngăn nền xanh trên thiết bị cảm ứng */
}

.auth-box a:hover {
  text-decoration: underline;
}

.auth-box a:focus,
.auth-box a:active {
  background-color: transparent !important;
  outline: none;
  box-shadow: none;
}

</style>
