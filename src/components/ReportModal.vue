<template>
  <div class="report-overlay" @click.self="close">
    <div class="report-modal">
      <header class="report-header">
        <h3>Báo Cáo Bài viết</h3>
        <button class="close-btn" @click="close"><i class="fas fa-times"></i></button>
      </header>
      <div class="report-body">
        <p class="report-question">Tại sao bạn báo cáo bài viết này?</p>
        <div class="report-options">
          <label v-for="opt in options" :key="opt.value" class="report-option">
            <input type="radio" :value="opt.value" v-model="selected" />
            <span>{{ opt.label }}</span>
          </label>
        </div>
      </div>
      <footer class="report-footer">
        <button class="confirm-btn" @click="submitReport">Xác nhận</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createReport } from '@/service/reportService'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const props = defineProps({
  postId: {
    type: [Number, String], // chấp nhận cả Number và String từ cha
    required: true
  }
})

const emit = defineEmits(['close', 'done'])

const options = [
  { value: 'false_info', label: 'Thông tin sai sự thật, lừa đảo hoặc gian lận' },
  { value: 'intellectual_property', label: 'Quyền sở hữu trí tuệ' },
  { value: 'under_18', label: 'Vấn đề liên quan tới người dưới 18 tuổi' },
  { value: 'self_harm', label: 'Tự tử hoặc gây thương tích' },
  { value: 'harassment', label: 'Bắt nạt, quấy rối hoặc lăng mạ / lạm dụng / ngược đãi' }
]

const selected = ref(options[0].value)

function close() {
  emit('close')
}

async function submitReport() {
  const reasonMap = {
    false_info: 'Thông tin sai sự thật, lừa đảo hoặc gian lận',
    intellectual_property: 'Quyền sở hữu trí tuệ',
    under_18: 'Vấn đề liên quan tới người dưới 18 tuổi',
    self_harm: 'Tự tử hoặc gây thương tích',
    harassment: 'Bắt nạt, quấy rối hoặc lăng mạ / lạm dụng / ngược đãi'
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userId = user?.id
  const postId = Number(props.postId)

  if (!userId || !postId) {
    console.error('❌ Thiếu thông tin:', { userId, postId })
    toast.error('⚠️ Không đủ thông tin để báo cáo.', {
      autoClose: 2000,
      position: toast.POSITION.TOP_RIGHT
    })
    return
  }

  try {
    await createReport({
      accountId: userId,
      targetId: postId,
      type: 'POST',
      reason: reasonMap[selected.value]
    })

    toast.success('Báo cáo đã được gửi thành công!', {
      autoClose: 2000,
      position: toast.POSITION.TOP_RIGHT
    })
    emit('done')
    emit('close')
  } catch (err) {
    console.error('❌ Lỗi gửi báo cáo:', err)
    toast.error('❌ Không thể gửi báo cáo. Vui lòng thử lại.', {
      autoClose: 2000,
      position: toast.POSITION.TOP_RIGHT
    })
  }
}
</script>

<style scoped>
.report-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.report-modal {
  background: #FFFFFF;
  border-radius: 12px;
  width: 90%; max-width: 400px;
  overflow: hidden; 
}
.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #F9F9F9;
  font-weight: 500;
}
.report-body {
  padding: 16px;
}
.report-question {
  margin-bottom: 12px;
  font-size: 14px;
}
.report-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.report-option {
  display: flex;
  align-items: center;
  background: #F9F9F9;
  border-radius: 8px;
  padding: 8px;
}
.report-option input {
  margin-right: 8px;
}
.report-footer {
  padding: 12px 16px;
  background: #F9F9F9;
  text-align: center;
}
.confirm-btn {
  background: #FFD699;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 16px;
  cursor: pointer;
}
.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</style>