<template>
  <div class="layout-wrapper">
    <aside class="sidebar">
      <div class="logo">
        <img src="/assets/logoPetGram.png" alt="LOPET Logo" class="logo-img" />
      </div>
      <div class="menu-container">
                <nav class="nav-menu">
            <ul>
              <li class="nav-item">
                <router-link to="/home" class="nav-link">
                  <img src="../assets/trangchu.png" alt="Trang chủ" class="nav-icon" />
                  <span>Trang chủ</span>
                </router-link>
              </li>
              <li class="nav-item">
                <a class="nav-link" @click.prevent="toggleNotifications">
                  <img src="../assets/notification.png" alt="Thông báo" class="nav-icon" />
                  <span>Thông báo</span>
                </a>
              </li>
              <li class="nav-item">
                <router-link to="/message" class="nav-link">
                  <img src="../assets/message.png" alt="Nhắn tin" class="nav-icon" />
                  <span>Nhắn tin</span>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/groups" class="nav-link">
                  <img src="../assets/community.png" alt="Cộng đồng" class="nav-icon" />
                  <span>Cộng đồng</span>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/friend" class="nav-link">
                  <img src="../assets/friends.png" alt="Bạn bè" class="nav-icon" />
                  <span>Bạn bè</span>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/profile/me" class="nav-link">
                  <img src="../assets/user.png" alt="Profile" class="nav-icon" />
                  <span>Profile</span>
                </router-link>
              </li>
            </ul>
            <hr>
            <div class="user-panel" @click="showLogoutMenu = !showLogoutMenu">
              <img class="avatar" :src="currentUser.avatar || '/image/avata.jpg'" alt="User Avatar" />
              <span class="username">{{ currentUser.name || 'Ẩn danh' }}</span>
              <img src="../assets/settings.png" alt="Cài đặt" class="nav-icon settings-icon" />
              <div v-if="showLogoutMenu" class="logout-menu">
                <ul>
                  <li @click.stop="handleLogout" class="logout-option">
                    <img src="../assets/log-out.png" alt="Đăng xuất" class="nav-icon" /> Đăng xuất
                  </li>
                  <li @click.stop="resetpassword" class="resetpassword">
                    <img src="../assets/security-password.png" alt="" class="nav-icon" /> Đổi lại mật khẩu
                  </li>
                </ul>
              </div>
            </div>
          </nav>
      </div>
      <div class="sidebar-footer"></div>
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
                  <li @click="muteTopic(i)"><i class="fas fa-cog"></i> Tắt thông báo về "{{item.name}}"</li>
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
                  <li @click="muteTopic(j + notifications.new.length)"><i class="fas fa-cog"></i> Tắt thông báo về "{{item.name}}"</li>
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
                  <li @click="muteTopic(k)"><i class="fas fa-cog"></i> Tắt thông báo về "{{item.name}}"</li>
                  <li @click="reportIssue(k)"><i class="fas fa-bug"></i> Báo cáo sự cố cho Thông báo</li>
                </ul>
              </div>
            </div>
          </template>
        </div>
      </div>
    </transition>
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { logoutUser, getAccountById } from '@/service/authService'
import { getProfileByAccountId } from '@/service/profileService'

const showNotifications = ref(false)
const activeTab = ref('all')
const router = useRouter()
const openMenuIdx = ref(null)
const showLogoutMenu = ref(false)
const currentUser = ref({ name: '', avatar: '' })

