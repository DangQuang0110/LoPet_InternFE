<template>
  <layout>
  <div class="lopet-app-new">
    <!-- Header with Search Bar -->
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
  <div class="custom-file-input">
    <label for="avatar" class="custom-file-label">📁 Chọn ảnh đại diện</label>
    <input
      id="avatar"
      type="file"
      ref="avatarInputModal"
      accept="image/*"
      @change="handleAvatarChangeModal"
    />
  </div>
  <div
    v-if="editProfileForm.avatarPreview"
    class="avatar-preview"
    :style="{ 'background-image': 'url(' + editProfileForm.avatarPreview + ')' }"
  ></div>
  <button
  v-if="editProfileForm.avatarPreview"
  type="button"
  class="btn-delete-avatar"
  @click="deleteAvatar"
>
  Xóa ảnh đại diện
</button>
</div>
     <div class="form-group">
  <label for="banner">Ảnh bìa</label>
  <div class="custom-file-input">
    <label for="banner" class="custom-file-label">🖼️ Chọn ảnh bìa</label>
    <input
      id="banner"
      type="file"
      ref="bannerInput"
      accept="image/*"
      @change="handleBannerChange"
    />
  </div>
  <div
    v-if="editProfileForm.bannerPreview"
    class="banner-preview"
    :style="{ 'background-image': 'url(' + editProfileForm.bannerPreview + ')' }"
  ></div>
        <!-- Nút xóa ảnh bìa -->
        <button
          v-if="editProfileForm.bannerPreview"
          type="button"
          class="btn-delete-banner"
          @click="deleteBanner"
        >
          Xóa ảnh bìa
        </button>
      </div>  
      <div class="confirm-modal-actions">
        <button type="submit" class="confirm-button">Lưu</button>
        <button type="button" class="cancel-button" @click="cancelProfileEdit">Hủy</button>
      </div>
    </form>
  </div>
</div>

    <!-- Delete Post Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="modal-overlay">
      <div class="delete-modal">
        <div class="modal-header">
          <h3>Bạn có muốn xóa bài viết này không</h3>
          <button class="close-modal" @click="cancelDelete">×</button>
        </div>
        <div class="modal-body">
          <!-- <p class="modal-title">Bạn có muốn xóa bài viết này hay không?</p> -->
          <p class="modal-text">
            Khi bạn xóa bài viết này thì nó sẽ không còn xuất hiện trong danh sách bài viết mà bạn được xem nữa.
          </p>
        </div>
        <div class="modal-actions">
           <button class="btn-cancel" @click="cancelDelete">Không</button>
          <button class="btn-confirm" @click="performDelete">Có</button>
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
    />

    <!-- Profile section -->
    <div class="profile-container">
      <div
        class="profile-banner"
        :style="{ backgroundImage: user.banner ? 'url(' + user.banner + ')' : '',
             backgroundColor: user.banner ? '' : '#ffffff'
         }"
      ></div>
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
          <button class="edit-profile-button" @click="goToProfileEdit">Chỉnh sửa tài khoản</button>
          <div class="profile-nav">
            <!-- <router-link to="/profile" class="nav-item active">Trang Cá Nhân</router-link> -->
            <!-- <router-link to="/photo" class="nav-item">Hình Ảnh</router-link> -->
          </div>
        </div>
      </div>

      <!-- Profile content section -->
      <div class="profile-content">
        <div class="sidebar">
          <div class="intro-section">
            <h3>Hồ sơ</h3>
            <div v-if="!editMode">
              <ul class="intro-list">
                <li class="bio-item">
                  <img src="/icon/resume.png" alt="Bio" class="nav-icon" />
                  <span>{{ user.bio || 'Chưa có thông tin giới thiệu...' }}</span>
                </li>
                <li>
                  <img src="/icon/telephone.png" alt="Phone" class="nav-icon" />
                  <span>{{ user.phone || 'Chưa có số điện thoại...' }}</span>
                </li>
                <li>
                  <img src="../assets/trangchu.png" alt="Hometown" class="nav-icon" />
                  <span>{{ user.hometown || 'Chưa có quê quán...' }}</span>
                </li>
                <li>
                  <img src="../assets/sex.jpg" alt="Gender" class="nav-icon" />
                  <span>{{ user.gender || 'Chưa có thông tin giới tính...' }}</span>
                </li>
                <li>
                  <img src="../assets/date.jpg" alt="Date of Birth" class="nav-icon" />
                  <span>{{ user.dateOfBirth || 'Chưa có ngày sinh...' }}</span>
                </li>
              </ul>
              <button class="edit-button" @click="goToEdit">Chỉnh sửa</button>
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
                <div class="form-group">
                  <label for="hometown">Quê quán</label>
                  <input
                    id="hometown"
                    type="text"
                    v-model="editForm.hometown"
                    placeholder="Nhập quê quán..."
                    class="form-input"
                  />
                </div>
                <div class="form-group">
                  <label for="gender">Giới tính</label>
                  <select
                    id="gender"
                    v-model="editForm.gender"
                    class="form-input"
                  >
                    <option value="" disabled>Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="dateOfBirth">Ngày tháng năm sinh</label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    v-model="editForm.dateOfBirth"
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
          <div v-if="posts.length === 0" class="no-posts-message">
  Chưa có bài viết mới
