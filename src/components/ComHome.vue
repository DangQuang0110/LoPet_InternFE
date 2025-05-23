<template>
  <div class="app-wrapper">
    <div class="main">
      <!-- Search -->
      <header class="topbar">
        <div class="search-box">
          <span class="material-icons">search</span>
          <input
            v-model="search"
            type="text"
            placeholder="Tìm kiếm"
          />
        </div>
        <transition name="fade">
  <div v-if="showDeleteConfirm" class="modal-overlay">
    <div class="delete-modal">
      <div class="modal-header">
        <h3>Bạn có muốn ẩn bài viết này không</h3>
        <button class="close-modal" @click="cancelDelete">&times;</button>
      </div>
      <div class="modal-body">
        <p class="modal-title">Bạn có muốn ẩn bài viết này hay không?</p>
        <p class="modal-text">
          Khi bạn ẩn bài viết này thì nó sẽ không còn xuất hiện trong danh sách bài viết mà bạn được xem nữa.
        </p>
      </div>
      <div class="modal-actions">
        <button class="btn-confirm" @click="performDelete">Xác nhận</button>
        <button class="btn-cancel" @click="cancelDelete">Hủy</button>
      </div>
    </div>
  </div>
</transition>
      </header>

      <!-- Stories -->
      <!-- <div class="stories">
        <div class="story" v-for="(u, index) in stories" :key="u.name">
          <div class="story-wrapper">
            <img
              :src="u.src"
              :alt="u.name"
              :class="{ 'first-story': index === 0 }"
            />
            <span v-if="index === 0" class="add-story">+</span>
          </div>
          <span>{{ u.name }}</span>
        </div>
      </div> -->

      <!-- Composer -->
     <div class="composer" @click="showCreate = true">
          <img
            class="composer-avatar"
            src="/assets/quang.jpg"
            alt="User Avatar"
          />
          <div class="composer-body">
            <input
              v-model="composeText"
              type="text"
              placeholder="Hôm nay, bạn nghĩ gì thế Quang Dang?"
              class="composer-input"
              readonly
            />
            <i class="fas fa-camera composer-camera"></i>
          </div>
        </div>

      <!-- Feed -->
      <div class="content">
        <div class="feed">
          <div class="post-card" v-for="post in posts" :key="post.id">
            <!-- Header -->
            <div class="post-header">
              <img
                :src="post.userSrc"
                alt="avatar"
                class="avatar"
              />
              <div class="post-info">
                <span class="username">{{ post.user }}</span>
                <small class="time">{{ post.time }}</small>
              </div>
              <div class="post-header-actions">
                <!-- Report button -->
               
                <!-- Alert chat button -->
                <button class="btn-icon comment-alert-btn" @click.stop="showReport = true">
                    <span class="icon-alert">
                      <i class="far fa-comment"></i>
                      <!-- dấu chấm than nằm chính giữa bong bóng -->
                      <i class="fas fa-exclamation comment-alert-icon"></i>
                    </span>
                  </button>
                <!-- Close post button -->
                <button class="btn-icon close-btn" @click="confirmDelete(post.id)">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="post-content">
              <p>{{ post.text }}</p>
              <img v-if="post.img" :src="post.img" alt="" />
            </div>

            <!-- Actions -->
          <div class="post-actions">
                            <button class="btn-icon like-btn" @click="toggleLike(post)">
                <i :class="post.liked ? 'fas fa-heart liked' : 'far fa-heart'"></i>
              </button>
              <p class="count">{{ post.likes + (post.liked ? 1 : 0) }}</p>

              <i class="far fa-comment"></i><p>8</p>
              <!-- thêm class share-icon -->
              <i class="fas fa-share share-icon"></i>
            </div>

            <!-- Stats -->
            <div class="post-stats">
              <a href="#" @click.prevent="openComments(post)">Xem thêm bình luận</a>
            </div>

            <!-- Comment Input -->
            <div class="post-comment">
              <input type="text" placeholder="Bình luận..." />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Suggestions -->
    <aside class="suggestions">
      <div class="ads">
        <h3>Quảng cáo</h3>
        <div class="ad-list">
          <div class="ad-card">
            <img src="/assets/ad1.png" alt="Trà sữa Toyo" />
            <div class="ad-info">
              <h4 class="ad-title">Trà sữa Toyo</h4>
              <p class="ad-desc">Trà sữa thơm ngon bổ dưỡng</p>
              <span class="ad-domain">toto.com.vn</span>
            </div>
          </div>
          <div class="ad-card">
            <img src="/assets/ad2.jpg" alt="Free FPS game" />
            <div class="ad-info">
              <h4 class="ad-title">Free FPS game</h4>
              <p class="ad-desc">Best FPS game ever</p>
              <span class="ad-domain">fps.com.vn</span>
            </div>
          </div>
          <div class="ad-card">
            <img src="/assets/ad3.jpg" alt="Best Movie" />
            <div class="ad-info">
              <h4 class="ad-title">Best Movie</h4>
              <p class="ad-desc">Best movie</p>
              <span class="ad-domain">movie.com.vn</span>
            </div>
          </div>
        </div>
      </div>

      <hr />

      <h3>Gợi ý cho bạn</h3>
      <ul class="suggestion-list">
        <li
          v-for="s in suggestions"
          :key="s.name"
          class="suggestion-card"
        >
          <img :src="s.src" alt="" />
          <div class="info">
            <span class="name">{{ s.name }}</span>
            <small>Gợi ý cho bạn</small>
          </div>
          <div class="actions">
            <button class="btn-add">Thêm</button>
            <button class="btn-remove">Xóa</button>
          </div>
        </li>
      </ul>
    </aside>


    
    <!-- CreatePost Modal -->
    <CreatePost v-if="showCreate" @close="showCreate = false" />
    <!-- ReportModal -->
    <ReportModal v-if="showReport" @close="showReport = false" @report="onReport" />

    <!-- Comments Modal --> 
     <transition name="fade">
      <div v-if="showCommentsModal" class="comments-overlay">
        <div class="comments-modal">
          <div class="comments-header">
            <h3>Bài viết của {{ selectedPost.user }}</h3>
            <button class="close-comments" @click="closeComments">&times;</button>
          </div>
          <div class="comments-body">
            <div
              v-for="comment in selectedPost.commentsList"
              :key="comment.id"
              class="comment-item"
            >
              <img :src="comment.userSrc" class="comment-avatar" />
              <div class="comment-content">
                <span class="comment-username">{{ comment.user }}</span>
                <p class="comment-text">{{ comment.text }}</p>
                <span class="comment-time">{{ comment.time }}</span>
              </div>
            </div>
          </div>
          <div class="comments-footer">
            <input
              v-model="newComment"
              type="text"
              placeholder="Viết bình luận..."
            />
            <button class="btn-send" @click="addComment">Gửi</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CreatePost from '@/components/CreatePost.vue'
