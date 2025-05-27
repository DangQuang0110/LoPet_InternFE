<template>
  <div class="group-edit-container">
    <!-- Header -->
    <div class="header">
      <div class="header-title">
        <h1>Chỉnh Sửa thông tin nhóm</h1>
      </div>
      <button class="close-btn" @click="cancelEdit">×</button>
    </div>

    <!-- Form chỉnh sửa -->
    <div class="edit-form">
      <form @submit.prevent="saveGroupInfo">
        <!-- Thông tin cơ bản -->
        <div class="form-section">
          <!-- Ảnh nhóm -->
          <div class="form-group">
            <label>Ảnh nhóm</label>
            <div class="group-image-container">
              <div class="group-image">
                <img :src="groupInfo.image || '/path/to/default-group-image.jpg'" alt="Ảnh nhóm" />
              </div>
              <div class="image-actions">
                <button type="button" class="btn btn-light" @click="triggerImageUpload">
                  <i class="icon-upload"></i> Thay đổi ảnh
                </button>
                <input 
                  type="file" 
                  ref="imageInput" 
                  @change="handleImageUpload" 
                  accept="image/*" 
                  class="hidden-input" 
                />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="group-name">Tên nhóm <span class="required">*</span></label>
            <input 
              type="text" 
              id="group-name" 
              v-model="groupInfo.name" 
              required
              placeholder="Nhập tên nhóm"
            />
          </div>

          <div class="form-group">
            <label for="group-intro">Giới thiệu</label>
            <textarea 
              id="group-intro" 
              v-model="groupInfo.intro" 
              rows="4"
              placeholder="Giới thiệu về nhóm của bạn..."
            ></textarea>
          </div>
        </div>

        <!-- Quyền riêng tư -->
        <div class="form-section">
          <h2>Quyền riêng tư</h2>
          <div class="form-group">
            <label for="privacy">Chọn quyền thành viên</label>
            <select id="privacy" v-model="groupInfo.privacy" class="form-select">
              <option value="public">Công khai</option>
              <option value="private">Riêng tư</option>
            </select>
          </div>
        </div>

        <!-- Mời bạn bè -->
        <div class="form-section">
          <h2>Mời bạn bè (Không bắt buộc)</h2>
          <div class="form-group">
            <label for="invite">Chọn bạn bè</label>
            <select id="invite" v-model="groupInfo.invite" class="form-select">
              <option value="" disabled selected>Chọn bạn bè</option>
              <option value="friend1">Cầu</option>
              <option value="friend2">Vũ</option>
              <option value="friend3">Trường</option>
              <option value="friend4">Nhân</option>
            </select>
          </div>
        </div>

        <!-- Liên hệ chúng tôi -->
        <div class="form-section">
          <h2>Liên hệ chúng tôi</h2>
          <div class="form-group">
            <label for="hotline">Hotline</label>
            <input 
              type="text" 
              id="hotline" 
              v-model="groupInfo.hotline" 
              placeholder="Nhập số hotline"
            />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="groupInfo.email" 
              placeholder="Nhập email"
            />
          </div>
          <div class="form-group">
            <label for="address">Địa chỉ</label>
            <input 
              type="text" 
              id="address" 
              v-model="groupInfo.address" 
              placeholder="Nhập địa chỉ"
            />
          </div>
        </div>

        <!-- Nút tác vụ -->
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Lưu thông tin sửa</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GroupEditForm',
  data() {
    return {
      groupInfo: {
        name: 'Hội cứu trợ động vật Việt Nam',
        intro: 'Hội cứu trợ động vật Việt Nam hỗ trợ các hoạt động bảo vệ và chăm sóc động vật trên toàn quốc.',
        image: '/path/to/group-cover.jpg',
        privacy: 'public',
        invite: '',
        hotline: '0369620631',
        email: 'caupham25@gmail.com',
        address: 'Hoài Nhơn, Bình Định, Việt Nam'
      }
    };
  },
  methods: {
    triggerImageUpload() {
      this.$refs.imageInput.click();
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.groupInfo.image = URL.createObjectURL(file);
      }
    },
    saveGroupInfo() {
      console.log('Đã lưu thông tin nhóm:', this.groupInfo);
      alert('Đã lưu thông tin nhóm thành công!');
    },
    cancelEdit() {
      if (confirm('Bạn có chắc muốn hủy các thay đổi?')) {
        console.log('Đã hủy chỉnh sửa');
      }
    }
  }
};
</script>

<style scoped>
/* Đảm bảo toàn màn hình */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden; /* Ngăn cuộn trên body */
}

.group-edit-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background: #FFF5E1; /* Màu cam nhạt giống hình 1 */
  border-radius: 0;
  box-shadow: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  overflow-y: auto;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  background: #FFF5E1; /* Màu cam nhạt giống hình 1 */
  border-bottom: 1px solid #E6E6E6;
  margin-bottom: 30px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-title h1 {
  font-size: 24px;
  color: #333;
  margin: 0;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
  color: #666;
}

.edit-form {
  background-color: #FFF;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 90%; /* Giới hạn chiều rộng để dễ đọc */
  max-width: 700px; /* Giới hạn tối đa để giống hình 1 */
  margin: 0 auto 30px; /* Căn giữa và thêm khoảng cách dưới */
  box-sizing: border-box;
}

.form-section {
  padding: 30px;
  border-bottom: 1px solid #E6E6E6;
}

.form-section:last-child {
  border-bottom: none;
}

.form-section h2 {
  font-size: 20px;
  color: #333;
  margin: 0 0 15px 0;
  font-weight: 600;
}

.form-group {
  margin-bottom: 25px;
}

.form-group:last-child {
  margin-bottom: 0;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 16px;
  color: #333;
}

.required {
  color: #E41E3F;
}

input[type="text"],
input[type="email"],
textarea,
.form-select {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #E6E6E6;
  border-radius: 4px;
  font-size: 16px;
  color: #333;
  background-color: #FFF5E1;
}

input[type="text"]:focus,
input[type="email"]:focus,
textarea:focus,
.form-select:focus {
  border-color: #F58220;
  outline: none;
  box-shadow: 0 0 0 2px rgba(245, 130, 32, 0.2);
}

textarea {
  resize: vertical;
}

.group-image-container {
  display: flex;
  gap: 20px;
  align-items: center;
}

.group-image {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #F0F2F5;
}

.group-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hidden-input {
  display: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  padding: 30px;
}

.btn-primary {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #F58220;
  color: #FFF;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: #E06B10;
}

.btn-light {
  background-color: #E4E6EB;
  color: #050505;
  font-size: 14px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-light:hover {
  background-color: #D8DADF;
}

.icon-upload:before {
  content: "↑";
}

/* Responsive */
@media (max-width: 768px) {
  .group-edit-container {
    padding: 0;
  }
  
  .edit-form {
    width: 100%;
    padding: 15px;
    margin: 0 auto 20px;
  }
  
  .form-section {
    padding: 20px;
  }
  
  .group-image-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .group-image {
    height: 150px;
  }
  
  .form-actions {
    padding: 20px;
  }
}
</style>