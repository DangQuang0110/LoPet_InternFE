<template>
  <Layout>
    <div class="app-container">
      <!-- Loading state -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>Đang tải thông tin nhóm...</p>
      </div>

      <!-- Overlay popup xác nhận thoát nhóm -->
      <div v-if="confirmLeave" class="overlay">
        <div class="popup">
          <p>Bạn muốn thoát khỏi nhóm?</p>
          <div class="popup-buttons">
            <button class="leave" @click="handleLeaveGroup">Thoát khỏi nhóm</button>
            <button class="cancel" @click="confirmLeave = false">Hủy</button>
          </div>
        </div>
      </div>

      <!-- Overlay popup báo cáo bài viết -->
      <div v-if="showReportPopup" class="overlay">
        <div class="report-popup">
          <div class="popup-header">
            <h3>Báo Cáo Bài viết</h3>
            <span class="close-btn" @click="closeReport">×</span>
          </div>

          <p class="popup-question">Tại sao bạn báo cáo bài viết này?</p>

          <div class="report-options">
            <div
              v-for="(option, index) in reportOptions"
              :key="index"
              class="report-option"
              :class="{ selected: selectedReason === option }"
              @click="selectedReason = option"
            >
              <input
                type="radio"
                :value="option"
                v-model="selectedReason"
                :id="`option-${index}`"
              />
              <label :for="`option-${index}`">{{ option }}</label>
            </div>
          </div>

          <button class="confirm-button" @click="submitReport" :disabled="!selectedReason">
            Xác nhận
          </button>
        </div>
      </div>

      <!-- Popup chỉnh sửa thông tin nhóm -->
      <div v-if="showEditPopup" class="overlay">
        <div class="edit-form">
          <div class="form-header">
            <h3>Chỉnh sửa nhóm</h3>
            <button class="close-btn" @click="closeEditForm">×</button>
          </div>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <input
            type="text"
            v-model="editForm.name"
            placeholder="Nhập tên nhóm"
            :disabled="isUpdating"
          />

          <select v-model="editForm.privacy" :disabled="isUpdating">
            <option disabled value="">Chọn quyền riêng tư</option>
            <option value="PUBLIC">Công khai</option>
            <option value="PRIVATE">Riêng tư</option>
          </select>

          <textarea
            v-model="editForm.description"
            placeholder="Nhập mô tả nhóm"
            :disabled="isUpdating"
          ></textarea>

          <div class="file-input-container">
            <label for="editGroupImage" class="file-label" v-if="!editImagePreview">
              <span>Chọn ảnh bìa nhóm</span>
              <input
                type="file"
                id="editGroupImage"
                @change="handleEditImageChange"
                accept="image/*"
                :disabled="isUpdating"
              />
            </label>
            <div v-if="editImagePreview" class="image-preview-container">
              <img :src="editImagePreview" alt="Preview" class="image-preview" />
              <button
                type="button"
                class="remove-image"
                @click="removeEditImage"
                :disabled="isUpdating"
              >
                <span>×</span>
              </button>
            </div>
          </div>

          <button class="submit-btn" @click="handleUpdateGroup" :disabled="isUpdating">
            {{ isUpdating ? 'Đang cập nhật...' : 'Cập nhật nhóm' }}
          </button>
        </div>
      </div>

      <!-- Share Link Popup -->
      <div v-if="showSharePopup" class="overlay">
        <div class="share-popup">
          <div class="popup-header">
            <h3>Chia sẻ bài viết</h3>
            <span class="close-btn" @click="toggleSharePopup">×</span>
          </div>

          <div class="share-link-container">
            <input
              type="text"
              :value="shareUrl"
              class="share-link-input"
              readonly
              ref="shareUrlInput"
            />
            <button class="copy-link-btn" @click="copyShareLink">
              <span v-if="!copied">Sao chép</span>
              <span v-else>Đã sao chép ✓</span>
            </button>
          </div>
        </div>
      </div>

      <header class="header">
        <div class="search-container">
          <input 
            v-model="searchQuery"
            @input="handleSearch"
            class="search" 
            placeholder="Tìm kiếm theo tên người dùng hoặc nội dung..." 
          />
          <div v-if="isSearching" class="search-loading">
            <div class="loading-spinner-small"></div>
          </div>
          
          <!-- Search Results Dropdown -->
          <div v-if="showSearchResults" class="search-results">
            <div v-if="isSearching" class="searching-message">
              Đang tìm kiếm...
            </div>
            <div v-else-if="searchResults.length === 0" class="no-results">
              Không tìm thấy kết quả
            </div>
            <div v-else class="results-list">
              <div 
                v-for="post in searchResults" 
                :key="post.postId" 
                class="search-result-item"
                @click="scrollToPost(post.postId)"
              >
                <img :src="post.userSrc || '/image/avata.jpg'" class="result-avatar" />
                <div class="result-info">
                  <div class="result-username">{{ post.user }}</div>
                  <div class="result-content">{{ post.content }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="cover" :style="{ backgroundImage: `url(${group.coverUrl})` }"></div>

      <section class="group-info full-width-group">
        <div class="group-header">
          <h1>{{ group.name }}</h1>
          <span class="privacy-badge" :class="group.privacy">
            {{ group.privacy === 'public' ? 'Công khai' : 'Riêng tư' }}
          </span>
        </div>
        <p class="members">
          <img src="@/assets/diacau.png" alt="Địa cầu" class="inline-icon" />
          {{ group.totalMembers }} thành viên
        </p>

        <!-- <div class="avatars">
          <img v-for="i in 6" :key="i" class="avatar" :src="`https://i.pravatar.cc/40?img=${i}`" />
        </div> -->
        <div class="group-actions">
          <template v-if="isOwner">
            <button class="delete-group" @click="handleDeleteGroup">Xóa nhóm</button>
            <button class="edit-group-btn" @click="openEditForm">Chỉnh sửa nhóm</button>
          </template>
          <template v-else>
            <template v-if="!leftGroup">
              <button class="joined" @click="toggleConfirmLeave">Đã tham gia ✓</button>
            </template>
            <template v-else>
              <button class="join" @click="handleJoin">Tham gia nhóm</button>
            </template>
          </template>
        </div>
      </section>

      <main class="main">
        <div class="layout">
          <div class="left">
            <div v-if="canPost" class="new-post">
              <div class="new-post-header">
                <img :src="currentUserAvatar" class="avatar" />
                <textarea
                  v-model="newPostContent"
                  class="post-input"
                  placeholder="Bạn muốn chia sẻ điều gì?"
                  :disabled="isPostLoading"
                ></textarea>
              </div>

              <!-- Image preview -->
              <div v-if="imagePreview" class="preview-container">
                <img :src="imagePreview" alt="Preview" class="preview-image" />
                <button class="remove-preview" @click="removeImage">×</button>
              </div>

              <div class="new-post-actions">
                <div class="left-actions">
                  <label class="upload-button">
                    <img src="@/assets/camera.png" alt="Upload" class="upload-icon" />
                    <span>Ảnh</span>
                    <input
                      type="file"
                      class="file-input"
                      @change="handleImageChange"
                      accept="image/*"
                      :disabled="isPostLoading"
                    />
                  </label>
                </div>
                <button
                  class="share-button"
                  @click="handleCreatePost"
                  :disabled="isPostLoading || !newPostContent.trim()"
                >
                  {{ isPostLoading ? 'Đang đăng...' : 'Đăng' }}
                </button>
              </div>
            </div>

            <div v-else class="join-message">
              <p>Tham gia nhóm để đăng bài viết và tương tác với các thành viên khác</p>
            </div>

            <!-- Danh sách bài viết -->
            <div
              v-for="post in groupPosts"
              :key="post.id"
              class="post-card"
              :data-post-id="post.postId"
            >
              <div class="post-header">
                <img :src="post.userSrc" class="avatar" />
                <div class="post-info">
                  <span class="username">{{ post.user }}</span>
                  <div class="time">{{ new Date(post.createdAt).toLocaleString('vi-VN') }}</div>
                </div>
                <div class="menu-container" v-if="canPost">
                  <div class="menu" @click.stop="toggleReportMenu(post.postId)">⋮</div>
                  <div v-show="activeMenuPostId === post.postId" class="report-dropdown">
                    <button v-if="!isPostOwner(post)" @click="openReport(post.postId)">Báo cáo bài viết</button>
                    <template v-else>
                      <button @click="handleDeletePost(post.postId)">Xóa bài viết</button>
                      <button @click="handleEditPost(post)">Chỉnh sửa bài viết</button>
                    </template>
                  </div>
                </div>
              </div>

              <div class="post-content" :class="{ expanded: expandedPosts[post.id] }">
                <p>{{ post.content }}</p>
                <button
                  v-if="post.content && post.content.length > 100"
                  class="see-more-btn"
                  @click="toggleExpand(post.id)"
                >
                  {{ expandedPosts[post.id] ? 'Thu gọn' : 'Xem thêm' }}
                </button>
              </div>

              <!-- Hiển thị ảnh từ postMedias -->
              <div
                v-if="post.postMedias && post.postMedias.length > 0"
                class="post-media-container"
              >
                <template v-for="(media, index) in post.postMedias" :key="index">
                  <img
                    v-if="media.mediaType === 'IMAGE'"
                    :src="media.mediaUrl"
                    :alt="'Post Image ' + (index + 1)"
                    class="post-image"
                    @click="openImagePreview(media.mediaUrl)"
                  />
                </template>
              </div>

              <div v-if="canPost" class="post-actions">
                <div class="action-item" @click="toggleLike(post)">
                  <img
                    :src="post.liked ? '/assets/liked.png' : '/assets/like.png'"
                    :alt="post.liked ? 'Unlike' : 'Like'"
                    class="action-icon"
                  />
                  <span class="action-count">{{ post.likes || 0 }}</span>
                </div>
                <div class="action-item" @click="toggleCommentPopup(post)">
                  <img src="@/assets/comment.png" alt="Comment" class="action-icon" />
                  <span class="action-count">{{ post.comments?.length || 0 }}</span>
                </div>
                <div class="action-item-share" @click="toggleSharePopup(post)">
                  <img src="@/assets/share.png" alt="Share" class="action-icon" />
                  <span></span>
                </div>
              </div>
              <div v-else class="post-stats">
                <span>{{ post.likes || 0 }} lượt thích</span>
                <span>{{ post.comments?.length || 0 }} bình luận</span>
              </div>

              <!-- Comments list - Giới hạn hiển thị 2 comments -->
              <div v-if="canPost" class="comment-list">
                <!-- Hiển thị tối đa 2 comments đầu tiên -->
                <div
                  v-for="comment in getPostComments(post.postId).slice(0, 2)"
                  :key="comment.id"
                  class="comment-item"
                >
                  <img
                    :src="comment.account?.profile?.avatarUrl || 'https://i.pravatar.cc/30?img=9'"
                    class="comment-avatar"
                  />
                  <div class="comment-bubble">
                    <span class="comment-username">{{
                      comment.account?.profile?.fullName || 'Người dùng'
                    }}</span>
                    <span class="comment-text">{{ comment.content }}</span>
                    <div class="comment-time">
                      {{ formatCommentTime(comment.createdAt) }}
                    </div>
                  </div>
                </div>

                <!-- Hiển thị nút "Xem thêm bình luận" nếu có nhiều hơn 2 comments -->
                <div v-if="getPostComments(post.postId).length > 2" class="view-more-comments">
                  <button class="view-more-btn" @click="toggleCommentPopup(post)">
                    Xem thêm {{ getPostComments(post.postId).length - 2 }} bình luận
                  </button>
                </div>

                <!-- Comment Input -->
                <div class="comment-input">
                  <input
                    type="text"
                    class="comment-box"
                    placeholder="Viết bình luận..."
                    v-model="commentInputs[post.postId]"
                    @keyup.enter="addComment(post)"
                  />
                  <button class="btn-send groupCommnent" @click="addComment(post)">
                    <img src="../assets/Sendbutton.svg" alt="Send Button" class="send-icon-group" />
                  </button>
                </div>
              </div>

              <!-- Post Detail Popup -->
              <transition name="fade">
                <div
                  v-if="showCommentPopup && activePost?.postId === post.postId"
                  class="overlay"
                  @click.self="toggleCommentPopup"
                >
                  <div class="post-modal">
                    <!-- Header -->
                    <div class="post-header">
                      <h2 class="post-title">Bình luận</h2>
                      <button class="close-btn" @click="toggleCommentPopup">×</button>
                    </div>

                    <!-- Comments List -->
                    <div class="post-content">
                      <div class="comments-section">
                        <div class="comments-list">
                          <div v-for="comment in post.comments" :key="comment.id" class="comment-item-modal">
                            <img
                              :src="comment.account?.profile?.avatarUrl || 'https://i.pravatar.cc/30?img=9'"
                              class="comment-avatar-modal"
                            />

                            <div class="comment-main">
                              <div class="comment-bubble-modal">
                                <div class="comment-header-modal">
                                  <span class="comment-username-modal">{{
                                    comment.account?.profile?.fullName || 'Người dùng'
                                  }}</span>
                                </div>
                                <div class="comment-text-modal">{{ comment.content }}</div>
                              </div>

                              <!-- ✅ Thời gian và nút trả lời nằm dưới bubble -->
                              <div class="comment-actions-modal">
                                <span class="comment-time-modal">{{
                                  formatCommentTime(comment.createdAt)
                                }}</span>
                                ·
                                <button class="btn-reply-modal" @click="prepareReply(comment)">
                                  Trả lời
                                </button>
                              </div>

                              <!-- Reply Input Section - Chỉ hiển thị khi comment này được chọn để trả lời -->
                              <div v-if="replyingCommentId === comment.id" class="reply-input-section">
                                <div class="reply-input-wrapper">
                                  <input
                                    type="text"
                                    class="reply-input"
                                    v-model="replyInputs[comment.id]"
                                    @keyup.enter="submitReply(comment)"
                                    :placeholder="'@' + (comment.account?.profile?.fullName || 'Người dùng')"
                                  />
                                  <button 
                                    class="btn-send-reply" 
                                    @click="submitReply(comment)"
                                    :disabled="!replyInputs[comment.id]?.trim()"
                                  >
                                    Gửi
                                  </button>
                                </div>
                              </div>

                              <!-- Display Replies -->
                              <div v-if="comment.replies && comment.replies.length > 0" class="replies-section">
                                <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                                  <img
                                    :src="reply.account?.profile?.avatarUrl || 'https://i.pravatar.cc/30?img=9'"
                                    class="reply-avatar"
                                  />
                                  <div class="reply-content">
                                    <div class="reply-bubble">
                                      <div class="reply-header">
                                        <span class="reply-username">{{ reply.account?.profile?.fullName || 'Người dùng' }}</span>
                                      </div>
                                      <div class="reply-text">
                                        <span class="reply-mention">@{{ comment.account?.profile?.fullName || 'Người dùng' }}</span>
                                        {{ reply.content.replace(`@${comment.account?.profile?.fullName}`, '').trim() }}
                                      </div>
                                    </div>
                                    <div class="reply-footer">
                                      <span class="reply-time">{{ formatCommentTime(reply.createdAt) }}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Comment Input Section -->
                    <div class="comment-input-section">
                      <div class="comment-input-container">
                        <input
                          type="text"
                          class="comment-input-modal"
                          placeholder="Viết bình luận..."
                          v-model="commentInputs[post.postId]"
                          @keyup.enter="addComment(post)"
                        />
                        <button class="send-btn-modal" @click="addComment(post)">Gửi</button>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <div class="right">
            <div class="introduction">
              <h3 class="intro-title">Giới thiệu</h3>
              <p class="intro-desc">{{ group.description }}</p>
            </div>

            <div v-if="canPost" class="sidebar-box">
              <h3>Bài viết mới</h3>
              <div v-if="recentPosts.length === 0" class="no-recent-posts">
                Chưa có bài viết nào
              </div>
              <div v-else class="recent-post" v-for="post in recentPosts" :key="post.postId">
                <img
                  class="recent-avatar"
                  :src="post.userSrc || '/image/avata.jpg'"
                  :alt="post.user || 'Người dùng'"
                />
                <div class="recent-info">
                  <div class="recent-name">
                    <strong>{{ post.user }}</strong> đã đăng một bài viết mới
                  </div>
                  <div class="recent-content">
                    {{ post.content.substring(0, 50) }}{{ post.content.length > 50 ? '...' : '' }}
                  </div>
                  <div class="recent-time">{{ getTimeAgo(post.createdAt) }}</div>
                </div>
                <button class="recent-button" @click="scrollToPost(post.postId)">
                  Xem bài viết
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </Layout>

  <!-- Thêm modal xem ảnh -->
  <div v-if="selectedPreviewImage" class="image-preview-modal" @click="closeImagePreview">
    <img :src="selectedPreviewImage" alt="Preview" @click.stop />
    <div class="close-button" @click="closeImagePreview">×</div>
  </div>

  <!-- Thêm form chỉnh sửa bài viết -->
  <div v-if="showEditPostPopup" class="overlay">
    <div class="edit-post-form">
      <div class="form-header">
        <h3>Chỉnh sửa bài viết</h3>
        <button class="close-btn" @click="closeEditPostForm">×</button>
      </div>

      <textarea
        v-model="editPostForm.content"
        class="edit-post-input"
        placeholder="Nội dung bài viết..."
      ></textarea>

      <!-- Image Previews -->
      <div v-if="editImagePreviews.length > 0" class="preview-container">
        <div v-for="(preview, index) in editImagePreviews" :key="index" class="preview-item">
          <img :src="preview" alt="Preview" class="preview-image" />
          <button class="remove-preview" @click="removeEditPostImage(index)">×</button>
        </div>
      </div>

      <div class="edit-post-actions">
        <div class="media-buttons">
          <label class="upload-button">
            <img src="@/assets/camera.png" alt="Upload Image" class="upload-icon" />
            <span>Ảnh</span>
            <input
              type="file"
              class="file-input"
              @change="handleEditPostImageChange"
              accept="image/*"
              multiple
            />
          </label>
        </div>

        <select v-model="editPostForm.scope" class="scope-select">
          <option value="PUBLIC">Công khai</option>
          <option value="FRIEND">Bạn bè</option>
          <option value="PRIVATE">Riêng tư</option>
        </select>

        <button class="update-button" @click="handleUpdatePost" :disabled="!editPostForm.content.trim()">
          Cập nhật
        </button>
      </div>
    </div>
  </div>

  <!-- Thêm popup xác nhận xóa bài viết -->
  <div v-if="showDeleteConfirm" class="overlay">
    <div class="delete-confirm-popup">
      <div class="popup-header">
        <h3>Xóa bài viết</h3>
        <button class="close-btn" @click="closeDeleteConfirm">×</button>
      </div>
      <div class="popup-content">
        <p>Bạn có chắc chắn muốn xóa bài viết này không?</p>
        <p class="warning-text">Hành động này không thể hoàn tác.</p>
      </div>
      <div class="popup-actions">
        <button class="cancel-btn" @click="closeDeleteConfirm">Hủy</button>
        <button class="confirm-delete-btn" @click="confirmDeletePost">Xóa bài viết</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Layout from '@/components/Layout.vue'
import { ref, computed, onMounted, reactive, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getGroupDetails,
  updateGroup,
  createPostGroup,
  getPostsGroup,
  deleteGroupByOwner,
  leaveGroup,
  getListGroupJoin,
  joinGroup,
} from '@/service/communityService'
import { getProfileByAccountId } from '@/service/profileService'
import { getAccountById } from '@/service/authService'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { likePost, unlikePost, deletePost, updatePost } from '@/service/postService'
import { getCommentsByPostId, createComment } from '@/service/commentService'
// import { sendReport } from '@/service/reportService'

const route = useRoute()
const router = useRouter()
const confirmLeave = ref(false)
const leftGroup = ref(false)
const showEditPopup = ref(false)
const showReportPopup = ref(false)
const selectedPostId = ref(null)
const selectedReason = ref('')
const showReportMenu = ref(null)
const isLoading = ref(true)
const isUpdating = ref(false)
const errorMessage = ref('')
const newPostContent = ref('')
const selectedImage = ref(null)
const imagePreview = ref(null)
const groupPosts = ref([])
const isPostLoading = ref(false)
const user = ref(null)
const editForm = ref({
  name: '',
  privacy: '',
  description: '',
})
const editImagePreview = ref(null)
const editSelectedImage = ref(null)
const selectedPreviewImage = ref(null)
const expandedPosts = ref({})
const showCommentPopup = ref(false)
const activePost = ref(null)
const showSharePopup = ref(false)
const selectedPost = ref(null)
const copied = ref(false)
const shareUrlInput = ref(null)

// Thêm reactive state cho comments
const postComments = ref({})
const commentInputs = reactive({})

// Cập nhật state
const currentUserAvatar = ref('/image/avata.jpg')
const currentUserName = ref('Ẩn danh')

const reportOptions = [
  'Thông tin sai sự thật, lừa đảo hoặc gian lận',
  'Quyền sở hữu trí tuệ',
  'Vấn đề liên quan tới người dưới 18 tuổi',
  'Tự tử hoặc gây thương tích',
  'Bắt nạt, quấy rối hoặc lăng mạ / lạm dụng / ngược đãi',
]

const group = ref({
  name: '',
  description: '',
  email: '',
  phone: '',
  address: '',
  privacy: '',
  coverUrl: '',
  totalMembers: 0,
  ownerId: null,
})

const isOwner = computed(() => {
  return user.value?.id === group.value?.ownerId
})

// Cập nhật hàm getCurrentUser
const getCurrentUser = async () => {
  const userStr = localStorage.getItem('user') || '{}'
  console.log('userStr', userStr)
  if (userStr) {
    try {
      user.value = JSON.parse(userStr)
      if (user.value?.id) {
        const [account, profile] = await Promise.all([
          getAccountById(user.value.id),
          getProfileByAccountId(user.value.id),
        ])

        currentUserAvatar.value = profile?.avatarUrl?.trim()
          ? profile.avatarUrl
          : account?.avatar || '/image/avata.jpg'
        currentUserName.value = profile?.fullName?.trim()
          ? profile.fullName
          : account?.username || 'Ẩn danh'

        console.log(profile)
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error)
      user.value = null
    }
  }
}

// Hàm lấy thông tin nhóm
const fetchGroupDetails = async () => {
  try {
    isLoading.value = true
    const groupId = route.params.id
    console.log('Fetching group details for ID:', groupId)

    const response = await getGroupDetails(groupId)
    console.log('Group details response:', response)

    if (response && response.data) {
      const data = response.data
      group.value = {
        name: data.name || '',
        description: data.bio || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        privacy: data.type === 'PUBLIC' ? 'public' : 'private',
        coverUrl: data.coverUrl || '/src/assets/anhbia.jpg',
        totalMembers: data.members?.length || 0,
        ownerId: data.owner?.id || null,
      }

      console.log('Current user ID:', user.value?.id)
      console.log('Group owner ID:', group.value.ownerId)
    }
  } catch (error) {
    console.error('Lỗi khi lấy thông tin nhóm:', error)
    toast.error('Không thể tải thông tin nhóm!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored',
    })
  } finally {
    isLoading.value = false
  }
}

