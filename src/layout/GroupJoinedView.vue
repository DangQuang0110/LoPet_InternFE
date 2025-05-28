<template>
  <Layout>
  <div class="app-container">
    <!-- Loading state -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Đang tải thông tin nhóm...</p>
    </div>

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
          <img :src="group.coverUrl" class="cover-image" />
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

    <div class="cover" :style="{ backgroundImage: `url(${group.coverUrl})` }"></div>

    <section class="group-info full-width-group">
      <h1>{{ group.name }}</h1>
      <p class="members">
        <img src="@/assets/diacau.png" alt="Địa cầu" class="inline-icon" />
        {{ group.totalMembers }} thành viên
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
          <!-- Show new post section only if user has joined the group -->
          <div v-if="!leftGroup" class="new-post">
            <div class="status-box">
              <img class="avatar" :src="user?.avatar || 'https://i.pravatar.cc/40?img=7'" />
              <textarea 
                v-model="newPostContent"
                class="status-input" 
                placeholder="Bạn muốn chia sẻ điều gì?"
                :disabled="isPostLoading"
              ></textarea>
            </div>
            
            <!-- Image preview -->
            <div v-if="imagePreview" class="image-preview-container">
              <img :src="imagePreview" alt="Preview" class="image-preview" />
              <button class="remove-image" @click="removeImage">×</button>
            </div>

            <div class="status-actions">
              <label class="image-upload-label">
                <img src="@/assets/camera.png" alt="Camera" class="inline-icon" />
                <input 
                  type="file" 
                  class="image-input" 
                  @change="handleImageChange" 
                  accept="image/*"
                  :disabled="isPostLoading"
                />
              </label>
              <button 
                class="post-button" 
                @click="handleCreatePost"
                :disabled="isPostLoading || !newPostContent.trim()"
              >
                {{ isPostLoading ? 'Đang đăng...' : 'Đăng' }}
              </button>
            </div>
          </div>

          <!-- Show message for non-members -->
          <div v-else class="join-message">
            <p>Tham gia nhóm để đăng bài viết và tương tác với các thành viên khác</p>
          </div>

          <!-- Posts list - visible to all -->
          <div v-for="post in groupPosts" :key="post.id" class="post">
            <div class="post-header">
              <img class="avatar" :src="post.user?.avatar || 'https://i.pravatar.cc/40?img=7'" />
              <div class="info">
                <strong>{{ post.user?.fullName || 'Người dùng' }}</strong>
                <div class="time">{{ new Date(post.createdAt).toLocaleString('vi-VN') }}</div>
              </div>
              <div class="menu-wrapper" style="position: relative; margin-left: auto;">
                <div class="menu" @click="toggleReportMenu(post.id)">⋮</div>
                <div
                  v-if="showReportMenu === post.id"
                  class="report-dropdown"
                  @click="openReport(post.id)"
                >
                  Báo cáo bài viết
                </div>
              </div>
            </div>
            <p>{{ post.content }}</p>
            <img v-if="post.postMedias && post.postMedias.length > 0" 
                 :src="post.postMedias[0].mediaUrl" 
                 alt="Post Image" 
                 class="post-image" />

            <div class="interactions">
              <img src="@/assets/traitim.png" alt="Like" class="inline-icon" /> {{ post.likes || 0 }} lượt thích –
              <img src="@/assets/comment.png" alt="Bình luận" class="inline-icon" /> {{ post.comments?.length || 0 }} bình luận –
              <img src="@/assets/share.png" alt="Chia sẻ" class="inline-icon" /> Chia sẻ
            </div>

            <!-- Show comment box only for members -->
            <div v-if="!leftGroup">
              <div v-for="comment in post.comments" :key="comment.id" class="comment">
                <img class="comment-avatar" :src="comment.user?.avatar || 'https://i.pravatar.cc/30?img=9'" />
                <div class="comment-content">
                  <strong>{{ comment.user?.fullName || 'Người dùng' }}:</strong> {{ comment.content }}
                </div>
              </div>
              <input class="comment-box" placeholder="Viết bình luận..." />
            </div>
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
import { ref, computed, onMounted } from 'vue'
import Layout from '@/components/Layout.vue'
import { useRoute, useRouter } from 'vue-router'
import { getGroupDetails, joinGroup, getListGroupJoin, createPostGroup, getPostsGroup } from '@/service/communityService'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const route = useRoute()
const router = useRouter()
const confirmLeave = ref(false)
const leftGroup = ref(true) // Start with not joined state
const showEditPopup = ref(false)
const showReportPopup = ref(false)
const selectedPostId = ref(null)
const selectedReason = ref('')
const showReportMenu = ref(null)
const isLoading = ref(true)
const user = ref(null)
const newPostContent = ref('')
const selectedImage = ref(null)
const imagePreview = ref(null)
const isPostLoading = ref(false)
const groupPosts = ref([])

