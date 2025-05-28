<template>
  <Layout>
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

    <!-- Overlay popup chỉnh sửa thông tin nhóm -->
    <div v-if="showEditPopup" class="overlay">
      <div class="edit-popup">
        <div class="edit-header">Chỉnh sửa thông tin nhóm</div>

        <div class="cover-section">
          <img src="@/assets/anhbia.jpg" class="cover-image" />
          <button class="edit-cover-btn">Chỉnh sửa ảnh bìa</button>
        </div>

        <div class="edit-section">
          <label for="groupName">Tên nhóm</label>
          <input id="groupName" v-model="group.name" type="text" />
        </div>

        <div class="edit-section">
          <label for="description">Mô tả</label>
          <textarea id="description" v-model="group.description" rows="4" />
        </div>

        <div class="edit-section">
          <label for="privacy">Quyền riêng tư</label>
          <select id="privacy" v-model="group.privacy">
            <option value="public">Công khai</option>
            <option value="private">Riêng tư</option>
          </select>
        </div>

        <div class="button-wrapper">
          <button class="save-button" @click="saveChanges">Lưu thông tin chỉnh sửa</button>
        </div>
      </div>
    </div>

    <!-- Popup báo cáo bài viết -->
    <div v-if="showReportPopup" class="overlay">
      <div class="report-popup">
        <div class="popup-header">
          <strong>Báo Cáo Bài viết</strong>
          <span class="close-btn" @click="closeReport">×</span>
        </div>

        <p class="popup-question">Tại sao bạn báo cáo bài viết này?</p>

        <div class="report-options">
          <label v-for="option in reportOptions" :key="option" class="report-option">
            <input type="radio" name="report" v-model="selectedReason" :value="option" />
            {{ option }}
          </label>
        </div>

        <button class="confirm-button" @click="submitReport">Xác nhận</button>
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
          <button class="join" @click="handleJoin">Tham gia nhóm</button>
        </template>
      </div>
    </section>

    <main class="main">
      <div class="layout">
        <div class="left">
          <div class="new-post">
            <div class="status-box"></div>
          </div>

          <div class="post">
            <div class="post-header">
              <img class="avatar" src="https://i.pravatar.cc/40?img=7" />
              <div class="info">
                <strong>Phạm Cầu</strong>
                <div class="time">7 tháng 5 lúc 15:48</div>
              </div>
              <div class="menu-wrapper" style="position: relative; margin-left: auto;">
                <div class="menu" @click="toggleReportMenu(1)">⋮</div>
                <div
                  v-if="showReportMenu === 1"
                  class="report-dropdown"
                  @click="openReport(1)"
                >
                  Báo cáo bài viết
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

          <!-- Bài viết thứ 2 -->
          <div class="post">
            <div class="post-header">
              <img class="avatar" src="https://i.pravatar.cc/40?img=8" />
              <div class="info">
                <strong>Nguyễn Minh</strong>
                <div class="time">6 tháng 5 lúc 10:30</div>
              </div>
              <div class="menu-wrapper" style="position: relative; margin-left: auto;">
                <div class="menu" @click="toggleReportMenu(2)">⋮</div>
                <div
                  v-if="showReportMenu === 2"
                  class="report-dropdown"
                  @click="openReport(2)"
                >
                  Báo cáo bài viết
                </div>
              </div>
            </div>
            <p>Các bạn ơi, mình cần tìm nhà mới cho 3 con mèo con này. Ai có nhu cầu nhận nuôi liên hệ mình nhé!</p>
            <img src="@/assets/anhbia.jpg" alt="Post Image" class="post-image" />

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
          </div>

          <div class="sidebar-box">
            <div class="recent-post" v-for="i in 6" :key="i">
              <div class="recent-info"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
    </div>
  </layout>
</template>

<script setup>
import { ref } from 'vue'
import Layout from '@/components/Layout.vue'


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
  showReportMenu.value = null // Đóng menu khi mở popup
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
  alert('Báo cáo của bạn đã được gửi.')
  closeReport()
}

function toggleReportMenu(postId) {
  showReportMenu.value = showReportMenu.value === postId ? null : postId
}
</script>

