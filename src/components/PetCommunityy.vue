<template>
  <layout>
    <div class="wrapper">
      <!-- Thanh tìm kiếm -->
      <div class="search-box-new">
        <input type="text" placeholder="Tìm kiếm" v-model="searchTerm" />
        <button class="search-button">
          <img src="/icon/search.png" alt="Search" class="nav-icon" />
        </button>
      </div>
      <div class="search-bar">
        <button @click="showCreateGroup = true">+ Tạo nhóm</button>
      </div>
      <!-- Popup tạo nhóm mới -->
      <div class="overlay" v-if="showCreateGroup">
        <div class="create-form">
          <div class="form-header">
            <h3>Tạo nhóm mới</h3>
            <button class="close-btn" @click="showCreateGroup = false">×</button>
          </div>
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <input
            type="text"
            v-model="newGroupName"
            placeholder="Nhập tên nhóm"
            :disabled="isCreating"
          />
          <select v-model="newGroupPrivacy" :disabled="isCreating">
            <option disabled value="">Chọn quyền riêng tư</option>
            <option>Công khai</option>
            <option>Riêng tư</option>
          </select>
          <textarea
            v-model="newGroupBio"
            placeholder="Nhập mô tả nhóm"
            :disabled="isCreating"
          ></textarea>
          <div class="file-input-container">
            <label for="groupImage" class="file-label" v-if="!imagePreview">
              <span>Chọn ảnh bìa nhóm</span>
              <input
                type="file"
                id="groupImage"
                @change="handleImageChange"
                accept="image/*"
                :disabled="isCreating"
              />
            </label>
            <div v-if="imagePreview" class="image-preview-container">
              <img :src="imagePreview" alt="Preview" class="image-preview" />
              <button type="button" class="remove-image" @click="removeImage">
                <span>×</span>
              </button>
            </div>
            <span v-if="selectedImage" class="file-name">{{ selectedImage.name }}</span>
          </div>
          <button class="submit-btn" @click="createNewGroup" :disabled="isCreating">
            {{ isCreating ? 'Đang tạo...' : 'Tạo nhóm' }}
          </button>
        </div>
      </div>

      <!-- Popup chỉnh sửa nhóm -->
      <div class="overlay" v-if="showEditGroup">
        <div class="create-form">
          <div class="form-header">
            <h3>Chỉnh sửa nhóm</h3>
            <button class="close-btn" @click="showEditGroup = false">×</button>
          </div>
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <input
            type="text"
            v-model="editGroupName"
            placeholder="Nhập tên nhóm"
            :disabled="isEditing"
          />
          <select v-model="editGroupPrivacy" :disabled="isEditing">
            <option disabled value="">Chọn quyền riêng tư</option>
            <option>Công khai</option>
            <option>Riêng tư</option>
          </select>
          <textarea
            v-model="editGroupBio"
            placeholder="Nhập mô tả nhóm"
            :disabled="isEditing"
          ></textarea>
          <div class="file-input-container">
            <label for="editGroupImage" class="file-label" v-if="!editImagePreview">
              <span>Chọn ảnh bìa nhóm</span>
              <input 
                type="file" 
                id="editGroupImage" 
                @change="handleEditImageChange" 
                accept="image/*"
                :disabled="isEditing"
              />
            </label>
            <div v-if="editImagePreview" class="image-preview-container">
              <img :src="editImagePreview" alt="Preview" class="image-preview" />
              <button type="button" class="remove-image" @click="removeEditImage" :disabled="isEditing">
                <span>×</span>
              </button>
            </div>
          </div>
          <button class="submit-btn" @click="showUpdateConfirmation" :disabled="isEditing">
            {{ isEditing ? 'Đang cập nhật...' : 'Cập nhật nhóm' }}
          </button>
        </div>
      </div>

      <!-- Tiêu đề và danh sách nhóm đã tạo -->
      <div class="header-new">
        <h2>Nhóm do bạn tạo</h2>
        <a href="#" class="btn-view-all" @click.prevent="showAllCreated = !showAllCreated">
          {{ showAllCreated ? 'Thu gọn' : 'Xem tất cả' }}
        </a>
      </div>
      <div v-if="isLoadingCreated" class="loading-state">Đang tải danh sách nhóm đã tạo...</div>
      <div class="group-grid" v-else-if="visibleCreatedGroups.length > 0">
        <div v-for="group in visibleCreatedGroups" :key="group.id" class="group-card" @click="navigateToGroup(group)">
          <img :src="group.image" alt="Group Image" />
          <div class="content">
            <div class="info">
              <h3>{{ group.name }}</h3>
              <p>{{ group.members }} Thành viên</p>
              <p class="group-bio">{{ group.bio }}</p>
            </div>
            <div class="group-actions">
              <div class="action-buttons-group">
                <button class="edit-btn" @click.stop="openEditForm(group)">Chỉnh sửa</button>
                <button class="delete-btn" @click.stop="openDeleteConfirm(group)">Xóa</button>
              </div>
              <span class="group-type" :class="group.type.toLowerCase()">
                {{ group.type === 'PUBLIC' ? 'Công khai' : 'Riêng tư' }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-joined-groups">
        <p>Chưa tạo nhóm nào</p>
      </div>
      <!-- Tiêu đề và danh sách nhóm đã tham gia -->
      <div class="header-new">
        <h2>Cộng đồng thú cưng đã tham gia</h2>
        <a href="#" class="btn-view-all" @click.prevent="showAllJoined = !showAllJoined">
          {{ showAllJoined ? 'Thu gọn' : 'Xem tất cả' }}
        </a>
      </div>
      <div v-if="isLoadingJoined" class="loading-state">Đang tải danh sách nhóm đã tham gia...</div>
      <div class="group-grid" v-else-if="visibleJoinedGroups.length > 0">
        <div v-for="group in visibleJoinedGroups" 
             :key="group.id" 
             class="group-card"
             @click="navigateToGroup(group)">
          <img :src="group.image" alt="Group Image" />
          <div class="content">
            <div class="info">
              <h3>{{ group.name }}</h3>
              <p>{{ group.members }} Thành viên</p>
            </div>
            <button class="join-btn joined" disabled>Đã tham gia</button>
          </div>
        </div>
      </div>
      <div v-else class="no-joined-groups">
        <p>Chưa tham gia nhóm nào</p>
      </div>

      <!-- Tiêu đề và danh sách gợi ý nhóm -->
      <div class="header-new">
        <h2>Gợi ý cộng đồng thú cưng</h2>
        <a href="#" class="btn-view-all" @click.prevent="showAllSuggested = !showAllSuggested">
          {{ showAllSuggested ? 'Thu gọn' : 'Xem tất cả' }}
        </a>
      </div>
      <div v-if="isLoading" class="loading-state">Đang tải danh sách nhóm...</div>
      <div v-else-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <div v-else-if="filteredSuggestedGroups.length === 0" class="no-groups">
        <p>Không có nhóm gợi ý nào mới</p>
      </div>
      <div v-else class="group-grid">
        <div v-for="group in visibleSuggestedGroups" :key="group.id" class="group-card">
          <img :src="group.image" alt="Group Image" />
          <div class="content">
            <div class="info">
              <h3>{{ group.name }}</h3>
              <p>{{ group.members }} Thành viên</p>
            </div>
            <button
              :class="[
                'join-btn',
                group.status === 'joining' ? 'joining' : group.status === 'joined' ? 'joined' : '',
              ]"
              :disabled="group.status !== 'idle'"
              @click="handleJoin(group)"
            >
              <span v-if="group.status === 'joining'" class="loading-spinner"></span>
              {{
                group.status === 'joined'
                  ? 'Đã tham gia'
                  : group.status === 'joining'
                    ? 'Đang tham gia...'
                    : 'Tham gia nhóm'
              }}
            </button>
          </div>
        </div>
      </div>

      <!-- Modal xác nhận xóa nhóm -->
      <div class="overlay" v-if="showDeleteConfirm">
        <div class="simple-confirm-modal">
          <div class="confirm-icon">
            <i class="fas fa-exclamation-circle"></i>
          </div>
          <h3>Xác nhận</h3>
          <p>Xóa nhóm này?</p>
          <div class="confirm-actions">
            <button class="simple-btn confirm" @click="handleDeleteGroup">
              Xác nhận
            </button>
            <button class="simple-btn cancel" @click="showDeleteConfirm = false">
              Hủy
            </button>
          </div>
        </div>
      </div>

      <!-- Modal xác nhận cập nhật -->
      <div class="overlay" v-if="showUpdateConfirm">
        <div class="simple-confirm-modal">
          <div class="confirm-icon">
            <i class="fas fa-question-circle"></i>
          </div>
          <h3>Xác nhận</h3>
          <p>Cập nhật thông tin nhóm?</p>
          <div class="confirm-actions">
            <button class="simple-btn confirm" @click="handleUpdateGroup" :disabled="isEditing">
              Xác nhận
            </button>
            <button class="simple-btn cancel" @click="showUpdateConfirm = false">
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>