const notifications = {
  new: [
    { name: 'Skibidi', text: 'đã chia sẻ bài viết của Conan', time: '5 phút trước', avatar: '/assets/trường.jpg' },
    { name: 'Conan', text: 'đã đăng một bài viết mới', time: '25 phút trước', avatar: '/assets/trường.jpg' }
  ],
  old: [
    { name: 'Shinichi', text: 'đã chia sẻ bài viết của "Thế Giới Động Vật"', time: '2 ngày trước', avatar: '/assets/trường.jpg' },
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
function handleLogout() {
  logoutUser()
  router.push('/login')
}

onMounted(async () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (user.id) {
    const profile = await getProfileByAccountId(user.id)
    const account = await getAccountById(user.id)
    currentUser.value = {
      name: profile.fullName || account.username || 'Ẩn danh',
      avatar: profile.avatarUrl || account.avatar || '/image/avata.jpg'
    }
  }
})
</script>


<style scoped>
.layout-wrapper {
  display: flex;
  height: 100vh;
  background: #F9F9F9;
}

.sidebar {
  width: 260px;
  background: var(--bg-main);
  border-right: 1px solid #FAEBD7;
  display: flex;
  flex-direction: column;
  padding: 30px;
  box-sizing: border-box;
  height:680px;
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
  border: 5px solid #FFFFFF;
  border-radius: 5px;
  padding: 5px;
  margin-top: 80px;
  background: #FFFFFF;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
  margin-right: 10px;
}
.user-panel {
  margin-top:5px;
  position: relative;
  cursor: pointer;
  display: flex;              
  align-items: center;       
  gap: 8px;                  
}

.logout-menu {
  position: absolute;
  /* canh về bên phải icon, bạn chỉnh lại giá trị để đưa sát vào */
  right: 16px;
  /* cho menu ngay dưới icon, cách 4px */
  top: calc(100% + 4px);
  
  /* bỏ flex, chuyển thành block để xếp thẳng hàng dọc */
  display: block;
  
  /* padding "mỏng" hơn */
  padding: 4px 0;
  
  /* ấn định width bé hơn, không cần min-width lớn */
  width: 185px;
  margin-right: -30px;
  margin-top: 10px;
  
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 999;
}

/* style cho từng item trong menu */
.logout-menu a {
  display: block;
  padding: 8px 12px;
  font-size: 14px;
  color: #333;
  text-decoration: none;
  white-space: nowrap;
}

/* hover effect cho item */
.logout-menu a:hover {
  background-color: #f5f5f5;
}
.logout-option {
               /* đảm bảo padding có tác dụng */
  padding: 8px 16px;                   /* padding mặc định */
        /* tạo chuyển động mượt */
}

.logout-option:hover {
  background-color: #f5f5f5;
  padding: 8px 39px;                   /* kéo dài chiều ngang thêm 8px hai bên */
}
.logout-option i {
  margin-right: 8px;
}

.resetpassword {
  display: inline-block;               /* đảm bảo padding có tác dụng */
  padding: 8px 16px;                   /* padding mặc định */
        /* tạo chuyển động mượt */
}

.resetpassword:hover {
  background-color: #f5f5f5;
  padding: 8px 17.5px;                   /* kéo dài chiều ngang thêm 8px hai bên */
}
.resetpassword i {
  margin-right: 8px;
}

.user-panel .avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
.nav-link {
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
  gap: 8px;
}
.user-panel .username {
  margin-left: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #141414;
}

.user-panel .fa-cog {
  margin-left: 8px;
  font-size: 18px;
  color: #141414;
  cursor: pointer;
}

.notification-popup {
  position: fixed;
  top: 0;
  right: 0;       /* ← thay left: 260px; thành right: 0 */
  /* left: auto; */ /* có thể lược */
  width: 360px;
  height: 100vh;
  background: #F9F9F9;
  box-shadow: -2px 0 8px rgba(0,0,0,0.1); /* shadow bên trái */
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  z-index: 1000;  /* đảm bảo che lên trên */
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
  padding: 8px 12px;
  position: relative;   /* giữ lại để dropdown menu vẫn position:absolute */
}
.avatar-wrapper {
  flex-shrink: 0;
  /* background: linear-gradient(135deg, #FF0080, #7928CA);
  padding: 2px;
  border-radius: 50%;
  margin-right: 12px; */
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.item-content {
  flex: 1;             /* chiếm hết khoảng trống giữa avatar và nút */
  margin: 0 8px;       /* cho một khoảng hở nhỏ */
}

.item-content p {
  margin: 0;
  line-height: 1.2;
}

.username {
  font-weight: 600;
}

/* .dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  background: #009DFF;
  border-radius: 50%;
  margin-left: 4px;
} */

.timestamp {
  font-size: 0.8rem;
  color: #009DFF;
  margin-top: 4px;
}

.more-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  margin-left: auto;   /* đẩy thẳng về cuối hàng */
  opacity: 0;
  transition: opacity 0.2s;
}

.notification-item:hover .more-btn {
  opacity: 1;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background: #F9F9F9;
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
  background: #FFFFFF;
  border: 1px solid #DDD;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  z-index: 10;
  width: 220px;
  margin-top: 4px;
}
.nav-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.item-menu ul { list-style: none; margin: 0; padding: 4px 0; }
.item-menu li { display: flex; align-items: center; padding: 8px 12px; font-size: 0.9rem; cursor: pointer; }
.item-menu li i { margin-right: 8px; font-size: 1rem; }
.item-menu li:hover { background: #bbbbbb; }

.main-content { flex: 1; overflow-y: auto; background: #F9F9F9; box-sizing: border-box; }

.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
.nav-icon{
  width: 20px;
  height: 20px;
}
</style>
