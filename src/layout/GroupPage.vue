<template>
  <div class="app-container">
    <!-- Overlay popup xác nhận thoát nhóm -->
    <div v-if="confirmLeave" class="overlay">
      <div class="popup">
        <p>Bạn muốn thoát khỏi nhóm?</p>
        <div class="popup-buttons">
          <button class="leave" @click="handleLeaveGroup">Thoát khỏi nhóm</button>
          <button class="cancel" @click="confirmLeave = false">Hủy</button>
        </div>
      </div>
    </div>

    <!-- Overlay popup báo cáo bài viết -->
    <div v-if="showReportPopup" class="overlay">
      <div class="report-popup">
        <div class="popup-header">
          <h3>Báo Cáo Bài viết</h3>
          <span class="close-btn" @click="closeReport">×</span>
        </div>
        
        <p class="popup-question">Tại sao bạn báo cáo bài viết này?</p>
        
        <div class="report-options">
          <div 
            v-for="(option, index) in reportOptions" 
            :key="index"
            class="report-option"
            :class="{ 'selected': selectedReason === option }"
            @click="selectedReason = option"
          >
            <input 
              type="radio" 
              :value="option" 
              v-model="selectedReason"
              :id="`option-${index}`"
            />
            <label :for="`option-${index}`">{{ option }}</label>
          </div>
        </div>
        
        <button 
          class="confirm-button" 
          @click="submitReport"
          :disabled="!selectedReason"
        >
          Xác nhận
        </button>
      </div>
    </div>

    <header class="header">
      <input class="search" placeholder="Tìm kiếm..." />
    </header>

    <div class="cover"></div>

    <section class="group-info full-width-group">
      <h1>Hội cứu trợ động vật Việt Nam</h1>
      <p class="members">
        <img src="@/assets/diacau.png" alt="Địa cầu" class="inline-icon" />
        3.2 Triệu thành viên
      </p>

      <div class="avatars">
        <img v-for="i in 6" :key="i" class="avatar" :src="`https://i.pravatar.cc/40?img=${i}`" />
      </div>
      <div class="group-actions">
        <template v-if="!leftGroup">
          <button class="joined" @click="toggleConfirmLeave">Đã tham gia ✓</button>
          <button class="invite">Mời</button>
        </template>
        <template v-else>
          <button class="join" @click="handleJoin">Tham gia nhóm</button>
        </template>
      </div>
    </section>

    <main class="main">
      <div class="layout">
        <div class="left">
          <div class="new-post">
            <div class="status-box">
              <img class="avatar" src="https://i.pravatar.cc/40?img=7" />
              <input class="status-input" placeholder="Bạn nghĩ gì thế Phạm Cầu?" />
            </div>
            <div class="status-actions">
              <img src="@/assets/camera.png" alt="Camera" class="inline-icon" />
            </div>
          </div>

          <div class="post">
            <div class="post-header">
              <img class="avatar" src="https://i.pravatar.cc/40?img=7" />
              <div class="info">
                <strong>Phạm Cầu</strong>
                <div class="time">7 tháng 5 lúc 15:48</div>
              </div>
              <div class="menu-container">
                <div class="menu" @click="toggleReportMenu(1)">⋮</div>
                <div v-if="showReportMenu === 1" class="report-dropdown">
                  <button @click="openReport(1)">Báo cáo bài viết</button>
                </div>
              </div>
            </div>
    
            <p>Mình đang bị lạc mất con chó màu vàng ai thấy báo giúp mình</p>
            <img src="@/assets/anhbia.jpg" alt="Post Image" class="post-image" />

            <div class="interactions">
              <img src="@/assets/traitim.png" alt="Like" class="inline-icon" /> 120 lượt thích – 
              <img src="@/assets/comment.png" alt="Bình luận" class="inline-icon" /> Bình luận – 
              <img src="@/assets/share.png" alt="Chia sẻ" class="inline-icon" /> Chia sẻ
            </div>

            <div class="comment" style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 6px;">
              <img src="https://i.pravatar.cc/30?img=9" style="width: 28px; height: 28px; border-radius: 50%;" />
              <div style="background-color: #f2f2f2; padding: 6px 10px; border-radius: 12px;">
                <strong>Phong:</strong> Chó này mình làm thịt rồi nha bạn
              </div>
            </div>

            <input class="comment-box" placeholder="Viết bình luận..." />
          </div>

          <!-- Thêm bài viết thứ 2 để test -->
          <div class="post">
            <div class="post-header">
              <img class="avatar" src="https://i.pravatar.cc/40?img=8" />
              <div class="info">
                <strong>Nguyễn Văn A</strong>
                <div class="time">6 tháng 5 lúc 10:30</div>
              </div>
              <div class="menu-container">
                <div class="menu" @click="toggleReportMenu(2)">⋮</div>
                <div v-if="showReportMenu === 2" class="report-dropdown">
                  <button @click="openReport(2)">Báo cáo bài viết</button>
                  <button @click="showReportMenu = null">Ẩn bài viết</button>
                  <button @click="showReportMenu = null">Chặn người dùng</button>
                </div>
              </div>
            </div>
    
            <p>Cần tìm nhà cho em mèo con này, ai có nhu cầu inbox mình nhé!</p>
            <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500" alt="Cat Image" class="post-image" />

            <div class="interactions">
              <img src="@/assets/traitim.png" alt="Like" class="inline-icon" /> 85 lượt thích – 
              <img src="@/assets/comment.png" alt="Bình luận" class="inline-icon" /> Bình luận – 
              <img src="@/assets/share.png" alt="Chia sẻ" class="inline-icon" /> Chia sẻ
            </div>

            <input class="comment-box" placeholder="Viết bình luận..." />
          </div>
        </div>

        <div class="right">
          <div class="introduction">
            <h3 class="intro-title">Giới thiệu</h3>
            <p class="intro-desc">Chào ae vào hội cứu trợ động vật Việt Nam</p>
            <p class="contact-title">Liên hệ với chúng tôi</p>
            <p><img class="icon" src="@/assets/sdt.png" alt="Hotline"> Hotline: 0369620631</p>
            <p><img class="icon" src="@/assets/email.png" alt="Email"> Email: caupham25@gmail.com</p>
            <p><img class="icon" src="@/assets/diachi.png" alt="Địa chỉ"> Hoài Nhơn, Bình Định, Việt Nam</p>

            <button class="edit-group-btn" @click="showEditPopup = true">Sửa thông tin nhóm</button>
          </div>

          <div class="sidebar-box">
            <h3>Bài viết mới</h3>
            <div class="recent-post" v-for="i in 6" :key="i">
              <img class="recent-avatar" :src="`https://i.pravatar.cc/100?img=${i}`" />
              <div class="recent-info">
                <div class="recent-name"><strong>Conan</strong> đã đăng một bài viết mới <span class="verified">✔️</span></div>
                <div class="recent-time">25 phút trước</div>
              </div>
              <button class="recent-button">Xem bài viết</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const confirmLeave = ref(false)
