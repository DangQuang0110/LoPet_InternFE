<template>
  <layout>
    <div class="app-container">
      <!-- Main Content -->
      <div class="main-content">
        <!-- Search Bar -->
        <div class="search-container">
          <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" placeholder="Tìm kiếm" />
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="tab-navigation">
          <div class="tab-item" :class="{ active: activeTab === 'all-friends' }" @click="activeTab = 'all-friends'">
            <i class="fas fa-users"></i>
            <span>Tất cả bạn bè</span>
          </div>
          <div class="tab-item" :class="{ active: activeTab === 'friend-requests' }" @click="activeTab = 'friend-requests'">
            <i class="fas fa-plus-circle"></i>
            <span>Lời mời kết bạn</span>
          </div>
          <div class="tab-item" :class="{ active: activeTab === 'friend-suggestions' }" @click="activeTab = 'friend-suggestions'">
            <i class="fas fa-user-friends"></i>
            <span>Gợi ý kết bạn</span>
          </div>
        </div>

        <!-- All Friends -->
        <div v-if="activeTab === 'all-friends'" class="pet-grid">
          <div v-for="(pet, index) in allFriends" :key="index" class="pet-card">
            <div class="pet-image">
              <img :src="pet.avatarUrl ?? currentAvatar" :alt="pet.fullName || pet.username" />
            </div>
            <div class="pet-name">{{ pet.fullName || pet.username }}</div>
              <button class="action-button profile" @click="goToFriendProfile(pet.id)">Xem trang cá nhân</button>
              <button class="action-button reject" @click="confirmDeleteFriend(pet.id)">Xoá</button>
          </div>
        </div>

        <!-- Friend Requests -->
        <div v-else-if="activeTab === 'friend-requests'" class="pet-grid">
          <div v-for="(pet, index) in friendRequests" :key="index" class="pet-card">
            <div class="pet-image">
              <img :src="pet.avatarUrl ?? currentAvatar" :alt="pet.fullName || pet.username" />
            </div>
            <div class="pet-name">{{ pet.fullName || pet.username }}</div>
            <button class="action-button accept" @click="acceptRequest(pet.id)">
              <i class="fas fa-check"></i> Chấp nhận
            </button>
            <button class="action-button reject" @click="confirmDelReqFriend(pet.id)">
              Xoá
            </button>
          </div>
        </div>

        <!-- Friend Suggestions -->
        <div v-else class="pet-grid">
          <div v-for="pet in friendSuggestions" :key="pet.id" class="pet-card">
            <div class="pet-image">
              <img :src="pet.avatarUrl || currentAvatar" :alt="pet.fullName || pet.username || 'Người dùng'" />
            </div>
            <div class="pet-name">{{ pet.fullName || pet.username || 'Ẩn danh' }}</div>
            <button class="action-button accept" @click="sendRequestToFriend(pet.id)">
              <i class="fas fa-user-plus"></i> Thêm bạn bè
            </button>
          </div>
        </div>
      </div>

      <!-- Popup xác nhận xóa bạn bè -->
      <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="cancelDeleteFriend">
        <div class="modal-content">
          <h3>Bạn có chắc chắn muốn xóa bạn này không?</h3>
          <div class="modal-actions">
            <button class="btn-cancel" @click="cancelDeleteFriend">Hủy</button>
            <button class="btn-confirm" @click="performDeleteFriend">Xóa</button>
          </div>
        </div>
      </div>
<!-- Popup xác nhận xóa bạn bè -->
      <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="cancelDeleteFriend">
        <div class="modal-content">
          <h3>Bạn có chắc chắn muốn xóa bạn này không?</h3>
          <div class="modal-actions">
            <button class="btn-confirm" @click="performDeleteFriend">Xóa</button>
            <button class="btn-cancel" @click="cancelDeleteFriend">Hủy</button>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import { getFriendList, getListRequestF, acceptFriendRequest, rejectFriendReq, getSuggestedFriends, sendFriendRequest, deleteFriend } from '@/service/friendService';
import { getProfileByAccountId } from '@/service/profileService';

import Layout from '@/components/Layout.vue'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';




