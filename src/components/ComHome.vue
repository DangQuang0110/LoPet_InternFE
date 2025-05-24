<template>
  <Layout>
  <div class="app-wrapper">
    <div class="main">
      <!-- Search -->
      <header class="topbar">
        <div class="search-box-home">
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
        <h3>Bạn có muốn xoá bài viết này không</h3>
        <button class="close-modal" @click="cancelDelete">&times;</button>
      </div>
      <div class="modal-body">
        <p class="modal-title">Bạn có muốn xóa bài viết này hay không?</p>
        <p class="modal-text">
          Khi bạn xóa bài viết này thì nó sẽ không còn xuất hiện trong danh sách bài viết mà bạn được xem nữa.
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

      <!-- Composer -->
      <div class="composer" @click="showCreate = true">
        <img
          class="composer-avatar"
          :src="currentAvatar"
          alt="User Avatar"
        />
        <div class="composer-body">
          <input
            v-model="composeText"
            type="text"
            placeholder="Hôm nay, bạn nghĩ gì thế?"
            class="composer-input"
            readonly
          />
          <i class="fas fa-camera composer-camera"></i>
        </div>
      </div>
      <!-- Feed -->
      <div class="content">
        <div class="feed">
          <div class="post-card" v-for="post in posts" :key="post.postId">
            <div class="post-header">
              <img :src="post.userSrc" alt="avatar" class="avatar" />
              <div class="post-info">
                <span class="username">{{ post.user }}</span>
                <small class="time">{{ post.time }}</small>
              </div>
              <div class="post-header-actions">
              <button class="btn-icon menu-btn" @click.stop="togglePostMenu(post.id)">
                <i class="fas fa-ellipsis-v"></i>
              </button>
                  <div
      v-if="openedMenuPostId === post.id"
      class="post-menu"
      @click.stop
    >
      <ul>
        <li @click="showReport = true">Báo cáo bài viết</li>
        <!-- <li @click="confirmDelete(post.id)">Xóa bài viết</li> -->
      </ul>
    </div>
              </div>
            </div>

            <div class="post-content">
              <p>{{ post.text }}</p>
              <img v-if="post.img" :src="post.img" alt="" />
            </div>

            <div class="post-actions">  
              <button class="btn-icon like-btn" @click="toggleLike(post)">
                <i :class="post.liked ? 'fas fa-heart liked' : 'far fa-heart'"></i>
              </button>
              <p class="count">{{ post.likes + (post.liked ? 1 : 0) }}</p>
              <i class="far fa-comment"></i><p>8</p>
              <i class="fas fa-share share-icon"></i>
            </div>
            <div class="post-stats">
              <a href="#">Xem thêm bình luận</a>
            </div>
            <div class="post-comment">
              <input type="text" placeholder="Bình luận..." />
            </div>
          </div>
        </div>
      </div>
    </div>
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
        :key="s.id"
        class="suggestion-card"
      >
        <img :src="s.avatar || currentAvatar" alt="Avatar" />
        <div class="info">
          <span class="name">{{ s.username }}</span>
          <small>Gợi ý cho bạn</small>
        </div>
        <div class="actions">
          <button class="btn-add" @click="handleAddFriend(s.id)">Thêm</button>
          <button class="btn-remove" @click="handleHideSuggestion(s.id)">Xóa</button>
        </div>
      </li>
      </ul>
    </aside>

    <CreatePost v-if="showCreate" @close="showCreate = false" @post="fetchPosts" />
    <ReportModal v-if="showReport" @close="showReport = false" @report="onReport" />

  </div>
  </layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Layout from './Layout.vue'
import CreatePost from '@/components/CreatePost.vue'
import ReportModal from '@/components/ReportModal.vue'
import { getPosts } from '@/service/postService'
import { getAccountById } from '@/service/authService'
import { getSuggestedFriends, sendFriendRequest,getFriendList} from '@/service/friendService'

const search = ref('')
const showCreate = ref(false)
const showReport = ref(false)
const composeText = ref('')
const posts = ref([])
const currentAvatar = ref('/image/avata.jpg')
const suggestions = ref([])
const openedMenuPostId = ref(null)
const showDeleteConfirm = ref(false)
const deleteTargetId = ref(null)

