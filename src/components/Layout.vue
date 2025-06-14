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
              <a class="nav-link notification-wrapper" @click.prevent="toggleNotifications">
                <div class="icon-with-badge">
                  <img src="../assets/notification.png" alt="Thông báo" class="nav-icon" />
                  <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
                </div>
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
          <hr />
          <div class="user-panel" @click="showLogoutMenu = !showLogoutMenu">
            <img class="avatar" :src="currentUser.avatar || '/image/avata.jpg'" alt="User Avatar" />
            <span class="username">{{ currentUser.name || 'Ẩn danh' }}</span>
            <img src="../assets/settings.png" alt="Cài đặt" class="nav-icon settings-icon" />
            <div v-if="showLogoutMenu" class="logout-menu">
              <ul>
                <!-- Thay vì gọi handleLogout trực tiếp, ta sẽ gọi confirmLogout để hiển thị modal xác nhận -->
                <li @click.stop="confirmLogout" class="logout-option">
                  <img src="../assets/log-out.png" alt="Đăng xuất" class="nav-icon" /> Đăng xuất
                </li>
                <!-- Có thể giữ hoặc bỏ phần “Đổi mật khẩu” -->
                <!--
                <router-link to="/resetNewPassword" class="nav-link">
                  <img src="../assets/security-password.png" class="nav-icon" />
                  Đổi lại mật khẩu
                </router-link>
                -->
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
          <!-- Tab “All” -->
          <template v-if="activeTab === 'all'">
            <p class="section-title">Mới</p>
            <div
              v-for="(item, k) in notifications.unread"
              :key="k"
              :class="['notification-item', { unread: !item.isRead }]"
              @click="handleNotificationClick(item, k)"
            >
              <div class="avatar-wrapper">
                <img class="avatar" :src="item.avatar" alt="avatar" />
              </div>
              <div class="item-content">
                <p>
                  <span class="username">{{ item.name }}</span> {{ item.text }}
                  <span v-if="!item.isRead" class="dot"></span>
                </p>
                <p class="timestamp">{{ item.time }}</p>
              </div>
            </div>
            <div
              v-for="(item, j) in notifications.read"
              :key="j"
              :class="['notification-item', { unread: !item.isRead }]"
            >
              <div class="avatar-wrapper">
                <img class="avatar" :src="item.avatar" alt="avatar" />
              </div>
              <div class="item-content">
                <p>
                  <span class="username">{{ item.name }}</span> {{ item.text }}
                </p>
                <p class="timestamp">{{ item.time }}</p>
              </div>
            </div>
          </template>
          <!-- Tab “Unread” -->
          <template v-else>
            <p class="section-title">Mới</p>
            <div v-for="(item, k) in notifications.unread" :key="k" class="notification-item">
              <div class="avatar-wrapper">
                <img class="avatar" :src="item.avatar" alt="avatar" />
              </div>
              <div class="item-content">
                <p>
                  <span class="username">{{ item.name }}</span> {{ item.text }}<span v-if="!item.isRead" class="dot"></span>
                </p>
                
                <p class="timestamp">{{ item.time }}</p>
              </div>
              <button class="more-btn" @click.stop="toggleMenu(k + notifications.unread.length + notifications.read.length)">
                <i class="fas fa-ellipsis-h"></i>
              </button>
              <div v-if="openMenuIdx === k + notifications.unread.length + notifications.read.length" class="item-menu">
                <ul>
                  <li @click="markAsRead(k)"><i class="fas fa-check"></i> Đánh dấu là đã đọc</li>
                  <li @click="deleteNotification(k)"><i class="far fa-times-circle"></i> Xóa thông báo này</li>
                  <li @click="muteTopic(k)"><i class="fas fa-cog"></i> Tắt thông báo về “{{ item.name }}”</li>
                  <li @click="reportIssue(k)"><i class="fas fa-bug"></i> Báo cáo sự cố cho Thông báo</li>
                </ul>
              </div>
            </div>
          </template>
        </div>
      </div>
    </transition>

    <!-- Modal xác nhận đăng xuất -->
    <div v-if="showLogoutConfirm" class="logout-confirm-overlay">
      <div class="logout-confirm-modal">
        <h3>Bạn có chắc chắn muốn đăng xuất?</h3>
        <div class="modal-actions">
          <button class="btn-confirm" @click="handleLogout">Đồng ý</button>
          <button class="btn-cancel" @click="cancelLogout">Hủy</button>
        </div>
      </div>
    </div>

    <main class="main-content">
      <slot />
    </main>
  </div>