export default {
  components: {
    Layout,
  },
  name: 'PetSocialPlatform',
  data() {
    return {
      activeTab: 'all-friends',
      friendRequests: [],
      friendSuggestions: [],
      allFriends: [],
      currentAvatar: '/image/avata.jpg',
      showDeleteConfirm: false,
      deleteFriendId: null,
    }
  },
  methods: {
    async fetchProfileData(friends) {
      const friendsWithProfiles = await Promise.all(
        friends.map(async (friend) => {
          try {
            const profile = await getProfileByAccountId(friend.id);
            return {
              ...friend,
              avatarUrl: profile?.avatarUrl || null,
              fullName: profile?.fullName || friend.username,
              bio: profile?.bio
            };
          } catch (error) {
            console.error(`Failed to fetch profile for friend ${friend.id}:`, error);
            return friend;
          }
        })
      );
      return friendsWithProfiles;
    },
      goToFriendProfile(id) {
      this.$router.push(`/profile/${id}`);
    },
    async fetchFriends(userId) {
      try {
        const data = await getFriendList(userId);
        this.allFriends = await this.fetchProfileData(data);
      } catch (error) {
        console.error('Failed to load friends:', error);
      }
    },
    async fetchListRequestF(userId) {
      try {
        const data = await getListRequestF(userId);
        this.friendRequests = await this.fetchProfileData(data);
      } catch (error) {
        console.log('Lỗi khi lấy danh sách lời mời:', error);
      }
    },
    async fetchSuggestedFriends(userId) {
      try {
        const data = await getSuggestedFriends(userId);
        this.friendSuggestions = await this.fetchProfileData(data);
      } catch (error) {
        console.log('Lỗi khi lấy gợi ý kết bạn:', error);
      }
    },
    async acceptRequest(senderId) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.id) return;
        await acceptFriendRequest(user.id, senderId);
        await this.fetchListRequestF(user.id);
        await this.fetchFriends(user.id);
        toast.success('Đã chấp nhận kết bạn!', {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
          theme: 'colored'
        });
      } catch (error) {
        console.log("Không thể chấp nhận lời mời:", error);
      }
    },
    async confirmDelReqFriend(senderId) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.id) return;
        await rejectFriendReq(user.id, senderId);
        await this.fetchListRequestF(user.id);
        await this.fetchFriends(user.id);
        toast.success('Đã xóa lời mời kết bạn!', {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
          theme: 'colored'
        });
      } catch (error) {
        console.log("Không thể xóa lời mời:", error);
      }
    },
    async sendRequestToFriend(receiverId) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.id) return;
        await sendFriendRequest(user.id, receiverId);
        await this.fetchSuggestedFriends(user.id);
        toast.success('Đã gửi lời mời kết bạn!', {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
          theme: 'colored'
        });
      } catch (error) {
        console.log("Không thể gửi lời mời:", error);
      }
    },
    // Hàm mở popup xác nhận xóa bạn
    confirmDeleteFriend(friendId) {
      this.deleteFriendId = friendId;
      this.showDeleteConfirm = true;
    },
    // Hủy popup
    cancelDeleteFriend() {
      this.deleteFriendId = null;
      this.showDeleteConfirm = false;
    },
    // Thực hiện xóa bạn
    async performDeleteFriend() {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.id || !this.deleteFriendId) return;
        await deleteFriend(this.deleteFriendId, user.id);
        await this.fetchFriends(user.id);

        this.showDeleteConfirm = false;
        this.deleteFriendId = null;

        toast.success('Đã xóa bạn bè!', {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
          theme: 'colored',
        });
      } catch (error) {
        console.log("Không thể xóa bạn:", error);
      }
    }
  },


  created() {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user && user.id) {
      this.fetchListRequestF(user.id)
      this.fetchFriends(user.id)
      this.fetchSuggestedFriends(user.id)
    } else {
      console.warn('Không tìm thấy ID người dùng đăng nhập')
    }
  }
}
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

/* Sidebar Styles */
.sidebar {
  width: 250px;
  background-color: white;
  border-right: 1px solid #e0e0e0;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
}

.logo {
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 20px;
}

.logo img {
  width: 32px;
  height: 32px;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  margin-left: 10px;
  color: #ff9800;
}

.search-container {
  justify-content: flex-start;
  width: 100%;
  padding-left: 20px;
}
.search-box {
  display: flex;
  align-items: center;
  background-color: #F9F9F9;
  border-radius: 12px;
  padding: 8px 15px;
  border: 1px solid #000000;
  width: 600px;
    background-color: rgba(165, 154, 154, 0.2);

}

.search-icon {
  margin-right: 8px;
  min-width: 20px;
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  margin-left: 10px;
  font-size: 16px;
  color: #666;
}

.nav-menu {
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #555;
  cursor: pointer;
}

.nav-item.active {
  background-color: #fff9e6;
  color: #ff9800;
  font-weight: bold;
}

.nav-item i {
  width: 24px;
  margin-right: 10px;
}

.account-info {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-top: 1px solid #e0e0e0;
  color: #555;
}

.account-info i {
  margin-right: 10px;
}
.main-content {
  flex: 1;
  background-color: #F9F9F9;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.tab-navigation {
  display: flex;
  background-color: #FFFFFF;
  border-radius: 4px;
  margin-bottom: 20px;
}

.tab-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  color: #555;
}

.tab-item.active {
  font-weight: bold;
  color: #ff9800;
  border-bottom: 2px solid #ff9800;
}

.tab-item i {
  margin-right: 8px;
}

.pet-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.pet-card {
  background-color: #FFFFFF;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pet-image {
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
}

.pet-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pet-name {
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
  font-size: 0.95em;
}

.action-button {
  width: 100%;
  padding: 8px 0;
  border: none;
  border-radius: 20px;
  margin-bottom: 6px;
  font-weight: normal;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: center;
  font-size: 0.9em;
}

.action-button.profile {
  background-color: #FFD9AA;
  color: #333;
}

.action-button.profile:hover {
  background-color: #ffe0a3;
}

.action-button.accept {
  background-color: #FFD9AA;
  color: #333;
}

.action-button.accept:hover {
  background-color: #ffe0a3;
}

.action-button.reject {
  background-color: #FFD9AA;
  color: #333;
}

.action-button.reject:hover {
  background-color: #ffe0a3;
}

/* Modal xác nhận xóa */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: #fff;
  padding: 24px 30px;
  border-radius: 10px;
  width: 320px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

.modal-content h3 {
  margin-bottom: 20px;
  font-weight: 600;
  color: #333;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 10px 0;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
}

.btn-cancel {
  background-color: #ddd;
  color: #333;
}

.btn-cancel:hover {
  background-color: #ccc;
}

.btn-confirm {
  background-color: #ff6b01;
  color: white;
}

.btn-confirm:hover {
  background-color: #e55f01;
}
</style>
