<template>
  <Layout>
    <div class="app-wrapper">
      <div class="main">
        <!-- Search -->
        <header class="topbar">
          <div class="search-box">
            <span class="material-icons">search</span>
            <input v-model="search" type="text" placeholder="Tìm kiếm..." />

          </div>
        <transition name="fade">
            <div v-if="showDeleteConfirm" class="modal-overlay">
              <div class="delete-modal">
                <div class="modal-header">
                  <h3>Bạn có muốn xoá bài viết này không</h3>
                  <button class="close-modal" @click="cancelDelete">&times;</button>
                </div>
                <div class="modal-body">
                  <!-- <p class="modal-title">Bạn có muốn xóa bài viết này hay không?</p> -->
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
          <img class="composer-avatar" :src="currentUserAvatar" alt="User Avatar" />
          <div class="composer-body">
            <input v-model="composeText" type="text" :placeholder="`Hôm nay, bạn nghĩ gì thế ${currentUserName}?`"
              class="composer-input" readonly />
            <i class="fas fa-camera composer-camera"></i>
          </div>
        </div>
        <!-- Feed -->
        <div class="content">
          <div class="feed">
          <div class="post-card" v-for="post in filteredPosts" :key="post.id">
              <!-- Header -->
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
                  <div v-if="openedMenuPostId === post.id" class="post-menu" @click.stop>
                    <ul>
                      <li @click="openReport(post)">Báo cáo bài viết</li>
                    </ul>
                  </div>
                </div>
              </div>
              <!-- Content -->
              <div class="post-content">
                <p>
                  <!-- Nếu nội dung quá dài và chưa mở rộng thì cắt ngắn -->
                  <span v-if="!expandedPosts[post.postId] && post.text.length > 200">
                    {{ post.text.slice(0, 200) }}...
                  </span>
                  <!-- Nếu mở rộng hoặc nội dung ngắn thì hiển thị toàn bộ -->
                  <span v-else>{{ post.text }}</span>
                </p>
                <!-- Nút xem thêm / thu gọn -->
                <button
                  v-if="post.text.length > 200"
                  class="toggle-expand-btn"
                  @click="toggleExpand(post.postId)"
                >
                  {{ expandedPosts[post.postId] ? 'Thu gọn' : 'Xem thêm' }}
                </button>

                <div class="post-media-wrapper" v-if="post.mediaUrl">
                  <template v-if="isVideo(post.mediaUrl)">
                    <video controls class="post-video">
                      <source :src="post.mediaUrl" type="video/mp4" />
                      Trình duyệt của bạn không hỗ trợ video.
                    </video>
                  </template>
                  <template v-else>
                    <img :src="post.mediaUrl" alt="Hình ảnh" class="post-image" />
                  </template>
                </div>
              </div>
              <!-- Actions -->
              <div class="post-actions">
                <button class="btn-icon like-btn" @click="toggleLike(post)">
                <img
                  :src="getLikeIcon(post)"
                  alt="Like"
                  class="icon-img-like"
                />
                </button>
                <span class="count">{{ post.likes }}</span>
                <button class="btn-icon comment-btn" @click="toggleCommentPopup(post)">
                  <img src="/assets/comment.png" alt="Comment" class="icon-img" />
                </button>
                <span class="count">{{ post.commentsList.length }}</span>
                <button class="btn-icon share-btn" @click="toggleSharePopup">
                  <img src="/images/share.png" alt="Share" class="icon-img-share" />
                </button>
              </div>
              <!-- Comments Popup -->
              <transition name="fade">
                <div v-if="showCommentPopup" class="comments-overlay" @click.self="toggleCommentPopup">
                  <div class="comments-modal">
                    <div class="comments-header">
                      <h3>Bình luận</h3>
                      <button class="close-comments" @click="toggleCommentPopup">×</button>
                    </div>
                    <div class="comments-body">
                      <div v-for="cmt in activePost.commentsList" :key="cmt.id" class="comment-item">
                        <img :src="cmt.userSrc" class="comment-avatar" />
                        <div class="comment-content">
                          <div class="comment-header">
                            <span class="comment-username">{{ cmt.user }}</span>
                            <span v-if="cmt.user === currentUserName" class="comment-label">
                              <i class="fas fa-pen"></i> Tác giả
                            </span>
                          </div>
                          <div class="comment-text">{{ cmt.text }}</div>
                          <div class="comment-time">{{ cmt.time || formatDate(cmt.createdAt) }}</div>
                          
                        </div>
                      </div>
                    </div>
                    <div class="comments-footer">
                      <input v-model="newComment" type="text" placeholder="Viết bình luận..."
                        @keydown.enter.prevent="addComment(activePost)" />
                    <button class="btn-send" @click="addComment()">Gửi </button>
                      
                    </div>
                  </div>
                </div>
              </transition>

              <!-- Comment list -->
              <div class="comment-list">
                <div class="comment-item" v-for="(cmt, idx) in post.comments" :key="idx">
                  <img :src="cmt.userSrc" alt="avatar" class="comment-avatar" />
                  <div class="comment-bubble">
                    <span class="comment-username">{{ cmt.user }}</span>
                    <span class="comment-text"> {{ cmt.text }}</span>
                    <div class="comment-time">{{ formatDate(cmt.createdAt) }}</div>
                  </div>
                </div>
              </div>
              <!-- Stats -->
                <button class="btn-icon comment-btn" @click="toggleCommentPopup(post)">Xem thêm bình luận</button>
              <!-- Comment Input -->
              <div class="post-comment">
              <input
                type="text"
                placeholder="Bình luận ..."
                v-model="newCommentMap[post.postId]"
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
      <!-- Suggestions -->
      <aside class="suggestions">
        <div class="ads">
          <h3>Quảng cáo</h3>
          <div class="ad-list">
            <div class="ad-card" 
              v-for="ad in advertisements" 
              :key="ad.id" 
              @click="handleAdClick(ad.linkReferfence)"
              role="link" 
              tabindex="0">
              <img :src="ad.imageUrl" :alt="ad.title" />
              <div class="ad-info">
                <h4 class="ad-title">{{ ad.title }}</h4>
                <p class="ad-desc">{{ ad.description }}</p>
              </div>
            </div>
          </div>
        </div>
        <hr />

        <h3>Gợi ý cho bạn</h3>
          <ul class="suggestion-list">
            <li v-for="s in suggestions" :key="s.id" class="suggestion-card">
              <img :src="s.src" alt="" />
              <div class="info">
                <span class="name">{{ s.name }}</span>
                <small>Gợi ý cho bạn</small>
              </div>
              <div class="actions">
                <button class="btn-add" @click="handleAddFriend(s.id)">Thêm</button>
              </div>
            </li>
          </ul>
      </aside>



      <!-- CreatePost Modal -->
      <CreatePost v-if="showCreate" @close="handleCreatePostClose" @refresh="refreshData" />
      <!-- ReportModal -->
      <ReportModal
        v-if="showReport"
        :postId="openedMenuPostId"
        @close="showReport = false"
        @report="onReport"
      />
      <!-- Comments Modal -->
      <transition name="fade">
        <div v-if="showCommentsModal" class="comments-overlay">
          <div class="comments-modal">
            <div class="comments-header">
              <h3>Bài viết của {{ selectedPost.user }}</h3>
              <button class="close-comments" @click="closeComments">&times;</button>
            </div>
            <div class="comments-body">
              <div v-for="comment in selectedPost.commentsList" :key="comment.id" class="comment-item">
                <img :src="comment.userSrc" class="comment-avatar" />
                <div class="comment-content">
                  <span class="comment-username">{{ comment.user }}</span>
                  <span class="comment-text">{{ comment.text }}</span>
                  <span class="comment-time">{{ comment.time }}</span>
                </div>
              </div>
            </div>
            <div class="comments-footer">
              <input
                type="text"
                placeholder="Bình luận t..."
                v-model="newCommentMap[post.postId]"
                @keydown.enter.prevent="addComment(post)"
              />
                <button class="btn-icon post-comment" @click="addComment(post)">
                 <img src="../assets/Sendbutton.svg" alt="Send Button" class="send-icon">
                </button>           
              </div>
          </div>
        </div>
      </transition>
    </div>

    <transition name="fade">
      <div v-if="showSharePopup" class="share-overlay" @click.self="toggleSharePopup">
        <div class="share-modal">
          <!-- Header -->
          <div class="share-header">
            <span class="share-title">Chia sẻ</span>
            <button class="close-btn" @click="toggleSharePopup">×</button>
          </div>
          <!-- Body -->
          <div class="share-body">
            <div class="share-user">
              <img :src="currentUserAvatar" alt="avatar" class="share-avatar" />
              <div class="share-user-info">
                <span class="share-name">{{ currentUserName }}</span>
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
          <!-- Footer -->
          <div class="share-footer">
            <button class="btn-share-now" @click="shareNow">Chia sẻ ngay</button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="showCommentModal" class="comment-modal-overlay" @click.self="toggleCommentPopup">
        <div class="comment-modal">
          <!-- 1. Header -->
          <div class="comment-modal-header">
            <h3>Bài viết của {{ activePost.user }}</h3>
            <button class="close-btn" @click="toggleCommentPopup">×</button>
          </div>
          <!-- 2. Ảnh/Video Gallery -->
          <div class="comment-modal-gallery">
            <img v-for="(img, idx) in activePost.images" :key="idx" :src="img" class="gallery-img" />
          </div>
          <!-- 3. Stats và Thao tác -->
          <!-- <div class="comment-modal-stats">
        <span>{{ activePost.likes }} Thích</span>
        <span>{{ activePost.commentsList.length }} Bình luận</span>
      </div> -->
          <!-- <div class="comment-modal-actions">
        <button><img src="/assets/like.png" class="icon-img-small"/></button>
        <button><img src="/assets/comment.png" class="icon-img-small"/></button>
        <button><img src="" class="icon-img-small"/></button>
      </div> -->
          <hr />
          <!-- 4. Danh sách comment -->
          <div class="comment-modal-list">
          <div v-for="c in activePost.commentsList" :key="c.id" class="comment-item">
  <img :src="c.userSrc" class="comment-avatar" />
  <div class="comment-body">
    <div class="main-comment">
      <span class="comment-username">{{ c.user }}</span>
      <p class="comment-text">{{ c.text }}</p>
    </div>
    <span class="comment-time">{{ formatDate(c.createdAt) }}</span>

    <!-- Nút trả lời -->
    <button class="btn-reply-modal" @click="prepareReply(c)">Trả lời</button>


    <!-- Input trả lời -->
    <div v-if="replyingCommentId === c.id" class="reply-section">
      <input
        v-model="replyInputs[c.id]"
        type="text"
        :placeholder="`@${c.user}`"
        @keydown.enter.prevent="submitReplyModal(c)"
      />
      <button @click="submitReplyModal(c)">Gửi</button>
    </div>

    <!-- Danh sách reply -->
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
          <!-- 5. Input comment -->
          <div class="comments-footer">
            <input v-model="newComment" type="text" placeholder="Viết bình luận t..." />
            <button class="btn-send" @click="addComment(activePost)">Gửi </button>
          </div>
        </div>
      </div>
    </transition>
  </Layout>
