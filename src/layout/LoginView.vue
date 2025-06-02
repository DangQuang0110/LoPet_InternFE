<template>
  <div class="auth-container">
    <div class="auth-box">
      <div class="left-side">
        <img src="@/assets/logoPetGram.png" alt="LOPET" class="logo" />
        <p>
          Trang mạng xã hội đầu tiên ở Việt Nam, nơi bạn có thể trao đổi và chia sẻ về thú cưng
        </p>
      </div>
      <div class="right-side">
        <img src="@/assets/logoPetGram.png" alt="LOPET" class="logo" />

        <!-- Username -->
        <div class="input-group">
          <input
            type="text"
            v-model="email"
            @focus="emailFocus = true"
            @blur="() => { emailFocus = false; validateEmail() }"
            @input="validateEmail"
            placeholder=" "
          />
          <label :class="{ active: emailFocus || email }">Tên Người dùng</label>
          <p v-if="errors.email" class="error">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div class="input-group password-group">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            @focus="passwordFocus = true"
            @blur="() => { passwordFocus = false; validatePassword() }"
            @input="validatePassword"
            placeholder=" "
          />
          <label :class="{ active: passwordFocus || password }">Mật khẩu</label>
          <span class="toggle-password" @click="togglePassword">
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
              <path
                d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5.5 0-10-4.5-10-10 0-2.5 1-4.7 2.64-6.36"
              />
              <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
              <path d="M12 4c4.5 0 8.3 2.7 9.54 6.36" />
            </svg>
            <svg
              class="svg-icon"
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
              <path
                class="hideeyes-icon"
                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </span>
          <p v-if="errors.password" class="error">{{ errors.password }}</p>
        </div>

        <a href="/resetPassword" class="forgot">Quên mật khẩu?</a>
        <button class="btn" :disabled="!isFormValid" @click="handleLogin">
          Đăng nhập
        </button>

        <div class="or-divider">Hoặc</div>
        <p class="footer">
          Chưa có tài khoản? <router-link to="/register">Đăng ký ngay</router-link>
        </p>
        <p
          v-if="loginMessage"
          :class="['login-notification', messageType]"
        >
          {{ loginMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import { loginUser, getAccountById } from '@/service/authService'

const email = ref('')
const password = ref('')
const emailFocus = ref(false)
const passwordFocus = ref(false)
const showPassword = ref(false)

// Dùng biến để tránh hiển thị toast khi toast cũ chưa ẩn hết
let isToastActive = false

// Regex: tên đăng nhập gồm ít nhất 1 chữ + 1 số, chỉ gồm chữ & số
const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/

// Regex: 8-16 ký tự, ít nhất 1 in hoa, 1 số, 1 đặc biệt
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,16}$/

const errors = reactive({
  email: '',
  password: ''
})

const validateEmail = () => {
  const value = email.value
   if (!value) {
    errors.email = 'Vui lòng nhập tên đăng nhập'
  } else if (value.length < 6 || value.length > 20) {
    errors.email = 'Tên đăng nhập phải từ 6 đến 20 ký tự'
  } else if (/\s/.test(value)) {
    errors.email = 'Tên đăng nhập không được chứa khoảng trắng'
  } else if (/^\d+$/.test(value)) {
    errors.email = 'Tên đăng nhập không được chỉ gồm số'
  } else if (!usernameRegex.test(value)) {
    errors.email = 'Phải có ít nhất 1 chữ và 1 số, chỉ chứa chữ & số'
  } else {
    errors.email = ''
  }
}

const validatePassword = () => {
  if (!password.value) {
    errors.password = 'Vui lòng nhập mật khẩu'
  } else if (/\s/.test(password.value)) {
    errors.password = 'Mật khẩu không được chứa khoảng trắng'
  } else if (password.value.length < 8 || password.value.length > 15) {
    errors.password = 'Mật khẩu phải từ 8 đến 15 ký tự'
  } else if (!passwordRegex.test(password.value)) {
    errors.password = 'Mật khẩu phải có 1 chữ in hoa, 1 ký tự đặc biệt và 1 số'
  } else {
    errors.password = ''
  }
}

const isFormValid = computed(() => {
  return email.value && password.value && !errors.email && !errors.password
})

const router = useRouter()

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

function showErrorToast(message) {
  if (isToastActive) return
  isToastActive = true

  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: 'top',       // xuất hiện phía trên
    position: 'right',    // góc phải
    backgroundColor: 'linear-gradient(to right, #e0251f, #f57c00)',
    style: {
      transform: 'translateX(100%)',               // khởi đầu bên ngoài bên phải
      animation: 'slide-in-right 0.5s forwards'    // áp dụng animation
    }
  }).showToast()

  // Reset lại flag sau khi toast được ẩn (3000ms + 500ms animation)
  setTimeout(() => {
    isToastActive = false
  }, 3500)
}