<script setup>
import Layout from './Layout.vue'
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  getSuggestCom,
  createGroup,
  getListGroupJoin,
  getListGroupUserCreate,
  joinGroup,
  deleteGroupByOwner,
  updateGroup
} from '@/service/communityService'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const router = useRouter()

const petGroups = ref([])
const joinedGroups = ref([])
const createdGroups = ref([])
const isLoading = ref(false)
const isLoadingJoined = ref(false)
const isLoadingCreated = ref(false)
const showCreateGroup = ref(false)
const newGroupName = ref('')
const newGroupPrivacy = ref('')
const newGroupBio = ref('')
const isCreating = ref(false)
const errorMessage = ref('')
const selectedImage = ref(null)
const imagePreview = ref(null)

//  hiển thị danh sách nhóm chỉ giới hạn 3 nhóm
const showAllSuggested = ref(false)
const showAllJoined = ref(false)
const showAllCreated = ref(false)

const searchTerm = ref('')

// Thêm computed properties để lọc nhóm theo từ khóa tìm kiếm
const filteredCreatedGroups = computed(() => {
  if (!searchTerm.value) return createdGroups.value
  const searchLower = searchTerm.value.toLowerCase()
  return createdGroups.value.filter(group => 
    group.name.toLowerCase().includes(searchLower)
  )
})