// Hàm xử lý khi chọn ảnh cho bài viết mới
const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (!file.type.match('image.*')) {
      toast.error('Vui lòng chọn file ảnh!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: 'colored',
      })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 5MB!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: 'colored',
      })
      return
    }
    selectedImage.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

// Hàm xóa ảnh đã chọn
const removeImage = () => {
  selectedImage.value = null
  imagePreview.value = null
  const input = document.querySelector('.file-input')
  if (input) input.value = ''
}

// Hàm đăng bài viết mới
const handleCreatePost = async () => {
  try {
    if (!newPostContent.value.trim()) {
      toast.error('Vui lòng nhập nội dung bài viết!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: 'colored',
      })
      return
    }

    if (!user.value) {
      toast.error('Vui lòng đăng nhập để thực hiện chức năng này!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: 'colored',
      })
      return
    }

    isPostLoading.value = true
    const formData = new FormData()
    formData.append('content', newPostContent.value.trim())
    formData.append('groupId', route.params.id)
    formData.append('accountId', user.value.id)
    formData.append('scope', 'PUBLIC')

    if (selectedImage.value) {
      formData.append('images', selectedImage.value)
    }

    const response = await createPostGroup(formData)

    // Tạo bài viết mới với thông tin cần thiết
    const newPost = {
      postId: response.data.postId,
      content: newPostContent.value.trim(),
      createdAt: new Date().toISOString(),
      accountId: user.value.id,
      user: currentUserName.value,
      userSrc: currentUserAvatar.value,
      likes: 0,
      comments: [],
      liked: false,
      postLikes: [],
      postMedias: selectedImage.value ? [{
        mediaType: 'IMAGE',
        mediaUrl: URL.createObjectURL(selectedImage.value)
      }] : []
    }

    // Thêm bài viết mới vào đầu mảng
    groupPosts.value = [newPost, ...groupPosts.value]

    // Reset form
    newPostContent.value = ''
    selectedImage.value = null
    imagePreview.value = null
    const input = document.querySelector('.file-input')
    if (input) input.value = ''

    toast.success('Đăng bài viết thành công!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored',
    })
  } catch (error) {
    console.error('Lỗi khi đăng bài viết:', error)
    toast.error('Có lỗi xảy ra khi đăng bài viết!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored',
    })
  } finally {
    isPostLoading.value = false
  }
}