</template>


<script setup>
import { ref, onMounted,computed,watch  } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { logoutUser, getAccountById } from '@/service/authService'
import { getProfileByAccountId } from '@/service/profileService'
import { getNotificationList } from '@/service/notificationService'
import { updateNotificationStatus } from '@/service/notificationService'


const showNotifications = ref(false)
const activeTab = ref('all')
const router = useRouter()
const route = useRoute()
const openMenuIdx = ref(null)
const showLogoutMenu = ref(false)
const currentUser = ref({ name: '', avatar: '' })
const friends = ref([])
const unreadCount = computed(() => notifications.value.unread.length)
const showLogoutConfirm = ref(false)   // true => hiển thị modal xác nhận đăng xuất

function confirmLogout() {
  showLogoutConfirm.value = true
  showLogoutMenu.value = false   // ẩn menu logout dropdown
}

function cancelLogout() {
  showLogoutConfirm.value = false
}
const notifications = ref({
  unread: [],
  read: []
})
watch(() => route.query.friendId, (newVal) => {
  if (newVal && route.query.fromNotification) {
    // Tự động chọn người bạn từ thông báo
    selectFriend(Number(newVal))
  }
})
function toggleNotifications() {
  showNotifications.value = !showNotifications.value
  openMenuIdx.value = null
}
function toggleMenu(idx) {
  openMenuIdx.value = openMenuIdx.value === idx ? null : idx
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
async function markAsRead(index) {
  const item = notifications.value.unread[index]
  if (!item) return

  try {
    await updateNotificationStatus(item.notificationId, 'READ')
    item.isRead = true
    notifications.value.unread.splice(index, 1)
    notifications.value.read.unshift({ ...item })
    openMenuIdx.value = null
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật trạng thái thông báo:', err)
  }
}
// async function goToChat(actorId) {
//   const idx = notifications.value.unread.findIndex(n => n.actorId === actorId)
//   const item = notifications.value.unread[idx]

//   if (item && !item.isRead) {
//     try {
//       await updateNotificationStatus(item.notificationId, 'READ')
//       item.isRead = true
//       notifications.value.unread.splice(idx, 1)
//       notifications.value.read.unshift({ ...item, type: 'read' })
//     } catch (err) {
//       console.error('❌ Lỗi cập nhật trạng thái khi click:', err)
//     }
//   }
//   try {
//     await router.push('/message')
//     console.log('✅ Đã chuyển sang trang message')
//   } catch (e) {
//     console.error('❌ Không thể chuyển sang message:', e)
//   }
// }
// Nhận socket 'notification'
socket.on('notification', async (data) => {
  try {
    const [account, profile] = await Promise.all([
      getAccountById(data.actorId),
      getProfileByAccountId(data.actorId)
    ])

    notifications.value.unread.unshift({
      notificationId: data.notificationId,
      actorId: data.actorId,
      name: profile?.fullName || account?.username || 'Ẩn danh',
      text: data.content,
      time: 'Vừa xong',
      avatar: profile?.avatarUrl || '/image/avata.jpg',
      isRead: false, // Luôn là chưa đọc khi mới nhận
      type: data.type || 'MESSAGE' // Loại thông báo
    })
  } catch (err) {
    console.error('❌ Lỗi khi nhận thông báo socket:', err)
  }
})
// Thêm hàm xử lý khi click vào thông báo
async function handleNotificationClick(item, index) {
  try {
        console.log('🔔 Click thông báo:', item)
    // Nếu chưa đọc thì cập nhật trạng thái
    if (!item.isRead) {
      await updateNotificationStatus(item.notificationId, 'READ')
      item.isRead = true
      notifications.value.unread.splice(index, 1)
      notifications.value.read.unshift({ ...item })
    }

    // Chuyển hướng đến trang message với query params
    await router.push({
      path: '/message',
      query: { 
        friendId: item.actorId,
        fromNotification: true 
      }
    })
    
  } catch (err) {
    console.error('❌ Lỗi khi xử lý click vào thông báo:', err)
  }
}

function resetNewPassword() {
  router.push('/resetNewPassword')
}

onMounted(async () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!user?.id) return

  try {
    const [account, profile] = await Promise.all([
      getAccountById(user.id),
      getProfileByAccountId(user.id)
    ])

    currentUser.value.name = profile?.fullName?.trim()
      ? profile.fullName
      : account?.username || 'Ẩn danh'

    currentUser.value.avatar = profile?.avatarUrl?.trim()
      ? profile.avatarUrl
      : account?.avatar || '/image/avata.jpg'

  } catch (err) {
    console.error('❌ Lỗi khi load thông tin user sidebar:', err)
  }

  const list = await getNotificationList(user.id)

  // 👇 parsed chỉ dùng trong onMounted
  const parsed = await Promise.all(
    list.map(async (n) => {
      try {
        const [account, profile] = await Promise.all([
          getAccountById(n.actorId),
          getProfileByAccountId(n.actorId)
        ])

        const name = profile?.fullName?.trim()
          ? profile.fullName
          : account?.username?.trim() || 'Ẩn danh'

        const avatar = profile?.avatarUrl?.trim()
          ? profile.avatarUrl
          : account?.avatar?.trim() || '/image/avata.jpg'

        return {
          notificationId: n.notificationId,
          actorId: n.actorId,
          name,
          text: n.content,
          time: new Date(n.createdAt).toLocaleTimeString('vi-VN'),
          avatar,
          isRead: n.status === 'READ'
        }
      } catch {
        return {
          notificationId: n.notificationId,
          actorId: n.actorId,
          name: 'Ẩn danh',
          text: n.content,
          time: new Date(n.createdAt).toLocaleTimeString('vi-VN'),
          avatar: '/image/avata.jpg',
          isRead: n.status === 'READ'
        }
      }
    })
  )

notifications.value.unread = parsed.filter(n => !n.isRead).map(n => ({ ...n, type: 'unread' }))
notifications.value.read = parsed.filter(n => n.isRead).map(n => ({ ...n, type: 'read' }))

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
  text-align: center;
  margin-bottom: 10px;
}