</div>
          <div class="post-card" v-for="post in posts" :key="post.id">
            <!-- Post Header -->
            <div class="post-header">
              <img :src="post.userSrc" alt="avatar" class="avatar" />
              <div class="post-info">
                <span class="username">{{ post.user }}</span>
                <small class="time">{{ post.time }}</small>
              </div>
              <div class="post-header-actions">
                <button class="btn-icon menu-btn" @click.stop="togglePostMenu(post.id)">
                  <img src="/icon/dots.png" alt="Home" class="nav-icon" />
                </button>
                <div v-if="openedMenuPostId === post.id" class="post-menu" @click.stop>
                  <ul>
                    <!-- <li v-if="post.user === user.name" @click="editPost(post.id)">Sửa bài viết</li> -->
                    <li v-if="post.user === user.name" @click="confirmDelete(post.id)">Xóa bài viết</li>
                    <li @click="showReport = true">Báo cáo bài viết</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Post Content -->
            <div class="post-content">
              <p>
                <span v-if="!expandedPosts[post.postId] && post.text.length > 200">
                  {{ post.text.slice(0, 200) }}...
                </span>
                <span v-else>{{ post.text }}</span>
              </p>
              <button
                v-if="post.text.length > 200"
                class="toggle-expand-btn"
                @click="toggleExpand(post.postId)"
              >
                {{ expandedPosts[post.postId] ? 'Thu gọn' : 'Xem thêm' }}
              </button>
              <div class="post-media-wrapper" v-if="post.images.length">
                <template v-for="(media, index) in post.images" :key="index">
                  <video
                    v-if="isVideo(media)"
                    controls
                    class="post-video"
                  >
                    <source :src="media" type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ video.
                  </video>
                  <img
                    v-else
                    :src="media"
                    class="post-image"
                    alt="post media"
                  />
                </template>
              </div>
            </div>
            <div class="post-actions">
              <button class="btn-icon like-btn" @click="toggleLike(post)">
                <img
                  :src="post.liked ? '/assets/like.png' : '/assets/like.png'"
                  alt="Like"
                  class="icon-img-like"
                />
              </button>
              <span class="count">{{ post.likes }}</span>
              <button class="btn-icon comment-btn" @click="toggleCommentPopup(post)">
                <img src="../assets/comment.png" alt="Comment" class="icon-img" />
              </button>
              <span class="count">{{ post.commentsList.length }}</span>
              <button class="btn-icon share-btn" @click="toggleSharePopup">
                <img src="/icon/share.png" alt="Share" class="icon-img-share" />
              </button>
            </div>

            <!-- Comment-list (kiểu Facebook-like theo hình) -->
<div class="comment-list">
  <div
    class="comment-item"
    v-for="(cmt) in getLatestComments(post.commentsList)"
    :key="cmt.id"
  >
    <!-- Avatar -->
    <img :src="cmt.userSrc" alt="avatar" class="comment-avatar" />

    <!-- Phần body chứa khung comment -->
    <div class="comment-content">
      <!-- Tên người comment (in đậm), và nội dung -->
      <div class="comment-bubble">
        <span class="comment-username">{{ cmt.user }}</span>
        <span class="comment-text">{{ cmt.text }}</span>
      </div>

      <!-- Dòng thời gian + Trả lời -->
      <div class="comment-footer">
        <span class="comment-time">{{ formatDate(cmt.createdAt) }}</span>
        <span class="comment-reply" @click="prepareReply(cmt)">Trả lời</span>
      </div>
    </div>
  </div>
            </div>
            <!-- Stats -->
            <button class="btn-icon comment-btn" @click="toggleCommentPopup(post)">Xem thêm bình luận</button>
            <!-- Comment Input -->
            <div class="post-comment">
              <input
                type="text"
                placeholder="Bình luận..."
                v-model="newComment"
                @keydown.enter.prevent="addComment(post)"
              />
              <button class="btn-icon post-comment" @click="addComment(post)">
                 <img src="../assets/Sendbutton.svg" alt="Send Button" class="send-icon">
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Comments Popup -->
    <transition name="fade">
      <div v-if="showCommentModal" class="comment-modal-overlay" @click.self="toggleCommentPopup">
        <div class="comment-modal">
          <div class="comment-modal-header">
            <h3>Bài viết của {{ activePost.user }}</h3>
            <button class="close-btn" @click="toggleCommentPopup">×</button>
          </div>
          <!-- <div class="comment-modal-gallery">
            <img v-for="(img, idx) in activePost.images" :key="idx" :src="img" class="gallery-img" />
          </div> -->
          <div class="comment-modal-list">
            <div v-for="c in activePost.commentsList" :key="c.id" class="comment-item">
              <img :src="c.userSrc" class="comment-avatar" />
              <div class="comment-body">
                <div class="main-comment">
                  <span class="comment-username">{{ c.user }}</span>
                  <p class="comment-text">{{ c.text }}</p>
                </div>
                <span class="comment-time">{{ formatDate(c.createdAt) }}</span>
                <button class="btn-reply-modal" @click="prepareReply(c)">Trả lời</button>
                <div v-if="replyingCommentId === c.id" class="reply-section">
                  <input
                    v-model="replyInputs[c.id]"
                    type="text"
                    :placeholder="`@${c.user}`"
                    @keydown.enter.prevent="submitReplyModal(c)"
                  />
                  <button @click="submitReplyModal(c)">Gửi</button>
                </div>
                <div v-for="r in c.replies" :key="r.id" class="reply-item">
                  <img :src="r.userSrc" class="comment-avatar" />
                  <div class="comment-body">
                    <div class="main-comment">
                      <span class="comment-username">{{ r.user }}</span>
                      <p class="comment-text">{{ r.text }}</p>
                    </div>
                    <div class="comment-time">{{ r.time || formatDate(r.createdAt) }}</div>
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
              v-model="newComment"
              type="text"
              placeholder="Viết bình luận..."
              @keydown.enter.prevent="addComment(activePost)"
            />
            <button class="btn-send" @click="addComment(activePost)">Gửi</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Share Modal -->
    <transition name="fade">
      <div v-if="showSharePopup" class="share-overlay" @click.self="toggleSharePopup">
        <div class="share-modal">
          <div class="share-header">
            <span class="share-title">Chia sẻ</span>
            <button class="close-btn" @click="toggleSharePopup">×</button>
          </div>
          <div class="share-body">
            <div class="share-user">
              <img :src="user.avatar" alt="avatar" class="share-avatar" />
              <div class="share-user-info">
                <span class="share-name">{{ user.name }}</span>
                <div class="privacy-dropdown">
                  <button @click="showPrivacy = !showPrivacy">
                    {{ privacySetting }} <i class="fas fa-caret-down"></i>
                  </button>
                  <ul v-if="showPrivacy" class="privacy-options">
                    <li @click="privacySetting = 'Bằng feed'; showPrivacy = false">Bằng feed</li>
                    <li @click="privacySetting = 'Công khai'; showPrivacy = false">Công khai</li>
                    <li @click="privacySetting = 'Bạn bè'; showPrivacy = false">Bạn bè</li>
                  </ul>
                </div>
              </div>
            </div>
            <textarea v-model="shareText" class="share-input" placeholder="Hãy nói gì đó về nội dung này…"></textarea>
          </div>
          <div class="share-footer">
            <button class="btn-share-now" @click="shareNow">Chia sẻ ngay</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Create Post Modal -->
    <CreatePost v-if="showCreate" @close="showCreate = false" @refresh="refreshData" />
    <!-- Report Modal -->
    <ReportModal v-if="showReport" @close="showReport = false" @report="onReport" />
  </div>
  </layout>
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue';
import layout from './Layout.vue';
import { getProfileByAccountId,updateProfile} from '@/service/profileService';
import ReportModal from '@/components/ReportModal.vue'
import {getPostsByAccountId,deletePost } from '@/service/postService';
import { getCommentsByPostId } from '@/service/commentService';
import { likePost, unlikePost } from '@/service/postService'
import { useRoute } from 'vue-router';
import {getFriendList} from '@/service/friendService';

