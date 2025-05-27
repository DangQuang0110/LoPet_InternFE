<template>
  <layout>
  <div class="lopet-app">
    <!-- Header with Search Bar -->
    
    <div class="search-box">
            <input type="text" placeholder="Tìm kiếm" />
            <button class="search-button">
              <img src="/icon/search.png" alt="Search" class="nav-icon" />
            </button>
          </div>
    <!-- Notification section -->
    <div class="notification-container">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="notification.type"
      >
        <span>{{ notification.message }}</span>
        <button class="close-notification" @click="removeNotification(notification.id)">×</button>
      </div>
    </div>

    <!-- Report confirmation form -->
    <div v-if="showReportConfirm" class="confirm-modal">
      <div class="confirm-modal-content">
        <h3>Xác nhận tố cáo</h3>
        <p>Bạn có muốn tố cáo bài viết này?</p>
        <div class="confirm-modal-actions">
          <button class="confirm-button" @click="confirmReport">Xác nhận</button>
          <button class="cancel-button" @click="cancelReport">Hủy</button>
        </div>
      </div>
    </div>

    <!-- Hidden file input for avatar change -->
    <input 
      type="file" 
      ref="avatarInput" 
      style="display: none" 
      accept="image/*"
      @change="handleAvatarChange"
    >

    <!-- Profile section -->
    <div class="profile-container">
      <!-- Profile banner image -->
      <div class="profile-banner">
        <!-- Banner image background -->
      </div>

      <!-- Profile details section -->
      <div class="profile-details-new">
        <div 
          class="profile-avatar"
          :style="{ 'background-image': 'url(' + user.avatar + ')' }"
          @click="$refs.avatarInput.click()"
          title="Click để thay đổi avatar"
        ></div>
        <div class="profile-info">
          <h1 class="profile-name">{{ user.name }}</h1>
          <p class="profile-stats">{{ user.friends }} Bạn bè</p>
          
          <div class="profile-nav">
            <router-link to='/profile' class="nav-item active">Trang Cá Nhân</router-link>
            <router-link to='/photo' class="nav-item">Hình Ảnh</router-link>
          </div>
        </div>
      </div>

      <!-- Profile content section -->
      <div class="profile-content">
        <!-- Sidebar - Fixed position -->
        <div class="sidebar-profile">
          <div class="intro-section">
            <h3>Giới Thiệu</h3>
            
            <!-- Conditionally render intro details or edit form -->
            <div v-if="!editMode">
              <!-- Bio and Contact Info -->
              <ul class="intro-list">
                <li class="bio-item">
                  <img src="/icon/resume.png" alt="Photo" class="nav-icon" />
                  <span>{{ user.bio || 'Chưa có thông tin giới thiệu...' }}</span>
                </li>
                <li>
                  <img src="/icon/telephone.png" alt="Photo" class="nav-icon" />
                  <span>{{ user.phone }}</span>
                </li>
              </ul>
              <button class="edit-button" @click="goToEdit">Chỉnh sửa chi tiết</button>
            </div>
            <div v-else>
              <!-- Edit form -->
              <form @submit.prevent="saveDetails" class="edit-form">
                <div class="form-group">
                  <label for="bio">Giới thiệu</label>
                  <textarea
                    id="bio"
                    v-model="editForm.bio"
                    placeholder="Nhập thông tin giới thiệu..."
                    class="form-input"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="phone">Số điện thoại</label>
                  <input
                    id="phone"
                    type="text"
                    v-model="editForm.phone"
                    placeholder="Nhập số điện thoại..."
                    class="form-input"
                  />
                </div>
                <div class="form-actions">
                  <button type="submit" class="save-button">Lưu</button>
                  <button type="button" class="cancel-button" @click="cancelEdit">Hủy</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Feed -->
        <div class="feed">
          <!-- Create post box -->
          <div class="create-post">
            <div class="create-post-header">
              <div 
                class="post-input-avatar"
                :style="{ 'background-image': 'url(' + user.avatar + ')' }"
              ></div>
              <div class="post-input">
                <input type="text" placeholder="Bạn đang nghĩ gì ?" />
              </div>
            </div>
            <div class="create-post-actions">
              <button class="create-action">
                <img src="/icon/camera.png" alt="Photo" class="nav-icon" />
                <span>Ảnh</span>
              </button>
            </div>
          </div>

          <!-- Posts list -->
          <div v-for="post in posts" :key="post.id" class="post-item" :class="{ 'user-post': post.author === user.name }">
            <div class="post-header">
              <div class="post-author">
                <div 
                  class="post-author-avatar" 
                  :class="{ 'user-avatar': post.author === user.name }"
                  :style="{ 'background-image': post.author === user.name ? 'url(' + user.avatar + ')' : 'url(' + post.authorAvatar + ')' }"
                ></div>
                <div class="post-author-info">
                  <h4>{{ post.author }}</h4>
                  <p class="post-time">{{ post.time }}</p>
                </div>
              </div>
              <div class="post-options" @click="toggleDropdown(post.id)">
                <img src="/icon/dots.png" alt="Options" class="nav-icon" />
                <!-- Dropdown Menu -->
                <div v-if="activeDropdown === post.id" class="dropdown-menu">
                  <div class="dropdown-item" @click.stop="reportPost(post.id)">
                    <img src="/icon/exclamation.png" alt="Report" class="nav-icon" />
                    <span>Tố cáo bài viết</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="post-content" v-if="post.content || post.image">
              <p v-if="post.content">{{ post.content }}</p>
              <div class="post-image" v-if="post.image" :class="post.imageClass">
                <!-- Pet image placeholder -->
              </div>
            </div>
            
            <div class="post-actions-wrapper">
              <div class="post-actions">
                <button class="post-action">
                  <img src="/icon/heart.png" alt="Like" class="nav-icon" />
                  <span></span>
                </button>
                <button class="post-action">
                  <img src="/icon/chat.png" alt="Comment" class="nav-icon" />
                  <span></span>
                </button>
              </div>
              <div class="post-actions-new">
                <button class="post-action">
                  <img src="/icon/share.png" alt="Share" class="nav-icon" />
                  <span></span>
                </button>
              </div>
            </div>
            
            <div class="post-stats" v-if="post.likes > 0">
              <span>{{ post.likes }} lượt thích</span>
            </div>
            
            <div class="post-comments" v-if="post.comments && post.comments.length > 0">
              <div v-for="(comment, index) in post.comments" :key="index" class="comment">
                <div 
                  class="comment-avatar"
                  :style="{ 'background-image': 'url(' + comment.authorAvatar + ')' }"
                ></div>
                <div class="comment-content">
                  <h5>{{ comment.author }}</h5>
                  <p>{{ comment.content }}</p>
                </div>
              </div>
            </div>

            <!-- Comment input -->
            <div class="comment-input">
              <div 
                class="comment-avatar user-avatar"
                :style="{ 'background-image': 'url(' + user.avatar + ')' }"
              ></div>
              <div class="comment-box">
                <input type="text" placeholder="Viết bình luận..." />
                <div class="comment-actions">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="activeDropdown || showReportConfirm" class="dropdown-overlay" @click="closeDropdown(); cancelReport()"></div>
  </div>
  </layout>