const leftGroup = ref(false)
const showEditPopup = ref(false)
const showReportPopup = ref(false)
const selectedPostId = ref(null)
const selectedReason = ref('')
const showReportMenu = ref(null)

const reportOptions = [
  'Thông tin sai sự thật, lừa đảo hoặc gian lận',
  'Quyền sở hữu trí tuệ', 
  'Vấn đề liên quan tới người dưới 18 tuổi',
  'Tự tử hoặc gây thương tích',
  'Bắt nạt, quấy rối hoặc lăng mạ / lạm dụng / ngược đãi'
]

const group = ref({
  name: 'Hội cứu trợ động vật Việt Nam',
  description: 'Chào ae vào hội cứu trợ động vật Việt Nam',
  email: 'caupham25@gmail.com',
  phone: '0369620631',
  address: 'Hoài Nhơn , Bình Định , Việt Nam',
  privacy: 'public'
})

function saveChanges() {
  console.log('Thông tin nhóm đã lưu:', group.value)
  showEditPopup.value = false
}

function toggleConfirmLeave() {
  confirmLeave.value = true
}

function handleLeaveGroup() {
  leftGroup.value = true
  confirmLeave.value = false
}

function handleJoin() {
  leftGroup.value = false
  confirmLeave.value = false
}

function openReport(postId) {
  selectedPostId.value = postId
  selectedReason.value = ''
  showReportPopup.value = true
  showReportMenu.value = null
}

function closeReport() {
  showReportPopup.value = false
  selectedPostId.value = null
  selectedReason.value = ''
}

function submitReport() {
  if (!selectedReason.value) {
    alert('Vui lòng chọn lý do báo cáo!')
    return
  }
  console.log('Báo cáo bài viết ID:', selectedPostId.value, 'Lý do:', selectedReason.value)
  alert('Báo cáo của bạn đã được gửi thành công!')
  closeReport()
}

function toggleReportMenu(postId) {
  showReportMenu.value = showReportMenu.value === postId ? null : postId
}

// Đóng menu khi click bên ngoài
document.addEventListener('click', (e) => {
  if (!e.target.closest('.menu-container')) {
    showReportMenu.value = null
  }
})
</script>

<style scoped>
/* --- Cấu trúc nền chung --- */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
.app-container {
  font-family: 'Arial', sans-serif;
  background: #F9F9F9;
  min-height: 100vh;
  width: 100%;
}

/* --- Header --- */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 386px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.search {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #000;
  width: 350px;
}

/* --- Ảnh bìa --- */
.cover {
  width: 100%;
  height: 325px;
  background: url('@/assets/anhbia.jpg') center/cover no-repeat;
}

