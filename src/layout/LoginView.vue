<template>
  <div class="auth-container">
    <div class="auth-box">
      <div class="left-side">
        <img src="@/assets/logoPetGram.png" alt="LOPET" class="logo" />
        <h1>LOPET</h1>
        <p>
          Trang mạng xã hội đầu tiên ở Việt Nam, nơi bạn có thể trao đổi và chia sẻ về thú cưng
        </p>
      </div>
      <div class="right-side">
        <img src="@/assets/logoPetGram.png" alt="LOPET" class="logo" />

        <!-- Email -->
        <div class="input-group">
          <input
            type="text"
            v-model="email"
            @focus="emailFocus = true"
            @blur="emailFocus = false"
          />
          <label :class="{ active: emailFocus || email }">Số điện thoại hoặc email</label>
        </div>

        <!-- Mật khẩu có con mắt -->
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

        <a href="/resetPassword" class="forgot">Quên mật khẩu?</a>
        <button class="btn" @click="handleLogin">Đăng nhập</button>
        <div class="or-divider">Hoặc</div>
        <p class="footer">
          Chưa có tài khoản? <router-link to="/register">Đăng ký ngay</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser } from '@/service/authService'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const emailFocus = ref(false)
const passwordFocus = ref(false)
const router = useRouter()

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  try {
    const response = await loginUser({
      username: email.value,
      password: password.value
    })

    console.log('Login success:', response)

    // Lưu userId vào localStorage
    localStorage.setItem('user', JSON.stringify({ id: response.userId }))

    router.push('/message')
  } catch (err) {
    console.error('Login failed:', err.response?.data || err.message)
    alert(err.response?.data?.message || 'Đăng nhập thất bại')
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

.left-side h1 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.left-side p {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
}

.input-group {
  position: relative;
  margin-bottom: 1.5rem;
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

.forgot:focus,
.forgot:active {
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

.btn:hover {
  background-color: #f57c00;
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

/* ✅ RESPONSIVE */
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

  .left-side h1 {
    font-size: 1.25rem;
  }

  .left-side p {
    font-size: 0.85rem;
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
  .auth-box{
    margin-top:40px;
  }
}

</style>