</template>

<script>
import layout from '@/components/Layout.vue'
export default {
      components: {
    layout,
  },
  name: 'LopetProfile',
  data() {
    return {
      activeDropdown: null,
      editMode: false,
      editForm: {
        bio: '',
        phone: ''
      },
      notifications: [],
      showReportConfirm: false, // Control visibility of report confirmation form
      reportPostId: null, // Store the ID of the post to report
      user: {
        name: 'Pham Cau',
        avatar: 'https://i.pravatar.cc/150?img=3',
        friends: 500,
        education: 'Học tại Đại học Thành Phố Hồ Chí Minh',
        location: 'Hoài Nhơn, Bình Định, Việt Nam',
        pets: 'Đang nuôi chó',
        relationship: 'Độc thân',
        email: 'cauphpham25@gmail.com',
        phone: '0123456789',
        birthday: '02/11/2004'
      },
      posts: [
        {
          id: 1,
          author: 'Pham Cau',
          authorAvatar: 'https://i.pravatar.cc/150?img=3',
          time: '2 giờ trước',
          content: 'Món cún lớn của gia đình chúng tôi',
          image: true,
          likes: 123,
          comments: [
            {
              author: 'Panda',
              authorAvatar: 'https://i.pravatar.cc/150?img=5',
              content: 'Dễ thương quá bạn ơi!'
            }
          ]
        },
        {
          id: 2,
          author: 'Bouncy và Pham Cau',
          authorAvatar: 'https://i.pravatar.cc/150?img=7',
          time: '1 giờ trước',
          content: 'Chuyến đi công viên hôm nay thật tuyệt vời!',
          image: true,
          likes: 45,
          comments: [
            {
              author: 'Mèo Miu',
              authorAvatar: 'https://i.pravatar.cc/150?img=9',
              content: 'Trông vui quá!'
            },
            {
              author: 'Luna',
              authorAvatar: 'https://i.pravatar.cc/150?img=11',
              content: 'Lần sau cho tôi đi cùng nhé!'
            }
          ]
        },
        {
          id: 3,
          author: 'Hội Yêu Thú Cưng',
          authorAvatar: 'https://i.pravatar.cc/150?img=13',
          time: '3 giờ trước',
          content: 'Sự kiện quyên góp thức ăn cho thú cưng hoang sẽ diễn ra vào ngày mai tại công viên thành phố. Hãy cùng tham gia!',
          likes: 210,
          comments: []
        }
      ]
    }
  },
  methods: {
    goToEdit() {
      this.editForm.bio = this.user.bio || '';
      this.editForm.phone = this.user.phone;
      this.editMode = true;
    },
    saveDetails() {
      this.user.bio = this.editForm.bio;
      this.user.phone = this.editForm.phone;
      this.editMode = false;
      this.showNotification('Thông tin đã được cập nhật thành công!', 'success');
    },
    cancelEdit() {
      this.editMode = false;
    },
    goBack() {
      this.$router.push('/friend');
    },
    handleAvatarChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.user.avatar = URL.createObjectURL(file);
    },
    toggleDropdown(postId) {
      this.activeDropdown = this.activeDropdown === postId ? null : postId;
    },
    closeDropdown() {
      this.activeDropdown = null;
    },
    showNotification(message, type = 'info') {
      const id = Date.now();
      this.notifications.push({ id, message, type });
      setTimeout(() => {
        this.removeNotification(id);
      }, 5000);
    },
    removeNotification(id) {
      this.notifications = this.notifications.filter(n => n.id !== id);
    },
    reportPost(postId) {
      this.showReportConfirm = true; // Show confirmation form
      this.reportPostId = postId; // Store post ID
      this.closeDropdown(); // Close dropdown
    },
    confirmReport() {
      console.log(`Reported post with ID: ${this.reportPostId}`);
      this.showNotification('Đã gửi tố cáo bài viết thành công!', 'success');
      this.showReportConfirm = false; // Hide confirmation form
      this.reportPostId = null; // Clear post ID
    },
    cancelReport() {
      this.showReportConfirm = false; // Hide confirmation form
      this.reportPostId = null; // Clear post ID
    }
  },
  mounted() {
    if (!document.querySelector('script[src*="font-awesome"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js';
      document.head.appendChild(script);
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.nav-icon {
  margin-right: 8px;
  width: 20px;
  height: 20px;
}

.lopet-app {
  background-color: #f0f2f5;
  min-height: 100vh;
  position: relative;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px; /* Tăng padding cho header */
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  max-width: 1200px; /* Thêm max-width để căn giữa */
  margin: 0 auto; /* Căn giữa header */
  width: 100%;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-text {
  font-weight: bold;
  font-size: 18px;
  color: #ff6f61;
}

.search-box{
  display: flex;
  align-items: center;
  background-color: #f0f2f5;
  border-radius: 25px; 
  padding: 8px 15px; 
  flex: 0 1 300px; 
  border: 1px solid #ddd;
  margin: 0 20px; 
  transition: box-shadow 0.3s ease; 
  margin-bottom: 10px;
  margin-left: 200px;
  margin-right: 200px;
}

.search-box:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Hiệu ứng bóng khi hover */
}

.search-box input {
  border: none;
  background-color: transparent;
  outline: none;
  flex: 1;
  padding: 8px 10px; /* Tăng padding input */
  font-size: 15px; /* Tăng kích thước chữ */
}

.search-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.search-button img {
  width: 22px; /* Tăng kích thước icon tìm kiếm */
  height: 22px;
}

.back-arrow {
  position: absolute;
  top: 60px;
  left: 15px;
  width: 30px;
  height: 30px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.profile-container {
  max-width: 900px;
  margin: 0 auto;
  background-color: #FAEBD7;
}

.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  width: 300px;
}

.notification {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 6px;
  color: black;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
}

.notification.success {
  background-color: #FAEBD7;
}

.notification.info {
  background-color: #007bff;
}

.close-notification {
  background: none;
  border: none;
  color: black;
  font-size: 16px;
  cursor: pointer;
  padding: 0 5px;
}

.close-notification:hover {
  opacity: 0.8;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.confirm-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.confirm-modal-content {
  background-color: #FFF8F0;
  border-radius: 8px;
  padding: 20px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.confirm-modal-content h3 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
}

.confirm-modal-content p {
  font-size: 14px;
  margin-bottom: 20px;
  color: #65676b;
}

.confirm-modal-actions {
  display: flex;
  gap: 10px;
}

.confirm-button, .cancel-button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.confirm-button {
  background-color: #f5ae52;
  color: white;
}

.confirm-button:hover {
  background-color: #FFD9AA;
}

.cancel-button {
  background-color: #e4e6eb;
  color: #333;
}

.cancel-button:hover {
  background-color: #d8dade;
}

.profile-banner {
  height: 250px;
  overflow: hidden;
  background-color: #f0f2f5;
  background-image: linear-gradient(to bottom, #e6e6e6, #f0f2f5);
  position: relative;
}

.profile-details-new {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #FFF8F0;
}

.profile-avatar {
  position: relative;
  margin-top: -50px;
  border: 4px solid white;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  background-color: #e4e6eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  transition: transform 0.3s;
}

.profile-avatar:hover {
  transform: scale(1.05);
}

.profile-info {
  text-align: center;
  width: 100%;
  padding-top: 10px;
}

.profile-name {
  font-size: 22px;
  font-weight: bold;
}

.profile-stats {
  color: #65676b;
  margin-bottom: 10px;
  font-size: 14px;
}

.profile-nav {
  display: flex;
  justify-content: center;
  border-top: 1px solid #e4e6eb;
  margin-top: 15px;
  padding-top: 5px;
}

.nav-item {
  padding: 8px 15px;
  text-decoration: none;
  color: #65676b;
  font-weight: 600;
  position: relative;
  font-size: 14px;
}

.nav-item.active {
  color: #ff6b01;
}

.nav-item.active:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #ff6b01;
}

.profile-content {
  display: flex;
  padding: 10px;
  flex-direction: row;
  background-color: #FAEBD7;
  position: relative;
}

.sidebar-profile {
  flex: 0 0 320px;
  margin-right: 15px;
  position: sticky;
  top: 10px;
  height: fit-content;
  z-index: 10;
}

.intro-section {
  background-color: #FFF8F0;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.intro-section h3 {
  margin-bottom: 15px;
  font-size: 16px;
}

.intro-list {
  list-style: none;
}

.intro-list li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #65676b;
  font-size: 14px;
}

.intro-list li i {
  margin-right: 10px;
  width: 20px;
  text-align: center;
  color: #777;
}

.edit-button {
  width: 100%;
  padding: 8px;
  background-color: #fad989;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  color: #333;
  transition: background-color 0.3s;
}

.edit-button:hover {
  background-color: #f8d070;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  background-color: #f0f2f5;
}

.form-input:focus {
  border-color: #ff6b01;
  background-color: white;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.save-button, .cancel-button {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-button {
  background-color: #ff6b01;
  color: white;
}

.save-button:hover {
  background-color: #e55f01;
}

.cancel-button {
  background-color: #e4e6eb;
  color: #333;
}

.cancel-button:hover {
  background-color: #d8dade;
}

.feed {
  flex: 1;
}

.create-post {
  background-color: #FFF8F0;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  padding: 12px;
  margin-bottom: 15px;
}

.create-post-header {
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.post-input-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 10px;
  background-color: #e4e6eb;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.post-input {
  flex: 1;
}

.post-input input {
  width: 100%;
  padding: 8px 12px;
  border: none;
  background-color: #f0f2f5;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
}

.create-post-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  margin-right: 400px;
}

.create-action {
  background: none;
  border: none;
  padding: 6px;
  color: #65676b;
  font-size: 14px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  transition: color 0.3s;
}

.create-action:hover {
  color: #ff6b01;
}

.create-action i {
  margin-right: 6px;
}

.post-item {
  background-color: #FFF8F0;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  padding: 12px;
}

.post-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.post-author {
  display: flex;
  align-items: center;
}

.post-author-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 10px;
  background-color: #e4e6eb;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.user-avatar {
  background-color: #ddd;
}

.post-author-info h4 {
  font-size: 14px;
  font-weight: 600;
}

.post-time {
  font-size: 12px;
  color: #65676b;
}

.post-options {
  position: relative;
  display: flex;
  gap: 15px;
  align-items: center;
}

.post-options i {
  cursor: pointer;
  color: #65676b;
  transition: color 0.3s;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s, color 0.3s;
}

.post-options i:hover {
  background-color: #f0f2f5;
  color: #ff6b01;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 180px;
  overflow: hidden;
  animation: dropdownFadeIn 0.2s ease;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
  color: #333;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item i {
  margin-right: 12px;
  width: 16px;
  text-align: center;
  font-size: 14px;
  color: #65676b;
}

.dropdown-item:first-child i {
  color: #e74c3c;
}

.dropdown-item:last-child i {
  color: #f39c12;
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background-color: transparent;
}

.post-content {
  margin-bottom: 15px;
}

.post-content p {
  margin-bottom: 10px;
  font-size: 14px;
}

.post-image {
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
  height: 240px;
  background-color: #e4e6eb;
}

.pets-image {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><rect width="400" height="240" fill="%23eee"/><text x="50%" y="50%" fill="%23aaa" font-family="Arial" font-size="16" text-anchor="middle">Pet Image</text></svg>');
  background-size: cover;
}

.park-image {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><rect width="400" height="240" fill="%23eee"/><text x="50%" y="50%" fill="%23aaa" font-family="Arial" font-size="16" text-anchor="middle">Park Image</text></svg>');
  background-size: cover;
}

.post-actions-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
}

.post-actions {
  display: flex;
  gap: 8px;
}

.post-actions-new {
  display: flex;
}

.post-action {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.post-action:hover {
  color: #ff6b01;
}

.post-action i {
  margin-right: 5px;
}

.post-stats {
  font-size: 14px;
  color: #65676b;
  margin: 10px 0;
}

.post-comments {
  margin-top: 10px;
}

.comment {
  display: flex;
  margin-bottom: 10px;
}

.comment-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-right: 10px;
  background-color: #e4e6eb;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.comment-content {
  background-color: #f0f2f5;
  border-radius: 18px;
  padding: 8px 12px;
  flex: 1;
}

.comment-content h5 {
  font-size: 13px;
  margin-bottom: 3px;
  font-weight: 600;
}

.comment-content p {
  font-size: 13px;
}

.comment-input {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.comment-box {
  flex: 1;
  position: relative;
}

.comment-box input {
  width: 100%;
  padding: 8px 12px;
  border: none;
  background-color: #f0f2f5;
  border-radius: 18px;
  outline: none;
  font-size: 13px;
  padding-right: 80px;
}

.comment-actions {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 10px;
  color: #65676b;
}

.comment-actions i {
  cursor: pointer;
  transition: color 0.3s;
}

.comment-actions i:hover {
  color: #ff6b01;
}

/* Responsive styles */
@media (max-width: 768px) {
  .header {
    padding: 10px 15px;
    flex-wrap: wrap; /* Cho phép wrap khi màn hình nhỏ */
    gap: 10px;
  }

  .search-box {
    flex: 1 1 100%; /* Chiếm toàn bộ chiều rộng trên mobile */
    margin: 10px 0; /* Thêm margin trên dưới */
    max-width: 100%; /* Đảm bảo không vượt quá container */
  }

  .search-box input {
    font-size: 14px;
  }

  .profile-content {
    flex-direction: column;
  }

  .sidebar {
    flex: 1;
    margin-right: 0;
    margin-bottom: 15px;
    position: static;
  }
  
  .create-action {
    flex: 1;
    min-width: 33%;
    padding: 6px 2px;
    font-size: 12px;
  }
  
  .dropdown-menu {
    right: 10px;
    min-width: 160px;
  }
  
  .notification-container {
    width: 100%;
    padding: 0 10px;
    right: 0;
  }
  
  .notification {
    max-width: 100%;
  }

  .confirm-modal-content {
    width: 95%;
    padding: 15px;
  }

  .confirm-modal-content h3 {
    font-size: 16px;
  }

  .confirm-modal-content p {
    font-size: 13px;
  }
}
</style>