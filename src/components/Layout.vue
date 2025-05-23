<template>
  <div class="layout-wrapper">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo">
        <img src="/assets/logoPetGram.png" alt="LOPET Logo" class="logo-img" />
      </div>
      <div class="menu-container">
        <nav class="nav-menu">
          <ul>
            <li class="nav-item" @click="toggleNotifications">
              <i class="fas fa-bell"></i>
              <span>Thông báo</span>
            </li>
            <li class="nav-item">
              <i class="fas fa-home"></i>
              <span>Trang chủ</span>
            </li>
            <li class="nav-item">
              <i class="fas fa-comment"></i>
              <span>Nhắn tin</span>
            </li>
            <li class="nav-item">
              <i class="fas fa-users"></i>
              <span>Cộng đồng</span>
            </li>
            <li class="nav-item">
              <i class="fas fa-user-friends"></i>
              <span>Bạn bè</span>
            </li>
            <li class="nav-item">
              <i class="fas fa-user"></i>
              <span>Profile</span>
            </li>
          </ul>
        </nav>
      </div>
      <div class="sidebar-footer">
        <img class="avatar" src="/assets/quang.jpg" alt="User Avatar" />
        <span class="username">Quang Đang</span>
        <i class="fas fa-cog" style="margin-left: 8px;"></i>
      </div>
    </aside>

    <!-- Notification Popup -->
    <transition name="slide">
      <div v-if="showNotifications" class="notification-popup">
        <div class="popup-header">
          <h2>Thông báo</h2>
          <button class="close-btn" @click="toggleNotifications">&times;</button>
        </div>
        <div class="popup-tabs">
          <button :class="['tab-btn', { active: activeTab === 'all' }]" @click="activeTab='all'">Tất cả</button>
          <button :class="['tab-btn', { active: activeTab === 'unread' }]" @click="activeTab='unread'">Chưa đọc</button>
        </div>
        <div class="popup-content">
          <!-- NEW & OLD -->
          <template v-if="activeTab === 'all'">
            <p class="section-title">Mới</p>
            <div v-for="(item,i) in notifications.new" :key="i" class="notification-item">
              <div class="avatar-wrapper">
                <img class="avatar" :src="item.avatar" alt="avatar" />
              </div>
              <div class="item-content">
                <p>
                  <span class="username">{{ item.name }}</span> {{ item.text }}<span class="dot"></span>
                </p>
                <p class="timestamp">{{ item.time }}</p>
              </div>
              <button class="more-btn" @click.stop="toggleMenu(i)">
                <i class="fas fa-ellipsis-h"></i>
              </button>
              <!-- Context Menu -->
              <div v-if="openMenuIdx === i" class="item-menu">
                <ul>
                  <li @click="markAsRead(i)"><i class="fas fa-check"></i> Đánh dấu là đã đọc</li>
                  <li @click="deleteNotification(i)"><i class="far fa-times-circle"></i> Xóa thông báo này</li>
                  <li @click="muteTopic(i)"><i class="fas fa-cog"></i> Tắt thông báo về “{{item.name}}”</li>
                  <li @click="reportIssue(i)"><i class="fas fa-bug"></i> Báo cáo sự cố cho Thông báo</li>
                </ul>
              </div>
            </div>
            <p class="section-title">Trước đó</p>
            <div v-for="(item,j) in notifications.old" :key="j" class="notification-item">
              <div class="avatar-wrapper">
                <img class="avatar" :src="item.avatar" alt="avatar" />
              </div>
              <div class="item-content">
                <p>
                  <span class="username">{{ item.name }}</span> {{ item.text }}<span class="dot"></span>
                </p>
                <p class="timestamp">{{ item.time }}</p>
              </div>
              <button class="more-btn" @click.stop="toggleMenu(j + notifications.new.length)">
                <i class="fas fa-ellipsis-h"></i>
              </button>
              <div v-if="openMenuIdx === j + notifications.new.length" class="item-menu">
                <ul>
                  <li @click="markAsRead(j + notifications.new.length)"><i class="fas fa-check"></i> Đánh dấu là đã đọc</li>
                  <li @click="deleteNotification(j + notifications.new.length)"><i class="far fa-times-circle"></i> Xóa thông báo này</li>
                  <li @click="muteTopic(j + notifications.new.length)"><i class="fas fa-cog"></i> Tắt thông báo về “{{item.name}}”</li>
                  <li @click="reportIssue(j + notifications.new.length)"><i class="fas fa-bug"></i> Báo cáo sự cố cho Thông báo</li>
                </ul>
              </div>
            </div>
          </template>
          <!-- UNREAD -->
          <template v-else>
            <p class="section-title">Mới</p>
            <div v-for="(item,k) in notifications.unread" :key="k" class="notification-item">
              <div class="avatar-wrapper">
                <img class="avatar" :src="item.avatar" alt="avatar" />
              </div>
              <div class="item-content">
                <p>
                  <span class="username">{{ item.name }}</span> {{ item.text }}<span class="dot"></span>
                </p>
                <p class="timestamp">{{ item.time }}</p>
              </div>
              <button class="more-btn" @click.stop="toggleMenu(k + notifications.new.length + notifications.old.length)">
                <i class="fas fa-ellipsis-h"></i>
              </button>
              <div v-if="openMenuIdx === k + notifications.new.length + notifications.old.length" class="item-menu">
                <ul>
                  <li @click="markAsRead(k)"><i class="fas fa-check"></i> Đánh dấu là đã đọc</li>
                  <li @click="deleteNotification(k)"><i class="far fa-times-circle"></i> Xóa thông báo này</li>
                  <li @click="muteTopic(k)"><i class="fas fa-cog"></i> Tắt thông báo về “{{item.name}}”</li>
                  <li @click="reportIssue(k)"><i class="fas fa-bug"></i> Báo cáo sự cố cho Thông báo</li>
                </ul>
              </div>
            </div>
          </template>
        </div>
      </div>
    </transition>
    <!-- Main content area -->
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showNotifications = ref(false)
const activeTab = ref('all')
const openMenuIdx = ref(null)
const notifications = {
  new: [
    { name: 'Skibidi', text: 'đã chia sẻ bài viết của Conan', time: '5 phút trước', avatar: '/assets/trường.jpg' },
    { name: 'Conan', text: 'đã đăng một bài viết mới', time: '25 phút trước', avatar: '/assets/trường.jpg' }
  ],
  old: [
    { name: 'Shinichi', text: 'đã chia sẻ bài viết của \"Thế Giới Động Vật\"', time: '2 ngày trước', avatar: '/assets/trường.jpg' },
    { name: 'Sakura', text: 'đã gửi cho bạn một lời kết bạn', time: '5 ngày trước', avatar: '/assets/trường.jpg' }
  ],
  unread: [
    { name: 'Minh', text: 'đã bình luận vào bài viết của bạn', time: '10 phút trước', avatar: '/assets/trường.jpg' }
  ]
}

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
  openMenuIdx.value = null
}