</template>

<script setup>
import { ref, onMounted,reactive,computed  } from 'vue'
import Layout from '@/components/Layout.vue'
import CreatePost from '@/components/CreatePost.vue'
import ReportModal from '@/components/ReportModal.vue'
import { getPosts ,likePost, unlikePost,getPostById  } from '@/service/postService'
import { getAccountById } from '@/service/authService'
import { getSuggestedFriends, getFriendList } from '@/service/friendService'
import { getCommentsByPostId, createComment } from '@/service/commentService'
import { getProfileByAccountId } from '@/service/profileService'
import { createReport } from '@/service/reportService'
import { getListAds } from '@/service/admin/AdsService'
import {
  sendFriendRequest,
  rejectFriendReq
} from '@/service/friendService'
// import Sendbutton from "@/assets/Sendbutton.svg"
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const search = ref('')
const showCreate = ref(false)
const showReport = ref(false)
const composeText = ref('')
const posts = ref([])
const suggestions = ref([])
const openedMenuPostId = ref(null)
const showDeleteConfirm = ref(false)
const deleteTargetId = ref(null)
const advertisements = ref([])


const showSharePopup = ref(false)
const showPrivacy = ref(false)
const privacySetting = ref('Bằng feed')
const shareText = ref('')

const showCommentModal = ref(false)
const activePost = ref(null)
const showCommentPopup = ref(false)

