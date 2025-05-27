<template>
  <div class="lopet-app">
    <!-- Edit profile container -->
    <div class="edit-profile-container">
      <div class="edit-header">
        
        <h1>Chỉnh Sửa Trang Cá Nhân</h1>
        
      </div>

      <div class="edit-content">
        <div class="edit-sections-wrapper">
          <!-- Left Column -->
          <div class="edit-column">
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
          </div>

          <!-- Right Column -->
          <div class="edit-column">
            <!-- About section -->
            <div class="edit-section about-section">
              <div class="section-header">
                <h3>Giới thiệu</h3>
              </div>
              
              <!-- Education -->
              <div class="info-row">
                <div class="info-icon">
                  <i class="fas fa-graduation-cap"></i>
                </div>
                <div class="info-content">
                  <div class="info-label">Học vấn</div>
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
                  <div class="info-label">Nơi ở hiện tại</div>
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
                  <div class="info-label">Quê quán</div>
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
                  <div class="info-label">Số điện thoại</div>
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
                  <div class="info-label">Ngày sinh</div>
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
                  <div class="info-label">Email</div>
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
      this.$router.push('/profile');
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.lopet-app {
  background-color: #FFF8F0;
  min-height: 100vh;
  position: relative;
}

/* Edit Profile Styles */
.edit-profile-container {
  max-width: 1200px;
  margin: 0 auto;
  background-color: #fff;
  min-height: 100vh;
  /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); */
}

.edit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  border-bottom: 1px solid #FAEBD7;
  position: sticky;

  background-color: #FAEBD7;
  z-index: 99;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.edit-header h1 {
  font-size: 24px;
  font-weight: 600;
  flex: 1;
  text-align: center;
  color: #333;
}

.back-button, .close-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  background-color: #f0f2f5;
  transition: background-color 0.2s ease;
}

.back-button:hover, .close-button:hover {
  background-color: #e4e6ea;
}

.back-button i, .close-button i {
  font-size: 16px;
  color: #65676b;
}

.edit-content {
  padding: 30px;
  background-color: #FFF8F0;
}

.edit-sections-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.edit-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
  
}

.edit-section {
  background-color: #FAEBD7;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
}

.about-section {
  height: fit-content;
  
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e9e6d6;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.edit-action {
  color: #ff6b01;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.edit-action:hover {
  background-color: rgba(255, 107, 1, 0.1);
}

.edit-action.save {
  font-weight: 600;
  background-color: #ff6b01;
  color: white;
}

.edit-action.save:hover {
  background-color: #e55a00;
}

.profile-image-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-photo-container {
  width: 100%;
  margin-bottom: 15px;
}

.cover-photo {
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cover-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.name-container {
  display: flex;
  align-items: center;
  padding: 15px 0;
}

.privacy-icon {
  margin-right: 15px;
  color: #65676b;
  font-size: 16px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  padding: 18px 0;
  border-bottom: 1px solid #e9e6d6;
  transition: background-color 0.2s ease;
}

.info-row:hover {
  background-color: rgba(255, 107, 1, 0.02);
  border-radius: 8px;
  margin: 0 -10px;
  padding: 18px 10px;
}

.info-row:last-child {
  border-bottom: none;
}

.info-icon {
  margin-right: 20px;
  width: 24px;
  color: #65676b;
  text-align: center;
  font-size: 16px;
  margin-top: 2px;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 12px;
  color: #65676b;
  text-transform: uppercase;
  font-weight: 500;
  margin-bottom: 5px;
  letter-spacing: 0.5px;
}

.edit-icon {
  color: #65676b;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
  margin-left: 10px;
}

.edit-icon:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #ff6b01;
}

.display-value {
  font-size: 15px;
  color: #333;
  line-height: 1.4;
}

.edit-input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.2s ease;
  background-color: #fff;
}

.edit-input:focus {
  outline: none;
  border-color: #ff6b01;
  box-shadow: 0 0 0 3px rgba(255, 107, 1, 0.1);
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
  padding: 20px 0;
  border-top: 1px solid #e4e6eb;
}

.cancel-button, .save-button {
  padding: 12px 30px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-size: 16px;
  transition: all 0.2s ease;
  min-width: 120px;
}

.cancel-button {
  background-color: #e4e6eb;
  color: #333;
}

.cancel-button:hover {
  background-color: #d0d2d7;
}

.save-button {
  background-color: #fad989;
  color: #333;
}

.save-button:hover {
  background-color: #f8d066;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Responsive styles */
@media (max-width: 1024px) {
  .edit-profile-container {
    max-width: 95%;
  }
  
  .edit-content {
    padding: 20px;
  }
  
  .edit-sections-wrapper {
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .edit-profile-container {
    max-width: 100%;
    box-shadow: none;
  }
  
  .edit-header {
    padding: 15px 20px;
  }
  
  .edit-header h1 {
    font-size: 20px;
  }
  
  .edit-sections-wrapper {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .edit-content {
    padding: 15px;
  }
  
  .edit-section {
    padding: 20px;
  }
  
  .profile-image {
    width: 120px;
    height: 120px;
  }
  
  .cover-photo {
    height: 150px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  
  .cancel-button, .save-button {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .edit-header {
    padding: 12px 15px;
  }
  
  .edit-header h1 {
    font-size: 18px;
  }
  
  .edit-content {
    padding: 10px;
  }
  
  .edit-section {
    padding: 15px;
  }
  
  .back-button, .close-button {
    width: 35px;
    height: 35px;
  }
  
  .info-row {
    padding: 15px 0;
  }
  
  .info-icon {
    margin-right: 15px;
    width: 20px;
  }
}
</style>