// hàm lấy thông tin người dùng
// async function getProfileUser(params) {

// }

// Cập nhật hàm fetchGroupPosts để lấy avatar của người đăng bài
async function fetchGroupPosts() {
  try {
    const posts = await getPostsGroup(route.params.id)
    const user = JSON.parse(localStorage.getItem('user'))

    const processedPosts = []

    for (const post of posts) {
      try {
        // Lấy thông tin comments
        const commentsData = await getCommentsByPostId(post.postId)
        const comments = commentsData?.comments || []

        const profileOwner = await getProfileByAccountId(post.accountId)

        let postUserAvatar = '/image/avata.jpg'
        let postUserName = 'Ẩn danh'

        if (profileOwner) {
          postUserAvatar = profileOwner.avatarUrl
          postUserName = profileOwner.fullName
        }

        const isLiked = post.postLikes?.some((like) => like.accountId === user?.id)

        const processedPost = {
          ...post,
          postId: post.postId,
          user: postUserName,
          userSrc: postUserAvatar,
          content: post.content,
          createdAt: post.createdAt,
          likes: post.likeAmount || 0,
          comments: comments,
          liked: isLiked,
          postLikes: post.postLikes || [],
        }

        processedPosts.push(processedPost)
        
        // Lưu comments vào state riêng
        postComments.value[post.postId] = comments
      } catch (error) {
        console.error('Error processing post:', error)
      }
    }

    // Sắp xếp bài viết theo thời gian tạo mới nhất
    processedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // Cập nhật state với spread operator để đảm bảo reactivity
    groupPosts.value = [...processedPosts]
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài viết:', error)
    toast.error('Không thể tải danh sách bài viết!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored',
    })
  }
}

