<template>
  <div class="auth-container">
    <div class="auth-box">
      <img src="@/assets/logoPetGram.png" alt="LOPET Logo" class="logo" />
      <h1>Đặt lại mật khẩu</h1>
      <p class="sub-text">Vui lòng nhập mật khẩu cũ và mật khẩu mới để cập nhật tài khoản</p>

      <label>Mật khẩu cũ</label>
      <div class="input-group password-group">
        <input
          :type="showOldPassword ? 'text' : 'password'"
          v-model="oldPassword"
          @input="validateInput"
          placeholder="Nhập mật khẩu cũ"
          :class="{ 'error-input': oldPasswordError }"
        />
        <span class="toggle-password" @click="showOldPassword = !showOldPassword">
          <svg
            v-if="!showOldPassword"
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
      <div v-if="oldPasswordError" class="error-message">{{ oldPasswordError }}</div>

      <label>Mật khẩu mới</label>
      <div class="input-group password-group">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          @input="validateInput"
          placeholder="Nhập mật khẩu mới"
          :class="{ 'error-input': passwordError }"
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
      <div v-if="passwordError" class="error-message">{{ passwordError }}</div>

      <label>Xác nhận mật khẩu mới</label>
      <div class="input-group password-group">
        <input
          :type="showConfirmPassword ? 'text' : 'password'"
          v-model="confirmPassword"
          @input="validateInput"
          placeholder="Nhập lại mật khẩu mới"
          :class="{ 'error-input': confirmPasswordError }"
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
      <div v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</div>

      <button class="btn" @click="handleReset" :disabled="!isFormValid">Đặt lại</button>
      <router-link to="/" class="back">← Trở về trang đăng nhập</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { resetPassword } from '@/service/authService'

const router = useRouter()

const oldPassword = ref('')
const password = ref('')
const confirmPassword = ref('')
const showOldPassword = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const oldPasswordError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const email = localStorage.getItem('email_otp')

const validateInput = () => {
  // Normalize inputs by removing spaces and diacritics
  oldPassword.value = oldPassword.value
    .replace(/\s/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  password.value = password.value
    .replace(/\s/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  confirmPassword.value = confirmPassword.value
    .replace(/\s/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  // Trigger validation for all fields
  validateOldPassword()
  validatePassword()
  validateConfirmPassword()
}

const validateOldPassword = () => {
  if (!oldPassword.value) {
    oldPasswordError.value = 'Vui lòng nhập mật khẩu cũ'
    return false
  }
  const diacriticRegex = /[\u0300-\u036f]/
  if (diacriticRegex.test(oldPassword.value.normalize('NFD'))) {
    oldPasswordError.value = 'Mật khẩu cũ không được chứa ký tự có dấu'
    return false
  }
  const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,15}$/
  if (!passwordRegex.test(oldPassword.value)) {
    oldPasswordError.value = 'Mật khẩu cũ phải có 8-15 ký tự, bao gồm số, chữ thường, chữ in hoa và ký tự đặc biệt (ví dụ: !@#$%^&*)'
    return false
  }
  oldPasswordError.value = ''
  return true
}

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = 'Vui lòng nhập mật khẩu mới'
    return false
  }
  const diacriticRegex = /[\u0300-\u036f]/
  if (diacriticRegex.test(password.value.normalize('NFD'))) {
    passwordError.value = 'Mật khẩu mới không được chứa ký tự có dấu'
    return false
  }
  const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,15}$/
  if (!passwordRegex.test(password.value)) {
    passwordError.value = 'Mật khẩu mới phải có 8-15 ký tự, bao gồm số, chữ thường, chữ in hoa và ký tự đặc biệt (ví dụ: !@#$%^&*)'
    return false
  }
  if (password.value === oldPassword.value && oldPassword.value) {
    passwordError.value = 'Mật khẩu mới không được trùng với mật khẩu cũ'
    return false
  }
  passwordError.value = ''
  return true
}

const validateConfirmPassword = () => {
  if (!confirmPassword.value) {
    confirmPasswordError.value = 'Vui lòng nhập lại mật khẩu mới'
    return false
  }
  if (confirmPassword.value !== password.value) {
    confirmPasswordError.value = 'Mật khẩu xác nhận không khớp với mật khẩu mới'
    return false
  }
  confirmPasswordError.value = ''
  return true
}

const isFormValid = computed(() => {
  return validateOldPassword() && validatePassword() && validateConfirmPassword()
})

const handleReset = async () => {
  const isOldPasswordValid = validateOldPassword()
  const isPasswordValid = validatePassword()
  const isConfirmPasswordValid = validateConfirmPassword()

  if (!isOldPasswordValid || !isPasswordValid || !isConfirmPasswordValid) {
    return
  }

  try {
    await resetPassword({
      email,
      oldPassword: oldPassword.value,
      password: password.value,
      confirmPassword: confirmPassword.value
    })

    oldPasswordError.value = ''
    passwordError.value = ''
    confirmPasswordError.value = ''
    localStorage.removeItem('email_otp')
    localStorage.removeItem('reset_flow')
    router.push('/login')
  } catch (err) {
    oldPasswordError.value = err?.response?.data?.message || 'Đặt lại mật khẩu thất bại'
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
  background-color: #fdecde;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 100%;
  max-width: 400px;
  position: relative;
}

.logo {
  width: 100px;
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
  margin-bottom: 0.5rem;
}

.input-group input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f9f9f9;
  outline: none;
}

.input-group input.error-input {
  border-color: #ef4444;
}

.password-group {
  position: relative;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  user-select: none;
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  text-align: left;
}

.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #f4a261;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover:not(:disabled) {
  background-color: #e07a5f;
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.back {
  display: block;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #1e88e5;
  text-decoration: none;
  text-align: center;
}

.back:hover {
  text-decoration: underline;
}
</style>