const handleLogin = async () => {
  // validate form trước khi gọi API
  validateEmail()
  validatePassword()
  if (!isFormValid.value) return

  try {
    const loginResponse = await loginUser({
      username: email.value,
      password: password.value
    })

    const { userId } = loginResponse
    const account = await getAccountById(userId)
    const roleNames = account.roles || []

    localStorage.setItem(
      'user',
      JSON.stringify({ id: userId, username: account.username, roles: roleNames })
    )

    const hasAdminRole = roleNames.includes('ADMIN')
    const hasAdsRole = roleNames.includes('ADS')

    if (hasAdminRole || hasAdsRole) {
      router.push('/admin')
    } else {
      router.push('/home')
    }
  } catch (err) {
    const msg = err.response?.data?.message || 'Đăng nhập thất bại'
    showErrorToast(msg)
  }
}
</script>

<style scoped>
.auth-container {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('@/assets/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 1rem;
  overflow-y: auto;
}

.auth-box {
  display: flex;
  flex-direction: row;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 900px;
}

.left-side,
.right-side {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.left-side {
  background-color: #fdecde;
}

.right-side {
  background-color: #fff9ef;
}

.logo {
  width: 100px;
  height: auto;
  display: block;
  margin: 0 auto 1rem;
}

.input-group {
  position: relative;
  margin-bottom: 0.5rem;
  text-align: left;
  min-height: 72px; /* Giữ cố định chiều cao để không bị nhảy */
}

.input-group {
  position: relative;
  margin-bottom: 1.2rem;
  text-align: left;
  min-height: 90px; /* Cố định chiều cao toàn bộ input + label + error */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.input-group input {
  width: 100%;
  padding: 14px 10px;
  font-size: 1rem;
  border: 1px solid #f4ae18;
  border-radius: 4px;
  background: transparent;
  outline: none;
  min-height: 45px;
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

.password-group {
  position: relative;
}

.toggle-password {
  position: absolute;
  top: 30%;
  right: 12px;
  transform: translateY(-50%);
  cursor: pointer;
  user-select: none;
}

.forgot {
  margin-top: -0.5rem;
  margin-bottom: 1rem;
  color: #1e88e5;
  font-size: 0.85rem;
  text-align: right;
  display: block;
  background-color: transparent !important;
  outline: none;
  border: none;
}

.btn {
  margin-top: 0.5rem;
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 4px;
  background-color: #ff9800;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn:hover:not(:disabled) {
  background-color: #f57c00;
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.or-divider {
  margin: 1rem 0;
  font-size: 0.8rem;
  color: #565656;
  position: relative;
  display: flex;
  align-items: center;
  text-transform: uppercase;
}

.or-divider::before,
.or-divider::after {
  content: '';
  height: 1px;
  background: #ccc;
  flex: 1;
  margin: 0 10px;
}

.footer a {
  color: #1e88e5;
  text-decoration: none;
}

.error {
  min-height: 18px; /* Dù không có lỗi vẫn giữ chỗ cho dòng thông báo */
  color: #e0251f;
  font-size: 0.85rem;
  margin-top: 6px;
  margin-bottom: 0;
  text-align: left;
}

/* --- Animation “slide-in-right” cho Toastify --- */
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
/* ---------------------------------------------- */

/* RESPONSIVE */
@media (max-width: 768px) {
  .auth-box {
    flex-direction: column;
    max-width: 100%;
  }

  .left-side,
  .right-side {
    padding: 1.5rem;
  }

  .logo {
    width: 90px;
  }
}

@media (max-width: 480px) {
  .input-group input {
    padding: 12px 10px;
    font-size: 0.95rem;
  }

  .btn {
    padding: 10px;
    font-size: 0.95rem;
  }

  .forgot {
    font-size: 0.8rem;
  }

  .or-divider {
    font-size: 0.7rem;
  }

  .auth-box {
    margin-top: 40px;
  }
}

.password-group input {
  padding-right: 3rem; /* tăng vùng trống bên phải */
}

/* Cố định kích thước và căn giữa icon */
.toggle-password {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  z-index: 2;
}
.toggle-password svg {
  width: 20px;
  height: 20px;
  stroke: #888;
  /* margin-top: -30px; */
}

.password-group input:focus ~ .toggle-password svg,
.toggle-password:hover svg {
  /* stroke: #ff9800; */
  /* margin-top: -30px; */
}
</style>
