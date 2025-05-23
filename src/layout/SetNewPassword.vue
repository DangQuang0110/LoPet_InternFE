<template>
  <div class="auth-container">
    <div class="auth-box">
      <img src="@/assets/logoPetGram.png" alt="LOPET Logo" class="logo" />
      <h1>Đặt lại mật khẩu</h1>
      <p class="sub-text">Vui lòng nhập mật khẩu mới để cập nhật tài khoản</p>

      <label>Mật khẩu mới</label>
      <div class="input-group password-group">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          placeholder="Nhập mật khẩu mới"
        />
        <span class="toggle-password" @click="showPassword = !showPassword">
          <svg
            v-if="!showPassword"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#888"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M1 1l22 22" />
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5.5 0-10-4.5-10-10 0-2.5 1-4.7 2.64-6.36" />
            <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
            <path d="M12 4c4.5 0 8.3 2.7 9.54 6.36" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#888"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </span>
      </div>

      <label>Xác nhận mật khẩu mới</label>
      <div class="input-group password-group">
        <input
          :type="showConfirmPassword ? 'text' : 'password'"
          v-model="confirmPassword"
          placeholder="Nhập lại mật khẩu"
        />
        <span class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
          <svg
            v-if="!showConfirmPassword"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#888"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M1 1l22 22" />
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5.5 0-10-4.5-10-10 0-2.5 1-4.7 2.64-6.36" />
            <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
            <path d="M12 4c4.5 0 8.3 2.7 9.54 6.36" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#888"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </span>
      </div>

      <button class="btn" @click="handleReset">Đặt lại mật khẩu</button>
      <router-link to="/" class="back">← Trở về trang đăng nhập</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { resetPassword } from '@/service/authService'

const router = useRouter()

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const email = localStorage.getItem('email_otp')

const handleReset = async () => {
  if (!password.value || !confirmPassword.value) {
    alert('Vui lòng nhập đầy đủ thông tin!')
    return
  }

  if (password.value !== confirmPassword.value) {
    alert('Mật khẩu không khớp!')
    return
  }

  try {
    await resetPassword({
      email,
      password: password.value,
      confirmPassword: confirmPassword.value
    })

    alert('Đặt lại mật khẩu thành công!')
    localStorage.removeItem('email_otp')
    localStorage.removeItem('reset_flow')

    router.push('/')
  } catch (err) {
    console.error('Lỗi reset mật khẩu:', err)
    alert(err?.response?.data?.message || 'Đặt lại mật khẩu thất bại!')
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
  width: 120px;
  margin-bottom: 1rem;
    margin: 0 auto 1rem; 
  display: block;
}

h1 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.sub-text {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 1.5rem;
}

label {
  display: block;
  text-align: left;
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 0.3rem;
}

.input-group {
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
}

.input-group input {
  width: 100%;
  padding: 14px 40px 14px 10px;
  font-size: 1rem;
  border: 1px solid #f4ae18;
  border-radius: 4px;
  background: transparent;
  outline: none;
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
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #fb8c00;
}

.back {
  display: block;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #1e88e5;
  text-decoration: none;
  text-align: center;
  background: transparent;
  padding: 0;
}

.back:hover {
  text-decoration: underline;
  background: transparent;
}
</style>