.logo-img {
  position: absolute;
  top: -12px;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
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
/* .user-panel {
  margin-top:5px;
  position: relative;
  cursor: pointer;
  display: flex;              
  align-items: center;       
  gap: 8px;                  
} */

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
  width: 200px;
  margin-right: -25px;
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
/* .logout-menu a:hover {
  background-color: #f5f5f5;
} */
.logout-option {
               /* đảm bảo padding có tác dụng */
  padding: 8px 16px;                   /* padding mặc định */
        /* tạo chuyển động mượt */
}


.logout-option .nav-icon {
  margin-right: 6px; /* khoảng cách giữa icon và chữ */
  vertical-align: middle;
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

.user-panel {
  margin-top: 5px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between; /* Đẩy items ra hai bên */
  padding-right: 8px;             /* Có khoảng cho nút settings */
}

.username {
  flex: 1;
  margin-left: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #141414;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Nút settings đứng sát bên phải */
.settings-icon {
  width: 20px;
  height: 20px;
  margin-left: auto;
  cursor: pointer;
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden; /* ⚠️ Giúp cắt ảnh tràn */
  margin-right: 12px;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover; /* ✅ Giữ ảnh đúng tỉ lệ và phủ kín */
  border-radius: 50%; /* Đảm bảo hình vẫn bo tròn */
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

.main-content { flex: 1; background: #F9F9F9; box-sizing: border-box; }

.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
.nav-icon{
  width: 20px;
  height: 20px;
}
.notification-popup  {
  max-height: 660px; /* hoặc 70vh tuỳ bạn */
  overflow-y: auto;
  padding-right: 8px; /* giúp hiển thị scroll bar không bị dính chữ */
}
.popup-content{
  
}
.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #00b300; /* xanh lá hoặc #009DFF nếu thích */
  border-radius: 50%;
  margin-left: 6px;
}
.icon-with-badge {
  position: relative;
  display: inline-block;
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: red;
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 5px;
  border-radius: 50%;
  min-width: 16px;
  text-align: center;
  line-height: 1;
}
.notification-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
}

.item-content {
  flex-grow: 1; /* Chiếm hết không gian còn lại */
}
/* Ví dụ style đơn giản cho modal */
.logout-confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.logout-confirm-modal {
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  width: 320px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.logout-confirm-modal h3 {
  margin-bottom: 16px;
  font-size: 18px;
}

.modal-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
}

.btn-confirm,
.btn-cancel {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-confirm {
  background-color: #e74c3c;
  color: #fff;
}

.btn-cancel {
  background-color: #bdc3c7;
  color: #fff;
}

</style>