const showCommentsModal = ref(false)
const selectedPost = ref({ commentsList: [] })
const newComment = ref('')
const expandedPosts = ref({})

const replyingCommentId = ref(null)
const replyInputs = reactive({})

const currentUserAvatar = ref('/image/avata.jpg')
const currentUserName = ref('Ẩn danh')
const newCommentMap = reactive({})

const user = JSON.parse(localStorage.getItem('user') || '{}')

const loadSuggestions = async () => {
  if (!user?.id) return
  suggestions.value = await getSuggestedFriends(user.id)
}

onMounted(() => {
  loadSuggestions()
})

const handleAddFriend = async (targetId) => {
  try {
    await sendFriendRequest(user.id, targetId)
    toast.success('Gửi lời mời kết bạn thành công!', {
        autoClose: 2000,
        position: toast.POSITION.TOP_RIGHT,
      })
    suggestions.value = suggestions.value.filter(s => s.id !== targetId)
  } catch (err) {
    // console.error('❌ Lỗi gửi lời mời:', err)
    toast.error('Lỗi khi gửi lời mời kết bạn thành công!', {
        autoClose: 2000,
        position: toast.POSITION.TOP_RIGHT,
      })
  }
}

const handleRemoveSuggestion = async (targetId) => {
  try {
    await rejectFriendReq(user.id, targetId)
    suggestions.value = suggestions.value.filter(s => s.id !== targetId)
  } catch (err) {
    console.error('❌ Lỗi khi xoá gợi ý:', err)
    alert('Không thể xoá gợi ý. Thử lại sau.')
  }
}