const filteredJoinedGroups = computed(() => {
  if (!searchTerm.value) return joinedGroups.value
  const searchLower = searchTerm.value.toLowerCase()
  return joinedGroups.value.filter(group => 
    group.name.toLowerCase().includes(searchLower)
  )
})

const searchFilteredSuggestedGroups = computed(() => {
  if (!searchTerm.value) return filteredSuggestedGroups.value
  const searchLower = searchTerm.value.toLowerCase()
  return filteredSuggestedGroups.value.filter(group => 
    group.name.toLowerCase().includes(searchLower)
  )
})

// Cập nhật các computed properties hiện có
const visibleCreatedGroups = computed(() => {
  return showAllCreated.value ? filteredCreatedGroups.value : filteredCreatedGroups.value.slice(0, 3)
})

const visibleJoinedGroups = computed(() => {
  return showAllJoined.value ? filteredJoinedGroups.value : filteredJoinedGroups.value.slice(0, 3)
})

const visibleSuggestedGroups = computed(() => {
  return showAllSuggested.value ? searchFilteredSuggestedGroups.value : searchFilteredSuggestedGroups.value.slice(0, 3)
})

// Lọc ra các nhóm chưa tham gia
const filteredSuggestedGroups = computed(() => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (!user) return []

  const joinedGroupIds = new Set(joinedGroups.value.map((group) => group.id))
  return petGroups.value.filter(
    (group) => !joinedGroupIds.has(group.id) && group.ownerId !== user.id,
  )
})