const group = ref({
  name: '',
  description: '',
  email: '',
  phone: '',
  address: '',
  privacy: 'public',
  coverUrl: '',
  totalMembers: 0,
  ownerId: null
})

const reportOptions = [
  'Thông tin sai sự thật, lừa đảo hoặc gian lận',
  'Quyền sở hữu trí tuệ',
  'Vấn đề liên quan tới người dưới 18 tuổi',
  'Tự tử hoặc gây thương tích',
  'Bắt nạt, quấy rối hoặc lăng mạ / lạm dụng / ngược đãi'
]

// Hàm lấy thông tin nhóm
const fetchGroupDetails = async () => {
  try {
    isLoading.value = true
    const groupId = route.params.id
    console.log('Fetching group details for ID:', groupId)

    const response = await getGroupDetails(groupId)
    console.log('Group details response:', response)

    if (response && response.data) {
      const data = response.data
      group.value = {
        name: data.name || '',
        description: data.bio || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        privacy: data.type === 'PUBLIC' ? 'public' : 'private',
        coverUrl: data.coverUrl || '/src/assets/anhbia.jpg',
        totalMembers: data.members?.length || 0,
        ownerId: data.owner?.id || null
      }
    }
  } catch (error) {
    console.error('Lỗi khi lấy thông tin nhóm:', error)
    toast.error('Không thể tải thông tin nhóm!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored',
    })
  } finally {
    isLoading.value = false
  }
}

// Get current user info
const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      user.value = JSON.parse(userStr)
    } catch (error) {
      console.error('Error parsing user from localStorage:', error)
      user.value = null
    }
  }
}

// Check if user has joined the group
const checkGroupMembership = async () => {
  try {
    if (!user.value) return

    const response = await getListGroupJoin(user.value.id)
    if (response && response.data) {
      const joinedGroups = response.data
      leftGroup.value = !joinedGroups.some(g => g.id === parseInt(route.params.id))
    }
  } catch (error) {
    console.error('Error checking group membership:', error)
  }
}

// Handle joining group
async function handleJoin() {
  try {
    if (!user.value) {
      toast.error('Vui lòng đăng nhập để tham gia nhóm!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: 'colored'
      })
      return
    }

    // Call API to join group
    await joinGroup(route.params.id, group.value.ownerId, user.value.id)
    
    // Update UI state
    leftGroup.value = false
    
    toast.success('Đã tham gia nhóm thành công!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored'
    })

    // Refresh group details
    await fetchGroupDetails()

  } catch (error) {
    console.error('Lỗi khi tham gia nhóm:', error)
    toast.error('Có lỗi xảy ra khi tham gia nhóm!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored'
    })
  }
}

function toggleConfirmLeave() {
  confirmLeave.value = true
}

