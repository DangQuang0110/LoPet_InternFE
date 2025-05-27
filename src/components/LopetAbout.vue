<template>
  <div class="lopet-app">
    

    

    <!-- Profile section -->
    <div class="profile-container">
      <!-- Profile banner image -->
      <div class="profile-banner">
        <!-- Banner image background -->
      </div>

      <!-- Profile details section -->
      <div class="profile-details-sss">
        <div class="profile-avatar">
          <!-- Profile avatar circle -->
        </div>
        <div class="profile-info">
          <h1 class="profile-name">{{ user.name }}</h1>
          <p class="profile-stats">{{ user.friends }} Bạn bè</p>
          
          <div class="profile-nav">
            <router-link to='/profile'  class="nav-item">Bài đăng</router-link>
            <router-link to='/about' class="nav-item active">Giới Thiệu</router-link>
            <router-link to='/photo' class="nav-item">Hình Ảnh</router-link>
            <router-link to='/edit'  class="nav-item">Chỉnh sửa trang cá nhân</router-link>
          </div>
        </div>
      </div>

      <!-- About page content -->
      <div class="about-content">
        <div class="about-main">
          <!-- Personal info section -->
          <div class="about-section">
            <div class="about-header">
              <h3>Thông tin cá nhân</h3>
            </div>
            <div class="about-body">
              <div class="info-row">
                <div class="info-label">
                  <i class="fas fa-heart"></i>
                  <span>Mối quan hệ:</span>
                </div>
                <div class="info-value">{{ user.relationship }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">
                  <i class="fas fa-graduation-cap"></i>
                  <span>Học tại:</span>
                </div>
                <div class="info-value">{{ user.education }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">
                  <i class="fas fa-home"></i>
                  <span>Sống tại:</span>
                </div>
                <div class="info-value">{{ user.currentCity }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>Đến từ:</span>
                </div>
                <div class="info-value">{{ user.hometown }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">
                  <i class="fas fa-envelope"></i>
                  <span>Email:</span>
                </div>
                <div class="info-value">{{ user.email }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">
                  <i class="fas fa-phone"></i>
                  <span>Điện thoại:</span>
                </div>
                <div class="info-value">{{ user.phone }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">
                  <i class="fas fa-birthday-cake"></i>
                  <span>Ngày sinh:</span>
                </div>
                <div class="info-value">{{ user.birthday }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit button -->
        <div class="edit-profile-button">
          <button>Chỉnh sửa chi tiết</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LopetAbout',
  data() {
    return {
      user: {
        name: 'Pham Cau',
        friends: 500,
        education: 'Học tại Đại học Thành Phố Hồ Chí Minh',
        currentCity: 'Sống tại Thành Phố Hồ Chí Minh',
        hometown: 'Hoài Nhơn, Bình Định, Việt Nam',
        relationship: 'Độc thân',
        email: 'Email:cauphpham25@gmail.com',
        phone: '0123456789',
        birthday: '02/11/2004',
        interests: [
          'Mối quan hệ Độc thân',
          'Chăm sóc thú cưng',
          'Đọc sách'
        ],
        familyMembers: [
          {
            name: 'Bouncy',
            relationship: 'Thú cưng'
          },
          {
            name: 'Panda',
            relationship: 'Bạn bè'
          }
        ]
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



.profile-container {
  max-width: 900px;
  margin: 0 auto;
  background-color: #FAEBD7;
}

.profile-banner {
  height: 180px;
  overflow: hidden;
  background-color: #f0f2f5;
  background-image: linear-gradient(to bottom, #e6e6e6, #f0f2f5);
  position: relative;
}

.profile-details-sss {
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

.about-content {
  padding: 15px;
  background-color: #FAEBD7;
}

.about-main {
  background-color: #faf8f0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
}

.about-section {
  border-bottom: 1px solid #e9e6d6;
  padding: 15px;
}

.about-section:last-child {
  border-bottom: none;
  background-color: #FAEBD7;
}

.about-header {
  margin-bottom: 15px;
}

.about-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.info-row {
  display: flex;
  margin-bottom: 12px;
  align-items: center;
}

.info-label {
  width: 140px;
  font-size: 14px;
  color: #65676b;
  display: flex;
  align-items: center;
}

.info-label i {
  margin-right: 8px;
  width: 16px;
  text-align: center;
}

.info-value {
  font-size: 14px;
  color: #333;
  flex: 1;
}

.interest-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}

.interest-item i {
  margin-right: 10px;
  color: #65676b;
}

.family-members {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.family-member {
  display: flex;
  align-items: center;
  width: 48%;
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e4e6eb;
  margin-right: 10px;
}

.member-info h4 {
  font-size: 14px;
  font-weight: 600;
}

.member-info p {
  font-size: 12px;
  color: #65676b;
}

.edit-profile-button {
  text-align: center;
}

.edit-profile-button button {
  padding: 8px 30px;
  background-color: #fad989;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  color: #333;
}

/* Responsive styles */
@media (max-width: 768px) {
  .family-member {
    width: 100%;
  }
}
</style>