<style scoped>
/* --- Phần chung --- */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.app-container {
  font-family: 'Arial', sans-serif;
  background: #F9F9F9;
  width: 100%;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 15px 386px;
  background: #ffff;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.search {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #000000;
  width: 350px;
}

.cover {
  width: 100%;
  height: 325px;
  background: url('@/assets/anhbia.jpg') center/cover no-repeat;
}

.full-width-group {
  width: 100%;
  box-sizing: border-box;
  padding: 16px 90px;
  background: #ffffff;
  margin-bottom: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.group-info h1 {
  margin: 0;
}

.members {
  margin: 6px 0;
}

.avatars {
  margin: 10px 0;
}

.avatars .avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 0px;
}

.group-actions button {
  margin-right: 10px;
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.invite {
  background-color: orange;
  color: #fff;
}

.joined {
  background-color: #eee;
}

.join {
  background-color: #2196f3;
  color: white;
}

.main {
  padding: 20px 90px;
  width: 100%;
  box-sizing: border-box;
}

.layout {
  display: flex;
  width: 108%;
  gap: 30px;
}

.left {
  flex: 2.5;
}

.right {
  flex: 2;
}

.new-post {
  background: #ffffff;
  padding: 0px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.status-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-box .avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
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

.post {
  background: #ffffff;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.post-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.post-header .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.post-header .info {
  flex-grow: 1;
}

.post-header .menu {
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  padding: 5px 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.post-header .menu:hover {
  background-color: #f0f0f0;
}

.post-img {
  margin-top: 10px;
  width: 100%;
  border-radius: 10px;
}

.post-image {
  margin-top: 10px;
  width: 100%;
  border-radius: 10px;
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
}

/* --- Giới thiệu cập nhật --- */
.introduction {
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  width: 100%;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.intro-title {
  font-weight: bold;
  color: #f9a825;
  font-size: 18px;
  margin-bottom: 4px;
}

.intro-desc {
  font-size: 14px;
  margin-bottom: 12px;
}

.contact-title {
  font-weight: bold;
  color: #f9a825;
  margin-bottom: 8px;
}

.icon {
  margin-right: 6px;
}

.introduction p {
  font-size: 14px;
  margin: 4px 0;
}

.edit-group-btn {
  margin-top: 12px;
  background-color: #f9a825;
  border: none;
  padding: 8px 16px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
}

.inline-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 4px;
  margin-bottom: 4px;
}

.icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 4px;
}

/* --- Sidebar --- */
.sidebar-box {
  background: #ffffff;
  padding: 0px;
  border-radius: 12px;
  margin-bottom: 20px;
  width: 0%;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.recent-post {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.recent-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid #880e4f;
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

/* --- Popup overlay --- */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup {
  background-color: #fff;
  padding: 20px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  text-align: center;
}

.popup p {
  font-size: 16px;
  margin-bottom: 20px;
}

.popup-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.popup .leave {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.popup .cancel {
  background-color: #ccc;
  color: black;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

/* --- Popup báo cáo bài viết --- */
.report-popup {
  background-color: #fff;
  padding: 20px 24px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  width: 360px;
  position: relative;
  font-family: Arial, sans-serif;
}

/* Header của popup báo cáo */
.report-popup .popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  margin-bottom: 12px;
}

.close-btn {
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  color: #666;
  padding: 0 5px;
}

.close-btn:hover {
  color: #000;
}

/* Câu hỏi trong popup */
.popup-question {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #333;
}

/* Các tùy chọn báo cáo */
.report-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.report-option {
  background: #f9f9f9;
  padding: 10px 14px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: background-color 0.2s;
}

.report-option:hover {
  background-color: #f0f0f0;
}

.report-option input[type="radio"] {
  accent-color: #f9a825;
}

.confirm-button {
  background-color: #f9a825;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  font-size: 14px;
}

/* --- Dropdown menu báo cáo --- */
.report-dropdown {
  position: absolute;
  top: 28px;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 8px 12px;
  cursor: pointer;
  z-index: 1000;
  white-space: nowrap;
  font-size: 14px;
  border: 1px solid #ddd;
}

.report-dropdown:hover {
  background-color: #f5f5f5;
}
</style>