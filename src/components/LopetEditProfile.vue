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

    <!-- Edit profile container -->
    <div class="edit-profile-container">
      <div class="edit-header">
        <div class="back-button" @click="navigateToPostsPage">
          <i class="fas fa-arrow-left"></i>
        </div>
        <h1>Chỉnh Sửa Trang Cá Nhân</h1>
        <div class="close-button" @click="navigateToPostsPage">
          <i class="fas fa-times"></i>
        </div>
      </div>

      <div class="edit-content">
        <!-- Profile image section -->
        <div class="edit-section">
          <div class="section-header">
            <h3>Hình đại diện</h3>
            <div class="edit-action" @click="editProfileImage">Chỉnh sửa</div>
          </div>
          <div class="profile-image-container">
            <div class="profile-image">
              <img :src="user.profileImage || 'https://via.placeholder.com/150'" alt="Ảnh đại diện" />
            </div>
            <input type="file" ref="profileImageInput" @change="onProfileImageChange" style="display: none" accept="image/*" />
          </div>
        </div>

        <!-- Cover photo section -->
        <div class="edit-section">
          <div class="section-header">
            <h3>Ảnh bìa</h3>
            <div class="edit-action" @click="editCoverPhoto">Chỉnh sửa</div>
          </div>
          <div class="cover-photo-container">
            <div class="cover-photo">
              <img :src="user.coverPhoto || 'https://via.placeholder.com/800x300'" alt="Ảnh bìa" />
            </div>
            <input type="file" ref="coverPhotoInput" @change="onCoverPhotoChange" style="display: none" accept="image/*" />
          </div>
        </div>

        <!-- Name section -->
        <div class="edit-section">
          <div class="section-header">
            <h3>Tên cá nhân</h3>
            <div class="edit-action" @click="isEditingName = true" v-if="!isEditingName">Chỉnh sửa</div>
            <div class="edit-action save" @click="saveName" v-else>Lưu</div>
          </div>
          <div class="name-container">
            <div class="privacy-icon">
              <i class="fas fa-lock"></i>
            </div>
            <div v-if="!isEditingName" class="display-value">{{ user.name }}</div>
            <input 
              v-else 
              type="text" 
              v-model="editedName" 
              class="edit-input"
              @keyup.enter="saveName"
            />
          </div>
        </div>

        <!-- About section -->
        <div class="edit-section">
          <div class="section-header">
            <h3>Giới thiệu</h3>
          </div>
          
          <!-- Education -->
          <div class="info-row">
            <div class="info-icon">
              <i class="fas fa-graduation-cap"></i>
            </div>
            <div class="info-content">
              <div v-if="!isEditingEducation" class="display-value">{{ user.education }}</div>
              <input 
                v-else 
                type="text" 
                v-model="editedEducation" 
                class="edit-input"
                @keyup.enter="saveEducation"
              />
            </div>
            <div class="edit-icon" @click="isEditingEducation = !isEditingEducation">
              <i class="fas fa-pencil-alt"></i>
            </div>
          </div>

          <!-- Current city -->
          <div class="info-row">
            <div class="info-icon">
              <i class="fas fa-home"></i>
            </div>
            <div class="info-content">
              <div v-if="!isEditingCurrentCity" class="display-value">{{ user.currentCity }}</div>
              <input 
                v-else 
                type="text" 
                v-model="editedCurrentCity" 
                class="edit-input"
                @keyup.enter="saveCurrentCity"
              />
            </div>
            <div class="edit-icon" @click="isEditingCurrentCity = !isEditingCurrentCity">
              <i class="fas fa-pencil-alt"></i>
            </div>
          </div>

          <!-- Hometown -->
          <div class="info-row">
            <div class="info-icon">
              <i class="fas fa-map-marker-alt"></i>
            </div>
            <div class="info-content">
              <div v-if="!isEditingHometown" class="display-value">{{ user.hometown }}</div>
              <input 
                v-else 
                type="text" 
                v-model="editedHometown" 
                class="edit-input"
                @keyup.enter="saveHometown"
              />
            </div>
            <div class="edit-icon" @click="isEditingHometown = !isEditingHometown">
              <i class="fas fa-pencil-alt"></i>
            </div>
          </div>

          <!-- Phone -->
          <div class="info-row">
            <div class="info-icon">
              <i class="fas fa-phone"></i>
            </div>
            <div class="info-content">
              <div v-if="!isEditingPhone" class="display-value">{{ user.phone }}</div>
              <input 
                v-else 
                type="text" 
                v-model="editedPhone" 
                class="edit-input"
                @keyup.enter="savePhone"
              />
            </div>
            <div class="edit-icon" @click="isEditingPhone = !isEditingPhone">
              <i class="fas fa-pencil-alt"></i>
            </div>
          </div>

          <!-- Birthday -->
          <div class="info-row">
            <div class="info-icon">
              <i class="fas fa-birthday-cake"></i>
            </div>
            <div class="info-content">
              <div v-if="!isEditingBirthday" class="display-value">{{ user.birthday }}</div>
              <input 
                v-else 
                type="text" 
                v-model="editedBirthday" 
                class="edit-input"
                @keyup.enter="saveBirthday"
              />
            </div>
            <div class="edit-icon" @click="isEditingBirthday = !isEditingBirthday">
              <i class="fas fa-pencil-alt"></i>
            </div>
          </div>

          <!-- Email -->
          <div class="info-row">
            <div class="info-icon">
              <i class="fas fa-envelope"></i>
            </div>
            <div class="info-content">
              <div v-if="!isEditingEmail" class="display-value">{{ user.email }}</div>
              <input 
                v-else 
                type="email" 
                v-model="editedEmail" 
                class="edit-input"
                @keyup.enter="saveEmail"
              />
            </div>
            <div class="edit-icon" @click="isEditingEmail = !isEditingEmail">
              <i class="fas fa-pencil-alt"></i>
            </div>
          </div>
        </div>

        <!-- Save buttons -->
        <div class="action-buttons">
          <button class="cancel-button" @click="navigateToPostsPage">Hủy</button>
          <button class="save-button" @click="saveAllChanges">Hoàn Thành</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LopetEditProfile',
  data() {
    return {
      user: {
        name: 'Pham Cau',
        education: 'Học tại Đại học Thành Phố Hồ Chí Minh',
        currentCity: 'Sống tại Thành Phố Hồ Chí Minh',
        hometown: 'Hoài Nhơn, Bình Định, Việt Nam',
        phone: '0123456789',
        birthday: '02/11/2004',
        email: 'cauphpham25@gmail.com',
        profileImage: null,
        coverPhoto: null
      },
      isEditingName: false,
      isEditingEducation: false,
      isEditingCurrentCity: false,
      isEditingHometown: false,
      isEditingPhone: false,
      isEditingBirthday: false,
      isEditingEmail: false,
      editedName: '',
      editedEducation: '',
      editedCurrentCity: '',
      editedHometown: '',
      editedPhone: '',
      editedBirthday: '',
      editedEmail: ''
    }
  },
  created() {
    // Initialize edited fields with current values
    this.editedName = this.user.name;
    this.editedEducation = this.user.education;
    this.editedCurrentCity = this.user.currentCity;
    this.editedHometown = this.user.hometown;
    this.editedPhone = this.user.phone;
    this.editedBirthday = this.user.birthday;
    this.editedEmail = this.user.email;
  },
  mounted() {
    // Load FontAwesome
    if (!document.querySelector('script[src*="font-awesome"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js';
      document.head.appendChild(script);
    }
  },
  methods: {
    navigateToPostsPage() {
      // In a real app with Vue Router, you would use:
      // this.$router.push('/posts');
      
      // For demonstration, we'll show an alert
      
      
      // In a real application, you would have actual navigation code here
      // If using Vue Router:
      this.$router.push('/profile');
      
      // If not using Vue Router, you might change a state variable:
      // this.$emit('navigate', 'posts');
      // or use window.location:
      // window.location.href = '/posts';
    },
    editProfileImage() {
      this.$refs.profileImageInput.click();
    },
    editCoverPhoto() {
      this.$refs.coverPhotoInput.click();
    },
    onProfileImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.user.profileImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    onCoverPhotoChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.user.coverPhoto = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    saveName() {
      this.user.name = this.editedName;
      this.isEditingName = false;
    },
    saveEducation() {
      this.user.education = this.editedEducation;
      this.isEditingEducation = false;
    },
    saveCurrentCity() {
      this.user.currentCity = this.editedCurrentCity;
      this.isEditingCurrentCity = false;
    },
    saveHometown() {
      this.user.hometown = this.editedHometown;
      this.isEditingHometown = false;
    },
    savePhone() {
      this.user.phone = this.editedPhone;
      this.isEditingPhone = false;
    },
    saveBirthday() {
      this.user.birthday = this.editedBirthday;
      this.isEditingBirthday = false;
    },
    saveEmail() {
      this.user.email = this.editedEmail;
      this.isEditingEmail = false;
    },
    saveAllChanges() {
      // Save all pending changes
      if (this.isEditingName) this.saveName();
      if (this.isEditingEducation) this.saveEducation();
      if (this.isEditingCurrentCity) this.saveCurrentCity();
      if (this.isEditingHometown) this.saveHometown();
      if (this.isEditingPhone) this.savePhone();
      if (this.isEditingBirthday) this.saveBirthday();
      if (this.isEditingEmail) this.saveEmail();
      
      // Show success message
      
      
      // Navigate to posts page
      this.navigateToPostsPage();
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

/* Edit Profile Styles */
.edit-profile-container {
  max-width: 600px;
  margin: 0 auto;
  background-color: #fff;
  min-height: calc(100vh - 50px);
}

.edit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid #e4e6eb;
  position: sticky;
  top: 50px;
  background-color: #fff;
  z-index: 99;
}

.edit-header h1 {
  font-size: 18px;
  font-weight: 600;
  flex: 1;
  text-align: center;
}

.back-button, .close-button {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.edit-content {
  padding: 15px;
}

.edit-section {
  margin-bottom: 20px;
  background-color: #faf8f0;
  border-radius: 8px;
  padding: 15px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-header h3 {
  font-size: 16px;
  font-weight: 600;
}

.edit-action {
  color: #ff6b01;
  font-size: 14px;
  cursor: pointer;
}

.edit-action.save {
  font-weight: 600;
}

.profile-image-container {
  display: flex;
  justify-content: center;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-photo-container {
  width: 100%;
  margin-bottom: 10px;
}

.cover-photo {
  width: 100%;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
}

.cover-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.name-container {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.privacy-icon {
  margin-right: 10px;
  color: #65676b;
}

.info-row {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e9e6d6;
}

.info-row:last-child {
  border-bottom: none;
}

.info-icon {
  margin-right: 15px;
  width: 20px;
  color: #65676b;
  text-align: center;
}

.info-content {
  flex: 1;
}

.edit-icon {
  color: #65676b;
  cursor: pointer;
  padding: 5px;
}

.display-value {
  font-size: 14px;
}

.edit-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.cancel-button, .save-button {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-size: 14px;
}

.cancel-button {
  background-color: #e4e6eb;
  color: #333;
}

.save-button {
  background-color: #fad989;
  color: #333;
}

/* Responsive styles */
@media (max-width: 768px) {
  .edit-profile-container {
    width: 100%;
  }
}
</style>