import ReportModal from '@/components/ReportModal.vue'

const search = ref('')
const showCreate = ref(false)
const showReport = ref(false)
const composeText = ref('')
const showDeleteConfirm = ref(false)
const deleteTargetId    = ref(null)



const stories = [
  { name: 'Phong', src: '/assets/phem.jpg' },
  { name: 'Nhân', src: '/assets/nhân.jpg' },
  { name: 'Cầu', src: '/assets/cầu.jpg' },
  { name: 'Vũ', src: '/assets/vũ.jpg' },
  { name: 'Trường', src: '/assets/trường.jpg' },
]

const posts = ref([
  
   {
    id: 1,
    user: 'Cầu', userSrc: '/assets/cầu.jpg', time: '7 tháng 5 lúc 15:48', text: 'Mình cần tìm giống chó này', img: '/assets/pngtree-five-dogs-and-a-cat-together-on-a-black-background-image_2699926.jpg', likes: 120, liked: false,
    commentsList: [
      { id: 11, user: 'Minh', userSrc: '/assets/phem.jpg', text: 'Đẹp quá!', time: '2 giờ trước' },
      { id: 12, user: 'Trường', userSrc: 'public/assets/trường.jpg', text: 'Bạn mua ở đâu?', time: '1 giờ trước' }
    ]
  },
  { 
    id: 2,
    user: 'Phong', userSrc: '/assets/phem.jpg', time: '7 tháng 5 lúc 15:48', text: 'Mình cần tìm giống chó này', img: '/assets/pngtree-five-dogs-and-a-cat-together-on-a-black-background-image_2699926.jpg', likes: 120, liked: false,
    commentsList: [
      { id: 21, user: 'Minh', userSrc: '/assets/phem.jpg', text: 'Đẹp quá!', time: '2 giờ trước' },
      { id: 22, user: 'Vũ', userSrc: '/assets/phem.jpg', text: 'Bạn mua ở đâu?', time: '1 giờ trước' }
    ]
  }
])

