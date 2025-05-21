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

        <!-- Số điện thoại hoặc email -->
        <div class="input-group">
          <input
            type="text"
            v-model="email"
            @focus="emailFocus = true"
            @blur="emailFocus = false"
          />
          <label :class="{ active: emailFocus || email }">Số điện thoại hoặc email</label>
        </div>

        <!-- Mật khẩu -->
        <div class="input-group">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            @focus="passwordFocus = true"
            @blur="passwordFocus = false"
            placeholder=" "
          />
          <label :class="{ active: passwordFocus || password }">Mật khẩu</label>
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
    console.log(' Login success:', response)
    router.push('/message')
  } catch (err) {
    console.error(' login failed:', err.response?.data || err.message)
    alert(err.response?.data?.message || 'Đăng nhập thất bại')
  }
}
</script>
<style scoped>
/* Giữ nguyên style của bạn */
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
  display: flex;
  width: 999px;
  max-width: 80%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
  width: 125px;
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

.forgot {
  margin-top: -0.5rem;
  margin-bottom: 1rem;
  color: #1e88e5;
  font-size: 0.85rem;
  text-align: right;
  display: block;
  background-color: transparent !important; /* Xóa nền */
  outline: none; /* Loại bỏ viền focus */
  border: none;
}

.forgot:focus,
.forgot:active {
  background-color: transparent !important; /* Ngăn không hiện nền khi focus hoặc active */
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

.footer a,
.footer a:focus,
.footer a:active,
.footer a.router-link-active,
.footer a.router-link-exact-active {
  outline: none !important;
  box-shadow: none !important;
  background-color: transparent !important;
  color: #1e88e5;
}

</style>