const checkGroupMembership = async () => {
  try {
    if (!user.value) {
      leftGroup.value = true
      return
    }

    const response = await getListGroupJoin(user.value.id)
    if (response && response.data) {
      const joinedGroups = response.data
      leftGroup.value = !joinedGroups.some((g) => g.id === parseInt(route.params.id))
    }
  } catch (error) {
    console.error('Error checking group membership:', error)
    leftGroup.value = true
  }
}

onMounted(() => {
  // console.log('Component mounted, route params:', route.params)
  getCurrentUser()
  fetchGroupDetails()
  checkGroupMembership()
  fetchGroupPosts()
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-container')) {
      activeMenuPostId.value = null;
    }
  });
  document.addEventListener('click', closeSearchResults)
})

onUnmounted(() => {
  document.removeEventListener('click', (e) => {
    if (!e.target.closest('.menu-container')) {
      activeMenuPostId.value = null;
    }
  });
  document.removeEventListener('click', closeSearchResults)
})

function saveChanges() {
  console.log('Thông tin nhóm đã lưu:', group.value)
  showEditPopup.value = false
}

function toggleConfirmLeave() {
  confirmLeave.value = true
}

async function handleLeaveGroup() {
  try {
    if (!user.value?.id || !route.params.id || !group.value?.ownerId) {
      toast.error('Không thể thoát khỏi nhóm!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: 'colored',
      })
      return
    }

    // Hiển thị toast loading
    toast.loading('Đang xử lý yêu cầu...', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1000,
      theme: 'colored',
    })

    await leaveGroup(route.params.id, group.value.ownerId, user.value.id)

    leftGroup.value = true
    confirmLeave.value = false

    // Refresh group data
    await fetchGroupDetails()

    toast.success('Đã thoát khỏi nhóm thành công!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored',
    })

    // Chờ 1 giây để người dùng thấy thông báo thành công
    setTimeout(() => {
      router.push('/groups')
    }, 1000)
  } catch (error) {
    console.error('Lỗi khi thoát khỏi nhóm:', error)
    toast.error('Có lỗi xảy ra khi thoát khỏi nhóm!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored',
    })
    confirmLeave.value = false
  }
}

async function handleJoin() {
  try {
    if (!user.value) {
      toast.error('Vui lòng đăng nhập để tham gia nhóm!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: 'colored',
      })
      return
    }

    await joinGroup(route.params.id, group.value.ownerId, user.value.id)

    leftGroup.value = false

    // Refresh group data
    await fetchGroupDetails()

    toast.success('Tham gia nhóm thành công!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored',
    })
  } catch (error) {
    console.error('Lỗi khi tham gia nhóm:', error)
    toast.error('Có lỗi xảy ra khi tham gia nhóm!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored',
    })
  }
}

function openReport(postId) {
  selectedPostId.value = postId
  selectedReason.value = ''
  showReportPopup.value = true
  showReportMenu.value = null
}

function closeReport() {
  showReportPopup.value = false
  selectedPostId.value = null
  selectedReason.value = ''
}

async function submitReport() {
  try {
    if (!selectedReason.value) {
      toast.error('Vui lòng chọn lý do báo cáo!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: 'colored',
      });
      return;
    }

    const reportData = {
      accountId: user.value?.id,
      targetId: selectedPostId.value,
      type: 'GROUP',
      reason: selectedReason.value
    };

    await sendReport(reportData);

    toast.success('Báo cáo đã được gửi thành công!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored',
    });

    closeReport();
  } catch (error) {
    console.error('Lỗi khi gửi báo cáo:', error);
    toast.error('Có lỗi xảy ra khi gửi báo cáo!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored',
    });
  }
}

// Thay đổi showReportMenu thành activeMenuPostId
const activeMenuPostId = ref(null);

// Cập nhật hàm toggleReportMenu
const toggleReportMenu = (postId) => {
  // Nếu menu của bài viết này đang mở, đóng nó lại
  if (activeMenuPostId.value === postId) {
    activeMenuPostId.value = null;
  } else {
    // Mở menu cho bài viết được chọn
    activeMenuPostId.value = postId;
  }
};

// Thêm hàm closeAllMenus
const closeAllMenus = () => {
  activeMenuPostId.value = null;
};

// Đóng menu khi click bên ngoài
document.addEventListener('click', (e) => {
  if (!e.target.closest('.menu-container')) {
    closeAllMenus();
  }
});

// Cập nhật template phần dropdown menu
// ... existing code ...

const openEditForm = () => {
  editForm.value = {
    name: group.value.name,
    privacy: group.value.privacy === 'public' ? 'PUBLIC' : 'PRIVATE',
    description: group.value.description,
  }
  editImagePreview.value = group.value.coverUrl
  showEditPopup.value = true
}

const closeEditForm = () => {
  showEditPopup.value = false
  errorMessage.value = ''
  editImagePreview.value = null
  editSelectedImage.value = null
}

const handleEditImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (!file.type.match('image.*')) {
      errorMessage.value = 'Vui lòng chọn file ảnh'
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = 'Kích thước ảnh không được vượt quá 5MB'
      return
    }
    editSelectedImage.value = file
    editImagePreview.value = URL.createObjectURL(file)
    errorMessage.value = ''
  }
}

const removeEditImage = () => {
  editSelectedImage.value = null
  editImagePreview.value = null
  const input = document.getElementById('editGroupImage')
  if (input) input.value = ''
}

const handleUpdateGroup = async () => {
  try {
    if (!editForm.value.name.trim() || !editForm.value.privacy) {
      errorMessage.value = 'Vui lòng điền đầy đủ thông tin nhóm'
      return
    }

    isUpdating.value = true
    errorMessage.value = ''

    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) {
      toast.error('Vui lòng đăng nhập để thực hiện chức năng này!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: 'colored',
      })
      return
    }

    const formData = new FormData()
    formData.append('name', editForm.value.name.trim())
    formData.append('type', editForm.value.privacy)
    formData.append('bio', editForm.value.description.trim())
    formData.append('owner', user.id)

    if (editSelectedImage.value) {
      formData.append('image', editSelectedImage.value)
    } else if (editImagePreview.value === null) {
      formData.append('removeImage', 'true')
    }

    await updateGroup(route.params.id, user.id, formData)

    toast.success('Cập nhật nhóm thành công!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored',
    })

    // Refresh group data
    await fetchGroupDetails()
    closeEditForm()
  } catch (error) {
    console.error('Lỗi khi cập nhật nhóm:', error)
    errorMessage.value = 'Có lỗi xảy ra khi cập nhật nhóm. Vui lòng thử lại.'
    toast.error('Có lỗi xảy ra khi cập nhật nhóm!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored',
    })
  } finally {
    isUpdating.value = false
  }
}

// Hàm mở modal xem ảnh
const openImagePreview = (imageUrl) => {
  selectedPreviewImage.value = imageUrl
}

// Hàm đóng modal xem ảnh
const closeImagePreview = () => {
  selectedPreviewImage.value = null
}

async function handleDeleteGroup() {
  try {
    if (!user.value?.id || !route.params.id) {
      toast.error('Không thể xóa nhóm!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: 'colored',
      })
      return
    }

    // Hiển thị toast loading
    toast.loading('Đang xóa nhóm...', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1000,
      theme: 'colored',
    })

    await deleteGroupByOwner(user.value.id, route.params.id)

    // Hiển thị toast success
    toast.success('Xóa nhóm thành công!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored',
    })

    // Chờ 1 giây trước khi chuyển hướng để người dùng thấy thông báo
    setTimeout(() => {
      router.push('/groups')
    }, 1000)
  } catch (error) {
    console.error('Lỗi khi xóa nhóm:', error)
    toast.error('Có lỗi xảy ra khi xóa nhóm!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored',
    })
  }
}

function toggleExpand(postId) {
  expandedPosts.value[postId] = !expandedPosts.value[postId]
}

// Thêm hàm xử lý like/unlike
async function toggleLike(post) {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user?.id) {
      toast.error('Vui lòng đăng nhập để thực hiện chức năng này!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: 'colored',
      })
      return
    }

    if (post.liked) {
      await unlikePost(user.id, post.postId)
      post.likes--
      post.liked = false
    } else {
      await likePost(user.id, post.postId)
      post.likes++
      post.liked = true
    }

    // Cập nhật UI ngay lập tức
    const postIndex = groupPosts.value.findIndex((p) => p.postId === post.postId)
    if (postIndex !== -1) {
      groupPosts.value[postIndex] = { ...post }
    }

    // toast.success(post.liked ? 'Đã thích bài viết!' : 'Đã bỏ thích bài viết!', {
    //   position: toast.POSITION.TOP_RIGHT,
    //   autoClose: 3000,
    //   theme: 'colored',
    // })
  } catch (error) {
    console.error('Lỗi khi thực hiện like/unlike:', error)
    // toast.error('Có lỗi xảy ra!', {
    //   position: toast.POSITION.TOP_RIGHT,
    //   autoClose: 3000,
    //   theme: 'colored',
    // })
  }
}

// Thêm hàm xử lý comment popup
function toggleCommentPopup(post = null) {
  if (showCommentPopup.value) {
    showCommentPopup.value = false
    activePost.value = null
  } else {
    activePost.value = post
    showCommentPopup.value = true
    // Khởi tạo input rỗng cho post này nếu chưa có
    if (!commentInputs[post.postId]) {
      commentInputs[post.postId] = ''
    }
  }
}

