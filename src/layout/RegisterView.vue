<template>
  <div class="auth-container">
    <div class="auth-box single">
      <img src="@/assets/logoPetGram.png" alt="LOPET" class="logo" />
      <h1>Đăng ký tài khoản</h1>
      <p class="sub-text">Tham gia cộng đồng yêu thú cưng ngay hôm nay!</p>

      <!-- Email -->
      <div class="input-group">
        <input
          type="text"
          v-model="contact"
          @focus="contactFocus = true"
          @blur="contactFocus = false"
          @input="validateContact"
          placeholder=" "
          :class="{ 'error': contactError && contactError !== '' }"
        />
        <label :class="{ active: contactFocus || contact }">Email</label>
        <div class="validation-message" :class="{ 'error': contactError }">
          {{ contactError || '' }}
        </div>
      </div>

      <!-- Tên Người dùng -->
      <div class="input-group">
        <input
          type="text"
          v-model="fullname"
          @focus="fullnameFocus = true"
          @blur="() => { fullnameFocus = false; checkUsername() }"
          @input="handleFullnameInput"
          placeholder=" "
          :class="{ 'error': fullnameError && fullnameError !== '' }"
        />
        <label :class="{ active: fullnameFocus || fullname }">Tên Người dùng</label>
        <div class="validation-message" :class="{ 'error': fullnameError }">
          {{ fullnameError || '' }}
        </div>
      </div>

      <!-- Mật khẩu -->
      <div class="input-group password-group">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          @focus="passwordFocus = true"
          @blur="passwordFocus = false"
          @input="validatePassword"
          placeholder=" "
          autocomplete="new-password"
          :class="{ 'error': passwordError && passwordError !== '' }"
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
        <div class="validation-message" :class="{ 'error': passwordError }">
          {{ passwordError || 'Tối đa 15 ký tự, có ít nhất 1 chữ hoa, 1 ký tự đặc biệt và 1 số' }}
        </div>
      </div>

      <!-- Xác nhận mật khẩu -->
      <div class="input-group password-group">
        <input
          :type="showConfirm ? 'text' : 'password'"
          v-model="confirmPassword"
          @focus="confirmFocus = true"
          @blur="confirmFocus = false"
          @input="validateConfirmPassword"
          placeholder=" "
          autocomplete="new-password"
          :class="{ 'error': confirmPasswordError && confirmPasswordError !== '' }"
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
        <div class="validation-message" :class="{ 'error': confirmPasswordError }">
          {{ confirmPasswordError || '' }}
        </div>
      </div>

      <button
        class="btn"
        @click="handleRegister"
        :disabled="!isFormValid"
      >
        Đăng ký
      </button>
      <router-link to="/" class="back">← Trở về trang đăng nhập</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { sendOTP } from '@/service/otpService'
import { getAccountList } from '@/service/authService'

/** Các biến reactive cho form **/
const contact = ref('')
const contactFocus = ref(false)
const contactError = ref('')

const fullname = ref('')
const fullnameFocus = ref(false)
const fullnameError = ref('')

const password = ref('')
const passwordFocus = ref(false)
const passwordError = ref('')
const showPassword = ref(false)

const confirmPassword = ref('')
const confirmFocus = ref(false)
const confirmPasswordError = ref('')
const showConfirm = ref(false)

/** Biến đánh dấu nếu username đã tồn tại **/
const isUsernameTaken = ref(false)

const router = useRouter()

/** Chuyển đổi hiển thị mật khẩu **/
const togglePassword = () => {
  showPassword.value = !showPassword.value
}
const toggleConfirm = () => {
  showConfirm.value = !showConfirm.value
}