/* --- Phần giới thiệu nhóm --- */
.full-width-group {
  width: 100%;
  padding: 16px 90px;
  background: #fff;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
.group-info h1, .members, .avatars {
  margin: 0;
}
.avatars {
  margin: 10px 0;
}
.avatars .avatar,
.post-header .avatar,
.status-box .avatar,
.recent-avatar {
  border-radius: 50%;
}
.avatars .avatar { width: 32px; height: 32px; }
.post-header .avatar { width: 40px; height: 40px; }
.status-box .avatar { width: 36px; height: 36px; }
.recent-avatar {
  width: 44px;
  height: 44px;
  border: 2px solid #880e4f;
}

/* --- Hành động nhóm --- */
.group-actions button {
  margin-right: 10px;
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.invite { background-color: orange; color: #fff; }
.joined { background-color: #eee; }
.join { background-color: #2196f3; color: #fff; }

/* --- Layout chính --- */
.main {
  padding: 20px 90px;
  box-sizing: border-box;
  width: 100%;
}
.layout {
  display: flex;
  gap: 30px;
  width: 108%;
}
.left { flex: 2.5; }
.right { flex: 2; }

/* --- Ô đăng trạng thái --- */
.new-post {
  background: #fff;
  padding: 16px;
  margin-bottom: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
.status-box {
  display: flex;
  align-items: center;
  gap: 10px;
}
.status-input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 16px;
  border: 1px solid #ccc;
}
.status-actions {
  margin-top: 10px;
  font-size: 20px;
}

/* --- Bài viết --- */
.post {
  background: #fff;
  padding: 16px;
  margin-bottom: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
.post-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.post-header .info { flex-grow: 1; }

/* --- Menu container và dropdown --- */
.menu-container {
  position: relative;
}
.menu { 
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}
.menu:hover {
  background-color: #f5f5f5;
}

.report-dropdown {
  position: absolute;
  top: 35px;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 100;
  min-width: 180px;
}
.report-dropdown button {
  display: block;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}
.report-dropdown button:hover {
  background-color: #f5f5f5;
}

.post-image {
  margin-top: 10px;
  width: 100%;
  border-radius: 10px;
  max-height: 400px;
  object-fit: cover;
}
.interactions {
  margin: 10px 0;
  font-size: 14px;
  color: #666;
}
.comment-box {
  width: 100%;
  padding: 6px;
  border-radius: 8px;
  background-color: #f5f5f5;
  border: none;
  outline: none;
}

/* --- Giới thiệu nhóm --- */
.introduction {
  background: #fff;
  padding: 16px;
  margin-bottom: 20px;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
.intro-title, .contact-title {
  font-weight: bold;
  color: #f9a825;
}
.intro-title { font-size: 18px; margin-bottom: 4px; }
.contact-title { margin-bottom: 8px; }
.intro-desc, .introduction p {
  font-size: 14px;
  margin-bottom: 12px;
}
.edit-group-btn {
  margin-top: 12px;
  background-color: #f9a825;
  color: #000;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
}
.inline-icon, .icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 4px;
}

/* --- Sidebar --- */
.sidebar-box {
  background: #fff;
  padding: 16px;
  margin-bottom: 20px;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
.recent-post {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}
.recent-info {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
}
.recent-time {
  color: #0288d1;
  font-size: 13px;
}
.recent-button {
  background-color: #fbc02d;
  color: #000;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 13px;
  cursor: pointer;
}
.verified {
  color: #2196f3;
  font-size: 14px;
}

/* --- Overlay popup --- */
.overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

/* --- Popup xác nhận --- */
.popup {
  background: #fff;
  padding: 20px 24px;
  width: 360px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  font-family: Arial, sans-serif;
}
.popup-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
}
.popup .leave {
  background-color: #f44336;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
.popup .cancel {
  background-color: #ccc;
  color: #000;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

/* --- Popup báo cáo --- */
.report-popup {
  background: #fff;
  padding: 24px;
  width: 480px;
  max-width: 90vw;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  font-family: Arial, sans-serif;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.popup-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.close-btn {
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  color: #666;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #f5f5f5;
}

.popup-question {
  font-size: 16px;
  margin-bottom: 20px;
  color: #555;
  line-height: 1.4;
}

.report-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.report-option {
  background: #f9f9f9;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.report-option:hover {
  background: #f0f0f0;
  border-color: #d0d0d0;
}

.report-option.selected {
  background: #fff3e0;
  border-color: #f9a825;
}

.report-option input[type="radio"] {
  width: 18px;
  height: 18px;
  accent-color: #f9a825;
}

.report-option label {
  flex: 1;
  font-size: 15px;
  cursor: pointer;
  color: #333;
  line-height: 1.3;
}

.confirm-button {
  background-color: #f9a825;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: bold;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.2s;
}

.confirm-button:hover:not(:disabled) {
  background-color: #f57c00;
}

.confirm-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>