// Hàm xử lý tham gia nhóm
async function handleJoin(group) {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) {
      errorMessage.value = 'Vui lòng đăng nhập để tham gia nhóm'
      return
    }

    // Cập nhật UI trước
    group.status = 'joining'

    // Gọi API tham gia nhóm
    await joinGroup(group.id, group.ownerId, user.id)
    toast.success('Đã tham gia nhóm thành công!', {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
          theme: "colored"
        });

    // Cập nhật UI sau khi tham gia thành công
    group.status = 'joined'

    // Refresh danh sách nhóm đã tham gia
    await fetchJoinedGroups()

    // Xóa nhóm khỏi danh sách gợi ý
    petGroups.value = petGroups.value.filter((g) => g.id !== group.id)
  } catch (error) {
    // Khôi phục trạng thái nếu có lỗi
    group.status = 'idle'
    console.error('Lỗi khi tham gia nhóm:', error)
    errorMessage.value = 'Có lỗi xảy ra khi tham gia nhóm. Vui lòng thử lại.'
  }
}

// Lấy danh sách nhóm đã tham gia
const fetchJoinedGroups = async () => {
  try {
    isLoadingJoined.value = true
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) return

    const response = await getListGroupJoin(user.id)

    if (response.data && Array.isArray(response.data)) {
      // Lọc ra các nhóm mà người dùng không phải là chủ sở hữu
      const filteredGroups = response.data.filter((group) => {
        console.log('Group owner:', group.ownerId, 'User id:', user.id)
        return parseInt(group.ownerId) !== parseInt(user.id)
      })

      joinedGroups.value = filteredGroups.map((group) => ({
        id: group.id,
        name: group.name,
        image:
          group.coverUrl ||
          'https://media.vov.vn/sites/default/files/styles/large/public/2020-05/cho_1.jpg',
        members: group.totalMembers || 0,
        status: 'joined',
        type: group.type,
        owner: group.ownerId,
      }))

      console.log('Filtered joined groups:', joinedGroups.value)
    }
  } catch (error) {
    console.error('Failed to fetch joined groups:', error)
    joinedGroups.value = []
  } finally {
    isLoadingJoined.value = false
  }
}

// Lấy danh sách nhóm gợi ý
const fetchSuggestedGroups = async () => {
  try {
    isLoading.value = true
    const response = await getSuggestCom()
    if (Array.isArray(response)) {
      petGroups.value = response.map((group) => ({
        id: group.id,
        name: group.name,
        image: group.coverUrl,
        members: group.totalMembers,
        status: 'idle',
        type: group.type,
        ownerId: group.ownerId,
      }))
    }
  } catch (error) {
    console.error('Failed to fetch suggested groups:', error)
    petGroups.value = []
  } finally {
    isLoading.value = false
  }
}

// Hàm lấy danh sách nhóm đã tạo
const fetchCreatedGroups = async () => {
  try {
    isLoadingCreated.value = true
    const user = JSON.parse(localStorage.getItem('user'))
    const response = await getListGroupUserCreate(user.id)

    if (response.data && Array.isArray(response.data)) {
      createdGroups.value = response.data.map((group) => ({
        id: group.id,
        name: group.name,
        image:
          group.coverUrl ||
          'https://media.vov.vn/sites/default/files/styles/large/public/2020-05/cho_1.jpg',
        members: group.totalMembers || 0,
        type: group.type,
        bio: group.bio,
      }))
    }
  } catch (error) {
    console.error('Failed to fetch created groups:', error)
    createdGroups.value = []
  } finally {
    isLoadingCreated.value = false
  }
}

onMounted(() => {
  fetchJoinedGroups()
  fetchSuggestedGroups()
  fetchCreatedGroups()
})

