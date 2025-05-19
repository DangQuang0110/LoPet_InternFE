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
          type="text"
          maxlength="1"
          class="otp-input"
          v-model="otp[index]"
          @input="handleOtpInput($event, index)"
        />
      </div>

      <a
        href="#"
        @click.prevent="resendOtp"
        :style="{ pointerEvents: countdown === 0 ? 'auto' : 'none', opacity: countdown === 0 ? 1 : 0.5 }"
      >
        Gửi lại mã OTP {{ formatCountdown() }}
      </a>

      <button class="btn" @click="sendLink">Xác nhận</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      otp: ['', '', '', '', '', ''],
      countdown: 120,
      intervalId: null,
    };
  },
  mounted() {
    this.focusFirstInput();
    this.startCountdown();
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  },
  methods: {
    focusFirstInput() {
      this.$nextTick(() => {
        const firstInput = this.$el.querySelector('.otp-input');
        if (firstInput) firstInput.focus();
      });
    },
    handleOtpInput(event, index) {
      const value = event.target.value;
      if (value.length === 1 && index < 5) {
        this.$el.querySelectorAll('.otp-input')[index + 1].focus();
      } else if (
        value === '' &&
        index > 0 &&
        event.inputType === 'deleteContentBackward'
      ) {
        this.$el.querySelectorAll('.otp-input')[index - 1].focus();
      }
      this.otp[index] = value;
    },
    startCountdown() {
      this.intervalId = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.intervalId);
        }
      }, 1000);
    },
    formatCountdown() {
      const minutes = Math.floor(this.countdown / 60)
        .toString()
        .padStart(2, '0');
      const seconds = (this.countdown % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
    },
    resendOtp() {
      if (this.countdown === 0) {
        this.countdown = 120;
        this.startCountdown();
        // TODO: Gọi API gửi lại mã OTP
        console.log('Đã gửi lại mã OTP!');
      }
    },
  },
};
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