function handleLeaveGroup() {
  leftGroup.value = true
  confirmLeave.value = false
  toast.success('Đã rời khỏi nhóm thành công!', {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000,
    theme: 'colored'
  })
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
    toast.error('Vui lòng chọn lý do báo cáo!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored'
    })
    return
  }
  console.log('Báo cáo bài viết ID:', selectedPostId.value, 'Lý do:', selectedReason.value)
  toast.success('Báo cáo của bạn đã được gửi thành công!', {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000,
    theme: 'colored'
  })
  closeReport()
}

function toggleReportMenu(postId) {
  showReportMenu.value = showReportMenu.value === postId ? null : postId
}

// Handle image selection for new post
const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (!file.type.match('image.*')) {
      toast.error('Vui lòng chọn file ảnh!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: 'colored'
      })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 5MB!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: 'colored'
      })
      return
    }
    selectedImage.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

// Remove selected image
const removeImage = () => {
  selectedImage.value = null
  imagePreview.value = null
  const input = document.querySelector('.image-input')
  if (input) input.value = ''
}

// Create new post
const handleCreatePost = async () => {
  try {
    if (!newPostContent.value.trim()) {
      toast.error('Vui lòng nhập nội dung bài viết!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: 'colored'
      })
      return
    }

    if (!user.value) {
      toast.error('Vui lòng đăng nhập để thực hiện chức năng này!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: 'colored'
      })
      return
    }

    isPostLoading.value = true
    const formData = new FormData()
    formData.append('content', newPostContent.value.trim())
    formData.append('groupId', route.params.id)
    formData.append('userId', user.value.id)
    formData.append('scope', 'PUBLIC')

    if (selectedImage.value) {
      formData.append('images', selectedImage.value)
    }

    await createPostGroup(formData)

    // Reset form
    newPostContent.value = ''
    selectedImage.value = null
    imagePreview.value = null
    const input = document.querySelector('.image-input')
    if (input) input.value = ''

    // Refresh posts
    await fetchGroupPosts()

    toast.success('Đăng bài viết thành công!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored'
    })

  } catch (error) {
    console.error('Lỗi khi đăng bài viết:', error)
    toast.error('Có lỗi xảy ra khi đăng bài viết!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored'
    })
  } finally {
    isPostLoading.value = false
  }
}

// Fetch group posts
const fetchGroupPosts = async () => {
  try {
    const posts = await getPostsGroup(route.params.id)
    groupPosts.value = posts
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài viết:', error)
    toast.error('Không thể tải danh sách bài viết!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored'
    })
  }
}

onMounted(() => {
  getCurrentUser()
  fetchGroupDetails()
  checkGroupMembership()
  fetchGroupPosts()
})

function saveChanges() {
  console.log('Thông tin nhóm đã lưu:', group.value)
  showEditPopup.value = false
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

.joined {
  background-color: #eee;
  color: #333;
  font-weight: bold;
}

.invite {
  background-color: orange;
  color: white;
}

.join {
  background-color: #2196f3;
  color: white;
  font-weight: bold;
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

/* Thêm style cho loading overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #f9a825;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.join-message {
  background: #fff;
  padding: 20px;
  text-align: center;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.join-message p {
  color: #666;
  font-size: 15px;
  margin: 0;
}

.status-box {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 16px;
}

.status-input {
  flex: 1;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid #ccc;
  min-height: 60px;
  resize: vertical;
  font-family: inherit;
}

.status-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px 16px;
}

.image-upload-label {
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.image-upload-label:hover {
  background-color: #f5f5f5;
}

.image-input {
  display: none;
}

.post-button {
  background-color: #f9a825;
  color: #fff;
  border: none;
  padding: 8px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.post-button:hover:not(:disabled) {
  background-color: #f57c00;
}

.post-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.image-preview-container {
  padding: 0 16px;
  margin-bottom: 16px;
}

.image-preview {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
}

.remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.remove-image:hover {
  background: rgba(0, 0, 0, 0.8);
}
</style>