// Thêm hàm xử lý thêm comment
async function addComment(post) {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user?.id) {
      // toast.error('Vui lòng đăng nhập để bình luận!', {
      //   position: toast.POSITION.TOP_RIGHT,
      //   autoClose: 3000,
      //   theme: 'colored',
      // })
      return
    }

    const commentText = commentInputs[post.postId]?.trim()
    if (!commentText) {
      // toast.error('Vui lòng nhập nội dung bình luận!', {
      //   position: toast.POSITION.TOP_RIGHT,
      //   autoClose: 3000,
      //   theme: 'colored',
      // })
      return
    }

    const commentData = {
      postId: post.postId,
      accountId: user.id,
      content: commentText,
      replyCommentId: null,
    }

    // Create optimistic comment
    const optimisticComment = {
      id: Date.now(),
      content: commentText,
      createdAt: new Date().toISOString(),
      account: {
        profile: {
          fullName: currentUserName.value,
          avatarUrl: currentUserAvatar.value,
        },
      },
    }

    // Update UI immediately
    const postToUpdate = groupPosts.value.find(p => p.postId === post.postId)
    if (postToUpdate) {
      if (!Array.isArray(postToUpdate.comments)) {
        postToUpdate.comments = []
      }
      postToUpdate.comments = [optimisticComment, ...postToUpdate.comments]
      groupPosts.value = [...groupPosts.value]
    }

    // Reset input for this specific post
    commentInputs[post.postId] = ''

    // Call API
    const response = await createComment(commentData)
    console.log('API response for createComment:', response)

    // Update with real comment data if needed
    if (postToUpdate) {
      const commentIndex = postToUpdate.comments.findIndex(c => c.id === optimisticComment.id)
      if (commentIndex !== -1) {
        postToUpdate.comments[commentIndex] = {
          ...optimisticComment,
          id: response.id
        }
        groupPosts.value = [...groupPosts.value]
      }
    }

    // toast.success('Đã thêm bình luận!', {
    //   position: toast.POSITION.TOP_RIGHT,
    //   autoClose: 3000,
    //   theme: 'colored',
    // })
  } catch (error) {
    console.error('Lỗi khi thêm bình luận:', error)
    // Rollback UI if error occurs
    const postToUpdate = groupPosts.value.find(p => p.postId === post.postId)
    if (postToUpdate) {
      postToUpdate.comments = postToUpdate.comments.filter(c => c.id !== optimisticComment.id)
      groupPosts.value = [...groupPosts.value]
    }
    
    // toast.error('Có lỗi xảy ra khi thêm bình luận!', {
    //   position: toast.POSITION.TOP_RIGHT,
    //   autoClose: 3000,
    //   theme: 'colored',
    // })
  }
}

// Tạo URL chia sẻ
const shareUrl = computed(() => {
  if (!selectedPost.value) return ''
  return `${window.location.origin}/post/${selectedPost.value.postId}`
})

// Hàm xử lý copy link
async function copyShareLink() {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)

    toast.success('Đã sao chép liên kết!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
      theme: 'colored',
    })
  } catch (error) {
    console.error('Lỗi khi sao chép:', error)
    // Fallback cho trường hợp không hỗ trợ Clipboard API
    const input = shareUrlInput.value
    input.select()
    document.execCommand('copy')
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

// Hàm toggle popup
function toggleSharePopup(post = null) {
  if (showSharePopup.value) {
    showSharePopup.value = false
    selectedPost.value = null
  } else {
    selectedPost.value = post
    showSharePopup.value = true
    copied.value = false
  }
}

// Thêm computed property để kiểm tra quyền đăng bài
const canPost = computed(() => {
  return !leftGroup.value
})

// Thêm computed property để lấy 6 bài viết mới nhất
const recentPosts = computed(() => {
  return [...groupPosts.value]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6)
})