// Reactive variables
const search = ref('');
const showCreate = ref(false);
const showReport = ref(false);
const composeText = ref('');
const notifications = ref([]);
const showEditPostModal = ref(false);
const editPostForm = ref({ postId: null, content: '' });
const showDeleteConfirm = ref(false);
const deleteTargetId = ref(null);
const openedMenuPostId = ref(null);
const showCommentModal = ref(false);
const activePost = ref(null);
const newComment = ref('');
const showSharePopup = ref(false);
const showPrivacy = ref(false);
const privacySetting = ref('Bằng feed');
const shareText = ref('');
const editMode = ref(false);
const removeBannerRequested = ref(false);
const showEditProfileModal = ref(false);

const editProfileForm = ref({
  username: '',
  avatar: null,
  avatarPreview: '',
  banner: null,
  bannerPreview: ''
});
const editForm = ref({
  bio: '',
  phone: '',
  hometown: '',
  gender: '',
  dateOfBirth: ''
});
const user = ref({
  id: '',
  name: '',
  avatar: '',
  banner: '',
  friends: 0,
  bio: '',
  phone: '',
  hometown: '',
  gender: '',
  dateOfBirth: ''
});

const expandedPosts = ref({});
const replyingCommentId = ref(null);
const replyInputs = reactive({});
const currentUserId = ref(localStorage.getItem('accountId') || '');
const posts = ref([]);
const route = useRoute();


// Functions for profile
function goToEdit() {
  editForm.value.bio = user.value.bio || '';
  editForm.value.phone = user.value.phone || '';
  editForm.value.hometown = user.value.hometown || '';
  editForm.value.gender = user.value.gender || '';
  editForm.value.dateOfBirth = user.value.dateOfBirth || '';
  editMode.value = true;
}
function deleteAvatar() {
  editProfileForm.value.avatar = null;
  editProfileForm.value.avatarPreview = '';
  user.value.avatar = ''; // nếu muốn cập nhật giao diện luôn
}

function deleteBanner() {
  // Xóa file banner đang cầm trong form
  editProfileForm.value.banner = null;
  editProfileForm.value.bannerPreview = '';
  user.value.banner = ''; // nếu muốn cập nhật giao diện luôn
}
function getLatestComments(comments) {
  if (!Array.isArray(comments)) return [];
  return [...comments]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // sắp xếp mới nhất
    .slice(0, 3); // lấy 3 cái đầu
}

async function saveDetails() {
  const phone = editForm.value.phone || '';
  const phoneRegex = /^0\d{9}$/; // Bắt đầu bằng 0, 10 chữ số

  if (phone && !phoneRegex.test(phone)) {
    showNotification('Số điện thoại không hợp lệ! Phải bắt đầu bằng 0 và có 10 chữ số.', 'error');
    return; // Dừng không lưu
  }

  try {
    const formData = new FormData();
    formData.append('fullName', user.value.name); // giữ nguyên tên
    formData.append('bio', editForm.value.bio || '');
    formData.append('phoneNumber', editForm.value.phone || '');
    formData.append('hometown', editForm.value.hometown || '');
    formData.append('sex', genderToNumber(editForm.value.gender));
    formData.append('dateOfBirth', editForm.value.dateOfBirth || '');

    const updated = await updateProfile(user.value.id, formData);

    user.value.bio = updated.bio || '';
    user.value.phone = updated.phoneNumber || '';
    user.value.hometown = updated.hometown || '';
    user.value.gender = genderLabel(updated.sex);
    user.value.dateOfBirth = updated.dateOfBirth
      ? new Date(updated.dateOfBirth).toISOString().split('T')[0]
      : '';
      user.value.avatar = updated.avatarUrl || user.value.avatar;
      user.value.banner = updated.coverUrl || user.value.banner;

    editMode.value = false;
    showNotification('Thông tin đã được cập nhật thành công!', 'success');
  } catch (error) {
    console.error('❌ update profile detail error:', error);
    showNotification('Cập nhật thông tin thất bại!', 'error');
  }
}

