<template>
  <div class="lopet-app">
    <!-- Header with logo and search -->
    <header class="header">
      <div class="logo">
        <span class="logo-text">LOPET</span>
        <span class="pet-icon">🐱</span>
      </div>
      <div class="search-box">
        <input type="text" placeholder="Tìm kiếm..." />
        <button class="search-button">
          <i class="fa fa-search"></i>
        </button>
      </div>
    </header>

    <!-- Back arrow -->
    <div class="back-arrow" @click="goBack">
      <i class="fas fa-arrow-left"></i>
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
      <div class="profile-details">
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
            <router-link to='/profile' class="nav-item active">Bài đăng</router-link>
            <router-link to='/about' class="nav-item">Giới Thiệu</router-link>
            <router-link to='/photo' class="nav-item">Hình Ảnh</router-link>
            <router-link to='/edit' class="nav-item">Chỉnh sửa trang cá nhân</router-link>
          </div>
        </div>
      </div>

      <!-- Profile content section -->
      <div class="profile-content">
        <!-- Sidebar -->
        <div class="sidebar">
          <div class="intro-section">
            <h3>Bài Đăng</h3>
            <ul class="intro-list">
              <li>
                <i class="fas fa-graduation-cap"></i>
                <span>{{ user.education }}</span>
              </li>
              <li>
                <i class="fas fa-home"></i>
                <span>{{ user.location }}</span>
              </li>
              <li>
                <i class="fas fa-dog"></i>
                <span>{{ user.pets }}</span>
              </li>
              <li>
                <i class="fas fa-heart"></i>
                <span>{{ user.relationship }}</span>
              </li>
              <li>
                <i class="fas fa-envelope"></i>
                <span>{{ user.email }}</span>
              </li>
              <li>
                <i class="fas fa-calendar"></i>
                <span>{{ user.birthday }}</span>
              </li>
              <li>
                <i class="fas fa-phone"></i>
                <span>{{ user.phone }}</span>
              </li>
            </ul>
            <button class="edit-button" @click="goToEdit">Chỉnh sửa chi tiết</button>
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
                <input type="text" placeholder="Bạn đang nghĩ gì, {{ user.name }}?" />
              </div>
            </div>
            <div class="create-post-actions">
              <button class="create-action">
                <i class="fas fa-images"></i>
                <span>Ảnh/Video</span>
              </button>
              <button class="create-action">
                <i class="fas fa-paw"></i>
                <span>Thú cưng</span>
              </button>
              <button class="create-action">
                <i class="fas fa-map-marker-alt"></i>
                <span>Địa điểm</span>
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
              <div class="post-options">
                <i class="fas fa-ellipsis-h"></i>
              </div>
            </div>
            
            <div class="post-content" v-if="post.content || post.image">
              <p v-if="post.content">{{ post.content }}</p>
              <div class="post-image" v-if="post.image" :class="post.imageClass">
                <!-- Pet image placeholder -->
              </div>
            </div>
            
            <div class="post-actions">
              <button class="post-action">
                <i class="far fa-heart"></i>
                <span>Thích</span>
              </button>
              <button class="post-action">
                <i class="far fa-comment"></i>
                <span>Bình luận</span>
              </button>
              <button class="post-action">
                <i class="fas fa-share"></i>
                <span>Chia sẻ</span>
              </button>
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
                  <i class="far fa-smile"></i>
                  <i class="fas fa-camera"></i>
                  <i class="fas fa-paperclip"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LopetProfile',
  data() {
    return {
      user: {
        name: 'Pham Cau',
        avatar: 'https://i.pravatar.cc/150?img=3', // Avatar mặc định
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
      this.$router.push('/edit');
    },
    goBack() {
      this.$router.push('/friend');
    },
    handleAvatarChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      
      // Tạo URL tạm để xem trước
      this.user.avatar = URL.createObjectURL(file);
      
      // Ở đây bạn có thể thêm code để upload ảnh lên server
      // Ví dụ:
      // const formData = new FormData();
      // formData.append('avatar', file);
      // axios.post('/api/upload-avatar', formData).then(response => {
      //   this.user.avatar = response.data.avatarUrl;
      // });
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

.lopet-app {
  background-color: #f0f2f5;
  min-height: 100vh;
  position: relative;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
}

.pet-icon {
  font-size: 18px;
  margin-left: 2px;
}

.logo-text {
  font-weight: bold;
  font-size: 18px;
  color: #ff6b01;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: #f0f2f5;
  border-radius: 20px;
  padding: 5px 15px;
  flex: 0 1 250px;
  border: 1px solid #ddd;
}

.search-box input {
  border: none;
  background-color: transparent;
  outline: none;
  flex: 1;
  padding: 5px;
  font-size: 14px;
}

.search-button {
  background: none;
  border: none;
  cursor: pointer;
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
  background-color: #f0f2f5;
}

.profile-banner {
  height: 180px;
  overflow: hidden;
  background-color: #f0f2f5;
  background-image: linear-gradient(to bottom, #e6e6e6, #f0f2f5);
  position: relative;
}

.profile-details {
  padding: 0 20px;
  position: relative;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
}

.sidebar {
  flex: 0 0 320px;
  margin-right: 15px;
}

.intro-section {
  background-color: #faf8f0;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
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

.feed {
  flex: 1;
}

.create-post {
  background-color: white;
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
  background-color: white;
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
  display: flex;
  gap: 15px;
  align-items: center;
}

.post-options i {
  cursor: pointer;
  color: #65676b;
  transition: color 0.3s;
}

.post-options i:hover {
  color: #ff6b01;
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

.post-actions {
  display: flex;
  padding: 5px 0;
  margin-bottom: 5px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.post-action {
  background: none;
  border: none;
  padding: 8px 10px;
  cursor: pointer;
  color: #65676b;
  font-size: 14px;
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  transition: color 0.3s;
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
  .profile-content {
    flex-direction: column;
  }

  .sidebar {
    flex: 1;
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .create-post-actions {
    flex-wrap: wrap;
  }
  
  .create-action {
    flex: 1;
    min-width: 33%;
    padding: 6px 2px;
    font-size: 12px;
  }
}
</style>