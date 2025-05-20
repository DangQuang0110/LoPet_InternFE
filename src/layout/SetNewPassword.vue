<template>
  <div class="auth-container">
    <div class="auth-box">
      <img src="@/assets/logoPetGram.png" alt="LOPET Logo" class="logo" />
      <h1>Đặt lại mật khẩu</h1>
      <p class="sub-text">Vui lòng nhập mật khẩu mới để cập nhật tài khoản</p>

      <label>Mật khẩu mới</label>
      <div class="input-group">
        <input
          :type="showPassword ? 'text' : 'password'"
          placeholder="Nhập mật khẩu mới"
        />
        <span @click="showPassword = !showPassword">
          <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </span>
      </div>

      <label>Xác nhận mật khẩu mới</label>
      <div class="input-group">
        <input
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="Nhập lại mật khẩu"
        />
        <span @click="showConfirmPassword = !showConfirmPassword">
          <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </span>
      </div>

      <button class="btn">Đặt lại mật khẩu</button>
      <router-link to="/" class="back">← Trở về trang đăng nhập</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showPassword = ref(false);
const showConfirmPassword = ref(false);
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
  width: 100%;
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
  color: #444;
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
