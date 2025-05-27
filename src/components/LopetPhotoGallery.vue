<template>
  <layout>
  <div class="lopet-app">
    <div class="search-box-image">
            <input type="text" placeholder="Tìm kiếm" />
            <button class="search-button">
              <img src="/icon/search.png" alt="Search" class="nav-icon" />
            </button>
          </div>

    <!-- Profile section -->
    <div class="profile-container">
      <!-- Profile banner image -->
      <div class="profile-banner">
        <!-- Banner image background -->
      </div>

      <!-- Profile details section -->
      <div class="profile-details">
        <div class="profile-avatar">
          <!-- Profile avatar circle -->
        </div>
        <div class="profile-info">
          <h1 class="profile-name">{{ user.name }}</h1>
          <p class="profile-stats">{{ user.friends }} Bạn bè</p>
          
          <div class="profile-nav">
            <router-link to='/profile' class="nav-item">Trang Cá Nhân</router-link>
            <router-link to='/photo' class="nav-item active">Hình Ảnh</router-link>
          </div>
        </div>
      </div>

      <!-- Photos page content -->
      <div class="photos-content">
        <div class="photos-header">
          <h3>Hình ảnh của {{ user.name }}</h3>
        </div>

        

        <!-- All photos section -->
        <div class="photos-section">
          
          <div class="photos-grid">
            <div class="photo-item" v-for="(photo, index) in photos" :key="'photo-'+index" @click="openPhotoViewer(index)">
              <div class="photo-img" :style="{ backgroundImage: `url(${photo.url})` }">
                <div class="photo-overlay">
                  <div class="photo-likes" v-if="photo.likes > 0">
                    <i class="fas fa-heart"></i> {{ photo.likes }}
                  </div>
                  <div class="photo-comments" v-if="photo.comments > 0">
                    <i class="fas fa-comment"></i> {{ photo.comments }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Photo viewer modal -->
    <div class="photo-viewer" v-if="showPhotoViewer">
      <div class="viewer-header">
        <div class="viewer-user-info">
          <div class="viewer-avatar" :style="{ backgroundImage: `url(${user.avatarUrl})` }"></div>
          <div class="viewer-name">{{ user.name }}</div>
        </div>
        <div class="viewer-close" @click="closePhotoViewer">
          <i class="fas fa-times"></i>
        </div>
      </div>
      <div class="viewer-content">
        <div class="viewer-nav prev" @click="prevPhoto">
          <i class="fas fa-chevron-left"></i>
        </div>
        <div class="viewer-image">
          <img :src="photos[currentPhotoIndex].url" alt="Photo" />
        </div>
        <div class="viewer-nav next" @click="nextPhoto">
          <i class="fas fa-chevron-right"></i>
        </div>
      </div>
      <div class="viewer-footer">
        <div class="viewer-actions">
          <button class="action-btn">
            <i class="fas fa-heart"></i> Thích
          </button>
          <button class="action-btn">
            <i class="fas fa-comment"></i> Bình luận
          </button>
          <button class="action-btn">
            <i class="fas fa-share"></i> Chia sẻ
          </button>
        </div>
        <div class="viewer-info">
          <div class="photo-date">{{ photos[currentPhotoIndex].date }}</div>
          <div class="photo-description">{{ photos[currentPhotoIndex].description }}</div>
        </div>
      </div>
    </div>
  </div>
  </layout>
</template>

<script>
import layout from './Layout.vue';
export default {
        components: {
    layout,
  },
  name: 'LopetPhotosPage',
  data() {
    return {
      showPhotoViewer: false,
      currentPhotoIndex: 0,
      user: {
        name: 'Pham Cau',
        friends: 500,
        avatarUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23ddd"/><text x="50%" y="50%" fill="%23aaa" font-family="Arial" font-size="16" text-anchor="middle">Avatar</text></svg>'
      },
      albums: [
        {
          name: 'Thú cưng của tôi',
          coverUrl: 'https://placedog.net/500/300',
          photoCount: 23
        },
        {
          name: 'Chó Corgi',
          coverUrl: 'https://placedog.net/500/301',
          photoCount: 15
        },
        {
          name: 'Mèo',
          coverUrl: 'https://placekitten.com/500/300',
          photoCount: 18
        },
        {
          name: 'Các loài thú',
          coverUrl: 'https://placedog.net/500/302',
          photoCount: 12
        }
      ],
      photos: [
        {
          url: 'https://placedog.net/500/500',
          likes: 45,
          comments: 12,
          date: '20/04/2025',
          description: 'Chú chó yêu quý của tôi đang chơi ở công viên.'
        },
        {
          url: 'https://placekitten.com/500/500',
          likes: 32,
          comments: 8,
          date: '15/04/2025',
          description: 'Mèo con đang ngủ trưa.'
        },
        {
          url: 'https://placedog.net/501/501',
          likes: 28,
          comments: 5,
          date: '10/04/2025',
          description: 'Bouncy đang nghịch đồ chơi mới.'
        },
        {
          url: 'https://placekitten.com/501/501',
          likes: 50,
          comments: 15,
          date: '05/04/2025',
          description: 'Một ngày nắng đẹp ở công viên với Panda.'
        },
        {
          url: 'https://placedog.net/502/502',
          likes: 22,
          comments: 3,
          date: '01/04/2025',
          description: 'Chụp ảnh kỷ niệm sinh nhật Bouncy.'
        },
        {
          url: 'https://placekitten.com/502/502',
          likes: 18,
          comments: 2,
          date: '28/03/2025',
          description: 'Mèo con đang chơi với đồ chơi.'
        },
        {
          url: 'https://placedog.net/503/503',
          likes: 35,
          comments: 6,
          date: '25/03/2025',
          description: 'Buổi đi dạo buổi sáng với Bouncy.'
        },
        {
          url: 'https://placekitten.com/503/503',
          likes: 41,
          comments: 9,
          date: '20/03/2025',
          description: 'Panda đang nằm phơi nắng.'
        },
        {
          url: 'https://placedog.net/504/504',
          likes: 19,
          comments: 4,
          date: '15/03/2025',
          description: 'Dạo chơi ở bãi biển cuối tuần.'
        }
      ]
    }
  },
  methods: {
    openPhotoViewer(index) {
      this.currentPhotoIndex = index;
      this.showPhotoViewer = true;
    },
    closePhotoViewer() {
      this.showPhotoViewer = false;
    },
    nextPhoto() {
      if (this.currentPhotoIndex < this.photos.length - 1) {
        this.currentPhotoIndex++;
      } else {
        this.currentPhotoIndex = 0;
      }
    },
    prevPhoto() {
      if (this.currentPhotoIndex > 0) {
        this.currentPhotoIndex--;
      } else {
        this.currentPhotoIndex = this.photos.length - 1;
      }
    }
  },
  mounted() {
    // Load FontAwesome
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

.search-box-image {
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
  height: 250px;
  overflow: hidden;
  background-color: #f0f2f5;
  background-image: linear-gradient(to bottom, #e6e6e6, #f0f2f5);
  position: relative;
}

.profile-details {
  padding: 0 20px;
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
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23ddd"/><text x="50%" y="50%" fill="%23aaa" font-family="Arial" font-size="16" text-anchor="middle">Avatar</text></svg>');
  background-size: cover;
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

/* Photos specific styles */
.photos-content {
  padding: 15px;
  background-color: #FAEBD7;
}

.photos-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.photos-header h3 {
  font-size: 18px;
  font-weight: 600;
}

.upload-btn {
  padding: 8px 15px;
  background-color: #fad989;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
}

.upload-btn i {
  margin-right: 5px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-header h4 {
  font-size: 16px;
  font-weight: 600;
}

.view-all-btn, .filter-dropdown {
  font-size: 14px;
  color: #ff6b01;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 600;
}

.filter-dropdown {
  padding: 5px;
  background-color: white;
  border-radius: 4px;
  color: #333;
}

.albums-section, .photos-section {
  background-color: #FFF8F0;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.albums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.album-item {
  cursor: pointer;
}

.album-cover {
  height: 150px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.album-count {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 5px 8px;
  border-top-left-radius: 8px;
  font-size: 12px;
}

.album-title {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
}
.search-box {
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

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.photo-item {
  cursor: pointer;
}

.photo-img {
  height: 120px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
  display: flex;
  justify-content: space-between;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.photo-item:hover .photo-overlay {
  opacity: 1;
}

.photo-likes, .photo-comments {
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
}

.photo-likes i, .photo-comments i {
  margin-right: 3px;
  font-size: 10px;
}



/* Photo viewer styles */
.photo-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  color: white;
}

.viewer-user-info {
  display: flex;
  align-items: center;
}

.viewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-size: cover;
  margin-right: 10px;
}

.viewer-name {
  font-weight: 600;
}

.viewer-close {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
}

.viewer-close:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.viewer-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.viewer-image {
  max-width: 90%;
  max-height: 80vh;
  display: flex;
  justify-content: center;
}

.viewer-image img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

.viewer-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
}

.viewer-nav.prev {
  left: 20px;
}

.viewer-nav.next {
  right: 20px;
}

.viewer-footer {
  color: white;
  padding: 15px;
}

.viewer-actions {
  display: flex;
  margin-bottom: 15px;
}

.action-btn {
  background: none;
  border: none;
  color: white;
  margin-right: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.action-btn i {
  margin-right: 5px;
}

.viewer-info {
  display: flex;
  flex-direction: column;
}

.photo-date {
  font-size: 12px;
  color: #ccc;
  margin-bottom: 5px;
}

.photo-description {
  font-size: 14px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .albums-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .photos-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .photo-img {
    height: 100px;
  }
  
  .album-cover {
    height: 120px;
  }
  
  .viewer-image img {
    max-height: 60vh;
  }
}
</style>