/** Hàm kiểm tra định dạng email **/
const isValidEmail = (email) => {
  if (email.length > 254) return false
  const parts = email.split('@')
  if (parts.length !== 2) return false
  const [local, domain] = parts
  if (local.length === 0 || local.length > 64) return false
  if (local.startsWith('.') || local.endsWith('.')) return false
  if (local.includes('..')) return false
  if (/[<>()[\]\\,;:\s@"]/.test(local)) return false
  if (domain.length === 0 || domain.length > 253) return false
  if (domain.startsWith('-') || domain.endsWith('-')) return false
  if (domain.startsWith('.') || domain.endsWith('.')) return false
  if (domain.includes('..')) return false
  if (domain.includes('_')) return false
  const ipRegex = /^\[?(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]?$/ 
  const ipMatch = domain.match(ipRegex)
  if (ipMatch) {
    for (let i = 1; i <= 4; i++) {
      const octet = parseInt(ipMatch[i])
      if (octet > 255) return false
    }
    return true
  }
  const domainParts = domain.split('.')
  if (domainParts.length < 2) return false
  for (const part of domainParts) {
    if (part.length === 0 || part.length > 63) return false
    if (part.startsWith('-') || part.endsWith('-')) return false
    if (!/^[a-zA-Z0-9-]+$/.test(part)) return false
  }
  const tld = domainParts[domainParts.length - 1]
  if (tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) return false
  return true
}

/** Hàm validate Email **/
const validateContact = () => {
  if (!contact.value.trim()) {
    contactError.value = ''
    return false
  }
  const value = contact.value.trim()
  if (value.includes('@')) {
    if (isValidEmail(value)) {
      contactError.value = ''
      return true
    } else {
      contactError.value = 'Email không đúng định dạng'
      return false
    }
  } else {
    contactError.value = 'Email không đúng định dạng'
    return false
  }
}

/** Hàm validate Tên Người dùng (fullname) **/
const validateFullname = () => {
  const name = fullname.value.trim()

  if (!name) {
    fullnameError.value = 'Vui lòng nhập tên người dùng'
    return false
  }
  if (name.length < 5) {
    fullnameError.value = 'Tên phải có ít nhất 5 ký tự'
    return false
  }
  if (name.length > 15) {
    fullnameError.value = 'Tên không được quá 15 ký tự'
    return false
  }
  if (/^\d+$/.test(name)) {
    fullnameError.value = 'Tên không được chỉ là số'
    return false
  }
  if (/\s/.test(name)) {
    fullnameError.value = 'Tên không được chứa khoảng trắng'
    return false
  }
  if (!/^[a-zA-ZÀ-ỹà-ỹ0-9]+$/.test(name)) {
    fullnameError.value = 'Tên chỉ được chứa chữ cái và số'
    return false
  }
  // Nếu pass hết, nhưng trước đó checkUsername từng đánh dấu tồn tại:
  if (isUsernameTaken.value) {
    fullnameError.value = 'Tên tài khoản đã tồn tại'
    return false
  }
  fullnameError.value = ''
  return true
}

/** Khi user gõ fullname: reset trạng thái “đã tồn tại” và gọi validateFullname **/
const handleFullnameInput = () => {
  isUsernameTaken.value = false
  validateFullname()
}

/** Hàm validate mật khẩu **/
const validatePassword = () => {
  if (!password.value) {
    passwordError.value = ''
    return false
  }
  const pwd = password.value
  if (pwd.length > 15) {
    passwordError.value = 'Mật khẩu chỉ được phép tối đa 15 ký tự'
    return false
  }
  if (pwd.includes(' ')) {
    passwordError.value = 'Mật khẩu không được chứa khoảng trắng'
    return false
  }
  if (pwd.length < 8) {
    passwordError.value = 'Mật khẩu phải có ít nhất 8 ký tự'
    return false
  }
  const hasUpperCase = /[A-Z]/.test(pwd)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
  const hasNumber = /[0-9]/.test(pwd)
  if (!hasUpperCase) {
    passwordError.value = 'Mật khẩu phải có ít nhất 1 chữ cái in hoa'
    return false
  }
  if (!hasSpecialChar) {
    passwordError.value = 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt (!@#$%^&*...)'
    return false
  }
  if (!hasNumber) {
    passwordError.value = 'Mật khẩu phải có ít nhất 1 chữ số'
    return false
  }
  passwordError.value = ''
  return true
}

/** Hàm validate xác nhận mật khẩu **/
const validateConfirmPassword = () => {
  if (!confirmPassword.value) {
    confirmPasswordError.value = ''
    return false
  }
  if (confirmPassword.value !== password.value) {
    confirmPasswordError.value = 'Mật khẩu xác nhận không khớp'
    return false
  }
  confirmPasswordError.value = ''
  return true
}

/** Hàm kiểm tra username trùng khi blur khỏi input **/
const checkUsername = async () => {
  const name = fullname.value.trim()
  if (!name) {
    // Nếu chưa nhập gì thì không báo lỗi trùng
    isUsernameTaken.value = false
    validateFullname()
    return
  }
  try {
    const list = await getAccountList()
    const exists = list.some(acc => acc.username === name)
    if (exists) {
      isUsernameTaken.value = true
      fullnameError.value = 'Tên tài khoản đã tồn tại'
    } else {
      isUsernameTaken.value = false
      // Nếu các điều kiện validate khác OK, xóa lỗi
      validateFullname()
    }
  } catch (err) {
    console.error('❌ Lỗi khi kiểm tra username:', err)
    // Trong trường hợp API lỗi, không xem là trùng
    isUsernameTaken.value = false
    validateFullname()
  }
}

/** Computed để kích hoạt/deactivate nút “Đăng ký” **/
const isFormValid = computed(() => {
  return (
    validateContact() &&
    validateFullname() &&
    validatePassword() &&
    validateConfirmPassword() &&
    !isUsernameTaken.value
  )
})

/** Xử lý khi bấm “Đăng ký” **/
const handleRegister = async () => {
  // Kiểm tra lại tất cả trước khi gửi
  const isContactValid = validateContact()
  const isFullnameValid = validateFullname()
  const isPasswordValid = validatePassword()
  const isConfirmPasswordValid = validateConfirmPassword()
  if (!isContactValid || !isFullnameValid || !isPasswordValid || !isConfirmPasswordValid) {
    return
  }
  // Kiểm tra trùng username thêm lần cuối
  await checkUsername()
  if (isUsernameTaken.value) {
    return
  }
  try {
    await sendOTP(contact.value)
    localStorage.setItem('register_email', contact.value)
    localStorage.setItem('register_username', fullname.value.trim())
    localStorage.setItem('register_password', password.value)
    localStorage.setItem('register_confirm', confirmPassword.value)
    router.push('/verificationCode')
  } catch (err) {
    alert(err?.response?.data?.message || 'Gửi OTP thất bại!')
  }
}
</script>

<style scoped>
/* Vẫn giữ nguyên CSS cũ của bạn; nếu cần, có thể bổ sung styles cho trạng thái disabled khi đang check username */
.btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>


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
  width: 200%;
  max-width: 400px;
  margin-bottom: 30px;
  margin-top: 30px;
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
  transition: border-color 0.3s ease;
}

.input-group input:focus {
  border-color: #ffa726;
}

.input-group input.error {
  border-color: #f44336;
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

.password-group input {
  padding-right: 45px !important;
}

.password-group input::-ms-reveal,
.password-group input::-ms-clear {
  display: none;
}

.password-group input::-webkit-credentials-auto-fill-button,
.password-group input::-webkit-strong-password-auto-fill-button {
  display: none !important;
}

.toggle-password {
  position: absolute;
  top: 14px;
  right: 12px;
  cursor: pointer;
  user-select: none;
  z-index: 10;
  height: 20px;
}

.validation-message {
  font-size: 0.8rem;
  text-align: left;
  margin-top: 0.25rem;
  padding-left: 10px;
  min-height: 1.2em;
  transition: color 0.3s ease;
}

.validation-message.error {
  color: #f44336;
}

.validation-message:not(.error) {
  color: #666;
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
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.btn:hover:not(:disabled) {
  background-color: #fb8c00;
  transform: translateY(-1px);
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
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
  transition: color 0.3s ease;
}

.back:hover {
  text-decoration: underline;
  color: #1565c0;
}
</style>