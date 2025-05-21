<template>
  <div class="auth-container">
    <div class="auth-box">
      <img src="@/assets/logoPetGram.png" alt="LOPET Logo" class="logo" />
      <p>Hãy nhập mã xác thực được gửi tới email của bạn</p>
      <p>Mã OTP sẽ hết hạn trong vòng 2 phút</p>

      <div class="otp-inputs">
        <input
          v-for="(digit, index) in otp"
          :key="index"
          :id="`otp-input-${index}`"
          type="text"
          maxlength="1"
          class="otp-input"
          v-model="otp[index]"
          @input="(e) => handleOtpInput(e, index)"
        />
      </div>

      <a
        href="#"
        @click.prevent="resendOtp"
        :style="{ pointerEvents: countdown === 0 ? 'auto' : 'none', opacity: countdown === 0 ? 1 : 0.5 }"
      >
        Gửi lại mã OTP {{ formatCountdown() }}
      </a>

      <!-- Nút cho xác minh -->
      <button class="btn" @click="sendLink">Xác nhận</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { verifyOTP } from '@/service/otpService'
import { registerUser, resetPassword } from '@/service/authService'

const router = useRouter()
const otp = ref(['', '', '', '', '', ''])
const countdown = ref(120)
let intervalId = null

// ✅ Xác định đang ở luồng reset password hay đăng ký
const isResetPasswordFlow = ref(localStorage.getItem('reset_flow') === 'true')

// ✅ Lấy email phù hợp theo luồng
const email = isResetPasswordFlow.value
  ? localStorage.getItem('email_otp')              // reset password
  : localStorage.getItem('register_email')     // đăng ký

const username = localStorage.getItem('register_username')
const password = localStorage.getItem('register_password')
const confirmPassword = localStorage.getItem('register_confirm')
console.log('Luồng:', isResetPasswordFlow.value ? 'RESET' : 'REGISTER')
console.log('Email lấy ra:', email)

const handleOtpInput = async (event, index) => {
  const value = event.target.value
  if (!/^\d?$/.test(value)) {
    otp.value[index] = ''
    return
  }
  otp.value[index] = value

  if (value.length === 1 && index < otp.value.length - 1) {
    await nextTick()
    const nextInput = document.querySelector(`#otp-input-${index + 1}`)
    if (nextInput) nextInput.focus()
  }
}

const startCountdown = () => {
  intervalId = setInterval(() => {
    if (countdown.value > 0) countdown.value--
    else clearInterval(intervalId)
  }, 1000)
}

onMounted(() => {
  document.querySelector('#otp-input-0')?.focus()
  startCountdown()
})

onBeforeUnmount(() => clearInterval(intervalId))

const resendOtp = async () => {
  alert('Chức năng gửi lại mã OTP đang được phát triển.')
}

const sendLink = async () => {
  const otpString = otp.value.join('')
  if (otpString.length !== 6) return alert('Vui lòng nhập đủ 6 số!')

  try {
    console.log('📤 Gửi verify OTP với:', { email, otp: otpString })
    await verifyOTP({ email, otp: otpString })

    if (isResetPasswordFlow.value) {
      localStorage.setItem('email_otp', email)
      router.push('/setNewPassword')
    } else {
      // ✅ Đăng ký tài khoản
      await registerUser({ email, username, password, confirmPassword })

      // Dọn dẹp localStorage
      localStorage.removeItem('register_email')
      localStorage.removeItem('register_username')
      localStorage.removeItem('register_password')
      localStorage.removeItem('register_confirm')
      localStorage.removeItem('reset_flow')

      alert('Đăng ký thành công!')
      router.push('/')
    }
  } catch (err) {
    console.error('❌ Lỗi verifyOTP:', err)
    alert(err?.response?.data?.message || 'Xác minh OTP hoặc xử lý thất bại!')
  }
}

const formatCountdown = () => {
  const min = String(Math.floor(countdown.value / 60)).padStart(2, '0')
  const sec = String(countdown.value % 60).padStart(2, '0')
  return `${min}:${sec}`
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
  background-color: rgba(249, 243, 234, 0.937);
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

.auth-box p {
  font-size: 0.875rem;
  color: #374151;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

.otp-inputs {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.otp-input {
  width: 45px;
  height: 50px;
  border: 2px solid #f4ae18;
  border-radius: 8px;
  text-align: center;
  font-size: 1.2rem;
  transition: border-color 0.3s;
}

.otp-input:focus {
  border-color: #fb8c00;
  outline: none;
  box-shadow: 0 0 5px rgba(251, 140, 0, 0.5);
}

.auth-box a {
  color: #3b82f6;
  font-size: 0.875rem;
  margin-top: 1rem;
  display: block;
  text-decoration: none;
  background: transparent;
  padding: 0;
}

.auth-box a:hover {
  text-decoration: underline;
  background: transparent;
}

.btn {
  margin-top: 1rem;
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 8px;
  background-color: #ffa726;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
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