function removePost(id) {
  const idx = posts.value.findIndex(p => p.postId === id)
  if (idx !== -1) posts.value.splice(idx, 1)
}

function togglePostMenu(id) {
  openedMenuPostId.value = openedMenuPostId.value === id ? null : id
}

function confirmDelete(id) {
  deleteTargetId.value = id
  showDeleteConfirm.value = true
}

function toggleLike(post) {
  post.liked = !post.liked
}

function onReport(reason) {
  console.log('Báo cáo vì:', reason)
}
async function fetchPosts() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) return

    // Lấy danh sách bạn bè
    const friendList = await getFriendList(user.id)
    const friendIds = friendList.map(friend => friend.id)

    const res = await getPosts()
    const postResults = []

    for (const post of res) {
      const authorId = post.accountId
      let username = 'Ẩn danh'

      if (post.accounts?.username) {
        username = post.accounts.username
      } else {
        const acc = await getAccountById(authorId)
        if (acc?.username) username = acc.username
      }
      if (authorId === user.id || friendIds.includes(authorId)) {
        postResults.push({
          postId: post.postId,
          user: username,
          userSrc: '/image/avata.jpg',
          time: new Date(post.createdAt).toLocaleString(),
          text: post.content,
          img: post.postMedias?.[0]?.mediaUrl || null,
          likes: post.likeAmount || 0,
          comments: 0,
          liked: false
        })
      }
    }

    posts.value = postResults
  } catch (err) {
    console.error('Không thể load bài viết:', err)
  }
}
async function addFriend(receiverId) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!user.id) return
  try {
    await sendFriendRequest(senderId, receiverId)
    suggestions.value = suggestions.value.filter(s => s.id !== receiverId)
  } catch (error) {
    console.error('Lỗi khi gửi lời mời kết bạn:', error)
  }
}

async function removeSuggestion(receiverId) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!user.id) return
  try {
    await deleteSuggestedFriend(user.id, receiverId)
    suggestions.value = suggestions.value.filter(s => s.id !== receiverId)
  } catch (error) {
    console.error('Lỗi khi xóa gợi ý bạn bè:', error)
  }
}

onMounted(async () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (user.id) {
    const acc = await getAccountById(user.id)
    if (acc?.avatar) currentAvatar.value = acc.avatar

    const suggest = await getSuggestedFriends(user.id, 4)
    suggestions.value = suggest
  }
})
function handleHideSuggestion(id) {
  suggestions.value = suggestions.value.filter(s => s.id !== id)
}

async function handleAddFriend(receiverId) {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) return

    await sendFriendRequest(user.id, receiverId)

    // Ẩn khỏi danh sách sau khi gửi
    suggestions.value = suggestions.value.filter(s => s.id !== receiverId)
  } catch (error) {
    console.error('Lỗi khi gửi lời mời:', error)
  }
}


onMounted(fetchPosts)
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
  padding: 100px 100px 0 100px;  
  padding-top: 0%;
  overflow-y: auto;
  margin-bottom :0;
}
.suggestions {
  width: 280px;
  background: var(--bg-sidebar);
  padding: 16px;
  border-left: 1px solid var(--divider);
  overflow-y: auto;
}

/* SEARCH BAR */
.topbar{
  padding-left:5px;
}
.search-box-home {
  display: flex;
  align-items: center;
  background: #FAEBD7;
  border: 1px solid #000;
  border-radius: 8px;
  padding: 4px 8px;
  width:710px;
  margin-right:10px;
}

.search-box-home .material-icons {
  font-size: 20px;
  color: #888;
  margin-right: 6px;
}

.search-box-home input {
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
  width: 97%;
  margin-left:10px;
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
.ad-card {
  display: flex;
  gap: 12px;
  padding: 8px;
}
.suggestion-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  gap: 12px;
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
  width: 90px; 
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  align-items: flex-end;
  flex-shrink: 0;
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
.post-header {
  position: relative;
}

.menu-btn i {
  font-size: 20px;
  color: var(--text);
}

.post-menu {
  position: absolute;
  top: 15%;
  right: 25px;
  background: var(--bg-post);
  border: 1px solid var(--divider);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 1000;
}

.post-menu ul {
  list-style: none;
  margin: 0;
  padding: 8px 0;
}

.post-menu li {
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
}

.post-menu li:hover {
  background: rgba(0,0,0,0.05);
}

</style>