function toggleMenu(idx) {
  openMenuIdx.value = openMenuIdx.value === idx ? null : idx
}

function markAsRead(idx) {
  console.log('Marked read', idx)
  openMenuIdx.value = null
}
function deleteNotification(idx) {
  console.log('Deleted', idx)
  openMenuIdx.value = null
}
function muteTopic(idx) {
  console.log('Muted topic at', idx)
  openMenuIdx.value = null
}
function reportIssue(idx) {
  console.log('Report issue', idx)
  openMenuIdx.value = null
}
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  height: 100vh;
  background: #FAEBD7;
}

.sidebar {
  width: 260px;
  background: #FFF8F0;
  border-right: 1px solid #FAEBD7;
  display: flex;
  flex-direction: column;
  padding: 15px;
  box-sizing: border-box;
}

.logo {
  position: relative;
  text-align: center;
  margin-bottom: 10px;
}

.logo-img {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 80px;
  z-index: 1;
}

.menu-container {
  border: 5px solid #FAEBD7;
  border-radius: 5px;
  padding: 5px;
  margin-top: 80px;
  background: #FAEBD7;
}

.nav-menu ul {
  list-style: none;
  padding: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 8px 4px;
  cursor: pointer;
  color: #000;
  font-size: 0.9rem;
  font-weight: 500;
}

.nav-item i {
  width: 20px;
  margin-right: 8px;
}

.sidebar-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  padding: 6px 0;
  border-top: 1px solid #FAEBD7;
}

.sidebar-footer .avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 6px;
}

.sidebar-footer .username {
  font-weight: 500;
  color: #000;
  font-size: 0.85rem;
}

.notification-popup {
  position: fixed;
  top: 0;
  left: 260px;
  width: 360px;
  height: 100vh;
  background: #FFF8F0;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.popup-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.popup-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.tab-btn {
  padding: 6px 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  border-radius: 50px;
}

.tab-btn.active {
  background: #C8F9EE;
  color: #000;
}

.section-title {
  margin: 12px 0 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
}

.notification-item {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 12px;
}

.avatar-wrapper {
  flex-shrink: 0;
  background: linear-gradient(135deg, #FF0080, #7928CA);
  padding: 2px;
  border-radius: 50%;
  margin-right: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.item-content p {
  margin: 0;
  line-height: 1.2;
}

.username {
  font-weight: 600;
}

.dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  background: #009DFF;
  border-radius: 50%;
  margin-left: 4px;
}

.timestamp {
  font-size: 0.8rem;
  color: #009DFF;
  margin-top: 4px;
}

.more-btn {
  position: absolute;
  top: 40%;
  right: -5px; /* tăng khoảng cách so với trước */
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s;
}

.notification-item:hover .more-btn {
  visibility: visible;
  opacity: 1;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background: #FFF8F0;
  box-sizing: border-box;
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from, .slide-leave-to {
  transform: translateX(-100%);
}

.item-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: #FFF8F0;
  border: 1px solid #DDD;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  z-index: 10;
  width: 220px;
  margin-top: 4px;
}
.item-menu ul { list-style: none; margin: 0; padding: 4px 0; }
.item-menu li { display: flex; align-items: center; padding: 8px 12px; font-size: 0.9rem; cursor: pointer; }
.item-menu li i { margin-right: 8px; font-size: 1rem; }
.item-menu li:hover { background: #00eaff; }

.main-content { flex: 1; overflow-y: auto; padding: 15px; background: #FFF8F0; box-sizing: border-box; }

.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }
</style>