function genderToNumber(label) {
  if (label === 'Nam') return 0;
  if (label === 'Nữ') return 1;
  return -1;
}

function cancelEdit() {
  editMode.value = false;
}

function goToProfileEdit() {
  editProfileForm.value.username = user.value.name;
  editProfileForm.value.avatarPreview = user.value.avatar;
  editProfileForm.value.bannerPreview = user.value.banner;
  showEditProfileModal.value = true;
}

function handleAvatarChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  user.value.avatar = URL.createObjectURL(file);
  showNotification('Ảnh đại diện đã được cập nhật!', 'success');
}

function handleAvatarChangeModal(e) {
  const file = e.target.files[0];
  if (!file) return;
  editProfileForm.value.avatar = file;
  editProfileForm.value.avatarPreview = URL.createObjectURL(file);
}
function handleBannerChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  editProfileForm.value.banner = file;
  editProfileForm.value.bannerPreview = URL.createObjectURL(file);
}

async function loadUserProfile() {
  const accountId = route.params.id || JSON.parse(localStorage.getItem('user') || '{}')?.id;

  if (!accountId) {
    console.error('❌ Không tìm thấy accountId trong localStorage');
    showNotification('Vui lòng đăng nhập lại!', 'error');
    return;
  }

  try {
    console.log('📤 Gọi API với accountId:', accountId);
    const profile = await getProfileByAccountId(accountId);

    // 🔁 Gọi API lấy danh sách bạn bè
    const friends = await getFriendList(accountId);

    user.value = {
      id: profile.id,
      name: profile.fullName,
      avatar: profile.avatarUrl || '/image/avata.jpg',
      banner: profile.coverUrl || '',
      friends: friends?.length || 0, // ✅ số lượng bạn bè thực tế
      bio: profile.bio || '',
      phone: profile.phoneNumber || '',
      hometown: profile.hometown || '',
      gender: genderLabel(profile.sex),
      dateOfBirth: profile.dateOfBirth
        ? new Date(profile.dateOfBirth).toISOString().split('T')[0]
        : ''
    };
  } catch (error) {
    console.error('❌ loadUserProfile error:', error);
    showNotification('Không thể tải thông tin hồ sơ!', 'error');
  }
}

function genderLabel(sex) {
  const sexNum = Number(sex);
  if (sexNum === 0) return 'Nam';
  if (sexNum === 1) return 'Nữ';
  return 'Không rõ';
}

async function saveProfileEdit() {
  try {
    const formData = new FormData();
    formData.append('fullName', editProfileForm.value.username);

    // ✅ Xử lý avatar
    if (editProfileForm.value.avatar === null) {
      // Avatar bị xóa => gửi chuỗi rỗng
      formData.append('avatar', '');
    } else if (editProfileForm.value.avatar) {
      // Có avatar mới được chọn
      formData.append('avatar', editProfileForm.value.avatar);
    } else {
      // Không đổi => giữ nguyên
      const blob = await fetch(user.value.avatar).then(res => res.blob());
      formData.append('avatar', blob, 'avatar.jpg');
    }

    // ✅ Xử lý banner
    if (editProfileForm.value.banner === null) {
      // Banner bị xóa => gửi chuỗi rỗng
      formData.append('cover', '');
    } else if (editProfileForm.value.banner) {
      // Có banner mới được chọn
      formData.append('cover', editProfileForm.value.banner);
    } else {
      // Không đổi => giữ nguyên
      const blob = await fetch(user.value.banner).then(res => res.blob());
      formData.append('cover', blob, 'cover.jpg');
    }

    const updated = await updateProfile(user.value.id, formData);

    user.value.name = updated.fullName || user.value.name;
    user.value.avatar = updated.avatarUrl || '';
    user.value.banner = updated.coverUrl || '';

    showNotification('Thông tin cá nhân đã được cập nhật!', 'success');
  } catch (error) {
    console.error('❌ update profile error', error);
    showNotification('Cập nhật thất bại!', 'error');
  }

  showEditProfileModal.value = false;
  resetProfileForm();
}


function cancelProfileEdit() {
  showEditProfileModal.value = false;
  resetProfileForm();
}

function resetProfileForm() {
  editProfileForm.value.username = '';
  editProfileForm.value.avatar = null;
  editProfileForm.value.avatarPreview = '';
  editProfileForm.value.banner = null;
  editProfileForm.value.bannerPreview = '';
}
function isVideo(url) {
  return /\.(mp4|webm|ogg)$/i.test(url);
}

// Functions for posts
function refreshData() {
  showNotification('Dữ liệu đã được làm mới!', 'success');
}

function submitReplyModal(cmt) {
  const text = (replyInputs[cmt.id] || '').trim();
  if (!text) return;
  if (!Array.isArray(cmt.replies)) cmt.replies = [];
  cmt.replies.push({
    id: Date.now(),
    user: user.value.name,
    userSrc: user.value.avatar,
    text,
    time: 'Vừa xong',
    replyToUser: cmt.user
  });
  replyInputs[cmt.id] = '';
  replyingCommentId.value = null;
  showNotification('Trả lời bình luận đã được thêm!', 'success');
}

function prepareReply(cmt) {
  replyingCommentId.value = cmt.id;
  if (!replyInputs[cmt.id]) replyInputs[cmt.id] = `@${cmt.user} `;
}

function toggleExpand(postId) {
  expandedPosts.value[postId] = !expandedPosts.value[postId];
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffMinutes < 1) return 'Vừa xong';
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

