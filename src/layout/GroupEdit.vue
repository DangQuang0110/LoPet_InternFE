<template>
  <div class="group-edit-container">
    <!-- Header -->
    <div class="header">
      <div class="header-title">Chỉnh Sửa thông tin nhóm</div>
      <button class="close-btn" @click="cancelEdit">×</button>
    </div>

    <!-- Form chỉnh sửa -->
    <div class="edit-form">
      <form @submit.prevent="saveGroupInfo">
        <!-- Tiêu đề hình bìa -->
        <div class="section-title">
          <span>Hình bìa</span>
          <span class="edit-image-text" @click="triggerImageUpload">Chỉnh sửa</span>
        </div>

        <!-- Ảnh nhóm -->
        <div class="form-group">
          <div class="group-image">
            <img :src="groupInfo.image" alt="Ảnh nhóm" />
          </div>
          <input 
            type="file" 
            ref="imageInput" 
            @change="handleImageUpload" 
            accept="image/*" 
            class="hidden-input" 
          />
        </div>

        <!-- Tên nhóm -->
        <div class="form-group">
          <label for="group-name">Tên nhóm</label>
          <input 
            type="text" 
            id="group-name" 
            v-model="groupInfo.name" 
            required
          />
        </div>

        <!-- Quyền riêng tư -->
        <div class="form-group">
          <label for="privacy">Chọn quyền riêng tư</label>
          <select id="privacy" v-model="groupInfo.privacy">
            <option value="public">Công khai</option>
            <option value="private">Riêng tư</option>
          </select>
        </div>

        <!-- Giới thiệu -->
        <div class="form-group">
          <label for="group-intro">Giới thiệu</label>
          <textarea 
            id="group-intro" 
            v-model="groupInfo.intro"
            rows="4"
          ></textarea>
        </div>

        <!-- Mời bạn bè -->
        <div class="form-group">
          <button type="button" class="btn-invite" @click="inviteFriends">Mời bạn bè (Không bắt buộc)</button>
          <div v-if="invitedFriends.length" class="invited-names">
            Đã mời:
            <span v-for="(name, index) in invitedFriends" :key="index">
              {{ name }}<span v-if="index < invitedFriends.length - 1">, </span>
            </span>
          </div>
        </div>

        <!-- Danh sách bạn bè -->
        <div v-if="showFriendList" class="friend-list">
          <label>Chọn bạn bè để mời:</label>
          <ul>
            <li v-for="friend in friends" :key="friend.id">
              <label>
                <input 
                  type="checkbox" 
                  :value="friend.id" 
                  v-model="selectedFriends"
                />
                {{ friend.name }}
              </label>
            </li>
          </ul>
          <button class="btn-primary full-width" @click="confirmInvite">Xác nhận mời</button>
        </div>

        <!-- Nút lưu -->
        <div class="form-actions">
          <button type="submit" class="btn-primary full-width">Lưu thông tin chỉnh sửa</button>
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
        intro: `Chào ae vào hội cứu trợ động vật Việt Nam\n📞 Hotline: 0369620631\n📧 Email: caupham25@gmail.com\n📍 Hoài Nhơn , Bình Định , Việt Nam`,
        image: '/path/to/group-cover.jpg',
        privacy: 'private'
      },
      showFriendList: false,
      friends: [
        { id: 1, name: 'Vũ vú sữa' },
        { id: 2, name: 'Cầu vồng' },
        { id: 3, name: 'Quang' },
        { id: 4, name: 'Phong' },
        { id: 5, name: 'Nhân' },
        { id: 6, name: 'Trường' },
      ],
      selectedFriends: [],
      invitedFriends: [] // Thêm dòng này
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
    },
    inviteFriends() {
      this.showFriendList = true;
    },
    confirmInvite() {
      const invited = this.friends.filter(f => this.selectedFriends.includes(f.id));
      this.invitedFriends = invited.map(f => f.name);
      alert('Đã mời: ' + this.invitedFriends.join(', '));
      this.showFriendList = false;
    }
  }
};
</script>

<style scoped>
.group-edit-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #FFF5E1;
  overflow-y: auto;
  font-family: 'Segoe UI', sans-serif;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 15px 20px;
  background: #FFF5E1;
  border-bottom: 1px solid #E6E6E6;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #000;
}

.close-btn {
  position: absolute;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #000;
}

.edit-form {
  padding: 20px;
  width: 100%;
  max-width: 500px;
  margin: 20px auto;
  background-color: #fff;
  border: 2px solid #E0E0E0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 10px;
  color: #333;
}

.edit-image-text {
  color: #F58220;
  font-size: 14px;
  cursor: pointer;
}

.group-image {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #F0F2F5;
  margin-bottom: 20px;
}

.group-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hidden-input {
  display: none;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 16px;
  color: #333;
}

input[type="text"],
select {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #E6E6E6;
  border-radius: 4px;
  font-size: 16px;
  background-color: #FFF5E1;
  color: #333;
}

textarea {
  width: 100%;
  min-height: 80px;
  resize: none;
  overflow: hidden;
  border: 1px solid #E6E6E6;
  background-color: #FFF5E1;
  border-radius: 4px;
  font-size: 16px;
  color: #333;
  padding: 12px 14px;
  line-height: 1.6;
}

.btn-invite {
  width: 100%;
  padding: 12px 14px;
  background-color: #e0e0e0;
  border: none;
  border-radius: 4px;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-invite:hover {
  background-color: #ccc;
}

.friend-list {
  background: #fff;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 10px;
}

.friend-list ul {
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

.friend-list li {
  margin-bottom: 8px;
  font-size: 15px;
}

.invited-names {
  margin-top: 10px;
  font-size: 14px;
  color: #555;
}

.form-actions {
  margin-top: 20px;
}

.btn-primary {
  padding: 12px 14px;
  border: none;
  border-radius: 4px;
  background-color: #F58220;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: #E06B10;
}

.full-width {
  width: 100%;
}
</style>
