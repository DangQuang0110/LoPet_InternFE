<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="create-post-modal">
      <!-- Header -->
      <header class="modal-header">
        <h2>Tạo bài viết</h2>
        <button class="close-btn" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
      </header>

      <!-- Body -->
      <div class="modal-body">
        <!-- User -->
        <div class="user-status-row">
          <img :src="avatar" class="avatar" alt="User Avatar" />
          <span class="username">{{ displayName }}</span>
        </div>

        <!-- Textarea -->
        <textarea v-model="content" class="post-textarea"
          :placeholder="`${displayName || 'Bạn'} ơi, bạn đang nghĩ gì ?`" />

        <!-- Previews -->
        <div v-if="mediaFiles.length" class="media-previews">
          <div v-for="(file, idx) in mediaFiles" :key="idx" class="preview-item">
            <img v-if="file.type === 'image'" :src="file.url" alt="preview" />
            <video v-else controls :src="file.url" />
            <button class="remove-preview" @click.stop="removeMedia(idx)">×</button>
          </div>
        </div>

        <!-- File Input -->
        <input
          type="file"
          ref="fileInput"
          accept="image/*,video/*"
          multiple
          @change="handleMediaChange"
          style="display: none;"
        />
        <div class="media-picker" @click="pickMedia">
          <i class="far fa-image"></i>
          <span>Thêm ảnh / video</span>
        </div>

        <!-- Submit -->
        <button class="submit-btn" @click="submitPost">
          Đăng
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { createPost } from '@/service/postService'
import { getAccountById } from '@/service/authService'
import { getProfileByAccountId } from '@/service/profileService'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const emit = defineEmits(['close', 'post', 'refresh'])

const content = ref('')
const mediaFiles = reactive([]) // { file, url, type: 'image' | 'video' }
const fileInput = ref(null)
const avatar = ref('/image/avata.jpg')
const displayName = ref('')

function closeModal() {
  emit('close')
}

function pickMedia() {
  fileInput.value.click()
}

function handleMediaChange(event) {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = e => {
      const fileType = file.type.startsWith('video/') ? 'video' : 'image'
      mediaFiles.push({ file, url: e.target.result, type: fileType })
    }
    reader.readAsDataURL(file)
  })
  event.target.value = null
}

function removeMedia(index) {
  mediaFiles.splice(index, 1)
}

async function submitPost() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const userId = user.id
    if (!userId) {
      alert('Bạn cần đăng nhập để đăng bài viết')
      return
    }

    if (!content.value.trim() && mediaFiles.length === 0) {
      alert('Bạn chưa nhập nội dung hoặc chọn ảnh/video!')
      return
    }

    const formData = new FormData()
    formData.append('accountId', userId)
    formData.append('content', content.value.trim())
    formData.append('scope', 'PUBLIC')

    mediaFiles.forEach(item => {
      const field = item.type === 'video' ? 'videos' : 'images'
      formData.append(field, item.file)
    })

    // ✅ LOG TOÀN BỘ formData
    for (const pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log('📦 Media:', pair[0], pair[1].name, pair[1].type)
      } else {
        console.log('📄 Field:', pair[0], pair[1])
      }
    }

    const res = await createPost(formData)
    emit('post', res.data)
    emit('refresh')
    toast.success('Đăng bài viết thành công', {
      autoClose: 3000,
      position: toast.POSITION.TOP_RIGHT,
      theme: 'colored'
    })
    closeModal()
  } catch (err) {
    console.error('❌ Lỗi khi tạo bài viết:', err?.response?.data || err)
    toast.error('Đăng bài viết thất bại!', {
      autoClose: 3000,
      position: toast.POSITION.TOP_RIGHT,
      theme: 'colored'
    })
  }
}

onMounted(async () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user.id) {
    const [account, profile] = await Promise.all([
      getAccountById(user.id),
      getProfileByAccountId(user.id)
    ])
    avatar.value = profile?.avatarUrl?.trim() || account?.avatar?.trim() || '/image/avata.jpg'
    displayName.value = profile?.fullName || account?.username || 'Ẩn danh'
  }
})
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.create-post-modal {
  width: 90%;
  max-width: 500px;
  background: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #F9F9F9;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.modal-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-status-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  font-weight: 500;
  font-size: 16px;
}

.status-btn {
  margin-left: auto;
  background: #FFD699;
  border: none;
  border-radius: 12px;
  padding: 6px 12px;
  cursor: pointer;
}

.post-textarea {
  width: 100%;
  min-height: 80px;
  border: none;
  border-radius: 12px;
  padding: 12px;
  resize: none;
  font-size: 14px;
  background: #F9F9F9;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
}

.media-previews {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preview-item {
  position: relative;
}

.preview-item img,
.preview-item video {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.remove-preview {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #e0245e;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  color: #fff;
  cursor: pointer;
}

.media-picker {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  background: #F9F9F9;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
}

.submit-btn,
.confirm-btn {
  width: 100%;
  padding: 12px;
  background: #FFD699;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

/* Status modal styles unchanged */
.status-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-modal {
  width: 90%;
  max-width: 400px;
  background: #FFF8F0;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.status-desc {
  font-size: 14px;
  color: #555;
}

.status-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.status-option i {
  font-size: 20px;
  color: #333;
}

.status-option input {
  margin: 0;
}

.status-option span {
  font-size: 14px;
  color: #141414;
}
</style>