const suggestions = [
  { name: 'Skibidi', src: '/assets/phem.jpg' },
  { name: 'Conan', src: '/assets/phem.jpg' },
  { name: 'Shinichi', src: '/assets/phem.jpg' },
  { name: 'Sakura', src: '/assets/phem.jpg' },
]

function removePost(id) {
  const idx = posts.findIndex(p => p.id === id)
  if (idx !== -1) posts.splice(idx, 1)
}

function toggleLike(post) {
  post.liked = !post.liked
}



// Comments modal
const showCommentsModal = ref(false)
const selectedPost = ref({ commentsList: [] })
const newComment = ref('')
function openComments(post) {
  selectedPost.value = post
  showCommentsModal.value = true
}

function closeComments() {
  showCommentsModal.value = false
  selectedPost.value = { commentsList: [] }
  newComment.value = ''
}

function addComment() {
  if (!newComment.value.trim()) return
  selectedPost.value.commentsList.push({ id: Date.now(), user: currentUser, userSrc: '/assets/quang.jpg', text: newComment.value, time: 'Vừa xong' })
  newComment.value = ''
}

function onReport(reason) {
  console.log('Báo cáo vì:', reason)
  
}

function confirmDelete(id) {
  deleteTargetId.value    = id
  showDeleteConfirm.value = true
}


function performDelete() {
  const idx = posts.value.findIndex(p => p.id === deleteTargetId.value)
  if (idx !== -1) posts.value.splice(idx, 1)
  showDeleteConfirm.value = false
  deleteTargetId.value    = null
}

function cancelDelete() {
  showDeleteConfirm.value = false
  deleteTargetId.value    = null
}


</script>

<style scoped>
:root {
  --bg-page: #FFF8F0;
  --bg-main: #FFF8F0;
  --bg-search: #FFFFFF;
  --bg-stories: #FFFFFF;
  --bg-composer: #FAEBD7;
  --bg-post: #FFF8F0;
  --bg-sidebar: #FFF8F0;
  --divider: #D9D9D9;
  --text: #141414;
  --subtext: #888888;
  --accent: #FAEBD7;
}

/* RESET */
* {
  margin: 3px;
  padding: 0;
  box-sizing: border-box;
}
body,
html,
#app {
  height: 100%;
  font-family: sans-serif;
}

/* LAYOUT */
.app-wrapper {
  display: flex;
  height: 100vh;
  background: var(--bg-page);
  overflow: hidden;
}
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-main);
  padding: 100px;  
  padding-top: 0%;
  overflow-y: auto;
}
.suggestions {
  width: 280px;
  background: var(--bg-sidebar);
  padding: 16px;
  border-left: 1px solid var(--divider);
  overflow-y: auto;
}

