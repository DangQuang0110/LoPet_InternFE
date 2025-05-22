<template>
  <div class="auth-container">
    <div class="auth-box single">
      <img src="@/assets/logoPetGram.png" alt="LOPET" class="logo" />
      <h1>Đăng ký tài khoản</h1>
      <p class="sub-text">Tham gia cộng đồng yêu thú cưng ngay hôm nay!</p>

      <div class="input-group">
        <input
          type="text"
          v-model="contact"
          @focus="contactFocus = true"
          @blur="contactFocus = false"
          placeholder=" "
        />
        <label :class="{ active: contactFocus || contact }">Số điện thoại hoặc email</label>
      </div>

      <div class="input-group">
        <input
          type="text"
          v-model="fullname"
          @focus="fullnameFocus = true"
          @blur="fullnameFocus = false"
          placeholder=" "
        />
        <label :class="{ active: fullnameFocus || fullname }">Tên đầy đủ</label>
      </div>

      <!-- Mật khẩu -->
      <div class="input-group password-group">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          @focus="passwordFocus = true"
          @blur="passwordFocus = false"
          placeholder=" "
        />
        <label :class="{ active: passwordFocus || password }">Mật khẩu</label>
        <span class="toggle-password" @click="togglePassword">
          <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 1l22 22" />
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5.5 0-10-4.5-10-10 0-2.5 1-4.7 2.64-6.36" />
            <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
            <path d="M12 4c4.5 0 8.3 2.7 9.54 6.36" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </span>
      </div>

      <!-- Xác nhận mật khẩu -->
      <div class="input-group password-group">
        <input
          :type="showConfirm ? 'text' : 'password'"
          v-model="confirmPassword"
          @focus="confirmFocus = true"
          @blur="confirmFocus = false"
          placeholder=" "
        />
        <label :class="{ active: confirmFocus || confirmPassword }">Nhập lại mật khẩu</label>
        <span class="toggle-password" @click="toggleConfirm">
          <svg v-if="!showConfirm" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 1l22 22" />
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5.5 0-10-4.5-10-10 0-2.5 1-4.7 2.64-6.36" />
            <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
            <path d="M12 4c4.5 0 8.3 2.7 9.54 6.36" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </span>
      </div>

      <button class="btn" @click="handleRegister">Đăng ký</button>
      <router-link to="/" class="back">← Trở về trang đăng nhập</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { sendOTP } from '@/service/otpService'

const contact = ref('')
const contactFocus = ref(false)
const fullname = ref('')
const fullnameFocus = ref(false)
const password = ref('')
const passwordFocus = ref(false)
const showPassword = ref(false)
const confirmPassword = ref('')
const confirmFocus = ref(false)
const showConfirm = ref(false)

const router = useRouter()

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirm = () => {
  showConfirm.value = !showConfirm.value
}

const handleRegister = async () => {
  try {
    await sendOTP(contact.value)
    localStorage.setItem('register_email', contact.value)
    localStorage.setItem('register_username', fullname.value)
    localStorage.setItem('register_password', password.value)
    localStorage.setItem('register_confirm', confirmPassword.value)
    router.push('/verificationCode')
  } catch (err) {
    alert(err?.response?.data?.message || 'Gửi OTP thất bại!')
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
  background-repeat: no-repeat;
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
  width: 120px;
  margin: 0 auto 1rem; 
  display: block;
}

h1 {
  font-size: 1.6rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.sub-text {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 1.5rem;
  text-align: center;
}

.input-group {
  position: relative;
  width: 100%;
  margin-bottom: 1.25rem;
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
  top: -10px;
  left: 8px;
  font-size: 0.75rem;
  color: #ffa726;
  font-weight: 600;
}

.password-group {
  position: relative;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  cursor: pointer;
  user-select: none;
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

.back {
  display: block;
  margin-top: 1rem;
  color: #1e88e5;
  font-size: 0.9rem;
  text-decoration: none;
  text-align: center;
  background-color: transparent !important;
  outline: none;
  border: none;
}

.back:hover {
  text-decoration: underline;
}
</style>