function formatVietnameseTime(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day} tháng ${month} lúc ${hours}:${minutes}`;
}

async function toggleLike(post) {
  try {
    const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}')
    const accountId = userFromStorage?.id
    const postId = post?.postId

    if (!accountId || !postId) {
      console.error('❌ Thiếu accountId hoặc postId khi like:', { accountId, postId })
      return
    }

    if (post.liked) {
      await unlikePost(accountId, postId)
      post.likes -= 1
      post.liked = false
    } else {
      await likePost(accountId, postId)
      post.likes += 1
      post.liked = true
    }

    await refreshData()
  } catch (error) {
    console.error('❌ Lỗi khi xử lý like/unlike:', error)
  }
}

function togglePostMenu(id) {
  openedMenuPostId.value = openedMenuPostId.value === id ? null : id;
}

function confirmDelete(id) {
  deleteTargetId.value = id;
  showDeleteConfirm.value = true;
}

async function performDelete() {
  if (!deleteTargetId.value) return;

  try {
    // Gọi API xóa bài viết
    await deletePost(deleteTargetId.value);

    // Nếu API trả về thành công, xóa khỏi mảng posts
    const idx = posts.value.findIndex(p => p.id === deleteTargetId.value);
    if (idx !== -1) {
      posts.value.splice(idx, 1);
    }
    showNotification('Bài viết đã được xóa!', 'success');
  } catch (error) {
    console.error('❌ Xóa bài viết thất bại:', error);
    showNotification('Xóa bài viết thất bại!', 'error');
  }

  // Reset trạng thái modal
  showDeleteConfirm.value = false;
  deleteTargetId.value = null;
}

function cancelDelete() {
  showDeleteConfirm.value = false;
  deleteTargetId.value = null;
}

async function toggleCommentPopup(post = null) {
  if (showCommentModal.value) {
    showCommentModal.value = false;
    activePost.value = null;
  } else {
    activePost.value = { ...post, postId: post.postId };
    try {
      const response = await getCommentsByPostId(post.postId);
      const comments = Array.isArray(response) ? response : response.comments || [];
      let commentsList = comments.map(cmt => ({
        id: cmt.id,
        user: cmt.account?.fullName || cmt.account?.username || 'Ẩn danh',
        userSrc: cmt.account?.avatarUrl || cmt.account?.avatar || '/image/avata.jpg',
        text: cmt.content,
        createdAt: cmt.createdAt,
        replies: (cmt.replies || []).map(reply => ({
          id: reply.id,
          user: reply.account?.fullName || reply.account?.username || 'Ẩn danh',
          userSrc: reply.account?.avatarUrl || reply.account?.avatar || '/image/avata.jpg',
          text: reply.content,
          createdAt: reply.createdAt,
          time: formatVietnameseTime(reply.createdAt)
        }))
      }))
    } catch (e) {
      console.error(`❌ Không thể lấy comment cho post ${post.postId}:`, e);
    }
    showCommentModal.value = true;
  }
}
function addComment(post) {
  if (!newComment.value.trim()) return;
  if (!Array.isArray(post.commentsList)) post.commentsList = [];
  post.commentsList.push({
    id: `cmt${Date.now()}`,
    user: user.value.name,
    userSrc: user.value.avatar,
    text: newComment.value,
    time: 'Vừa xong',
    createdAt: new Date().toISOString(),
    replies: []
  });
  newComment.value = '';
  showNotification('Bình luận đã được thêm!', 'success');
}

function editPost(postId) {
  const post = posts.value.find(p => p.id === postId);
  if (post) {
    editPostForm.value.postId = postId;
    editPostForm.value.content = post.text;
    showEditPostModal.value = true;
    togglePostMenu(null);
  }
}

function savePostEdit() {
  const post = posts.value.find(p => p.id === editPostForm.value.postId);
  if (post) {
    post.text = editPostForm.value.content;
    showNotification('Bài viết đã được cập nhật!', 'success');
  }
  showEditPostModal.value = false;
  editPostForm.value.postId = null;
  editPostForm.value.content = '';
}

function cancelPostEdit() {
  showEditPostModal.value = false;
  editPostForm.value.postId = null;
  editPostForm.value.content = '';
}

function showNotification(message, type = 'info') {
  const id = Date.now();
  notifications.value.push({ id, message, type });
  setTimeout(() => {
    removeNotification(id);
  }, 5000);
}

function removeNotification(id) {
  notifications.value = notifications.value.filter(n => n.id !== id);
}

function toggleSharePopup() {
  showSharePopup.value = !showSharePopup.value;
}

function shareNow() {
  console.log('Chia sẻ:', shareText.value, 'Privacy:', privacySetting.value);
  showNotification('Bài viết đã được chia sẻ!', 'success');
  toggleSharePopup();
}

function onReport(reason) {
  console.log('Báo cáo vì:', reason);
  showNotification('Báo cáo đã được gửi!', 'success');
}

onMounted(async () => {
  await loadUserProfile();

  const accountId = route.params.id || JSON.parse(localStorage.getItem('user') || '{}')?.id;


  if (!accountId) {
    console.error('❌ Không tìm thấy accountId trong localStorage');
    showNotification('Vui lòng đăng nhập lại!', 'error');
    return;
  }

  try {
    const postsData = await getPostsByAccountId(accountId);
    console.log('✅ Danh sách bài viết từ API:', postsData);

    const mappedPosts = await Promise.all(
      postsData.map(async post => {
        let commentsList = [];
        try {
          const res = await getCommentsByPostId(post.postId);
          const comments = Array.isArray(res) ? res : res.comments || [];

          const commentMap = {};
          const repliesMap = {};

          for (const cmt of comments) {
            const acc = cmt.account || {};
            const fullName = acc.fullName || acc.username || 'Ẩn danh';
            const avatarUrl = acc.avatarUrl || acc.avatar || '/image/avata.jpg';

            const commentData = {
              id: cmt.id,
              user: fullName,
              userSrc: avatarUrl,
              text: cmt.content,
              createdAt: cmt.createdAt,
              replyToCommentId: cmt.replyToCommentId || null,
              replies: []
            };

            if (!commentData.replyToCommentId) {
              commentMap[commentData.id] = commentData;
            } else {
              if (!repliesMap[commentData.replyToCommentId]) {
                repliesMap[commentData.replyToCommentId] = [];
              }
              repliesMap[commentData.replyToCommentId].push(commentData);
            }
          }

          for (const parentId in repliesMap) {
            if (commentMap[parentId]) {
              commentMap[parentId].replies = repliesMap[parentId];
            }
          }

          commentsList = Object.values(commentMap);
        } catch (e) {
          console.error(`❌ Không thể lấy comment cho post ${post.postId}:`, e);
        }

        return {
          id: post.postId,
          postId: post.postId,
          user: user.value.name,
          userSrc: user.value.avatar,
          time: formatVietnameseTime(post.createdAt),
          text: post.content,
          img: post.postMedias?.[0]?.mediaUrl || '',
          likes: post.likeAmount || 0,
          commentsList,
          postLikes: post.listLike || [],
          liked: post.listLike?.some(like => like.accountId === accountId),
          images: post.postMedias?.map(m => m.mediaUrl) || []
        };
      })
    );

    posts.value = mappedPosts;
    console.log('✅ posts sau khi map:', posts.value);
  } catch (err) {
    console.error('❌ Không thể tải danh sách bài viết:', err);
    showNotification('Không thể tải danh sách bài viết!', 'error');
  }

  if (!document.querySelector('script[src*="font-awesome"]')) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js';
    document.head.appendChild(script);
  }
});

</script>

<style scoped>
:root {
  --bg-page: #FFF8F0;
  --bg-main: #FFF8F0;
  --bg-search: #FFFFFF;
  --bg-composer: #FAEBD7;
  --bg-post: #FFF8F0;
  --bg-sidebar: #FFF8F0;
  --divider: #D9D9D9;
  --text: #141414;
  --subtext: #888888;
  --accent: #FAEBD7;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.lopet-app-new {
  background-color: var(--bg-page);
  min-height: 100vh;
  position: relative;
}

/* Search Box */
.search-box {
  display: flex;
  align-items: center;
  background: #EDEBEB;
  border: 1px solid #000;
  border-radius: 8px;
  padding: 4px 8px;
  width: 100%;
  max-width: 600px;
  margin: 10px auto;
}

.search-box .material-icons {
  font-size: 20px;
  color: #888;
  margin-right: 6px;
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  flex: 1;
  padding: 6px;
  font-size: 14px;
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
  padding: 8px 12px;
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

.notification.error {
  background-color: #ff6b6b;
}

.close-notification {
  background: none;
  border: none;
  color: black;
  font-size: 16px;
  cursor: pointer;
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
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: 15px;
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

.confirm-modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px
}

.confirm-button,
.cancel-button {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
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
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 10px auto;
  background-size: cover;
  background-position: center;
}

.banner-preview {
  width: 100%;
  height: 120px;
  border-radius: 8px;
  margin: 10px 0;
  background-size: cover;
  background-position: center;
}

/* Profile Section */
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  background-color: #FAEBD7;
}

.profile-banner {
  height: 400px;
  overflow: hidden;
  background-color: #f0f2f5;
  background-size: cover;
  background-position: center;
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
  width: 100px;
  height: 100px;
  background-color: #e4e6eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  background-size: cover;
  background-position: center;
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
  padding-right: 100px;
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

.edit-profile-button {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  padding: 8px 12px;
  background-color: #fad989;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  color: #333;
  font-size: 14px;
  margin-top: -16px;
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
  padding: 8px 15px;
  text-decoration: none;
  color: #65676b;
  font-weight: 600;
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

/* Profile Content */
.profile-content {
  display: flex;
  padding: 15px;
  flex-direction: row;
  background-color: #F9F9F9;
  gap: 15px;
}

.sidebar {
  flex: 0 0 320px;
  position: sticky;
  top: 10px;
  height: fit-content;
  z-index: 10;
}

.intro-section {
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
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

.intro-list li img {
  margin-right: 10px;
  width: 20px;
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
  font-size: 14px;
}

.edit-button:hover {
  background-color: #f8d070;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 16px;       /* Tăng khoảng cách giữa các nhóm form */
  padding: 16px;   /* Padding xung quanh form */
  background-color: #fff; /* (tuỳ chọn) để dễ nhìn */
  border-radius: 8px;     /* (tuỳ chọn) bo góc */
}

.form-group {
  display: flex;
  flex-direction: column;
  padding: 8px 12px; /* Padding trong mỗi ô input group */
 
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
  text-align: left;
}
.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  background-color: #f9f9f9;
  transition: border-color 0.3s, background-color 0.3s;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

.form-input:focus {
  border-color: #ff6b01;
  background-color: #fff;
  box-shadow: 0 0 0 2px rgba(255, 107, 1, 0.2);
}

.form-input:hover {
  background-color: #f0f0f0;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.save-button,
.cancel-button {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
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
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ====== Post Card & Header ====== */
.post-card {
  margin: 16px auto;         /* căn giữa, zoom trên desktop */
  max-width: 600px;          /* giới hạn chiều rộng */
  padding: 16px;             /* khoảng cách đều xung quanh */
  border-radius: 12px;       /* bo góc mềm mại */
  background: #FFF;          /* nền trắng */
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  /* bỏ border dày nếu có */
  border: none;
}

.post-header {
  display: flex;
  align-items: center;
  gap: 12px;                 /* avatar ↔ info */
  padding-bottom: 12px;      /* tách header/content */
  border-bottom: 1px solid #EEE;
  margin-bottom: 12px;
  position: relative;        /* để menu absolute */
}

.post-header .avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  /* bỏ margin rời rạc */
}

.post-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 16px;
  font-weight: 600;
  color: #141414;
}

.time {
  font-size: 12px;
  color: #888;
}

/* nút ... */
.post-header-actions {
  margin-left: auto;
}

.btn-icon {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  margin-left: 8px;
}

.post-header-actions .btn-icon {
  padding: 4px;
  border-radius: 4px;
  transition: background .2s;
}

.post-header-actions .btn-icon:hover {
  background: rgba(0,0,0,0.05);
}

/* Responsive: mobile nhỏ hơn 600px */
@media (max-width: 600px) {
  .post-card {
    padding: 12px;
    margin: 12px 8px;
  }
  .post-header .avatar {
    width: 40px;
    height: 40px;
  }
  .username { font-size: 14px; }
  .time     { font-size: 11px; }
}
.btn-icon i {
  font-size: 18px;
  color: var(--text);
}

.post-menu {
  position: absolute;
  top: -12px;
  right: 40px;
  background: var(--bg-post);
  border: 1px solid var(--divider);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.post-menu ul {
  list-style: none;
  margin: 0px 0;
  padding: 0px 0;
}

.post-menu li {
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
}

.post-menu li:hover {
  background: rgba(0, 0, 0, 0.05);
}

.post-content {
  margin-bottom: 15px;
  margin-left: -3px;
}

.post-content p {
  margin-bottom: 8px;
  color: var(--text);
  margin-top: -12px;
  margin-left: 20px;
  font-size: 16px;
}

.post-image-wrapper {
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 500px;
  overflow: hidden;
  border-radius: 10px;
}

.post-image-wrapper img {
  max-width: 100%;
  max-height: 380px;
  width: auto;
  height: auto;
  display: block;
  object-fit: contain;
  margin-top: 8px;
  margin-inline: auto;
}

.post-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
}

.post-actions .count {
  margin: 0 1px 0 1px;
  font-size: 20px;
}

.post-actions i {
  font-size: 18px;
  cursor: pointer;
  color: var(--text);
  margin-top: 10px;
}

.post-actions p {
  font-size: 18px;
  cursor: pointer;
  color: var(--text);
  margin-top: 10px;
}

/* .post-actions {
  font-size: 50px;
} */


/* .post-actions .icon-img,
.post-actions .icon-img-like,
.post-actions .icon-img-share {
  width: 20px;
  height: 20px;
  object-fit: contain;
  margin-bottom: 8px;
}

.icon-img-share {
  margin-left: 700px;
} */

.icon-img {
  width: 20px;
  height: 20px;
  object-fit: contain;
  margin-bottom: 8px;
}

.icon-img-like {
  width: 20px;
  height: 20px;
  object-fit: contain;
  margin-bottom: 10px;
}

.icon-img-share {
  width: 20px;
  height: 20px;
  object-fit: contain;
  margin-bottom: 8px;
  margin-left:430px;
}

.count {
  font-size: 13px;
  color: var(--text);
  margin-bottom: 8px;
}

.post-comment {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}
/* No posts message */
.no-posts-message {
  padding: 20px;
  text-align: center;
  font-size: 18px;
  color: #666;
  font-weight: 600;
}

.post-comment input {
  width: 98%;
  height: 36px;
  padding: 8px 12px;
  border: 1.5px solid #000000;
  border-radius: 8px;
  font-size: 14px;
  color: #000000;
  margin-top: -2px;
}

.post-comment button {
  width: 40px;                /* fixed square */
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 9px;
  background-color: #009DFF;  /* your blue */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 0 0 0 0;
}

.post-comment button img,
.post-comment button svg {
  width: 20px;
  height: 20px;
}

.btn-send {
  padding: 6px 12px;
  background: #009DFF;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin-top: -4px;
}

.btn-send:hover {
  background: #007ACC;
}

/* .comment-list {
  margin-top: 8px;
}

.comment-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}

.comment-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 5px;
}

.comment-bubble {
  background-color: #f0f2f5;
  padding: 8px 12px;
  border-radius: 18px;
  max-width: 500px;
  font-size: 14px;
  line-height: 1.4;
}

.comment-username {
  font-weight: 600;
  margin-right: 4px;
}

.comment-text {
  color: #050505;
  margin-top : 10px; 
}

.comment-time {
  font-size: 12px;
  color: #65676b;
  margin-top: 4px;
  margin-left: 5px;
} */

/* Comment Modal */
.comment-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.comment-modal {
  width: 600px;
  max-height: 80vh;
  background: #FFF;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
.post-media-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
}

.post-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
}

.post-video {
  width: 400px;
  max-height: 400px;
}
.comment-modal-gallery img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-modal-list .comment-body {
  flex: 1;
}

.comment-modal-list .main-comment {
  background: #f0f2f5;
  border-radius: 20px;
  padding: 5px 10px;
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

.comment-modal-footer {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #eee;
}

.comment-modal-footer .comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
}

.comment-modal-footer input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 999px;
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
.nav-icon {
  margin-right: 10px; /* Khoảng cách giữa icon và text */
  width: 20px; 
  height: 20px;
}
.reply-section {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.reply-section input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
}

.reply-section button {
  background: #009dff;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 6px 14px;
  cursor: pointer;
}

.reply-item {
  display: flex;
  align-items: flex-start;
  margin-top: 4px;
}

.reply-item .comment-body {
  display: flex;
  flex-direction: column;
  border-radius: 18px;
  font-size: 14px;
  max-width: 400px;
  word-wrap: break-word;
}

.reply-item .comment-username {
  font-weight: 600;
  margin-right: 4px;
}

.reply-item .comment-text {
  display: inline;
  color: #050505;
}

.reply-item .comment-time {
  font-size: 12px;
  color: #65676b;
  display: block;
  margin-top: 4px;
}

.btn-reply-modal {
  background: transparent;
  border: none;
  color: #1877f2;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  font-weight: 500;
 padding-left: 10px;
}

/* Share Modal */
.share-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.share-modal {
  width: 360px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.share-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.share-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.share-body {
  padding: 16px;
}

.share-user {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.share-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
}

.share-user-info {
  flex: 1;
}

.share-name {
  font-weight: 600;
  display: block;
}

.privacy-dropdown {
  position: relative;
  margin-top: 4px;
}

.privacy-dropdown button {
  background: #eee;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
}

.privacy-options {
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 4px;
  list-style: none;
  padding: 4px 0;
  width: 100%;
}

.privacy-options li {
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.9rem;
}

.privacy-options li:hover {
  background: #f5f5f5;
}

.share-input {
  width: 100%;
  min-height: 80px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  resize: vertical;
  font-size: 0.95rem;
}

.share-footer {
  padding: 12px 16px;
  border-top: 1px solid #eee;
  text-align: right;
}

.btn-share-now {
  background: #1877F2;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
}

.btn-share-now:hover {
  background: #155db2;
}

/* Delete Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.delete-modal {
  width: 360px;
  background: #FFF8F0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #FAEBD7;
}

.modal-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.close-modal {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

.modal-body {
  padding: 12px 16px;
}

.modal-title {
  font-weight: 600;
  margin-bottom: 8px;
}

.modal-text {
  font-size: 0.85rem;
  line-height: 1.4;
  color: #333;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 16px;
  background: #FFEDD5;
}

.btn-confirm,
.btn-cancel {
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn-confirm {
  background: #FFCC80;
}

.btn-cancel {
  background: #FFE0B2;
}

/* Delete Banner */
.btn-delete-avatar,
.btn-delete-banner {
  margin-top: 8px;
  padding: 6px 12px;
  background-color: #f5ae52;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
}

.btn-delete-banner:hover {
  background-color: #c4c3c3;
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.toggle-expand-btn {
  background: none;
  border: none;
  color: #A9A9A9;
  cursor: pointer;
  font-size: 14px;
  margin-top: 4px;
  margin-left: 20px;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .profile-content {
    flex-direction: row;
  }

  .sidebar {
    flex: 0 0 280px;
  }

  .post-image-wrapper img {
    max-height: 320px;
  }

  .comment-modal {
    width: 90%;
  }
}

@media (max-width: 768px) {
  .search-box {
    margin: 10px 15px;
    max-width: 100%;
  }

  .profile-content {
    flex-direction: column;
  }

  .sidebar {
    flex: 1;
    position: static;
  }

  .notification-container {
    width: 90%;
    right: 50%;
    transform: translateX(50%);
  }

  .confirm-modal-content {
    width: 95%;
    padding: 12px;
  }

  .profile-banner {
    height: 220px;
  }

  .profile-avatar {
    width: 90px;
    height: 90px;
  }

  .post-card {
    padding: 8px;
  }

  .post-header .avatar {
    width: 36px;
    height: 36px;
  }

  .username {
    font-size: 16px;
  }

  .time {
    font-size: 14px;
  }

  .post-image-wrapper img {
    max-height: 320px;
  }

  .post-content p {
    font-size: 14px;
  }

  .comment-modal {
    width: 95%;
  }

  .icon-img-share {
    margin-left: auto;
  }
}

@media (max-width: 480px) {
  .search-box {
    margin: 8px 10px;
  }

  .profile-banner {
    height: 180px;
  }

  .profile-avatar {
    width: 80px;
    height: 80px;
    margin-top: -40px;
  }

  .profile-name {
    font-size: 18px;
  }

  .profile-stats {
    font-size: 12px;
  }

  .nav-item {
    padding: 6px 10px;
    font-size: 12px;
  }

  .intro-section {
    padding: 10px;
  }

  .intro-section h3 {
    font-size: 14px;
  }

  .intro-list li {
    font-size: 12px;
  }

  .edit-button {
    padding: 6px;
    font-size: 12px;
  }

  .form-group label {
    font-size: 12px;
  }

  .form-input {
    padding: 6px;
    font-size: 12px;
  }

  .save-button,
  .cancel-button {
    padding: 6px;
    font-size: 12px;
  }

  .post-header .avatar {
    width: 32px;
    height: 32px;
  }

  .username {
    font-size: 14px;
  }

  .time {
    font-size: 12px;
  }

  .post-image-wrapper img {
    max-height: 280px;
  }

  .post-content p {
    font-size: 13px;
  }

  .post-stats {
    font-size: 12px;
  }
}

.custom-file-input {
  position: relative;
  width: fit-content;
  margin-top: 6px;
}

.custom-file-input input[type="file"] {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.custom-file-label {
  display: inline-block;
  background-color: #f5ae52;
  color: #fff;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* .custom-file-label:hover {
  background-color: #e6e6e6;
} */

/* ========== Comment-list trên trang chính (giống modal) ========== */
.comment-list {
  margin-top: 8px;
  padding: 0;
}

.comment-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.comment-bubble {
 background: #f0f2f5;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    padding: 5px 10px;
}

.comment-username {
  font-weight: 600;
  font-size: 14px;
  color: #141414;
  margin-right: 4px;
}

.comment-text {
  font-size: 14px;
  color: #050505;
  line-height: 1.4;
}

.comment-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #65676b;
  margin-left: 4px; /* lùi nhẹ để canh dưới khung bubble */
}

.comment-time {
  /* nếu bạn muốn định dạng “Vừa xong” */
}

.comment-reply {
  color: #1877F2;
  cursor: pointer;
}

.comment-reply:hover {
  text-decoration: underline;
}
</style>