/* SEARCH BAR */
.topbar {
  padding: 8px 16px;
}
.search-box {
  display: flex;
  align-items: center;
  background: #FAEBD7;
  border: 1px solid #000;
  border-radius: 8px;
  padding: 4px 8px;

  /* MỞ RỘNG PHẦN TÌM KIẾM */
  width: 100%;        /* chiếm hết khung cha */
  max-width: 600px;   /* hoặc chỉnh thành bất kỳ giá trị nào bạn muốn */
  margin: 0 auto;     /* căn giữa trên màn hình */
}

.search-box .material-icons {
  font-size: 20px;
  color: #888;
  margin-right: 6px;
}

.search-box input {
  flex: 1;
  border: none;
  background-color: transparent; /* giữ nền bằng search-box */
  outline: none;
  font-size: 14px;
  color: #333;
}
/* STORIES */
.stories {
  display: flex;
  gap: 12px;
  padding: 16px 0;      /* giảm padding dọc để gọn hơn */
  border-radius: 8px;
  margin-bottom: 16px;
  align-items: center;
  overflow: visible;    /* bỏ cuộn ngang */
  flex-wrap: wrap;      /* cho phép xuống dòng nếu quá nhiều item */
}

.story img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  padding: 2px;
  background: #fff;
}
.story img.first-story {
  border: 2px solid #040404;
}
.story img:not(.first-story) {
  border: 2px solid #FF0000;
}
.story-wrapper {
  position: relative;

}

/* chiếc nút “+” nhỏ ở góc */
.add-story {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  background-color: #1DA1F2;    /* xanh dương như mockup */
  border: 2px solid #000000;       /* viền trắng */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;              /* size dấu “+” */
  box-shadow: 0 0 2px rgba(0,0,0,0.2);
}



/* COMPOSER */
/* COMPOSER */
.composer {
  display: flex;
  width: 99%;
  align-items: flex-start;
  background: var(--bg-composer); /* #FAEBD7 */
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;      
  background-color: #FAEBD7;          /* click bất kỳ mở popup */
}

.composer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
}

.composer-body {
  flex: 1;
  display: flex;
  flex-direction: column;         /* xếp dọc */
  gap: 8px;                       /* khoảng cách giữa input & icon */
}

/* input “bong bóng” */
.composer-input {
  width: 100%;
  height: 36px;
  background: #FFF;
  border: none;
  border-radius: 18px;            /* bo tròn giống pill */
  padding: 8px 12px;
  font-size: 14px;
  color: var(--subtext);
  outline: none;
  cursor: pointer;                /* nhấn anywhere để mở */
}

/* icon camera bên dưới */
.composer-camera {
  font-size: 20px;
  color: var(--text);
  /* căn sang trái ngay dưới input */
  margin-left: 0;
  cursor: pointer;
}
/* FEED */
.feed {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  
}
.post-card {
  background: #FAEBD7;
  border: 0px solid #FAEBD7;
  border-radius: 12px;
  overflow: hidden;           /* ← bo góc cả card */
  
}
.post-header {
  display: flex;
  align-items: flex-start;
  padding-bottom: 12px;
}
.post-header .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
}
/* nút chứa alert */
.comment-alert-btn {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}

/* wrapper để overlay */
.icon-alert {
  position: relative;
  display: inline-block;
}

/* bong bóng chat */
.icon-alert .fa-comment {
  font-size: 20px;
  color: var(--text);
}

/* dấu chấm than đặt chính giữa */
.icon-alert .fa-exclamation {
  position: absolute;
  top: 43%;
  left: 40%;
  transform: translate(-50%, -60%);
  font-size: 10px;
  color: var(--text);
}