// Thêm hàm để định dạng thời gian
const getTimeAgo = (date) => {
  const now = new Date()
  const postDate = new Date(date)
  const diffInSeconds = Math.floor((now - postDate) / 1000)

  if (diffInSeconds < 60) {
    return 'Vừa xong'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} phút trước`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} giờ trước`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ngày trước`
  }
}

// Cập nhật lại hàm scrollToPost để di chuyển đến bài viết mượt mà hơn
const scrollToPost = (postId) => {
  const postElement = document.querySelector(`.post-card[data-post-id="${postId}"]`)
  if (postElement) {
    // Scroll đến bài viết với hiệu ứng mượt
    postElement.scrollIntoView({ behavior: 'smooth', block: 'center' })

    // Thêm hiệu ứng highlight
    postElement.style.backgroundColor = '#fff3e0'
    setTimeout(() => {
      postElement.style.backgroundColor = 'transparent'
      postElement.style.transition = 'background-color 1s ease'
    }, 100)
  }
}

// Thêm hàm để chuyển đến trang chi tiết bài viết
const navigateToPost = (postId) => {
  router.push({
    name: 'PostDetail',
    params: { id: postId },
  })
}

// Thêm hàm formatCommentTime vào phần script
const formatCommentTime = (dateString) => {
  const now = new Date()
  const commentDate = new Date(dateString)
  const diffInSeconds = Math.floor((now - commentDate) / 1000)

  if (diffInSeconds < 60) {
    return 'Vừa xong'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} phút trước`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} giờ trước`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    if (days < 30) {
      return `${days} ngày trước`
    } else {
      return commentDate.toLocaleDateString('vi-VN')
    }
  }
}

// Thêm computed property để theo dõi comments
const getPostComments = computed(() => (postId) => {
  const post = groupPosts.value.find(p => p.postId === postId)
  return post?.comments || []
})

// Thêm state cho reply
const replyingCommentId = ref(null)
const replyInputs = reactive({})

// Thêm hàm xử lý reply
function prepareReply(comment) {
  replyingCommentId.value = comment.id
  if (!replyInputs[comment.id]) {
    replyInputs[comment.id] = `@${comment.account?.profile?.fullName || 'Người dùng'} `
  }
}

async function submitReply(comment) {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user?.id) {
      toast.error('Vui lòng đăng nhập để trả lời bình luận!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: 'colored',
      })
      return
    }

    const replyText = (replyInputs[comment.id] || '').trim()
    if (!replyText) {
      toast.error('Vui lòng nhập nội dung trả lời!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: 'colored',
      })
      return
    }

    const response = await createComment({
      postId: activePost.value.postId,
      accountId: user.id,
      content: replyText,
      replyCommentId: comment.id
    })

    // Tạo object reply mới
    const newReply = {
      id: response.id,
      content: replyText,
      createdAt: new Date().toISOString(),
      account: {
        profile: {
          fullName: currentUserName.value,
          avatarUrl: currentUserAvatar.value,
        },
      },
    }

    // Cập nhật UI
    const postIndex = groupPosts.value.findIndex(p => p.postId === activePost.value.postId)
    if (postIndex !== -1) {
      const commentIndex = groupPosts.value[postIndex].comments.findIndex(c => c.id === comment.id)
      if (commentIndex !== -1) {
        if (!Array.isArray(groupPosts.value[postIndex].comments[commentIndex].replies)) {
          groupPosts.value[postIndex].comments[commentIndex].replies = []
        }
        groupPosts.value[postIndex].comments[commentIndex].replies.push(newReply)
        // Force reactivity update
        groupPosts.value = [...groupPosts.value]
      }
    }

    // Reset input và trạng thái
    replyInputs[comment.id] = ''
    replyingCommentId.value = null

    // toast.success('Đã thêm trả lời!', {
    //   position: toast.POSITION.TOP_RIGHT,
    //   autoClose: 3000,
    //   theme: 'colored',
    // })
  } catch (error) {
    console.error('Lỗi khi trả lời bình luận:', error)
    toast.error('Có lỗi xảy ra khi trả lời bình luận!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored',
    })
  }
}

// Cập nhật template phần modal comments

// Add this computed property to check if user is post owner
const isPostOwner = (post) => {
  return user.value?.id === post.accountId;
}

// Add delete post handler
const handleDeletePost = (postId) => {
  openDeleteConfirm(postId)
}

// Hàm xác nhận xóa bài viết
const confirmDeletePost = async () => {
  try {
    await deletePost(postToDelete.value)
    
    // Remove post from local state
    groupPosts.value = groupPosts.value.filter(post => post.postId !== postToDelete.value)
    
    // Đóng popup
    closeDeleteConfirm()

    toast.success('Xóa bài viết thành công!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored',
    })
  } catch (error) {
    console.error('Lỗi khi xóa bài viết:', error)
    toast.error('Có lỗi xảy ra khi xóa bài viết!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored',
    })
  }
}

// ... existing code ...

// Thêm state cho form chỉnh sửa bài viết
const showEditPostPopup = ref(false);
const editPostForm = reactive({
  content: '',
  images: [],
  scope: 'PUBLIC',
});
const editImagePreviews = ref([]);
const editingPostId = ref(null);

// Hàm mở form chỉnh sửa
const handleEditPost = (post) => {
  editingPostId.value = post.postId;
  editPostForm.content = post.content;
  editPostForm.scope = post.scope || 'PUBLIC';
  editImagePreviews.value = post.postMedias
    ?.filter(media => media.mediaType === 'IMAGE')
    .map(media => media.mediaUrl) || [];
  showEditPostPopup.value = true;
  activeMenuPostId.value = null; // Đóng dropdown menu
};

// Hàm đóng form chỉnh sửa
const closeEditPostForm = () => {
  showEditPostPopup.value = false;
  editingPostId.value = null;
  editPostForm.content = '';
  editPostForm.images = [];
  editImagePreviews.value = [];
};

const handleEditPostImageChange = (event) => {
  const files = Array.from(event.target.files);
  const validImageFiles = files.filter(file => file.type.startsWith('image/'));
  
  if (validImageFiles.length > 0) {
    editPostForm.images.push(...validImageFiles);
    const newPreviews = validImageFiles.map(file => URL.createObjectURL(file));
    editImagePreviews.value.push(...newPreviews);
  }
};

const removeEditPostImage = (index) => {
  editPostForm.images.splice(index, 1);
  editImagePreviews.value.splice(index, 1);
};

// Cập nhật bài viết
const handleUpdatePost = async () => {
  try {
    if (!editPostForm.content.trim()) {
      toast.error('Vui lòng nhập nội dung bài viết!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: 'colored',
      });
      return;
    }

    const formData = new FormData();
    formData.append('content', editPostForm.content.trim());
    formData.append('ownerId', user.value.id);
    formData.append('scope', editPostForm.scope);
    formData.append('groupId', route.params.id);

    // Thêm ảnh vào formData
    editPostForm.images.forEach(image => {
      formData.append('images', image);
    });

    await updatePost(editingPostId.value, formData);

    // Refresh posts list
    await fetchGroupPosts();

    // Đóng form và reset state
    closeEditPostForm();

    toast.success('Cập nhật bài viết thành công!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored',
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật bài viết:', error);
    toast.error('Có lỗi xảy ra khi cập nhật bài viết!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored',
    });
  }
};

// ... existing code ...

const searchQuery = ref('')
const isSearching = ref(false)
const showSearchResults = ref(false)

// Computed property for filtered posts
const searchResults = computed(() => {
  if (!searchQuery.value.trim()) {
    return []
  }
  
  const query = searchQuery.value.toLowerCase()
  return groupPosts.value.filter(post => {
    const usernameMatch = post.user?.toLowerCase().includes(query)
    const contentMatch = post.content?.toLowerCase().includes(query)
    return usernameMatch || contentMatch
  })
})

// Handle search input
const handleSearch = () => {
  isSearching.value = true
  showSearchResults.value = true
  
  // Debounce search to avoid too many updates
  setTimeout(() => {
    isSearching.value = false
  }, 300)
}

// Close search results when clicking outside
const closeSearchResults = (event) => {
  if (!event.target.closest('.search-container')) {
    showSearchResults.value = false
  }
}

// Thêm state cho popup xác nhận xóa
const showDeleteConfirm = ref(false)
const postToDelete = ref(null)

// Hàm mở popup xác nhận xóa
const openDeleteConfirm = (postId) => {
  postToDelete.value = postId
  showDeleteConfirm.value = true
  activeMenuPostId.value = null // Đóng dropdown menu
}

// Hàm đóng popup xác nhận xóa
const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false
  postToDelete.value = null
}
</script>

<style scoped>
/* --- Cấu trúc nền chung --- */
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
.app-container {
  font-family: 'Arial', sans-serif;
  background: #f9f9f9;
  min-height: 100vh;
  width: 100%;
}

/* --- Header --- */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 386px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.search-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 24px;
  font-size: 15px;
  outline: none;
  background: #f0f2f5;
  transition: all 0.3s ease;
}

.search:focus {
  background: #fff;
  border-color: #1a73e8;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.search-loading {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  margin-top: 8px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
}

.searching-message,
.no-results {
  padding: 16px;
  text-align: center;
  color: #65676b;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-result-item:hover {
  background-color: #f0f2f5;
}

.result-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
}

.result-info {
  flex: 1;
}

.result-username {
  font-weight: 600;
  margin-bottom: 4px;
}

.result-content {
  color: #65676b;
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #1a73e8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* --- Ảnh bìa --- */
.cover {
  width: 100%;
  height: 325px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

/* --- Phần giới thiệu nhóm --- */
.full-width-group {
  width: 100%;
  padding: 16px 90px;
  background: #fff;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
.group-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}
.group-info h1 {
  font-size: 24px;
  color: #333;
  margin: 0;
}
.members,
.avatars {
  margin: 0;
}
.avatars {
  margin: 10px 0;
}
.avatars .avatar,
.post-header .avatar,
.status-box .avatar,
.recent-avatar {
  border-radius: 50%;
}
.avatars .avatar {
  width: 32px;
  height: 32px;
}
.post-header .avatar {
  width: 40px;
  height: 40px;
}
.status-box .avatar {
  width: 36px;
  height: 36px;
}
.recent-avatar {
  width: 44px;
  height: 44px;
  border: 2px solid #880e4f;
}

/* --- Hành động nhóm --- */
.group-actions button {
  /* margin-right: 100px; */
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-left: -2px;
  margin-top: 20px;
}
.invite {
  background-color: orange;
  color: #fff;
}
.joined {
  background-color: #eee;
}
.join {
  background-color: #2196f3;
  color: #fff;
}

/* --- Layout chính --- */
.main {
  padding: 20px 90px;
  box-sizing: border-box;
  width: 100%;
}
.layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;       /* khoảng cách giữa hai cột */
  align-items: start;
  width: 100%;
  padding: 0 90px; /* tương tự padding main nếu cần */
  box-sizing: border-box;
}

.left,
.right {
  margin: 0;
  padding: 0;
}
/* --- Ô đăng trạng thái --- */
.new-post {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  padding: 16px;
  margin-bottom: 24px;
  width: 100%;
}

.new-post-header {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  margin-left: -4px;
}

.post-input {
  flex: 1;
  min-height: 80px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  resize: none;
  font-family: inherit;
  font-size: 15px;
  line-height: 1.5;
  transition: border-color 0.2s;
}

.post-input:focus {
  outline: none;
  border-color: #f9a825;
}

.post-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.preview-container {
  position: relative;
  margin: 12px 0;
  border-radius: 8px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
}

.remove-preview {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: background-color 0.2s;
}

.remove-preview:hover {
  background: rgba(0, 0, 0, 0.8);
}

.new-post-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
}

.left-actions {
  display: flex;
  gap: 12px;
}

.upload-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  color: #666;
}

.upload-button:hover {
  background-color: #f5f5f5;
}

.upload-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.file-input {
  display: none;
}

.share-button {
  background-color: #f9a825;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.share-button:hover:not(:disabled) {
  background-color: #f57c00;
}

.share-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.7;
}

/* --- Bài viết --- */
.post-card {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  padding: 10px 10px 1px 10px;
  width: 100%;
  transition: background-color 0.5s ease;
  margin-bottom: 20px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #000000;
  object-fit: cover;
}
.post-info {
  flex: 1;
}

.username {
  font-size: 16px;
  font-weight: 600;
  color: #141414;
  display: block;
  margin-bottom: 4px;
}
.time {
  font-size: 13px;
  color: #888;
}
.menu-container {
  position: relative;
  display: inline-block;
}
.menu {
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
  
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 10px;
    padding-top: 10px;

}
.menu:hover {
  background-color: #f0f2f5;
}
.report-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 180px;
  padding: 8px 0;
}
.report-dropdown button {
  width: 100%;
  padding: 8px 16px;
  text-align: left;
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  font-size: 14px;
}
.report-dropdown button:hover {
  background-color: #f5f5f5;
}
.report-dropdown button:not(:last-child) {
  border-bottom: 1px solid #eee;
}

/* Add color for delete button */
.report-dropdown button:first-child {
  color: #dc3545;
}

/* .post-content {
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 16px;
  color: #1a1a1a;
  position: relative;
} */

.post-content p {
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-content.expanded p {
  display: block;
  -webkit-line-clamp: unset;
}

.see-more-btn {
  background: none;
  border: none;
  color: #65676b;
  font-size: 14px;
  padding: 4px 0;
  cursor: pointer;
  margin-top: 4px;
  font-weight: 500;
}

.see-more-btn:hover {
  text-decoration: underline;
}

.post-media-container {
  margin: 12px 0;
  border-radius: 8px;
  overflow: hidden;
}
.post-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  cursor: pointer;
}
.post-actions {
  display: flex;
  align-items: center;
  padding: 12px 8px 12px 5px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin: 12px 0;
}
.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-right: 24px;
  cursor: pointer;
}
.action-item-share{
  display: flex;
  align-items: center;
  gap: 6px;
  margin-right: 0px;
  margin-left: 388px;
  cursor: pointer;
}
.action-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}
.action-count {
  font-size: 14px;
  color: #666;
}
.comment-list {
  margin: 16px 0;
}
.comment-item {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
.comment-bubble {
  background: #f0f2f5;
  padding: 8px 12px;
  border-radius: 18px;
  flex: 1;
}
.comment-username {
  font-weight: 600;
  margin-right: 6px;
}
.comment-text {
  color: #1a1a1a;
}
.comment-time {
  font-size: 12px;
  color: #65676b;
  margin-top: 4px;
}
.comment-box {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
}
.comment-box:focus {
  border-color: #1a73e8;
}

/* --- Giới thiệu nhóm --- */
.introduction {
  background: #fff;
  padding: 20px;
  margin-left: 140px;
  margin-bottom: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 81%; /* hoặc để auto nếu bạn muốn */
}

/* 1. Xóa hết margin-left và width cố định */
.introduction {

  margin: 0 50px 24px;      /* chỉ giữ margin-bottom */
  padding: 20px;
  width: 100%;           /* full width cột bên phải */
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.sidebar-box {
  margin: 0 0 24px;      /* chỉ giữ margin-bottom */
  padding: 20px;
  width: 100%;       
     
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.group-type.public[data-v-fcbc4baa] {
    background-color: #e6f4ea;
    color: #1e7e34;
    margin-top: -289px;
}


/* 2. Điều chỉnh layout chung để 2 cột sát nhau */
.layout {
  display: grid;
  grid-template-columns: 2fr 1fr; /* trái rộng 2, phải rộng 1 */
  gap: 24px;                      /* khoảng cách giữa 2 cột */
  padding: 0 90px;                /* giữ padding trái/phải cho cả layout */
  box-sizing: border-box;
}

/* 3. Khi xuống tablet/mobile thì stack dọc */
@media (max-width: 768px) {
  .layout {
    display: flex;
    flex-direction: column;
    padding: 0 16px;
  }
  .introduction,
  .sidebar-box {
    margin-bottom: 20px;
  }
}


.intro-title {
  color: #333;
  font-size: 18px;
  margin-bottom: 12px;
}
.intro-desc {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 20px;
}
.contact-title {
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}
.edit-group-btn {
  margin-top: 12px;
  margin-left: 9px;
  background-color: #f9a825;
  color: #000;
  border: none;
  padding: 9px 90px;
  font-size: 14px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
}
.inline-icon,
.icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 4px;
}

/* --- Sidebar --- */
.sidebar-box {
  background: #fff;
  padding: 16px;
  margin: 0 50px  20px;    /* chỉ giữ margin-bottom */
  width: 100%;         /* full width trong cột phải */
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
} 
.recent-post {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: background-color 0.2s;
  cursor: pointer;
}
.recent-post:hover {
  background-color: #f5f5f5;
}
.recent-info {
  flex: 1;
  min-width: 0; /* Để tránh overflow */
}
.recent-name {
  font-size: 14px;
  margin-bottom: 4px;
  color: #333;
}
.recent-content {
  font-size: 13px;
  color: #666;
  margin: 4px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.recent-time {
  color: #0288d1;
  font-size: 13px;
  margin-top: 2px;
}
.recent-button {
  background-color: #f9a825;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
}
.recent-button:hover {
  background-color: #f57c00;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.recent-button:active {
  transform: translateY(0);
  box-shadow: none;
}
.no-recent-posts {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
}
.highlight-post {
  animation: highlight 2s ease-out;
}
@keyframes highlight {
  0% {
    background-color: rgba(249, 168, 37, 0.2);
  }
  100% {
    background-color: transparent;
  }
}

/* --- Overlay popup --- */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

/* --- Popup xác nhận --- */
.popup {
  background: #fff;
  padding: 20px 24px;
  width: 360px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  font-family: Arial, sans-serif;
}
.popup-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
}
.popup .leave {
  background-color: #f44336;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
.popup .cancel {
  background-color: #ccc;
  color: #000;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

/* --- Popup báo cáo --- */
.report-popup {
  background: #fff;
  padding: 24px;
  width: 480px;
  max-width: 90vw;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  font-family: Arial, sans-serif;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.popup-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding-top: 0px;
  padding-bottom: 6px;

  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  transition: background-color 0.2s;
  
}

.close-btn:hover {
  background-color: #f5f5f5;
}

.popup-question {
  font-size: 16px;
  margin-bottom: 20px;
  color: #555;
  line-height: 1.4;
}

.report-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.report-option {
  background: #f9f9f9;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.report-option:hover {
  background: #f0f0f0;
  border-color: #d0d0d0;
}

.report-option.selected {
  background: #fff3e0;
  border-color: #f9a825;
}

.report-option input[type='radio'] {
  width: 18px;
  height: 18px;
  accent-color: #f9a825;
}

.report-option label {
  flex: 1;
  font-size: 15px;
  cursor: pointer;
  color: #333;
  line-height: 1.3;
}

.confirm-button {
  background-color: #f9a825;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: bold;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.2s;
}

.confirm-button:hover:not(:disabled) {
  background-color: #f57c00;
}

.confirm-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #f9a825;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.privacy-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.privacy-badge.public {
  background-color: #e6f4ea;
  color: #1e7e34;
  margin-top : 11px;
}

.privacy-badge.private {
  background-color: #fef3f2;
  color: #b42318;
}

.edit-form {
  background: #f9f9f9;
  padding: 24px;
  border-radius: 16px;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  position: relative;
}

.edit-form input,
.edit-form select,
.edit-form textarea {
  padding: 12px;
  border: none;
  border-radius: 12px;
  background-color: #ffffff;
  font-size: 14px;
  color: #444;
}

.edit-form textarea {
  min-height: 100px;
  resize: vertical;
}

.edit-form select:invalid {
  color: gray;
}

.submit-btn {
  padding: 12px;
  background: #ffd6a1;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.file-input-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-label {
  display: inline-block;
  padding: 12px;
  background-color: #ffe9cf;
  border-radius: 12px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s;
}

.file-label:hover {
  background-color: #ffd6a1;
}

.file-label input[type='file'] {
  display: none;
}

.image-preview-container {
  position: relative;
  width: 100%;
  margin-bottom: 10px;
  border-radius: 12px;
  overflow: hidden;
}

.image-preview {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
}

.remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.remove-image:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #444;
}

.error-message {
  color: #dc2626;
  background-color: #fee2e2;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

/* Comment styles */
.comment {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.comment-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

.comment-content {
  background-color: #f2f2f2;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 14px;
}

.comment-content strong {
  margin-right: 4px;
}

/* Image preview in new post */
.image-preview-container {
  margin: 12px 0;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.remove-image:hover {
  background: rgba(0, 0, 0, 0.8);
}

.post-media-container {
  margin: 10px 0;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.post-media-container img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.post-media-container img:hover {
  transform: scale(1.02);
}

/* Nếu chỉ có 1 ảnh thì hiển thị full width */
.post-media-container:has(img:only-child) img {
  grid-column: 1 / -1;
}

/* Thêm style cho modal xem ảnh nếu cần */
.image-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.image-preview-modal img {
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
}

.image-preview-modal .close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  color: white;
  font-size: 30px;
  cursor: pointer;
}

.delete-group {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 10px;
  font-weight: bold;
}

.delete-group:hover {
  background-color: #c82333;
}

/* Share Link Popup Styles */
.share-popup {
  background: #ffffff;
  width: 500px;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.popup-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  margin-right: 10px;
  padding-top: 0px;
  padding-bottom: 6px;

  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  transition: background-color 0.2s;
  
    padding-top: 4px;

}

.close-btn:hover {
  background-color: #f5f5f5;
}

.share-link-container {
  display: flex;
  gap: 10px;
}

.share-link-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  background: #f8f9fa;
  cursor: text;
}

.copy-link-btn {
  padding: 0 20px;
  background-color: #f9a825;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.copy-link-btn:hover {
  background-color: #f57c00;
}

.share-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.social-share-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.social-share-btn:hover {
  opacity: 0.9;
}

.social-share-btn img {
  width: 24px;
  height: 24px;
}

.social-share-btn.facebook {
  background-color: #1877f2;
  color: white;
}

.social-share-btn.twitter {
  background-color: #1da1f2;
  color: white;
}

/* Add new styles for non-member view */
.post-stats {
  padding: 12px 16px;
  border-top: 1px solid #eee;
  color: #666;
  font-size: 14px;
  display: flex;
  gap: 16px;
}

.join-message {
  background: #fff;
  padding: 20px;
  text-align: center;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  color: #666;
  font-size: 15px;
}

.btn-send {
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 9px;
  background-color: #009dff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 0 0 0 0;
}

.btn-send:active {
  transform: translateY(0);
  box-shadow: none;
}

.btn-send:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.comment-input {
  display: flex;
  align-items: center;
  margin-top: 12px;
  gap: 8px;
}

.comment-box {
  width: 100%;
  flex: 1;
  height: 42px;
  padding: 0 12px;
  border: 1px solid #ccc;
  border-radius: 9px;
  outline: none;
}

.comment-box:focus {
  border-color: #4e9bff;
  box-shadow: 0 0 0 2px rgba(249, 168, 37, 0.1);
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.post-modal {
  background: white;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.post-header {
  padding: 10px 0 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.post-title {
  font-size: 20px;
  font-weight: 700;
  color: #1c1e21;
  margin: 0;
  padding-left: 12px;
  padding-bottom: 8px;
}

.close-btn {
  background: #f0f2f5;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  color: #606770;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: #e4e6ea;
}

.post-content {
  padding: 10px 10px 0px 10px;
}
.groupCommnent button {
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 9px;
  background-color: #009dff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 0 0 0 0;
}

.post-author {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
}

.author-info {
  flex: 1;
}


.author-name {
  font-size: 15px;
  font-weight: 600;
  color: #1c1e21;
  margin-bottom: 2px;
}

.post-time {
  font-size: 13px;
  color: #65676b;
  display: flex;
  align-items: center;
}

.reply-link {
  color: #1877f2;
  text-decoration: none;
  margin-left: 8px;
  font-size: 13px;
}

.reply-link:hover {
  text-decoration: underline;
}

.post-text {
  background: #f0f2f5;
  border-radius: 18px;
  padding: 12px 16px;
  margin: 16px 0;
  font-size: 15px;
  line-height: 1.4;
  color: #1c1e21;
}

.post-images {
  margin: 16px 0;
}

.post-image-modal {
  width: 100%;
  max-width: 100%;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 8px;
}

.comments-title {
  font-size: 16px;
  font-weight: 600;
  color: #1c1e21;
  margin-bottom: 12px;
}

.comments-list {
  max-height: 300px;
  overflow-y: auto;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 10px;
  margin-bottom: 0px;
}

.comment-avatar-modal {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
  object-fit: cover;
}


.comment-header-modal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}

.comment-username-modal {
  font-size: 13px;
  font-weight: 600;
  color: #1c1e21;
}

.comment-time-modal {
  font-size: 12px;
  color: #65676b;
}


.comment-input-section {
  padding: 16px 20px;
  border-top: 1px solid #e4e6ea;
  background: #fafbfc;
}

.comment-input-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.comment-input-modal {
  flex: 1;
  border: 1px solid #ccd0d5;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
}

.comment-input-modal:focus {
  border-color: #1877f2;
}

.comment-input-modal::placeholder {
  color: #65676b;
}

.send-btn-modal {
  background: #1877f2;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.send-btn-modal:hover {
  background: #166fe5;
}

.send-btn-modal:disabled {
  background: #e4e6ea;
  color: #bcc0c4;
  cursor: not-allowed;
}

/* View more comments button styles */
.view-more-comments {
  margin: 8px 0;
  text-align: center;
  padding-left: 0px;

  padding-right: 328px;
  height: 35px;
  width: 550px;
}

.view-more-btn {
  background: none;
  border: none;
  color: #1877f2;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin: 1px 190px 3px 0;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background-color 0.2s;

  padding-left: 0px;
  padding-right: 0px;
  margin-right: 0px;
  margin-bottom: 0px;
}

.view-more-btn:hover {
  background: #f0f2f5;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.comment-item-modal {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
}

.comment-avatar-modal {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}

.comment-main {
  display: flex;
  flex-direction: column;
}

.comment-bubble-modal {
  background-color: #f0f2f5;
  padding: 8px 12px;
  border-radius: 16px;
  max-width: 500px;
}

.comment-header-modal {
  font-weight: 600;
  margin-bottom: 2px;
}

.comment-text-modal {
  font-size: 14px;
  color: #050505;
}

.comment-actions-modal {
  display: flex;
  gap: 6px;
  margin-top: 4px;
  font-size: 13px;
  color: #65676b;
}

.btn-reply-modal {
  background: none;
  border: none;
  color: #1877f2;
  cursor: pointer;
  font-size: 13px;
  padding: 0;
}

.reply-input-section {
  margin-top: 4px;
  margin-bottom: 8px;
  padding-left: 48px;
}

.reply-input-wrapper {
  display: flex;
  align-items: center;
  
  border-radius: 50px;
  padding: 4px;
  gap: 8px;
  max-width: 500px;
}

.reply-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #050505;
  padding: 8px 12px;
  background: transparent;
}

.reply-input::placeholder {
  color: #1877f2;
  font-weight: 500;
}

/* .btn-send-reply {
  background: #0095f6;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
} */

.btn-send-reply:disabled {
  background: #ccd0d5;
  cursor: not-allowed;
}

.btn-send-reply:not(:disabled):hover {
  background: #1877f2;
}

.reply-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.reply-mention {
  color: #1877f2;
  font-weight: 500;
  margin-right: 4px;
}

.reply-footer {
  display: flex;
  gap: 12px;
  margin-top: 4px;
  padding-left: 12px;
  align-items: center;
}

.reply-time {
  font-size: 12px;
  color: #65676b;
  margin-left: 12px;
  margin-top: 4px;
}

.reply-action {
  font-size: 12px;
  color: #65676b;
  font-weight: 500;
  cursor: pointer;
}

.reply-action:hover {
  text-decoration: underline;
}
.reply-input-section {
  margin-top: 8px;

}

.reply-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.reply-input {
  flex: 1;
  padding: 8px 12px;
  border: 2px solid black;
  border-radius: 999px; /* tạo bo tròn */
  font-size: 14px;
  outline: none;
  flex: 1;
    padding: 8px 12px;
    border: 1px solid #a5a5a5;
    border-radius: 10px;
    font-size: 14px;
    outline: none;
}

.btn-send-reply {
 background-color: #1877f2;
    color: white;
    border: none;
    border-radius: 10px;
    padding: 6px 14px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-send-reply:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.reply-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  margin-left: 48px;
}

.reply-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}

.reply-content {
  display: flex;
  flex-direction: column;
}

.reply-bubble {
  background-color: #f0f2f5;
  padding: 8px 12px;
  border-radius: 16px;
  max-width: 500px;
  display: inline-block;
}

.reply-header {
  margin-bottom: 2px;
}

.reply-username {
  font-weight: 600;
  font-size: 13px;
  color: #050505;
}

.reply-text {
  font-size: 14px;
  color: #050505;
}

.reply-mention {
  color: #1877f2;
  font-weight: 500;
}

.reply-footer {
  display: flex;
  gap: 6px;
  margin-top: 4px;
  font-size: 13px;
  color: #65676b;
  padding-left: 12px;
}

.reply-time {
  font-size: 12px;
  color: #65676b;
}

.reply-action {
  font-size: 12px;
  color: #65676b;
  cursor: pointer;
}

.reply-action:hover {
  text-decoration: underline;
}


@media (min-width: 1025px) {
  .header {
    padding: 15px 80px;
  }
  .search {
    width: 350px;
  }
  .layout {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
    padding: 0 90px;
  }
}

/* ----------------------------------------
   Tablet (600px – 1024px)
-----------------------------------------*/
@media (max-width: 1024px) and (min-width: 601px) {
  .header {
    padding: 12px 40px;
  }
  .search {
    width: 60%;
  }
  .cover {
    height: 250px;
  }
  .full-width-group {
    padding: 16px 40px;
  }
  .layout {
    display: grid;
    grid-template-columns: 1fr; /* stack dọc 1 cột */
    gap: 20px;
    padding: 0 40px;
  }
  .introduction,
  .sidebar-box {
    width: 100%;
    margin: 0 0 20px;
  }
}

/* ----------------------------------------
   Mobile (dưới 600px)
-----------------------------------------*/
@media (max-width: 600px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 16px;
  }
  .search {
    width: 100%;
    margin-top: 10px;
  }
  .cover {
    height: 150px;
  }
  .full-width-group {
    padding: 12px 16px;
  }
  .layout {
    display: flex;
    flex-direction: column;
    padding: 0 16px;
    gap: 16px;
  }
  .introduction,
  .sidebar-box {
    padding: 16px;
    margin-bottom: 16px;
    width: 100%;
  }
  /* giảm kích thước avatar, button, input trên mobile */
  .new-post-header img,
  .post-header .avatar {
    width: 32px;
    height: 32px;
  }
  .post-input {
    font-size: 14px;
    padding: 10px;
  }
  .action-icon {
    width: 18px;
    height: 18px;
  }
  .comment-avatar {
    width: 28px;
    height: 28px;
  }
  .recent-button {
    padding: 6px 12px;
    font-size: 13px;
  }
  /* đảm bảo các modal và popup co dãn */
  .report-popup,
  .edit-form,
  .share-popup,
  .popup {
    width: 90%;
    padding: 16px;
  }
}

.edit-post-form {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.edit-post-input {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 16px 0;
  font-size: 15px;
  resize: vertical;
}

.preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  margin: 16px 0;
}

.preview-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.remove-preview {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-post-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.media-buttons {
  display: flex;
  gap: 12px;
}

.scope-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.update-button {
  background: #f9a825;
  color: white;
  border: none;
  padding: 8px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.update-button:hover {
  background: #f57c00;
}

.update-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Styles cho popup xác nhận xóa */
.delete-confirm-popup {
  background: white;
  width: 400px;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.popup-header h3 {
  margin: 0;
  font-size: 18px;
  color: #1a1a1a;
}

.popup-content {
  margin-bottom: 24px;
}

.popup-content p {
  margin: 0 0 8px;
  color: #333;
}

.warning-text {
  color: #dc3545;
  font-size: 14px;
}

.popup-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #f5f5f5;
}

.confirm-delete-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #dc3545;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.confirm-delete-btn:hover {
  background: #c82333;
}

</style>