// hàm tạo nhóm mới
async function createNewGroup() {
  if (!newGroupName.value.trim() || !newGroupPrivacy.value) {
    errorMessage.value = 'Vui lòng điền đầy đủ thông tin nhóm'
    return
  }

  try {
    isCreating.value = true
    errorMessage.value = ''
    const user = JSON.parse(localStorage.getItem('user'))

    const formData = new FormData()
    formData.append('name', newGroupName.value.trim())
    formData.append('type', newGroupPrivacy.value === 'Công khai' ? 'PUBLIC' : 'PRIVATE')
    formData.append('owner', user.id)
    formData.append('bio', newGroupBio.value.trim())

    if (selectedImage.value) {
      formData.append('image', selectedImage.value)
    }

    // Tạo nhóm mới
    const response = await createGroup(formData)

    // Tự động thêm người tạo vào nhóm
    if (response.data && response.data.id) {
      await joinGroup(response.data.id, user.id, user.id)
      toast.success('Tạo nhóm thành công!', {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
          theme: 'colored'
        });

    }

    // reset form
    newGroupName.value = ''
    newGroupPrivacy.value = ''
    newGroupBio.value = ''
    selectedImage.value = null
    showCreateGroup.value = false

    // Refresh tất cả các danh sách
    await Promise.all([fetchJoinedGroups(), fetchSuggestedGroups(), fetchCreatedGroups()])
  } catch (error) {
    errorMessage.value = 'Có lỗi xảy ra khi tạo nhóm. Vui lòng thử lại.'
    console.error('Error creating group:', error)
  } finally {
    isCreating.value = false
  }
}

// Xử lý khi chọn ảnh
const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Kiểm tra xem file có phải là ảnh không
    if (!file.type.match('image.*')) {
      errorMessage.value = 'Vui lòng chọn file ảnh'
      return
    }
    // Kiểm tra kích thước file (giới hạn 5MB)
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = 'Kích thước ảnh không được vượt quá 5MB'
      return
    }
    selectedImage.value = file
    // Tạo URL cho preview
    imagePreview.value = URL.createObjectURL(file)
    errorMessage.value = '' // Xóa thông báo lỗi nếu có
  }
}

// Xử lý khi xóa ảnh
const removeImage = () => {
  selectedImage.value = null
  imagePreview.value = null
  // Reset input file
  const input = document.getElementById('groupImage')
  if (input) input.value = ''
}

// Cleanup URL khi component bị hủy
onUnmounted(() => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
})

// Xử lý xóa nhóm
const showDeleteConfirm = ref(false)
const groupToDelete = ref(null)

// Mở modal xác nhận xóa
const openDeleteConfirm = (group) => {
  groupToDelete.value = group
  showDeleteConfirm.value = true
}

// Xử lý xóa nhóm
const handleDeleteGroup = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) {
      toast.error('Vui lòng đăng nhập để thực hiện chức năng này!', {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
        theme: 'colored'
      })
      return
    }

    await deleteGroupByOwner(user.id, groupToDelete.value.id)
    toast.success('Xóa nhóm thành công!', {
      autoClose: 3000,
      position: toast.POSITION.TOP_RIGHT,
      theme: 'colored'
    })
    
    // Đóng modal và reset state
    showDeleteConfirm.value = false
    groupToDelete.value = null
    
    // Cập nhật lại danh sách nhóm
    await fetchCreatedGroups()
  } catch (error) {
    console.error('Lỗi khi xóa nhóm:', error)
    toast.error('Có lỗi xảy ra khi xóa nhóm!', {
      autoClose: 3000,
      position: toast.POSITION.TOP_RIGHT,
      theme: 'colored'
    })
  }
}

const showEditGroup = ref(false)
const editingGroup = ref(null)
const editGroupName = ref('')
const editGroupPrivacy = ref('')
const editGroupBio = ref('')
const editSelectedImage = ref(null)
const editImagePreview = ref(null)
const isEditing = ref(false)
const showUpdateConfirm = ref(false)
const updatedData = ref(null)

// Mở form chỉnh sửa
const openEditForm = (group) => {
  editingGroup.value = group
  editGroupName.value = group.name
  editGroupPrivacy.value = group.type === 'PUBLIC' ? 'Công khai' : 'Riêng tư'
  editGroupBio.value = group.bio || ''
  editImagePreview.value = group.image
  editSelectedImage.value = null // Reset selected image when opening form
  showEditGroup.value = true
}