function isVideo(url) {
  return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg')
}
function getRandomAds(list, count = 3) {
  if (!Array.isArray(list)) {
    console.warn('⚠️ getRandomAds nhận dữ liệu không phải mảng:', list)
    return []
  }
  const shuffled = [...list].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

const filteredPosts = computed(() => {
  if (!search.value.trim()) return posts.value

  const keyword = search.value.toLowerCase()

  return posts.value.filter(post =>
    post.text.toLowerCase().includes(keyword) ||
    post.user.toLowerCase().includes(keyword)
  )
})

async function refreshData() {
  try {
    await fetchPosts()
    console.log('🔄 Data refreshed successfully')
  } catch (error) {
    console.error('❌ Error refreshing data:', error)
  }
}
async function submitReplyModal(cmt) {
  const text = (replyInputs[cmt.id] || '').trim()
  if (!text) return

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!user?.id) return

  try {
    // Gửi reply lên server
    await createComment({
      postId: activePost.value.postId,
      accountId: user.id,
      content: text,
      replyCommentId: cmt.id
    })
    const commentRes = await getCommentsByPostId(activePost.value.postId)

    const commentMap = {}
    const repliesMap = {}

    for (const c of commentRes.comments) {
      const [acc, prof] = await Promise.all([
        getAccountById(c.account.id),
        getProfileByAccountId(c.account.id)
      ])

      const commentData = {
        id: c.id,
        user: prof?.fullName?.trim() || acc?.username || 'Ẩn danh',
        userSrc: prof?.avatarUrl?.trim() || acc?.avatar || '/image/avata.jpg',
        text: c.content,
        createdAt: c.createdAt,
        replyToCommentId: c.replyToCommentId || null,
        replies: []
      }

      if (!commentData.replyToCommentId) {
        commentMap[commentData.id] = commentData
      } else {
        if (!repliesMap[commentData.replyToCommentId]) {
          repliesMap[commentData.replyToCommentId] = []
        }
        repliesMap[commentData.replyToCommentId].push(commentData)
      }
    }
    // Gắn replies vào comment gốc
    for (const parentId in repliesMap) {
      if (commentMap[parentId]) {
        commentMap[parentId].replies = repliesMap[parentId]
      }
    }

    // Gán lại danh sách comment đã xử lý cho bài viết đang mở
    activePost.value.commentsList = Object.values(commentMap)

    // Reset input reply
    replyInputs[cmt.id] = ''
    replyingCommentId.value = null
  } catch (error) {
    console.error('❌ Lỗi khi gửi reply:', error)
    alert('Không thể gửi phản hồi. Vui lòng thử lại.')
  }
}
function prepareReply(cmt) {
  replyingCommentId.value = cmt.id
  if (!replyInputs[cmt.id]) {
    replyInputs[cmt.id] = `@${cmt.user} `
  }
}
function handleCreatePostClose() {
  showCreate.value = false
  refreshData()
}
function getLikeIcon(post) {
  return post.liked ? '/assets/liked.png' : '/assets/like.png'
}

function toggleExpand(postId) {
  expandedPosts.value[postId] = !expandedPosts.value[postId]
}
function formatDate(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMinutes / 60)

  if (diffMinutes < 1) return 'Vừa xong'
  if (diffMinutes < 60) return `${diffMinutes} phút trước`
  if (diffHours < 24) return `${diffHours} giờ trước`
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
}
async function toggleLike(post) {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id || !post.postId) return

    if (post.liked) {
      await unlikePost(user.id, post.postId)
      post.likes -= 1
      post.liked = false

      post.postLikes = post.postLikes.filter(like => like.id !== user.id)
    } else {
      await likePost(user.id, post.postId)
      post.likes += 1
      post.liked = true

      if (!Array.isArray(post.postLikes)) post.postLikes = []
      post.postLikes.push({ id: user.id, username: user.username, email: user.email }) // giả lập
    }
  } catch (error) {
    console.error('❌ Lỗi khi xử lý like/unlike:', error)
  }
}
function togglePostMenu(id) {
  openedMenuPostId.value = openedMenuPostId.value === id ? null : id
}

