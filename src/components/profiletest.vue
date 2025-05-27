<template>
  <div class="lopet-app-new">
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

    <!-- Edit Post Modal -->
    <div v-if="showEditPostModal" class="confirm-modal">
      <div class="confirm-modal-content">
        <h3>Chỉnh sửa bài viết</h3>
        <form @submit.prevent="savePostEdit">
          <div class="form-group">
            <textarea
              v-model="editPostForm.content"
              placeholder="Nội dung bài viết..."
              class="form-input"
            ></textarea>
          </div>
          <div class="confirm-modal-actions">
            <button type="submit" class="confirm-button">Lưu</button>
            <button type="button" class="cancel-button" @click="cancelPostEdit">Hủy</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditProfileModal" class="confirm-modal">
      <div class="confirm-modal-content">
        <h3>Chỉnh sửa thông tin cá nhân</h3>
        <form @submit.prevent="saveProfileEdit">
          <div class="form-group">
            <label for="username">Tên người dùng</label>
            <input
              id="username"
              type="text"
              v-model="editProfileForm.username"
              placeholder="Nhập tên người dùng..."
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label for="avatar">Ảnh đại diện</label>
            <input
              id="avatar"
              type="file"
              ref="avatarInputModal"
              accept="image/*"
              @change="handleAvatarChangeModal"
              class="form-input"
            />
            <div
              v-if="editProfileForm.avatarPreview"
              class="avatar-preview"
              :style="{ 'background-image': 'url(' + editProfileForm.avatarPreview + ')' }"
            ></div>
          </div>
          <div class="form-group">
            <label for="banner">Ảnh bìa</label>
            <input
              id="banner"
              type="file"
              ref="bannerInput"
              accept="image/*"
              @change="handleBannerChange"
              class="form-input"
            />
            <div
              v-if="editProfileForm.bannerPreview"
              class="banner-preview"
              :style="{ 'background-image': 'url(' + editProfileForm.bannerPreview + ')' }"
            ></div>
          </div>
          <div class="confirm-modal-actions">
            <button type="submit" class="confirm-button">Lưu</button>
            <button type="button" class="cancel-button" @click="cancelProfileEdit">Hủy</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Post Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="confirm-modal">
      <div class="confirm-modal-content">
        <h3>Xác nhận xóa</h3>
        <p>Bạn có chắc muốn xóa bài viết này?</p>
        <div class="confirm-modal-actions">
          <button class="confirm-button" @click="confirmDelete">Xác nhận</button>
          <button class="cancel-button" @click="cancelDelete">Hủy</button>
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
      <div
        class="profile-banner"
        :style="{ 'background-image': user.banner ? 'url(' + user.banner + ')' : 'linear-gradient(to bottom, #e6e6e6, #f0f2f5)' }"
      ></div>

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
          <button class="edit-profile-button" @click="goToProfileEdit">Chỉnh sửa thông tin</button>
          <div class="profile-nav">
            <router-link to='/profile' class="nav-item active">Trang Cá Nhân</router-link>
            <router-link to='/photo' class="nav-item">Hình Ảnh</router-link>
          </div>
        </div>
      </div>

      <!-- Profile content section -->
      <div class="profile-content">
        <!-- Sidebar - Fixed position -->
        <div class="sidebar">
          <div class="intro-section">
            <h3>Giới Thiệu</h3>
            <div v-if="!editMode">
              <ul class="intro-list">
                <li class="bio-item">
                  <img src="/icon/resume.png" alt="Bio" class="nav-icon" />
                  <span>{{ user.bio || 'Chưa có thông tin giới thiệu...' }}</span>
                </li>
                <li>
                  <img src="/icon/telephone.png" alt="Phone" class="nav-icon" />
                  <span>{{ user.phone }}</span>
                </li>
              </ul>
              <button class="edit-button" @click="goToEdit">Chỉnh sửa chi tiết</button>
            </div>
            <div v-else>
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
                <div v-if="activeDropdown === post.id" class="dropdown-menu">
                  <div class="dropdown-item" @click.stop="editPost(post.id)">
                    <img src="/icon/edit.png" alt="Edit" class="nav-icon" />
                    <span>Sửa bài viết</span>
                  </div>
                  <div class="dropdown-item" @click.stop="deletePost(post.id)">
                    <img src="/icon/delete.png" alt="Delete" class="nav-icon" />
                    <span>Xóa bài viết</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="post-content" v-if="post.content || post.image">
              <p v-if="post.content">{{ post.content }}</p>
              <div class="post-image" v-if="post.image" :class="post.imageClass"></div>
            </div>

            <div class="post-actions-wrapper">
              <div class="post-actions">
                <button class="post-action" @click="toggleLike(post)">
                  <img
                    :src="post.liked ? '/icon/heart-1.png' : '/icon/heart.png'"
                    alt="Like"
                    class="nav-icon"
                  />
                  <span></span>
                </button>
                <button class="post-action" @click="toggleCommentPopup(post)">
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
              <span>{{ post.likes + (post.liked ? 1 : 0) }} lượt thích</span>
            </div>

            <div class="post-comments" v-if="post.commentsList && post.commentsList.length > 0">
              <div
                v-for="comment in post.showAllComments ? post.commentsList : post.commentsList.slice(0, 2)"
                :key="comment.id"
                class="comment"
              >
                <div
                  class="comment-avatar"
                  :style="{ 'background-image': 'url(' + comment.userSrc + ')' }"
                ></div>
                <div class="comment-content">
                  <h5>{{ comment.user }}</h5>
                  <p>{{ comment.text }}</p>
                  <span class="comment-time">{{ comment.time }}</span>
                </div>
              </div>
              <div
                v-if="post.commentsList.length > 2"
                class="show-more-comments"
                @click="toggleComments(post.id)"
              >
                {{ post.showAllComments ? 'Ẩn bớt bình luận' : `Xem thêm ${post.commentsList.length - 2} bình luận` }}
              </div>
            </div>

            <!-- Comment input -->
            <div class="comment-input" v-if="post.showCommentInput">
              <div
                class="comment-avatar user-avatar"
                :style="{ 'background-image': 'url(' + user.avatar + ')' }"
              ></div>
              <div class="comment-box">
                <input
                  type="text"
                  v-model="newComment"
                  placeholder="Viết bình luận..."
                  @keydown.enter.prevent="addComment(post)"
                />
                <div class="comment-actions">
                  <button class="btn-send" @click="addComment(post)">Gửi</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Comments Modal -->
    <transition name="fade">
      <div v-if="showCommentModal" class="comment-modal-overlay" @click.self="toggleCommentPopup">
        <div class="comment-modal">
          <div class="comment-modal-header">
            <h3>Bài viết của {{ activePost.author }}</h3>
            <button class="close-btn" @click="toggleCommentPopup">×</button>
          </div>
          <div class="comment-modal-gallery">
            <img
              v-for="(img, idx) in activePost.images"
              :key="idx"
              :src="img"
              class="gallery-img"
            />
          </div>
          <div class="comment-modal-list">
            <div
              v-for="c in activePost.commentsList"
              :key="c.id"
              class="comment-item"
            >
              <img :src="c.userSrc" class="comment-avatar" />
              <div class="comment-body">
                <span class="comment-username">{{ c.user }}</span>
                <p class="comment-text">{{ c.text }}</p>
                <span class="comment-time">{{ c.time }}</span>
                <button class="btn-reply-modal" @click="prepareReply(c)">Trả lời</button>
                <div v-if="replyingCommentId === c.id" class="reply-section">
                  <input
                    v-model="replyInputs[c.id]"
                    type="text"
                    placeholder="Viết trả lời..."
                    @keydown.enter.prevent="submitReplyModal(c)"
                  />
                  <button @click="submitReplyModal(c)">Gửi</button>
                </div>
                <div v-if="c.replies && c.replies.length" class="nested-replies">
                  <div v-for="r in c.replies" :key="r.id" class="reply-item">
                    <span class="reply-username">{{ r.user }}</span>
                    <span class="reply-to">@{{ r.replyToUser }}:</span>
                    {{ r.text }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="comment-modal-footer">
            <div
              class="comment-avatar"
              :style="{ 'background-image': 'url(' + user.avatar + ')' }"
            ></div>
            <input
              type="text"
              placeholder="Viết bình luận..."
              v-model="newComment"
              @keydown.enter.prevent="addComment(activePost)"
            />
            <button class="btn-send" @click="addComment(activePost)">Gửi</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Overlay to close dropdown when clicking outside -->
    <div v-if="activeDropdown || showEditPostModal || showDeleteConfirm || showEditProfileModal" class="dropdown-overlay" @click="closeDropdown(); cancelPostEdit(); cancelDelete(); cancelProfileEdit()"></div>
  </div>
</template>

<script>
export default {
  name: 'LopetProfile',
  data() {
    return {
      activeDropdown: null,
      editMode: false,
      editForm: {
        bio: '',
        phone: ''
      },
      showEditProfileModal: false,
      editProfileForm: {
        username: '',
        avatar: null,
        avatarPreview: '',
        banner: null,
        bannerPreview: ''
      },
      notifications: [],
      showCommentModal: false,
      activePost: null,
      newComment: '',
      replyingCommentId: null,
      replyInputs: {},
      showEditPostModal: false,
      editPostForm: {
        postId: null,
        content: ''
      },
      showDeleteConfirm: false,
      deletePostId: null,
      user: {
        name: 'Pham Cau',
        avatar: 'https://i.pravatar.cc/150?img=3',
        banner: '',
        friends: 500,
        bio: 'Yêu thú cưng và du lịch',
        phone: '0123456789'
      },
      posts: [
        {
          id: 1,
          author: 'Pham Cau',
          authorAvatar: 'https://i.pravatar.cc/150?img=3',
          time: '2 giờ trước',
          content: 'Món cún lớn của gia đình chúng tôi',
          image: true,
          imageClass: 'pets-image',
          likes: 123,
          liked: false,
          commentsList: [
            {
              id: 11,
              user: 'Panda',
              userSrc: 'https://i.pravatar.cc/150?img=5',
              text: 'Dễ thương quá bạn ơi!',
              time: '1 giờ trước',
              replies: []
            }
          ],
          images: ['https://i.pravatar.cc/150?img=5'],
          showCommentInput: false,
          showAllComments: false
        },
        {
          id: 2,
          author: 'Bouncy và Pham Cau',
          authorAvatar: 'https://i.pravatar.cc/150?img=7',
          time: '1 giờ trước',
          content: 'Chuyến đi công viên hôm nay thật tuyệt vời!',
          image: true,
          imageClass: 'park-image',
          likes: 45,
          liked: false,
          commentsList: [
            {
              id: 21,
              user: 'Mèo Miu',
              userSrc: 'https://i.pravatar.cc/150?img=9',
              text: 'Trông vui quá!',
              time: '30 phút trước',
              replies: []
            },
            {
              id: 22,
              user: 'Luna',
              userSrc: 'https://i.pravatar.cc/150?img=11',
              text: 'Lần sau cho tôi đi cùng nhé!',
              time: '15 phút trước',
              replies: []
            }
          ],
          images: ['https://i.pravatar.cc/150?img=7'],
          showCommentInput: false,
          showAllComments: false
        },
        {
          id: 3,
          author: 'Hội Yêu Thú Cưng',
          authorAvatar: 'https://i.pravatar.cc/150?img=13',
          time: '3 giờ trước',
          content: 'Sự kiện quyên góp thức ăn cho thú cưng hoang sẽ diễn ra vào ngày mai tại công viên thành phố. Hãy cùng tham gia!',
          likes: 210,
          liked: false,
          commentsList: [],
          images: [],
          showCommentInput: false,
          showAllComments: false
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
    goToProfileEdit() {
      this.editProfileForm.username = this.user.name;
      this.editProfileForm.avatarPreview = this.user.avatar;
      this.editProfileForm.bannerPreview = this.user.banner;
      this.showEditProfileModal = true;
    },
    handleAvatarChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.user.avatar = URL.createObjectURL(file);
      this.showNotification('Ảnh đại diện đã được cập nhật!', 'success');
    },
    handleAvatarChangeModal(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.editProfileForm.avatar = file;
      this.editProfileForm.avatarPreview = URL.createObjectURL(file);
    },
    handleBannerChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.editProfileForm.banner = file;
      this.editProfileForm.bannerPreview = URL.createObjectURL(file);
    },
    saveProfileEdit() {
      if (this.editProfileForm.username) {
        this.user.name = this.editProfileForm.username;
      }
      if (this.editProfileForm.avatar) {
        this.user.avatar = this.editProfileForm.avatarPreview;
      }
      if (this.editProfileForm.banner) {
        this.user.banner = this.editProfileForm.bannerPreview;
      }
      this.showNotification('Thông tin cá nhân đã được cập nhật!', 'success');
      this.showEditProfileModal = false;
      this.resetProfileForm();
    },
    cancelProfileEdit() {
      this.showEditProfileModal = false;
      this.resetProfileForm();
    },
    resetProfileForm() {
      this.editProfileForm.username = '';
      this.editProfileForm.avatar = null;
      this.editProfileForm.avatarPreview = '';
      this.editProfileForm.banner = null;
      this.editProfileForm.bannerPreview = '';
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
    editPost(postId) {
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        this.editPostForm.postId = postId;
        this.editPostForm.content = post.content;
        this.showEditPostModal = true;
        this.closeDropdown();
      }
    },
    savePostEdit() {
      const post = this.posts.find(p => p.id === this.editPostForm.postId);
      if (post) {
        post.content = this.editPostForm.content;
        this.showNotification('Bài viết đã được cập nhật!', 'success');
      }
      this.showEditPostModal = false;
      this.editPostForm.postId = null;
      this.editPostForm.content = '';
    },
    cancelPostEdit() {
      this.showEditPostModal = false;
      this.editPostForm.postId = null;
      this.editPostForm.content = '';
    },
    deletePost(postId) {
      this.showDeleteConfirm = true;
      this.deletePostId = postId;
      this.closeDropdown();
    },
    confirmDelete() {
      this.posts = this.posts.filter(p => p.id !== this.deletePostId);
      this.showNotification('Bài viết đã được xóa!', 'success');
      this.showDeleteConfirm = false;
      this.deletePostId = null;
    },
    cancelDelete() {
      this.showDeleteConfirm = false;
      this.deletePostId = null;
    },
    toggleCommentInput(postId) {
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        post.showCommentInput = !post.showCommentInput;
      }
    },
    toggleLike(post) {
      post.liked = !post.liked;
    },
    toggleCommentPopup(post = null) {
      if (this.showCommentModal) {
        this.showCommentModal = false;
        this.activePost = null;
      } else {
        this.activePost = post;
        this.showCommentModal = true;
      }
    },
    prepareReply(cmt) {
      this.replyingCommentId = cmt.id;
      if (this.replyInputs[cmt.id] === undefined) {
        this.replyInputs[cmt.id] = `@${cmt.user} `;
      }
    },
    submitReplyModal(cmt) {
      const text = (this.replyInputs[cmt.id] || '').trim();
      if (!text) return;
      if (!Array.isArray(cmt.replies)) cmt.replies = [];
      cmt.replies.push({
        id: Date.now(),
        user: this.user.name,
        userSrc: this.user.avatar,
        text,
        time: 'Vừa xong',
        replyToId: cmt.id,
        replyToUser: cmt.user
      });
      this.replyInputs[cmt.id] = '';
      this.replyingCommentId = null;
    },
    addComment(post) {
      if (!this.newComment.trim()) return;
      if (!Array.isArray(post.commentsList)) post.commentsList = [];
      post.commentsList.push({
        id: Date.now(),
        user: this.user.name,
        userSrc: this.user.avatar,
        text: this.newComment,
        time: 'Vừa xong',
        replies: []
      });
      this.newComment = '';
      this.showNotification('Bình luận đã được thêm!', 'success');
    },
    toggleComments(postId) {
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        post.showAllComments = !post.showAllComments;
      }
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
  margin-right: clamp(4px, 1vw, 8px);
  width: clamp(16px, 2vw, 20px);
  height: clamp(16px, 2vw, 20px);
}

.lopet-app-new {
  background-color: #F9F9F9;
  min-height: 100vh;
  position: relative;
}

/* Header and Search Box */
.search-box {
  display: flex;
  align-items: center;
  background-color: #f0f2f5;
  border-radius: 25px;
  padding: clamp(6px, 1vw, 8px) clamp(10px, 2vw, 15px);
  flex: 1;
  max-width: 600px;
  margin: 10px auto;
  border: 1px solid #ddd;
  transition: box-shadow 0.3s ease;
}

.search-box:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-box input {
  border: none;
  background-color: transparent;
  outline: none;
  flex: 1;
  padding: clamp(6px, 1vw, 8px);
  font-size: clamp(13px, 1.5vw, 15px);
}

.search-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.search-button img {
  width: clamp(18px, 2vw, 22px);
  height: clamp(18px, 2vw, 22px);
}

/* Notifications */
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  width: clamp(250px, 30vw, 300px);
}

.notification {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: clamp(8px, 1vw, 10px) clamp(12px, 1.5vw, 15px);
  margin-bottom: 10px;
  border-radius: 6px;
  color: black;
  font-size: clamp(12px, 1.2vw, 14px);
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
  font-size: clamp(14px, 1.5vw, 16px);
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

/* Confirmation Modal */
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
  padding: clamp(15px, 2vw, 20px);
  max-width: clamp(300px, 80vw, 400px);
  width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.confirm-modal-content h3 {
  font-size: clamp(16px, 2vw, 18px);
  margin-bottom: 15px;
  color: #333;
}

.confirm-modal-content p {
  font-size: clamp(12px, 1.5vw, 14px);
  margin-bottom: 20px;
  color: #65676b;
}

.confirm-modal-actions {
  display: flex;
  gap: 10px;
}

.confirm-button, .cancel-button {
  flex: 1;
  padding: clamp(8px, 1vw, 10px);
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: clamp(12px, 1.5vw, 14px);
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

.avatar-preview {
  width: clamp(80px, 10vw, 100px);
  height: clamp(80px, 10vw, 100px);
  border-radius: 50%;
  margin: 10px auto;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.banner-preview {
  width: 100%;
  height: clamp(100px, 10vw, 120px);
  border-radius: 8px;
  margin: 10px 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Profile Section */
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  background-color: #FAEBD7;
}

.profile-banner {
  height: clamp(200px, 20vw, 250px);
  overflow: hidden;
  background-color: #f0f2f5;
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.profile-details-new {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #FFFFFF;
}

.profile-avatar {
  position: relative;
  margin-top: -50px;
  border: 4px solid white;
  border-radius: 50%;
  width: clamp(80px, 10vw, 100px);
  height: clamp(80px, 10vw, 100px);
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
  width: 90%;
  padding-top: 10px;
  margin-left: 100px;
  position: relative;
  padding-right: clamp(80px, 10vw, 100px); 
}

.profile-name {
  font-size: clamp(18px, 2.5vw, 22px);
  font-weight: bold;
}

.profile-stats {
  color: #65676b;
  margin-bottom: 10px;
  font-size: clamp(12px, 1.5vw, 14px);
}

.edit-profile-button {
  position: absolute;
  right: clamp(10px, 2vw, 15px);
  top: 50%;
  transform: translateY(-50%);
  padding: clamp(6px, 1vw, 8px) clamp(10px, 1.5vw, 12px);
  background-color: #fad989;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  color: #333;
  transition: background-color 0.3s;
  font-size: clamp(12px, 1.5vw, 14px);
}

.edit-profile-button:hover {
  background-color: #f8d070;
}

.profile-nav {
  display: flex;
  justify-content: center;
  border-top: 1px solid #e4e6eb;
  margin-top: 15px;
  padding-top: 5px;
}

.nav-item {
  padding: clamp(6px, 1vw, 8px) clamp(10px, 2vw, 15px);
  text-decoration: none;
  color: #65676b;
  font-weight: 600;
  position: relative;
  font-size: clamp(12px, 1.5vw, 14px);
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

/* Profile Content */
.profile-content {
  display: flex;
  padding: clamp(10px, 2vw, 15px);
  flex-direction: row;
  background-color: #F9F9F9;
  position: relative;
  gap: clamp(10px, 2vw, 15px);
}

.sidebar {
  flex: 0 0 clamp(280px, 30vw, 320px);
  margin-right: 0;
  position: sticky;
  /* top: 10px; */
  height: fit-content;
  z-index: 10;
}

.intro-section {
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: clamp(10px, 2vw, 15px);
  margin-bottom: 20px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
}

.intro-section h3 {
  margin-bottom: 15px;
  font-size: clamp(14px, 2vw, 16px);
}

.intro-list {
  list-style: none;
}

.intro-list li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #65676b;
  font-size: clamp(12px, 1.5vw, 14px);
}

.intro-list li img {
  margin-right: 10px;
  width: 20px;
  text-align: center;
  color: #777;
}

.edit-button {
  width: 100%;
  padding: clamp(6px, 1vw, 8px);
  background-color: #fad989;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  color: #333;
  transition: background-color 0.3s;
  font-size: clamp(12px, 1.5vw, 14px);
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
  font-size: clamp(12px, 1.5vw, 14px);
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.form-input {
  width: 100%;
  padding: clamp(6px, 1vw, 8px);
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: clamp(12px, 1.5vw, 14px);
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
  padding: clamp(6px, 1vw, 8px);
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: clamp(12px, 1.5vw, 14px);
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

/* Feed */
.feed {
  flex: 1;
}

.create-post {
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  padding: clamp(10px, 1.5vw, 12px);
  margin-bottom: 15px;
}

.create-post-header {
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.post-input-avatar {
  width: clamp(32px, 4vw, 36px);
  height: clamp(32px, 4vw, 36px);
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
  padding: clamp(6px, 1vw, 8px) clamp(10px, 1.5vw, 12px);
  border: none;
  background-color: #f0f2f5;
  border-radius: 20px;
  outline: none;
  font-size: clamp(12px, 1.5vw, 14px);
}

.create-post-actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
  gap: 10px;
}

.create-action {
  background: none;
  border: none;
  padding: clamp(4px, 1vw, 6px);
  color: #65676b;
  font-size: clamp(12px, 1.5vw, 14px);
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  transition: color 0.3s;
}

.create-action:hover {
  color: #ff6b01;
}

.create-action img {
  margin-right: 6px;
}

/* Post Item */
.post-item {
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  margin-bottom: 15px;
  padding: clamp(10px, 1.5vw, 12px);
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
  width: clamp(32px, 4vw, 36px);
  height: clamp(32px, 4vw, 36px);
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
  font-size: clamp(12px, 1.5vw, 14px);
  font-weight: 600;
}

.post-time {
  font-size: clamp(10px, 1.2vw, 12px);
  color: #65676b;
}

.post-options {
  position: relative;
  display: flex;
  gap: 15px;
  align-items: center;
}

.post-options img {
  cursor: pointer;
  color: #65676b;
  transition: color 0.3s;
  border-radius: 50%;
  transition: background-color 0.3s, color 0.3s;
}

.post-options img:hover {
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
  min-width: clamp(160px, 20vw, 180px);
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
  padding: clamp(10px, 1.5vw, 12px) clamp(12px, 1.5vw, 16px);
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: clamp(12px, 1.5vw, 14px);
  color: #333;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item img {
  margin-right: 12px;
  width: 16px;
  text-align: center;
  font-size: 14px;
  color: #65676b;
}

.dropdown-item:first-child img {
  color: #e74c3c;
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
  font-size: clamp(12px, 1.5vw, 14px);
}

.post-image {
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
  height: clamp(180px, 20vw, 240px);
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
  gap: 15px;
  align-items: center;
  padding: 0 clamp(8px, 1.5vw, 12px);
}

.post-actions {
  display: flex;
  gap: 15px;
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

.post-action:hover {
  color: #ff6b01;
}

.post-action img {
  margin-right: 5px;
}

.post-stats {
  font-size: clamp(12px, 1.5vw, 14px);
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

.comment-content {
  background-color: #f0f2f5;
  border-radius: 18px;
  padding: clamp(6px, 1vw, 8px) clamp(10px, 1.5vw, 12px);
  flex: 1;
}

.comment-content h5 {
  font-size: clamp(11px, 1.2vw, 13px);
  margin-bottom: 3px;
  font-weight: 600;
}

.comment-content p {
  font-size: clamp(11px, 1.2vw, 13px);
}

.comment-time {
  font-size: clamp(10px, 1.2vw, 11px);
  color: #65676b;
}

.show-more-comments {
  color: #65676b;
  font-size: clamp(11px, 1.2vw, 13px);
  cursor: pointer;
  text-align: center;
  margin-top: 10px;
}

.show-more-comments:hover {
  color: #ff6b01;
}

/* Comment Input (Inline Comment Form) */
.comment-input {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  gap: 10px;
}

.comment-avatar {
  width: clamp(28px, 3.5vw, 32px);
  height: clamp(28px, 3.5vw, 32px);
  border-radius: 50%;
  margin-right: 10px;
  background-color: #e4e6eb;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.comment-box {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.comment-box input {
  width: 100%;
  padding: clamp(6px, 1vw, 8px) clamp(10px, 1.5vw, 12px);
  border: none;
  background-color: #f0f2f5;
  border-radius: 18px;
  outline: none;
  font-size: clamp(11px, 1.2vw, 13px);
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

.comment-actions .btn-send {
  background: #009DFF;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: clamp(4px, 1vw, 6px) clamp(8px, 1.5vw, 10px);
  cursor: pointer;
  font-size: clamp(11px, 1.2vw, 12px);
}

.comment-actions .btn-send:hover {
  background: #007ACC;
}

/* Comments Modal */
.comment-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.comment-modal {
  width: 600px;
  max-height: 90vh;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  font-family: "Segoe UI", Tahoma, sans-serif;
}

.comment-modal-header {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
}

.comment-modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.comment-modal-header .close-btn {
  background: transparent;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
}

.comment-modal-gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 180px;
  gap: 4px;
}

.comment-modal-gallery img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: relative;
  margin-left: 155px;
}

.comment-modal-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 16px;
}

.comment-modal-list .comment-item {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.comment-modal-list .comment-avatar {
  width: clamp(28px, 3.5vw, 32px);
  height: clamp(28px, 3.5vw, 32px);
  border-radius: 50%;
  object-fit: cover;
}

.comment-modal-list .comment-body {
  flex: 1;
}

.comment-modal-list .comment-username {
  font-weight: 600;
}

.comment-modal-list .comment-text {
  margin: 4px 0;
  color: #333;
}

.comment-modal-list .comment-time {
  font-size: 0.75rem;
  color: #888;
}

.btn-reply-modal {
  background: none;
  border: none;
  color: #1877F2;
  cursor: pointer;
  font-size: 14px;
  margin-top: 4px;
}

.reply-section {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

.reply-section input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.reply-section button {
  padding: 6px 12px;
  background: #009DFF;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.nested-replies {
  margin-top: 8px;
  padding-left: 16px;
  border-left: 2px solid #eee;
}

.reply-item {
  margin-bottom: 4px;
}

.reply-username {
  font-weight: 600;
}

.reply-to {
  color: #555;
  margin: 0 4px;
}

.comment-modal-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #eee;
}

.comment-modal-footer .comment-avatar {
  width: clamp(28px, 3.5vw, 32px);
  height: clamp(28px, 3.5vw, 32px);
  border-radius: 50%;
  background-color: #e4e6eb;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.comment-modal-footer input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 999px;
  font-size: clamp(12px, 1.5vw, 14px);
}

.comment-modal-footer .btn-send {
  padding: 8px 16px;
  background: #009DFF;
  color: #fff;
  border: none;
  border-radius: 999px;
  cursor: pointer;
}

.comment-modal-footer .btn-send:hover {
  background: #007ACC;
}

/* Fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .search-box {
    max-width: 500px;
    margin: 10px 20px;
  }

  .profile-content {
    flex-direction: row;
  }

  .sidebar {
    flex: 0 0 clamp(250px, 30vw, 280px);
  }

  .post-image {
    height: clamp(160px, 18vw, 200px);
  }

  .comment-modal {
    width: 90%;
  }

  .comment-avatar {
    width: clamp(24px, 3.5vw, 28px);
    height: clamp(24px, 3.5vw, 28px);
  }

  .comment-modal-list .comment-avatar {
    width: clamp(24px, 3.5vw, 28px);
    height: clamp(24px, 3.5vw, 28px);
  }

  .comment-modal-footer .comment-avatar {
    width: clamp(24px, 3.5vw, 28px);
    height: clamp(24px, 3.5vw, 28px);
  }
}

@media (max-width: 768px) {
  .search-box {
    margin: 10px 15px;
    max-width: 100%;
  }

  .search-box input {
    font-size: clamp(12px, 1.5vw, 14px);
  }

  .profile-content {
    flex-direction: column;
  }

  .sidebar {
    flex: 1;
    margin-bottom: 15px;
    position: static;
  }

  .create-post-actions {
    justify-content: space-around;
  }

  .create-action {
    flex: 1;
    min-width: 33%;
    padding: clamp(4px, 1vw, 6px);
    font-size: clamp(11px, 1.5vw, 12px);
  }

  .dropdown-menu {
    right: 10px;
    min-width: clamp(140px, 20vw, 160px);
  }

  .notification-container {
    width: 90%;
    padding: 0 10px;
    right: 50%;
    transform: translateX(50%);
  }

  .notification {
    max-width: 100%;
    font-size: clamp(11px, 1.2vw, 13px);
  }

  .confirm-modal-content {
    width: 95%;
    padding: clamp(12px, 2vw, 15px);
  }

  .confirm-modal-content h3 {
    font-size: clamp(14px, 2vw, 16px);
  }

  .confirm-modal-content p {
    font-size: clamp(11px, 1.5vw, 13px);
  }

  .profile-banner {
    height: clamp(180px, 20vw, 220px);
  }

  .profile-avatar {
    width: clamp(70px, 10vw, 90px);
    height: clamp(70px, 10vw, 90px);
  }

  .comment-modal {
    width: 95%;
  }

  .comment-avatar {
    width: clamp(24px, 3.5vw, 28px);
    height: clamp(24px, 3.5vw, 28px);
  }

  .comment-modal-list .comment-avatar {
    width: clamp(24px, 3.5vw, 28px);
    height: clamp(24px, 3.5vw, 28px);
  }

  .comment-modal-footer .comment-avatar {
    width: clamp(24px, 3.5vw, 28px);
    height: clamp(24px, 3.5vw, 28px);
  }
}

@media (max-width: 480px) {
  .search-box {
    margin: 8px 10px;
  }

  .search-box input {
    padding: clamp(4px, 1vw, 6px);
    font-size: clamp(11px, 1.5vw, 13px);
  }

  .search-button img {
    width: clamp(16px, 2vw, 18px);
    height: clamp(16px, 2vw, 18px);
  }

  .profile-banner {
    height: clamp(150px, 20vw, 180px);
  }

  .profile-avatar {
    width: clamp(60px, 10vw, 80px);
    height: clamp(60px, 10vw, 80px);
    margin-top: -40px;
  }

  .profile-name {
    font-size: clamp(16px, 2.5vw, 18px);
  }

  .profile-stats {
    font-size: clamp(11px, 1.5vw, 12px);
  }

  .nav-item {
    padding: clamp(4px, 1vw, 6px) clamp(8px, 2vw, 10px);
    font-size: clamp(11px, 1.5vw, 12px);
  }

  .intro-section {
    padding: clamp(8px, 2vw, 10px);
  }

  .intro-section h3 {
    font-size: clamp(13px, 2vw, 14px);
  }

  .intro-list li {
    font-size: clamp(11px, 1.5vw, 12px);
  }

  .edit-button {
    padding: clamp(4px, 1vw, 6px);
    font-size: clamp(11px, 1.5vw, 12px);
  }

  .form-group label {
    font-size: clamp(11px, 1.5vw, 12px);
  }

  .form-input {
    padding: clamp(4px, 1vw, 6px);
    font-size: clamp(11px, 1.5vw, 12px);
  }

  .save-button, .cancel-button {
    padding: clamp(4px, 1vw, 6px);
    font-size: clamp(11px, 1.5vw, 12px);
  }

  .create-post {
    padding: clamp(8px, 1.5vw, 10px);
  }

  .post-input-avatar {
    width: clamp(28px, 4vw, 32px);
    height: clamp(28px, 4vw, 32px);
  }

  .post-input input {
    padding: clamp(4px, 1vw, 6px) clamp(8px, 1.5vw, 10px);
    font-size: clamp(11px, 1.5vw, 12px);
  }

  .create-action {
    padding: clamp(3px, 1vw, 4px);
    font-size: clamp(10px, 1.5vw, 11px);
  }

  .post-item {
    padding: clamp(8px, 1.5vw, 10px);
  }

  .post-author-avatar {
    width: clamp(28px, 4vw, 32px);
    height: clamp(28px, 4vw, 32px);
  }

  .post-author-info h4 {
    font-size: clamp(11px, 1.5vw, 12px);
  }

  .post-time {
    font-size: clamp(9px, 1.2vw, 10px);
  }

  .post-image {
    height: clamp(140px, 20vw, 180px);
  }

  .post-content p {
    font-size: clamp(11px, 1.5vw, 12px);
  }

  .post-stats {
    font-size: clamp(11px, 1.5vw, 12px);
  }

  .comment-avatar {
    width: clamp(20px, 3.5vw, 24px);
    height: clamp(20px, 3.5vw, 24px);
  }

  .comment-modal-list .comment-avatar {
    width: clamp(20px, 3.5vw, 24px);
    height: clamp(20px, 3.5vw, 24px);
  }

  .comment-modal-footer .comment-avatar {
    width: clamp(20px, 3.5vw, 24px);
    height: clamp(20px, 3.5vw, 24px);
  }

  .comment-content {
    padding: clamp(4px, 1vw, 6px) clamp(8px, 1.5vw, 10px);
  }

  .comment-content h5 {
    font-size: clamp(10px, 1.2vw, 11px);
  }

  .comment-content p {
    font-size: clamp(10px, 1.2vw, 11px);
  }

  .comment-box input {
    padding: clamp(4px, 1vw, 6px) clamp(8px, 1.5vw, 10px);
    font-size: clamp(10px, 1.2vw, 11px);
    padding-right: 60px;
  }

  .comment-actions {
    right: 8px;
    gap: 8px;
  }

  .comment-modal-footer input {
    padding: clamp(6px, 1vw, 8px) clamp(10px, 1.5vw, 12px);
    font-size: clamp(11px, 1.5vw, 12px);
  }

  .comment-modal {
    width: 95%;
  }
}
</style>