// Xử lý khi chọn ảnh mới trong form chỉnh sửa
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

// Xóa ảnh đã chọn trong form chỉnh sửa
const removeEditImage = () => {
  editSelectedImage.value = null
  editImagePreview.value = null // Set to null to show the file input
  const input = document.getElementById('editGroupImage')
  if (input) input.value = ''
}

// Xử lý hiển thị form xác nhận cập nhật
const showUpdateConfirmation = () => {
  if (!editGroupName.value.trim() || !editGroupPrivacy.value) {
    errorMessage.value = 'Vui lòng điền đầy đủ thông tin nhóm'
    return
  }
  updatedData.value = {
    name: editGroupName.value.trim(),
    type: editGroupPrivacy.value === 'Công khai' ? 'PUBLIC' : 'PRIVATE',
    bio: editGroupBio.value.trim(),
    image: editSelectedImage.value
  }
  showUpdateConfirm.value = true
}

// Xử lý cập nhật nhóm
const handleUpdateGroup = async () => {
  try {
    isEditing.value = true
    errorMessage.value = ''

    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) {
      toast.error('Vui lòng đăng nhập để thực hiện chức năng này!', {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
        theme: 'colored'
      })
      return
    }
    const formData = new FormData()
    formData.append('name', updatedData.value.name)
    formData.append('type', updatedData.value.type)
    formData.append('bio', updatedData.value.bio)
    formData.append('image', updatedData.value.image)
  
    // if (updatedData.value.image) {
    //   formData.append('image', updatedData.value.image)
    // } else if (editImagePreview.value === null) {
    //   formData.append('removeImage', 'true')
    // }
    console.log('truoc khi thuc hien goi ham',editingGroup.value.id)
    console.log('truoc khi thuc hien goi ham',user.id)
    await updateGroup(editingGroup.value.id, user.id, formData)
    
    toast.success('Cập nhật nhóm thành công!', {
      autoClose: 3000,
      position: toast.POSITION.TOP_RIGHT,
      theme: 'colored'
    })

    // Reset form và đóng popup
    showEditGroup.value = false
    showUpdateConfirm.value = false
    editingGroup.value = null
    editGroupName.value = ''
    editGroupPrivacy.value = ''
    editGroupBio.value = ''
    editSelectedImage.value = null
    editImagePreview.value = null
    updatedData.value = null

    // Cập nhật lại danh sách nhóm
    await fetchCreatedGroups()

  } catch (error) {
    errorMessage.value = 'Có lỗi xảy ra khi cập nhật nhóm. Vui lòng thử lại.'
    console.error('Error updating group:', error.message)
  } finally {
    isEditing.value = false
  }
}

// Cleanup URLs khi component bị hủy
onUnmounted(() => {
  if (editImagePreview.value && editSelectedImage.value) {
    URL.revokeObjectURL(editImagePreview.value)
  }
})

// Add navigation function
const navigateToGroup = (group) => {
  console.log('Navigating to group:', group.id)
  router.push({
    name: 'GroupPage',
    params: { id: group.id }
  })
}
</script>

<style scoped>
.wrapper {
  width: 75vw;
  min-height: 100vh;
  padding: 24px 40px;
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;
}

.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.search-bar input {
  padding: 10px 18px;
  border: 1px solid #ccc;
  border-radius: 9999px;
  flex: 1;
  font-size: 16px;
}

.search-bar button {
  background-color: black;
  color: white;
  padding: 12px 16px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
}

.header-new {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
}