function formatVietnameseTime(dateStr) {
  const date = new Date(dateStr)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${day} tháng ${month} lúc ${hours}:${minutes}`
}
function cancelDelete() {
  showDeleteConfirm.value = false
  deleteTargetId.value = null
}

function performDelete() {
  const idx = posts.value.findIndex(p => p.postId === deleteTargetId.value)
  if (idx !== -1) posts.value.splice(idx, 1)
  showDeleteConfirm.value = false
  deleteTargetId.value = null
}

function toggleSharePopup() {
  showSharePopup.value = !showSharePopup.value
}

function shareNow() {
  toggleSharePopup()
}

function toggleCommentPopup(post = null) {
  if (showCommentModal.value) {
    showCommentModal.value = false
    activePost.value = null
  } else {
    activePost.value = { ...post, postId: post.postId }
    showCommentModal.value = true
  }
}

function openComments(post) {
  selectedPost.value = post
  showCommentsModal.value = true
}

function closeComments() {
  showCommentsModal.value = false
  selectedPost.value = { commentsList: [] }
  newComment.value = ''
}

async function addComment(post) {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user?.id) return

    const isModal = post?.postId === activePost.value?.postId
    const target = post || selectedPost.value
    const commentText = isModal
      ? newComment.value.trim()
      : (newCommentMap[post.postId] || '').trim()

    if (!commentText) return

    await createComment({
      postId: target.postId,
      accountId: user.id,
      content: commentText,
      replyCommentId: ''
    })

    const commentRes = await getCommentsByPostId(target.postId)

    const commentMap = {}
    const repliesMap = {}

    for (const c of commentRes.comments) {
      const [acc, prof] = await Promise.all([
        getAccountById(c.account.id),
        getProfileByAccountId(c.account.id)
      ])
      const commentData = {
        id: c.id,
        user: prof?.fullName?.trim() || acc?.username || 'Ẩn danh',
        userSrc: prof?.avatarUrl?.trim() || acc?.avatar || '/image/avata.jpg',
        text: c.content,
        createdAt: c.createdAt,
        replyToCommentId: c.replyToCommentId || null,
        replies: []
      }

      if (!commentData.replyToCommentId) {
        commentMap[commentData.id] = commentData
      } else {
        if (!repliesMap[commentData.replyToCommentId]) {
          repliesMap[commentData.replyToCommentId] = []
        }
        repliesMap[commentData.replyToCommentId].push(commentData)
      }
    }

    for (const parentId in repliesMap) {
      if (commentMap[parentId]) {
        commentMap[parentId].replies = repliesMap[parentId]
      }
    }

    target.commentsList = Object.values(commentMap)

    // Reset đúng ô input
    if (isModal) {
      newComment.value = ''
    } else {
      newCommentMap[post.postId] = ''
    }
  } catch (error) {
    console.error('❌ Lỗi khi thêm bình luận:', error)
    alert('Không thể gửi bình luận. Vui lòng thử lại.')
  }
}

async function fetchPosts() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) {
      console.error('❌ User not found in localStorage')
      return
    }
    console.log('📤 Fetching posts for user:', user.id)

    const [account, profile] = await Promise.all([
      getAccountById(user.id),
      getProfileByAccountId(user.id)
    ])
    console.log('📥 User data:', { account, profile })

    currentUserAvatar.value = profile?.avatarUrl?.trim() ? profile.avatarUrl : (account?.avatar || '/image/avata.jpg')
    currentUserName.value = profile?.fullName?.trim() ? profile.fullName : (account?.username || 'Ẩn danh')

    const friendList = await getFriendList(user.id)
    // console.log('📥 Friend list:', friendList)
    const friendIds = friendList.map(friend => friend.id)

    const res = await getPosts()
    console.log(' Raw posts:', res)

    if (!Array.isArray(res)) {
      console.error('❌ Invalid posts response:', res)
      return
    }

    const postResults = []

    for (const post of res) {
      try {
        if (!post.postId || !post.accountId) {
          console.error('❌ Invalid post data:', post)
          continue
        }

        const authorId = post.accountId
        let username = 'Ẩn danh'
        let avatarUrl = '/image/avata.jpg'

        if (post.accounts?.username) {
          username = post.accounts.username
          avatarUrl = post.accounts.avatar || '/image/avata.jpg'
        } else {
          const [acc, prof] = await Promise.all([
            getAccountById(authorId),
            getProfileByAccountId(authorId)
          ])
          username = prof?.fullName?.trim() ? prof.fullName : (acc?.username || 'Ẩn danh')
          avatarUrl = prof?.avatarUrl?.trim() ? prof.avatarUrl : (acc?.avatar || '/image/avata.jpg')
        }

        if (authorId === user.id || friendIds.includes(authorId)) {
          const commentRes = await getCommentsByPostId(post.postId)
          console.log('📥 Comments for post', post.postId, ':', commentRes)
          const commentMap = {}
          const repliesMap = {}
          if (commentRes?.comments) {
            for (const c of commentRes.comments) {
              const commentAccountId = c.account?.id
              if (!commentAccountId) continue

              try {
                const [acc, prof] = await Promise.all([
                  getAccountById(commentAccountId),
                  getProfileByAccountId(commentAccountId)
                ])

                const commentData = {
                  id: c.id,
                  user: prof?.fullName?.trim() || acc?.username || 'Ẩn danh',
                  userSrc: prof?.avatarUrl?.trim() || acc?.avatar || '/image/avata.jpg',
                  text: c.content,
                  createdAt: c.createdAt,
                  replyToCommentId: c.replyToCommentId || null,
                  replies: []
                }

                if (!commentData.replyToCommentId) {
                  commentMap[commentData.id] = commentData
                } else {
                  if (!repliesMap[commentData.replyToCommentId]) {
                    repliesMap[commentData.replyToCommentId] = []
                  }
                  repliesMap[commentData.replyToCommentId].push(commentData)
                }
              } catch (e) {
                console.error('❌ Error loading comment profile:', e)
              }
            }

            // Gắn replies vào comment gốc
            for (const parentId in repliesMap) {
              if (commentMap[parentId]) {
                commentMap[parentId].replies = repliesMap[parentId]
              }
            }
          }
          const comments = Object.values(commentMap)
          // const liked = Array.isArray(post.listLike)
          //   ? post.listLike.some(like => like.id === user.id)
          //   : false
          //   postLikes: post.listLike || [],
            postResults.push({
              postId: post.postId,
              user: username,
              userSrc: avatarUrl,
              time: formatVietnameseTime(post.createdAt),
              text: post.content,
              mediaUrl: post.postMedias?.[0]?.mediaUrl || null,
              likes: post.likeAmount || 0,
              commentsList: comments,
              postLikes: post.listLike || [],
              liked: await checkLikedStatus(post.postId)

            })

        }
      } catch (postError) {
        console.error('❌ Error processing post:', post.postId, postError)
      }
    }

    posts.value = postResults.reverse()
    console.log('📥 Final processed posts:', posts.value)
  } catch (err) {
    console.error('❌ Error fetching posts:', err)
    if (err.response) {
      console.error('❌ API Error:', err.response.data)
    }
  }
}
function onReport() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!user?.id || !openedMenuPostId.value) return

  const post = posts.value.find(p => p.postId === openedMenuPostId.value)
  if (!post || !post.postId) {
    toast.error('❌ Không thể xác định bài viết cần báo cáo.', {
      autoClose: 2000,
      position: toast.POSITION.TOP_RIGHT,
    })
    return
  }

  const reason = prompt('Nhập lý do báo cáo bài viết này:')
  if (!reason || reason.trim().length === 0) {
    toast.warning('⚠️ Lý do không được để trống!', {
      autoClose: 2000,
      position: toast.POSITION.TOP_RIGHT,
    })
    return
  }

  createReport({
    accountId: user.id,
    targetId: post.postId,
    type: 'POST',
    reason: reason.trim()
  })
    .then(() => {
      toast.success('✅ Báo cáo đã được gửi thành công!', {
        autoClose: 2000,
        position: toast.POSITION.TOP_RIGHT,
      })
      showReport.value = false
      openedMenuPostId.value = null
    })
    .catch((error) => {
      console.error('❌ Lỗi gửi báo cáo:', error)
      toast.error('❌ Không thể gửi báo cáo. Vui lòng thử lại sau.', {
        autoClose: 2000,
        position: toast.POSITION.TOP_RIGHT,
      })
    })
}

onMounted(async () => {
  await refreshData()
  setInterval(refreshData, 60000)
})
onMounted(async () => {
  const adsData = await getListAds()
  if (Array.isArray(adsData)) {
    advertisements.value = getRandomAds(adsData, 3)
  } else {
    console.error('❌ Unexpected ads data format:', adsData)
    advertisements.value = []
  }
})
onMounted(async () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (user.id) {
    const suggest = await getSuggestedFriends(user.id, 4)

    const enrichedSuggestions = await Promise.all(suggest.map(async (s) => {
      try {
        const [acc, prof] = await Promise.all([
          getAccountById(s.id),
          getProfileByAccountId(s.id)
        ])

        return {
          id: s.id,
          name: prof?.fullName?.trim() || acc?.username || 'Ẩn danh',
          src: prof?.avatarUrl?.trim() || acc?.avatar || '/image/avata.jpg'
        }
      } catch (err) {
        console.error(`❌ Không thể lấy thông tin cho userId ${s.id}`, err)
        return {
          id: s.id,
          name: 'Ẩn danh',
          src: '/image/avata.jpg'
        }
      }
    }))

    suggestions.value = enrichedSuggestions
  }
})
async function checkLikedStatus(postId) {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user?.id) return false

    const detail = await getPostById(postId)

   

    // Log từng ID trong danh sách like để chắc chắn có hay không
    const likeIds = detail?.listLike?.map(like => like.id)
    // console.log('❤️ Danh sách ID đã like:', likeIds)

    const liked = detail?.listLike?.some(like => String(like.id) === String(user.id))
    // console.log(`✅ Kết quả đã like bài ${postId}?`, liked)

    return liked
  } catch (error) {
    console.error('❌ Lỗi kiểm tra liked status:', error)
    return false
  }
}

function openReport(post) {
  openedMenuPostId.value = post.postId // phải dùng đúng post.postId
  showReport.value = true
}

// Add new method to handle ad clicks
function handleAdClick(link) {
  if (link) {
    window.open(link, '_blank')
  }
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
.post-media-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
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

.material-icons {
  font-size: 20px;
  color: #888;
  margin-right: 6px;
}

.search-box {
  display: flex;
  align-items: center;
  background: #EDEBEB;
  border: 1px solid #000;
  border-radius: 8px;
  padding: 4px 8px;

  /* MỞ RỘNG PHẦN TÌM KIẾM */
  width: 100%;
  /* chiếm hết khung cha */
  max-width: 600px;
  /* hoặc chỉnh thành bất kỳ giá trị nào bạn muốn */
  margin: 0 auto;
  /* căn giữa trên màn hình */
}

/* STORIES */
.stories {
  display: flex;
  gap: 12px;
  padding: 16px 0;
  /* giảm padding dọc để gọn hơn */
  border-radius: 8px;
  margin-bottom: 16px;
  align-items: center;
  overflow: visible;
  /* bỏ cuộn ngang */
  flex-wrap: wrap;
  /* cho phép xuống dòng nếu quá nhiều item */
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

/* chiếc nút "+" nhỏ ở góc */
.add-story {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  background-color: #1DA1F2;
  /* xanh dương như mockup */
  border: 2px solid #000000;
  /* viền trắng */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  /* size dấu "+" */
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
}



/* COMPOSER */
/* COMPOSER */
.composer {
  display: flex;
  width: 89%;
  margin-left: 38px;
  align-items: flex-start;
  background: var(--bg-composer);
  /* #FAEBD7 */
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  background-color: #FFFFFF;
  /* click bất kỳ mở popup */
  /* margin-top: 20px; */
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
  flex-direction: column;
  /* xếp dọc */
  gap: 8px;
  /* khoảng cách giữa input & icon */
}

/* input "bong bóng" */
.composer-input {
  width: 100%;
  height: 36px;
  background: #DCDCDC;
  border: none;
  border-radius: 18px;
  /* bo tròn giống pill */
  padding: 8px 12px;
  font-size: 14px;
  color: var(--subtext);
  outline: none;
  cursor: pointer;
  /* nhấn anywhere để mở */
}

/* icon camera bên dưới */
.composer-camera {
  font-size: 20px;
  color: var(--text);
  ;
  margin-left: -50px;
  cursor: pointer;
}

/* FEED */
.feed {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  padding: 29px;
  margin-top: -15px;
}

.post-card {
  background: #Ffffff;
  border-radius: 10px;
  padding-top: 10px;
  padding-bottom: 20px;
  /* box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3); */
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  /* padding: 10px;
  border: 5px solid #FFFFFF; */

}

.post-header {
  display: flex;
  align-items: center;
  padding-bottom: 18px;
  margin-top: -5px;
}

.post-header .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
  margin-top: 10px;
  margin-left: 15px;

}

/* nút chứa alert */
.comment-alert-btn {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}

/* send-button */
/* .send-icon{
  width: 20px;
  height: 20px;
  object-fit: contain;
  margin-bottom: 8px;
} */

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
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  margin-top: 10px;
  margin-left: 5px;
}

.time {
  font-size: 16px;
  color: #000000;
  margin-top: -4px;
  margin-left: 5px;
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
  margin-top: 12px;
  margin-left: 8px;
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

/* .post-content {
  margin-bottom: 15px;
  margin-left: -3px;
} */

.post-content p {
  margin-bottom: 8px;
  color: var(--text);
  margin-top: -20px;
  margin-left: 10px;
  font-size: 16px;
  width: 580px;
}
.post-content img {
  max-width: 580px;
  max-height: 380px;
  /* Giới hạn chiều cao tối đa */
  /* width: auto;
  height: auto;
  display: block; */
  object-fit: contain;
  /* Không cắt ảnh, giữ nguyên tỉ lệ */
}

.post-image-wrapper {
  background-color: #f0f0f0;
  /* Màu xám nhạt */
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 500px;
  overflow: hidden;
  /* border-radius: 10px; */
  margin:0;
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
}


/* .btn-iconlike {
  margin-left: 16px;
} */

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

/* đẩy icon Share ra tận bên phải */
.post-actions {
  font-size: 20px;
}

/* .share-icon {
  font-size: 20px;
  margin-left: 550px;
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
  color: #000000;
  text-decoration: none;
  font-size: 13px;
  margin-top: -16px;
  margin-left: 16px;
}

/* .post-comment input {
  width: auto;
  height: 42px;
  padding: 8px 12px;
  border: 1.5px solid #000000;
  border-radius: 8px;
  font-size: 14px;
  color: #000000;
  margin-top: -2px;
} */

/* .post-comment {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
} */

/* Center the whole input+button block and limit its width */
.post-comment {
  display: flex;
  justify-content: center;    /* center children horizontally */
  align-items: center;        /* center children vertically */
  margin: 0 auto;             /* center the block in its parent */
  max-width: 600px;           /* you can tweak this */
  gap: 4px;                   /* space between input & button */
  margin: 0px 10px 0 10px;
}

/* Style the text input */
.post-comment input {
  width: 100%;                /* take full width of the parent */
  flex: 1;
  height: 42px;               /* fixed height */
  padding: 0 12px;
  border: 1px solid #ccc;
  border-radius: 9px;        /* pill shape */
  outline: none;
}

/* Style the send button */
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

/* If your button contains an SVG or icon, make sure it fits */
.post-comment button img,
.post-comment button svg {
  width: 20px;
  height: 20px;
}
/* .btn-send-comment {
  padding: 0 0 0 0;
  background: #009DFF;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  /* margin-top: -4px; */

.btn-send-comment:hover {
  background: #007ACC;
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
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  gap: 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.ad-card:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.ad-card:active {
  transform: translateY(0);
}

.ad-card:focus {
  outline: 2px solid #009DFF;
  outline-offset: -2px;
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

/* .btn-remove {
  background: #FFE0B2;
} */

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
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.liked {
  color: #e0245e;
}

/* overlay tối nền */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Comments overlay */
.comments-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.comments-modal {
  width: 600px;
  max-height: 80vh;
  background: #FFF;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.comments-header {
  margin: 0;
  padding: 16px;
  background: #FFF;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
  /* ← Đổ bóng */
}

.comments-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.close-comments {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.comments-body {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
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
  margin-top:5px;
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
  margin-top: 10px ;
}

.comment-time {
  font-size: 12px;
  color: #65676b;
  margin-top: 4px;
  margin-left:5px;
}

.comments-footer {
  padding: 12px;
  border-top: 1px solid #DDD;
  display: flex;
  gap: 8px;
}

.comments-footer input {
  flex: 1;
  padding: 8px;
  border: 1px solid #CCC;
  border-radius: 4px;
}

.btn-send {
  padding: 8px 16px;
  background: #009DFF;
  color: #FFF;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.post-header {
  position: relative;
  /* để .post-menu có thể đặt absolute */
}

.menu-btn i {
  font-size: 20px;
  color: var(--text);
  margin-top: 10px;
  margin-left: 100px;
}

.post-menu {
  position: absolute;
  top: 15%;
  /* ngay dưới header-actions */
  right: 25px;
  background: var(--bg-post);
  border: 1px solid var(--divider);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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
  background: rgba(0, 0, 0, 0.05);
}


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

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
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

/* Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


/* Overlay mờ toàn màn hình */
.comment-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

/* Hộp modal */
.comment-modal {
  width: 600px;
  max-height: 90vh;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  font-family: "Segoe UI", Tahoma, sans-serif;
}

/* Header */
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

/* Gallery ảnh */
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
}

/* Overlay +N trên ảnh cuối */
.comment-modal-gallery img:last-child {
  filter: brightness(0.6);
}

.comment-modal-gallery img:last-child::after {
  content: "+" attr(data-extra);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 2rem;
  font-weight: bold;
}

/* Thống kê Like/Comment/Share */
.comment-modal-stats {
  padding: 8px 16px;
  font-size: 0.9rem;
  color: #555;
  display: flex;
  justify-content: space-between;
}

.comment-modal-actions {
  padding: 8px 16px;
  display: flex;
  gap: 24px;
  border-bottom: 1px solid #eee;
}

.comment-modal-actions button {
  background: transparent;
  border: none;
  cursor: pointer;
}

.comment-modal-actions .icon-img-small {
  width: 20px;
  height: 20px;
}

/* Danh sách bình luận */
.comment-modal-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 16px;
}

.comment-modal-list .comment-item {
  display: flex;
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
  /* box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); */
  border-radius: 12px;
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

/* Footer nhập bình luận */
.comment-modal-footer {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #eee;
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

/* Fade transition */
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
  margin-left:20px;
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

.nested-replies {
  margin-top: 6px;
  padding-left: 16px;
  border-left: 2px solid #ddd;
}

.reply-item {
  font-size: 14px;
  margin-top: 4px;
    display: flex;
  align-items: flex-start;
}

.reply-username {
  font-weight: 600;
}

.reply-to {
  color: #007aff;
  margin-left: 4px;
}
.nested-replies {
  margin-left: 48px; /* đẩy sang phải giống trả lời Facebook */
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reply-item {
  display: flex;
  align-items: flex-start;
}

.reply-item .comment-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
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
.main-comment{
  background:#f0f2f5;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
}
.btn-reply-modal {
  background: transparent;
  border: none;
  color: #1877f2; /* xanh Facebook, hoặc dùng `blue` */
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  font-weight: 500;
}

.app-wrapper {
  flex-direction: column; /* stack main + sidebar */
}
.main {
  padding: 16px;
}
.suggestions {
  display: none;         /* ẩn sidebar trên mobile */
}
.post-card {
  margin-bottom: 16px;
}
.post-actions {
  gap: 4px;
}
.post-comment {
  max-width: 100%;
}

/* --------------------------------------------- */
/* Tablet (600px – 900px)                        */
/* --------------------------------------------- */
@media (min-width: 600px) {
  .app-wrapper {
    flex-direction: row;
  }
  .main {
    flex: 1;
    padding: 24px;
  }
  .suggestions {
    display: block;
    width: 200px;
  }
  .post-card {
    margin: 0 auto 24px;
    max-width: 600px;
  }
}

@media (min-width: 900px) {
  .main {
    padding: 32px;
  }
  .search-box {
    max-width: 600px;
  }
  .composer {
    max-width: 600px;
    margin: 24px auto 24px;
  }
  .post-card {
    max-width: 700px;
    margin: 0 auto 32px;
  }
  .suggestions {
    width: 280px;
    display: block;
  }
}

</style>