.post-info {
  display: flex;
  flex-direction: column;
}
.username {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}
.time {
  font-size: 12px;
  color: var(--subtext);
  margin-top: 2px;
}
.post-header-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-icon {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.comment-btn {
  border: 1px solid var(--text);
  border-radius: 6px;
  padding: 6px;
}
.btn-icon i {
  font-size: 18px;
  color: var(--text);
}
.post-content p {
  margin-bottom: 8px;
  color: var(--text);
}
.post-content img {
  width: 100%;
  
  margin-top: 8px;
}
.post-actions {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-top: 1px solid var(--divider);
  border-bottom: 1px solid var(--divider);
}

.post-actions i {
  font-size: 18px;
  cursor: pointer;
  color: var(--text);
}

/* đẩy icon Share ra tận bên phải */
.post-actions .share-icon {
  margin-left: auto;
}

.post-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 12px;
}
.post-stats .likes {
  font-weight: 500;
  color: var(--text);
}
.post-stats a {
  color: #6a0dad;
  text-decoration: none;
  font-size: 13px;
}
.post-comment input {
  width: 98%;
  height: 36px;
  padding: 8px 12px;
  border: 1px solid var(--divider);
  border-radius: 8px;
  font-size: 14px;
  color: var(--text);
}

/* ADS & SUGGESTIONS */
.ads h3,
.suggestions h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text);
}
.ad-list,
.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ad-card,
.suggestion-card {
  display: flex;
  gap: 12px;
  padding: 8px;
}
.ad-card img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}
.ad-info .ad-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text);
}
.ad-info .ad-desc {
  font-size: 12px;
  margin-bottom: 2px;
  color: var(--subtext);
}
.ad-info .ad-domain {
  font-size: 11px;
  color: var(--subtext);
}
.suggestion-card img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--accent);
}
.suggestion-card .info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.suggestion-card .name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text);
}
.suggestion-card small {
  font-size: 12px;
  color: #000;
}
.suggestion-card .actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.suggestion-card button {
  padding: 6px 12px;
  font-size: 11px;
  border: none;
  border-radius: 12px;
  background: #FFE0B2;
  color: var(--text);
  cursor: pointer;
  white-space: nowrap;
}
.btn-remove {
  background: #FFE0B2;
}

/* Modal overlay (nếu cần override) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

/* Scrollbar */
.main::-webkit-scrollbar,
.suggestions::-webkit-scrollbar {
  width: 6px;
}
.main::-webkit-scrollbar-thumb,
.suggestions::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.1);
  border-radius: 3px;
} 
.liked {
  color: #e0245e;
}

/* overlay tối nền */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

/* container modal */
.delete-modal {
  width: 360px;
  background: #FFF8F0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  overflow: hidden;
}

/* header */
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

/* body */
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

/* actions */
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

/* simple fade */
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
/* Comments overlay */
.comments-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; justify-content: center; align-items: center; z-index: 2000; }
.comments-modal { width: 600px; max-height: 80vh; background: #FFF; border-radius: 8px; display: flex; flex-direction: column; overflow: hidden; }
.comments-header { padding: 16px; background: #FAEBD7; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #DDD; }
.comments-header h3 { margin: 0; font-size: 1.2rem; }
.close-comments { background: transparent; border: none; font-size: 1.5rem; cursor: pointer; }
.comments-body { flex: 1; padding: 16px; overflow-y: auto; }
.comment-item { display: flex; gap: 12px; margin-bottom: 12px; }
.comment-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
.comment-content { flex: 1; }
.comment-username { font-weight: 600; }
.comment-text { margin: 4px 0; }
.comment-time { font-size: 0.8rem; color: #666; }
.comments-footer { padding: 12px; border-top: 1px solid #DDD; display: flex; gap: 8px; }
.comments-footer input { flex: 1; padding: 8px; border: 1px solid #CCC; border-radius: 4px; }
.btn-send { padding: 8px 16px; background: #009DFF; color: #FFF; border: none; border-radius: 4px; cursor: pointer; }
/* Fade transition */
.fade-enter-active, .fade-leave-active { transition: opacity .2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

</style>