.header h2 {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.header a {
  font-size: 14px;
  color: #3b82f6;
  text-decoration: none;
}
.search-box-new {
  display: flex;
  align-items: center;
  background-color: rgba(165, 154, 154, 0.2);
  border-radius: 10px;
  padding: 8px 10px;
  flex: 0 1 200px;
  border: 1px solid #ddd;
  margin: 0 10px;
  transition: box-shadow 0.3s ease;
  margin-bottom: 10px;
  margin-left: 200px;
  margin-right: 200px;
}

.search-box-new input {
  border: none;
  background-color: transparent;
  outline: none;
  flex: 1;
  padding: 8px 10px; /* Tăng padding input */
  font-size: 15px; /* Tăng kích thước chữ */
}

.search-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.search-button img {
  width: 22px; /* Tăng kích thước icon tìm kiếm */
  height: 22px;
}

.group-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(240px, 1fr));
  gap: 24px;
}

.group-card {
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.group-card:hover {
  transform: translateY(-4px);
}

.group-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
  min-height: 42px;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.info p {
  font-size: 14px;
  color: #666;
}

.join-btn {
  width: 100%;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  background-color: #ffd6d6;
  color: #333;
  cursor: pointer;
  transition: all 0.4s ease;
  opacity: 1;
  transform: scale(1);
}

.joining {
  opacity: 0;
  transform: scale(0.7);
  pointer-events: none;
}

.joined {
  background-color: #d6f5d6;
  color: #2f7a2f;
  font-weight: bold;
  cursor: default;
  transform: scale(1.03);
}

.no-joined-groups {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 16px;
}

.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.create-form {
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

.create-form input,
.create-form select,
.create-form textarea {
  padding: 12px;
  border: none;
  border-radius: 12px;
  background-color: #ffffff;
  font-size: 14px;
  color: #444;
}

.create-form textarea {
  min-height: 100px;
  resize: vertical;
}

.create-form select:invalid {
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

.error-message {
  color: #dc2626;
  background-color: #fee2e2;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
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

.loading-state {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 16px;
  background-color: white;
  border-radius: 8px;
  margin: 20px 0;
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

.file-name {
  font-size: 14px;
  color: #666;
  word-break: break-all;
}

.group-bio {
  font-size: 13px;
  color: #666;
  margin-top: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.group-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.action-buttons-group {
  display: flex;

  justify-content: center;
    gap: 10px;
    margin-top: 40px;
    padding: 20px 0;
   
}

.edit-btn {
  padding: 8px 16px;
  background-color: #ffd6a1;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-btn:hover {
  background-color: #ffb84d;
}

.delete-btn {
  padding: 8px 16px;
  background-color: #ffd6d6;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
  color: #dc2626;
}

.delete-btn:hover {
  background-color: #fee2e2;
}

.group-type {
  font-size: 12px;
  margin-top: 45px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.group-type.public {
  background-color: #e6f4ea;
  color: #1e7e34;
}

.group-type.private {
  background-color: #fef3f2;
  color: #b42318;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.join-btn.joining {
  background-color: #ffd6a1;
  opacity: 0.8;
  cursor: not-allowed;
}
.btn-view-all {
  display: inline-block;
  padding: 8px 16px;
  background-color: #a59a9a; /* hoặc rgba(165, 154, 154, 0.2) nếu muốn trong suốt */
  color: white;
  text-decoration: none;
  border-radius: 6px;
  border: none;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.btn-view-all:hover {
  background-color: #8c8080; /* màu đậm hơn khi hover */
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
  transition: background-color 0.3s;
}

.remove-image:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.simple-confirm-modal {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 280px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.confirm-icon {
  font-size: 40px;
  color: #2563eb;
  margin-bottom: 12px;
}

.simple-confirm-modal h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
}

.simple-confirm-modal p {
  color: #666;
  margin-bottom: 20px;
  font-size: 14px;
}

.confirm-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.simple-btn {
  padding: 8px 24px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.simple-btn.confirm {
  background-color: #2563eb;
  color: white;
}

.simple-btn.confirm:hover {
  background-color: #1d4ed8;
}

.simple-btn.cancel {
  background-color: #e5e7eb;
  color: #4b5563;
}

.simple-btn.cancel:hover {
  background-color: #d1d5db;
 
}

.simple-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
