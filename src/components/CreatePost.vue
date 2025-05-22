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
        <!-- User + Status Button -->
        <div class="user-status-row">
          <img src="/assets/quang.jpg" class="avatar" alt="Quang Dang" />
          <span class="username">Quang Dang</span>
          <!-- <button class="status-btn" @click="showStatus = true">
            Trạng thái bài viết
          </button> -->
        </div>

        <!-- Textarea for post content -->
        <textarea
          v-model="content"
          class="post-textarea"
          placeholder="Quang ơi, bạn đang nghĩ gì ?"
        />

        <!-- Image Previews -->
        <div v-if="mediaFiles.length" class="media-previews">
          <div v-for="(file, idx) in mediaFiles" :key="idx" class="preview-item">
            <img :src="file.url" alt="preview" />
            <button class="remove-preview" @click.stop="removeMedia(idx)">×</button>
          </div>
        </div>

        <!-- Media picker -->
        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          multiple
          @change="handleMediaChange"
          style="display: none;"
        />
        <div class="media-picker" @click="pickMedia">
          <i class="far fa-image"></i>
          <span>Thêm ảnh</span>
        </div>

        <!-- Submit button -->
        <button class="submit-btn" @click="submitPost">
          Đăng
        </button>
      </div>

      <!-- Status Selection Popup -->
      <div
        v-if="showStatus"
        class="status-overlay"
        @click.self="showStatus = false"
      >
          <!-- <div class="status-modal">
            <h3>Trạng thái bài viết của bạn</h3>
            <p class="status-desc">
              Bạn có thể chọn trạng thái bài viết của mình là riêng tư hoặc công khai.
            </p>
            <div class="status-options">
              <label class="status-option">
                <i class="fas fa-shield-alt"></i>
                <input type="radio" value="private" v-model="status" />
                <span>Riêng tư</span>
              </label>
              <label class="status-option">
                <i class="fas fa-users"></i>
                <input type="radio" value="public" v-model="status" />
                <span>Công khai</span>
              </label>
            </div>
            <button class="confirm-btn" @click="confirmStatus">
              Xác nhận
            </button>
          </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const emit = defineEmits(['close', 'post'])

const content = ref('')
const status = ref('private')
const showStatus = ref(false)
const mediaFiles = reactive([])
const fileInput = ref(null)

function closeModal() {
  emit('close')
}

function submitPost() {
  emit('post', { content: content.value, status: status.value, media: mediaFiles.map(f => f.file) })
  closeModal()
}

function confirmStatus() {
  showStatus.value = false
}

function pickMedia() {
  fileInput.value.click()
}

function handleMediaChange(event) {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = e => {
      mediaFiles.push({ file, url: e.target.result })
    }
    reader.readAsDataURL(file)
  })
  // reset input
  event.target.value = null
}

function removeMedia(index) {
  mediaFiles.splice(index, 1)
}
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
  background: #FAEBD7;
  border-radius: 12px;
  overflow: hidden;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #FFF8F0;
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
  background: #FAEBD7;
}
.media-previews {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.preview-item {
  position: relative;
}
.preview-item img {
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
  background: #FFF8F0;
  border-radius: 8px;
  cursor: pointer;
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
