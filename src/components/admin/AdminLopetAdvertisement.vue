<template>
  <div class="admin-ad">
    <h1>Quản lý quảng cáo</h1>
    <div class="header-section">
      <p class="section-title">Danh sách quảng cáo</p>
      <button class="add-btn" @click="showModal = true">Thêm quảng cáo</button>
    </div>
    <table class="ad-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Hình ảnh</th>
          <th>Tiêu đề</th>
          <th>Nội dung</th>
          <th>Url</th>
          <th>Tác giả</th>
          <th>Ngày tạo</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ad in paginatedAds" :key="ad.id">
          <td>{{ ad.id }}</td>
          <td><img :src="ad.image" alt="Ad Image" class="ad-image" /></td>
          <td>{{ ad.title }}</td>
          <td>{{ ad.content }}</td>
          <td>
            <a 
              :href="ad.url" 
              target="_blank" 
              rel="noopener noreferrer"
              class="ad-link"
            >
              {{ ad.url }}
            </a>
          </td>
          <td>{{ ad.author.username }}</td>
          <td>{{ new Date(ad.createdAt).toLocaleDateString() }}</td>
          <td>
            <button class="action-btn detail-btn" @click="showDetails(ad)">Chi tiết</button>
            <button class="action-btn edit-btn" @click="openEditModal(ad)">Sửa</button>
            <button class="action-btn delete-btn" @click="openDeleteModal(ad)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal for adding new advertisement -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content add-ad-modal">
        <h2>Thêm quảng cáo</h2>
        <div class="form-container">
          <div class="form-group">
            <label>Hình ảnh <span class="required">*</span></label>
            <input
              type="file"
              accept="image/*"
              @change="handleImageUpload($event, 'new')"
              required
            />
            <img
              v-if="newAd.imagePreview"
              :src="newAd.imagePreview"
              alt="Preview"
              class="image-preview"
            />
          </div>
          <div class="form-group">
            <label>Tiêu đề <span class="required">*</span></label>
            <input type="text" v-model="newAd.title" placeholder="Nhập tiêu đề" required />
          </div>
          <div class="form-group">
            <label>Nội dung <span class="required">*</span></label>
            <textarea v-model="newAd.description" placeholder="Nhập nội dung" required></textarea>
          </div>
          <div class="form-group">
            <label>Link tham chiếu <span class="required">*</span></label>
            <input type="url" v-model="newAd.linkRef" placeholder="Nhập URL" required />
          </div>
        </div>
        <div class="form-actions">
          <button class="submit-btn" @click="addNewAd">Thêm</button>
          <button class="cancel-btn" @click="showModal = false">Hủy</button>
        </div>
      </div>
    </div>

    <!-- Modal for editing advertisement -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Sửa quảng cáo</h2>
        <div class="form-group">
          <label>Hình ảnh hiện tại</label>
          <img :src="editAd.oldImage" alt="Current Image" class="image-preview" />
        </div>
        <div class="form-group">
          <label>Thay đổi hình ảnh</label>
          <input type="file" accept="image/*" @change="handleImageUpload($event, 'edit')" />
          <img
            v-if="editAd.imagePreview"
            :src="editAd.imagePreview"
            alt="Preview"
            class="image-preview"
          />
        </div>
        <div class="form-group">
          <label>Tiêu đề <span class="required">*</span></label>
          <input type="text" v-model="editAd.title" placeholder="Tiêu đề" required />
        </div>
        <div class="form-group">
          <label>Nội dung <span class="required">*</span></label>
          <textarea v-model="editAd.description" placeholder="Nội dung" required></textarea>
        </div>
        <div class="form-group">
          <label>Link tham chiếu <span class="required">*</span></label>
          <input type="url" v-model="editAd.linkRef" placeholder="URL" required />
        </div>
        <div class="form-actions">
          <button class="submit-btn" @click="updateAd">Cập nhật</button>
          <button class="cancel-btn" @click="showEditModal = false">Hủy</button>
        </div>
      </div>
    </div>

    <!-- Modal for viewing advertisement details -->
    <div v-if="showDetailsModal" class="modal-overlay">
      <div class="modal-content details-modal">
        <h2>Chi tiết quảng cáo</h2>

        <div class="image-container">
          <img :src="selectedAd.image" alt="Ad Image" class="image-preview" />
        </div>

        <div class="info-grid">
          <div class="basic-info">
            <div class="form-group">
              <label>ID</label>
              <input type="text" :value="selectedAd.id" readonly />
            </div>
            <div class="form-group">
              <label>Tiêu đề</label>
              <input type="text" :value="selectedAd.title" readonly />
            </div>
            <div class="form-group">
              <label>Nội dung</label>
              <input type="text" :value="selectedAd.content" readonly />
            </div>
            <div class="form-group">
              <label>URL</label>
              <input type="text" :value="selectedAd.url" readonly />
            </div>
          </div>

          <div class="additional-info">
            <div class="author-info">
              <div class="info-title">Thông tin tác giả</div>
              <div class="info-item">
                <span class="info-label">Tên:</span>
                <span class="info-value">{{ selectedAd.author?.username }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">{{ selectedAd.author?.email }}</span>
              </div>
            </div>

            <div class="dates-info">
              <div class="info-title">Thông tin thời gian</div>
              <div class="info-item">
                <span class="info-label">Ngày tạo:</span>
                <span class="info-value">{{
                  new Date(selectedAd.createdAt).toLocaleString()
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Cập nhật lần cuối:</span>
                <span class="info-value">{{
                  new Date(selectedAd.updatedAt).toLocaleString()
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button class="cancel-btn" @click="showDetailsModal = false">Đóng</button>
        </div>
      </div>
    </div>

    <!-- Modal for delete confirmation -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content delete-modal">
        <div class="delete-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h2>Xác nhận xóa</h2>
        <p class="delete-message">
          Bạn có chắc chắn muốn xóa quảng cáo "<span class="highlight">{{ deleteAd.title }}</span
          >"?
        </p>
        <p class="delete-warning">Hành động này không thể hoàn tác!</p>
        <div class="form-actions delete-actions">
          <button class="delete-confirm-btn" @click="confirmDelete">Xóa</button>
          <button class="cancel-btn" @click="showDeleteModal = false">Hủy</button>
        </div>
      </div>
    </div>

    <!-- Pagination controls -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Trang trước</button>
      <span
        v-for="page in displayedPages"
        :key="page"
        @click="goToPage(page)"
        :class="{ active: currentPage === page }"
      >
        {{ page }}
      </span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Trang sau</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getListAds, createAds, updateAds, delAds } from '@/service/admin/AdsService'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// Reactive data
const ads = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(5)
const showModal = ref(false)
const showEditModal = ref(false)
const showDetailsModal = ref(false)
const showDeleteModal = ref(false)
const deleteAd = ref({
  id: null,
  title: '',
})

const newAd = ref({
  title: '',
  description: '',
  linkRef: '',
  image: null,
  imagePreview: null
})
const editAd = ref({
  id: null,
  image: null,
  title: '',
  description: '',
  linkRef: '',
  oldImage: '',
  imagePreview: null,
})
const selectedAd = ref({})

// Tính toán tổng số trang
const totalPages = computed(() => Math.ceil(ads.value.length / itemsPerPage.value))

// Lấy danh sách quảng cáo cho trang hiện tại
const paginatedAds = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return ads.value.slice(start, end)
})

// Các hàm điều hướng trang
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Tạo mảng các số trang để hiển thị
const displayedPages = computed(() => {
  const delta = 2
  const range = []
  const rangeWithDots = []
  let l

  range.push(1)

  for (let i = currentPage.value - delta; i <= currentPage.value + delta; i++) {
    if (i < totalPages.value && i > 1) {
      range.push(i)
    }
  }

  range.push(totalPages.value)

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  }

  return rangeWithDots
})

const mapApiDataToDisplay = (apiData) => {
  return apiData.map((item) => ({
    id: item.id,
    image: item.imageUrl,
    title: item.title,
    content: item.description,
    url: item.linkReferfence,
    author: item.author,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }))
}

onMounted(async () => {
  try {
    // Lấy user từ localStorage
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      console.error('Không tìm thấy ID người dùng')
      return
    }

    const user = JSON.parse(userStr)
    const response = await getListAds(user.id)
    ads.value = mapApiDataToDisplay(response.data)
  } catch (error) {
    console.error('Error fetching ads:', error)
    // You might want to show an error message to the user here
  }
})

const handleImageUpload = (event, mode) => {
  const file = event.target.files[0]
  if (file) {
    if (mode === 'new') {
      newAd.value.image = file
      newAd.value.imagePreview = URL.createObjectURL(file)
    } else if (mode === 'edit') {
      editAd.value.image = file
      editAd.value.imagePreview = URL.createObjectURL(file)
    }
  }
}

//  thêm quảng cáo
const addNewAd = async () => {
  try {
    if (
      !newAd.value.title ||
      !newAd.value.description ||
      !newAd.value.linkRef ||
      !newAd.value.image
    ) {
      toast.error('Vui lòng điền đầy đủ thông tin!', {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      })
      return
    }

    const userStr = localStorage.getItem('user')
    if (!userStr) {
      toast.error('Không tìm thấy thông tin người dùng!', {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      })
      return
    }

    const user = JSON.parse(userStr)

    // Tạo FormData object
    const formData = new FormData()
    formData.append('accountId', user.id)
    formData.append('title', newAd.value.title)
    formData.append('description', newAd.value.description)
    formData.append('linkRef', newAd.value.linkRef)
    formData.append('image', newAd.value.image)

    // Hiển thị loading toast
    const loadingToastId = toast.loading('Đang thêm quảng cáo...', {
      position: toast.POSITION.TOP_RIGHT,
    })

    // Gọi API tạo quảng cáo
    await createAds(formData)

    // Refresh danh sách quảng cáo
    const response = await getListAds(user.id)
    ads.value = mapApiDataToDisplay(response.data)

    // Reset form và đóng modal
    newAd.value = {
      title: '',
      description: '',
      linkRef: '',
      image: null,
      imagePreview: null
    }
    showModal.value = false

    // Cập nhật toast thành công
    toast.update(loadingToastId, {
      render: 'Thêm quảng cáo thành công!',
      type: toast.TYPE.SUCCESS,
      autoClose: 3000,
      isLoading: false,
    })
  } catch (error) {
    console.error('Error creating advertisement:', error)
    toast.error('Có lỗi xảy ra khi thêm quảng cáo!', {
      autoClose: 3000,
      position: toast.POSITION.TOP_RIGHT,
    })
  }
}

const openEditModal = (ad) => {
  editAd.value = {
    id: ad.id,
    title: ad.title,
    description: ad.content,
    linkRef: ad.url,
    image: null,
    oldImage: ad.image,
    imagePreview: null,
  }
  showEditModal.value = true
}

const updateAd = async () => {
  try {
    if (!editAd.value.title || !editAd.value.description || !editAd.value.linkRef) {
      toast.error('Vui lòng điền đầy đủ thông tin!', {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      })
      return
    }

    const userStr = localStorage.getItem('user')
    if (!userStr) {
      toast.error('Không tìm thấy thông tin người dùng!', {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      })
      return
    }

    const user = JSON.parse(userStr)
    const formData = new FormData()
    formData.append('accountId', user.id)
    formData.append('title', editAd.value.title)
    formData.append('description', editAd.value.description)
    formData.append('linkReferfence', editAd.value.linkRef)

    // Chỉ append image nếu có chọn file mới
    if (editAd.value.image) {
      formData.append('image', editAd.value.image)
    }

    // Log để kiểm tra dữ liệu trong FormData
    console.log('=== FormData Content ===')
    console.log('adsId:', editAd.value.id)
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value)
    }
    console.log('=====================')

    // Hiển thị loading toast
    const loadingToastId = toast.loading('Đang cập nhật quảng cáo...', {
      position: toast.POSITION.TOP_RIGHT,
    })

    // Gọi API cập nhật
    await updateAds(editAd.value.id, formData)

    // Refresh danh sách
    const response = await getListAds(user.id)
    ads.value = mapApiDataToDisplay(response.data)

    // Đóng modal và reset form
    showEditModal.value = false
    editAd.value = {
      id: null,
      image: null,
      title: '',
      description: '',
      linkRef: '',
      oldImage: '',
      imagePreview: null,
    }

    // Cập nhật toast thành công
    toast.update(loadingToastId, {
      render: 'Cập nhật quảng cáo thành công!',
      type: toast.TYPE.SUCCESS,
      autoClose: 3000,
      isLoading: false,
    })
  } catch (error) {
    console.error('Error updating advertisement:', error)
    toast.error('Có lỗi xảy ra khi cập nhật quảng cáo!', {
      autoClose: 3000,
      position: toast.POSITION.TOP_RIGHT,
    })
  }
}

const openDeleteModal = (ad) => {
  deleteAd.value = {
    id: ad.id,
    title: ad.title,
  }
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    // Hiển thị loading toast
    const loadingToastId = toast.loading('Đang xóa quảng cáo...', {
      position: toast.POSITION.TOP_RIGHT,
    })

    await delAds(deleteAd.value.id)

    // Refresh danh sách
    const userStr = localStorage.getItem('user')
    const user = JSON.parse(userStr)
    const response = await getListAds(user.id)
    ads.value = mapApiDataToDisplay(response.data)

    // Đóng modal
    showDeleteModal.value = false
    deleteAd.value = { id: null, title: '' }

    // Cập nhật toast thành công
    toast.update(loadingToastId, {
      render: 'Xóa quảng cáo thành công!',
      type: toast.TYPE.SUCCESS,
      autoClose: 3000,
      isLoading: false,
    })
  } catch (error) {
    console.error('Error deleting advertisement:', error)
    toast.error('Có lỗi xảy ra khi xóa quảng cáo!', {
      autoClose: 3000,
      position: toast.POSITION.TOP_RIGHT,
    })
  }
}

const showDetails = (ad) => {
  selectedAd.value = { ...ad }
  showDetailsModal.value = true
}

const resetNewAdForm = () => {
  newAd.value = {
    title: '',
    description: '',
    linkRef: '',
    image: null,
    imagePreview: null
  }
  showModal.value = false
}
</script>

<style scoped>
.admin-ad {
  padding: 2rem;
  max-width: 95vw;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  min-height: 400px;
}

h1 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: clamp(1.5rem, 2.8vw, 2rem);
  font-weight: 700;
  text-align: left;
  letter-spacing: 0.3px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
}

.section-title {
  font-size: clamp(1rem, 1.8vw, 1.2rem);
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.add-btn {
  background: #F8D070;
  color: white;
  padding: clamp(0.5rem, 1vw, 0.7rem) clamp(1rem, 1.8vw, 1.2rem);
  border: none;
  border-radius: 6px;
  font-size: clamp(0.8rem, 1.2vw, 0.9rem);
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
}

.add-btn:hover {
  background: #e67e22;
  transform: translateY(-2px);
}

.ad-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.ad-table th,
.ad-table td {
  padding: clamp(0.8rem, 1.8vw, 1.2rem);
  text-align: left;
  border-bottom: 1px solid #e9ecef;
  font-size: clamp(0.8rem, 1.3vw, 1rem);
}

.ad-table th {
  background: #a59a9a;
  color: #2c3e50;
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(0.7rem, 1.3vw, 0.9rem);
  letter-spacing: 0.5px;
}

.ad-table td {
  color: #2c3e50;
  font-weight: 400;
}

.ad-table tr:hover {
  background-color: #f8f9fa;
}

.ad-table tr:last-child td {
  border-bottom: none;
}

.ad-table td:first-child {
  font-weight: 500;
  color: #495057;
}

.ad-table td:nth-child(3) {
  font-weight: 600;
  color: #2c3e50;
}

.ad-image {
  width: clamp(50px, 3vw, 60px);
  height: clamp(50px, 3vw, 60px);
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  transition: transform 0.3s ease;
}

.ad-image:hover {
  transform: scale(1.05);
}

.action-btn {
  padding: clamp(0.4rem, 1vw, 0.6rem) clamp(0.8rem, 1.5vw, 1rem);
  border: none;
  border-radius: 6px;
  font-size: clamp(0.7rem, 1vw, 0.9rem);
  cursor: pointer;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
  margin-right: 0.5rem;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.detail-btn {
  background: #007bff;
  color: white;
}

.detail-btn:hover {
  background: #0056b3;
}

.edit-btn {
  background: #28a745;
  color: white;
}

.edit-btn:hover {
  background: #1c7d33;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #b02a37;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  padding: clamp(1.2rem, 2.5vw, 1.8rem);
  border-radius: 10px;
  width: 90%;
  max-width: clamp(320px, 80vw, 450px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  animation: scaleIn 0.3s ease-out;
  max-height: 90vh;
  overflow-y: auto;
}

/* Custom scrollbar styles */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #f39c12;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #e67e22;
}

/* For Firefox */
.modal-content {
  scrollbar-width: thin;

}

/* Responsive repo styles */
.form-group textarea {
  width: 100%;
  min-height: clamp(100px, 20vh, 200px);
  max-height: clamp(200px, 40vh, 400px);
  padding: clamp(0.6rem, 1.2vw, 0.8rem);
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: clamp(0.9rem, 1.3vw, 1rem);
  background: #fff;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  resize: vertical;
  line-height: 1.5;
}

.form-group textarea:focus {
  border-color: #f39c12;
  outline: none;
  box-shadow: 0 0 6px rgba(243, 156, 18, 0.3);
}

/* Mobile optimization */
@media screen and (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-height: 85vh;
    padding: clamp(1rem, 2vw, 1.5rem);
  }

  .form-group textarea {
    min-height: clamp(80px, 15vh, 150px);
    max-height: clamp(150px, 30vh, 300px);
    font-size: clamp(0.8rem, 1.2vw, 0.9rem);
  }
}

@media screen and (max-width: 480px) {
  .modal-content {
    width: 98%;
    max-height: 80vh;
    padding: clamp(0.8rem, 1.5vw, 1.2rem);
  }

  .form-group textarea {
    min-height: clamp(60px, 12vh, 120px);
    max-height: clamp(120px, 25vh, 250px);
    font-size: clamp(0.7rem, 1.1vw, 0.8rem);
  }
}

.add-ad-modal {
  max-width: clamp(600px, 90vw, 800px);
  padding: clamp(1.5rem, 2.8vw, 2rem);
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-content h2 {
  font-size: clamp(1.2rem, 1.8vw, 1.4rem);
  margin-bottom: 1.2rem;
  color: #2c3e50;
  text-align: center;
}

.form-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-start;
}

.form-group {
  flex: 1;
  min-width: 200px;
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #34495e;
  font-size: clamp(0.9rem, 1.3vw, 1rem);
  text-align: left;
}

.form-group input[type='text'],
.form-group input[type='file'] {
  width: 100%;
  padding: clamp(0.6rem, 1.2vw, 0.8rem);
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: clamp(0.9rem, 1.3vw, 1rem);
  background: #fff;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.form-group input[readonly] {
  background: #f0f0f0;
  cursor: not-allowed;
}

.form-group input[type='text']:focus,
.form-group input[type='file']:focus {
  border-color: #f39c12;
  outline: none;
  box-shadow: 0 0 6px rgba(243, 156, 18, 0.3);
}

.form-group input[type='file'] {
  padding: clamp(0.4rem, 0.8vw, 0.6rem);
  background: #f9f9f9;
  cursor: pointer;
}

.form-group input[type='file']::-webkit-file-upload-button {
  background: #f39c12;
  color: white;
  border: none;
  padding: clamp(0.4rem, 0.8vw, 0.6rem) clamp(0.8rem, 1.5vw, 1rem);
  border-radius: 4px;
  cursor: pointer;
  font-size: clamp(0.8rem, 1.2vw, 0.9rem);
  transition: background 0.3s ease;
}

.form-group input[type='file']::-webkit-file-upload-button:hover {
  background: #e67e22;
}

.image-preview {
  width: 100%;
  max-height: 150px;
  object-fit: contain;
  margin-top: 0.8rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 0.4rem;
  background: #f9f9f9;
  transition: transform 0.3s ease;
}

.image-preview:hover {
  transform: scale(1.03);
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.submit-btn,
.cancel-btn {
  padding: clamp(0.5rem, 1vw, 0.7rem) clamp(1rem, 1.8vw, 1.2rem);
  border: none;
  border-radius: 6px;
  font-size: clamp(0.8rem, 1.2vw, 0.9rem);
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
  min-width: 120px;
}

.submit-btn {
  background: #f39c12;
  color: white;
}

.submit-btn:hover {
  background: #e67e22;
  transform: translateY(-2px);
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

.modal-content p {
  font-size: clamp(1rem, 1.5vw, 1.1rem);
  color: #34495e;
  text-align: center;
  margin-bottom: 1.2rem;
}

/* Adjusted action buttons styling */
.ad-table td:last-child {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  flex-wrap: nowrap;
}

/* Media Queries */
@media screen and (max-width: 1024px) {
  .admin-ad {
    padding: 1.5rem;
    max-width: 98vw;
  }

  .ad-table {
    min-width: 500px;
  }

  .add-ad-modal {
    max-width: clamp(500px, 85vw, 600px);
  }

  .form-group {
    min-width: 180px;
  }
}

@media screen and (max-width: 768px) {
  .admin-ad {
    padding: 1rem;
    max-width: 100vw;
  }

  h1 {
    font-size: clamp(1.2rem, 2.2vw, 1.6rem);
  }

  .section-title {
    font-size: clamp(0.9rem, 1.4vw, 1.1rem);
  }

  .ad-table th,
  .ad-table td {
    padding: clamp(0.6rem, 1.2vw, 0.9rem);
    font-size: clamp(0.7rem, 1.1vw, 0.9rem);
  }

  .ad-image {
    width: clamp(40px, 2.5vw, 50px);
    height: clamp(40px, 2.5vw, 50px);
  }

  .action-btn {
    padding: clamp(0.3rem, 0.8vw, 0.5rem) clamp(0.6rem, 1.2vw, 0.8rem);
    font-size: clamp(0.6rem, 0.9vw, 0.8rem);
  }
}

@media screen and (max-width: 480px) {
  .admin-ad {
    padding: 0.8rem;
  }

  .ad-table {
    min-width: 320px;
  }

  .ad-table th,
  .ad-table td {
    padding: clamp(0.5rem, 1vw, 0.7rem);
    font-size: clamp(0.6rem, 0.9vw, 0.8rem);
  }

  .action-btn {
    padding: clamp(0.2rem, 0.6vw, 0.4rem) clamp(0.4rem, 0.8vw, 0.6rem);
    font-size: clamp(0.5rem, 0.8vw, 0.7rem);
  }

  .form-group {
    min-width: 100%;
  }

  .add-ad-modal {
    max-width: clamp(280px, 90vw, 320px);
  }

  .submit-btn,
  .cancel-btn {
    padding: clamp(0.4rem, 0.8vw, 0.6rem) clamp(0.8rem, 1.5vw, 1rem);
    font-size: clamp(0.7rem, 1vw, 0.8rem);
  }
}

.required {
  color: red;
  margin-left: 4px;
}

textarea {
  width: 100%;
  padding: clamp(0.6rem, 1.2vw, 0.8rem);
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: clamp(0.9rem, 1.3vw, 1rem);
  background: #fff;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
  min-height: 100px;
  resize: vertical;
}

textarea:focus {
  border-color: #f39c12;
  outline: none;
  box-shadow: 0 0 6px rgba(243, 156, 18, 0.3);
}

/* Pagination styles */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.pagination button {
  padding: clamp(0.5rem, 1vw, 0.7rem) clamp(1rem, 1.8vw, 1.2rem);
  border: none;
  border-radius: 6px;
  font-size: clamp(0.8rem, 1.2vw, 0.9rem);
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
  margin: 0 0.5rem;
}

.pagination button:hover {
  background: #e67e22;
  transform: translateY(-2px);
}

.pagination button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.pagination span {
  padding: clamp(0.5rem, 1vw, 0.7rem) clamp(1rem, 1.8vw, 1.2rem);
  border: none;
  border-radius: 6px;
  font-size: clamp(0.8rem, 1.2vw, 0.9rem);
  font-weight: 600;
  cursor: pointer;
  margin: 0 0.5rem;
}

.pagination span.active {
  background: #f39c12;
  color: white;
}

/* Modal responsive styles */
.modal-content.details-modal {
  max-width: clamp(320px, 90vw, 600px);
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  padding: clamp(1rem, 3vw, 2rem);
}

.details-modal .form-group {
  margin-bottom: clamp(1rem, 2vw, 1.5rem);
}

.details-modal label {
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  margin-bottom: clamp(0.3rem, 1vw, 0.5rem);
  color: #2c3e50;
  font-weight: 600;
}

.details-modal input {
  font-size: clamp(0.85rem, 1.4vw, 1rem);
  padding: clamp(0.5rem, 1.2vw, 0.8rem);
  background-color: #f8f9fa;
}

.details-modal .image-container {
  position: relative;
  width: 100%;
  padding-top: 34%;
  margin-bottom: clamp(1rem, 2vw, 1.5rem);
  background-color: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}

.details-modal .image-preview {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: clamp(0.5rem, 1vw, 1rem);
}

.details-modal .info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
}

.details-modal .author-info,
.details-modal .dates-info {
  background-color: #f8f9fa;
  padding: clamp(0.8rem, 1.5vw, 1.2rem);
  border-radius: 8px;
  margin-top: clamp(1rem, 2vw, 1.5rem);
}

.details-modal .info-title {
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  color: #2c3e50;
  margin-bottom: clamp(0.5rem, 1vw, 0.8rem);
  font-weight: 600;
}

.details-modal .info-item {
  display: flex;
  align-items: center;
  margin-bottom: clamp(0.4rem, 0.8vw, 0.6rem);
}

.details-modal .info-label {
  font-weight: 500;
  color: #6c757d;
  margin-right: 0.5rem;
  font-size: clamp(0.8rem, 1.3vw, 0.95rem);
}

.details-modal .info-value {
  color: #2c3e50;
  font-size: clamp(0.8rem, 1.3vw, 0.95rem);
}

@media screen and (max-width: 768px) {
  .details-modal .info-grid {
    grid-template-columns: 1fr;
  }

  .details-modal .image-container {
    padding-top: 75%; /* 4:3 Aspect Ratio for mobile */
  }
}

@media screen and (max-width: 480px) {
  .details-modal {
    padding: 1rem;
  }

  .details-modal .form-group {
    margin-bottom: 0.8rem;
  }

  .details-modal label {
    font-size: 0.9rem;
  }

  .details-modal input {
    font-size: 0.85rem;
    padding: 0.5rem;
  }
}

/* Delete modal styles */
.delete-modal {
  max-width: clamp(300px, 90vw, 400px);
  text-align: center;
  padding: clamp(1.5rem, 3vw, 2rem);
}

.delete-icon {
  font-size: clamp(2rem, 4vw, 3rem);
  color: #dc3545;
  margin-bottom: 1rem;
}

.delete-message {
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.delete-warning {
  font-size: clamp(0.8rem, 1.3vw, 0.95rem);
  color: #dc3545;
  margin-bottom: 1.5rem;
}

.highlight {
  font-weight: 600;
  color: #2c3e50;
}

.delete-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.delete-confirm-btn {
  padding: clamp(0.5rem, 1vw, 0.7rem) clamp(1rem, 1.8vw, 1.2rem);
  border: none;
  border-radius: 6px;
  font-size: clamp(0.8rem, 1.2vw, 0.9rem);
  font-weight: 600;
  cursor: pointer;
  background: #dc3545;
  color: white;
  transition: all 0.3s ease;
}

.delete-confirm-btn:hover {
  background: #c82333;
  transform: translateY(-2px);
}

@media screen and (max-width: 480px) {
  .delete-modal {
    padding: 1rem;
  }

  .delete-message {
    font-size: 0.9rem;
  }

  .delete-warning {
    font-size: 0.8rem;
  }

  .delete-actions {
    flex-direction: column;
  }

  .delete-confirm-btn,
  .cancel-btn {
    width: 100%;
    margin: 0.25rem 0;
  }
}

.form-group input[type='url'] {
  width: 100%;
  padding: clamp(0.6rem, 1.2vw, 0.8rem);
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: clamp(0.9rem, 1.3vw, 1rem);
  background: #fff;
  transition: all 0.3s ease;
  color: #2c3e50;
}

.form-group input[type='url']:focus {
  border-color: #f39c12;
  outline: none;
  box-shadow: 0 0 6px rgba(243, 156, 18, 0.3);
}

.form-group input[type='url']::placeholder {
  color: #95a5a6;
  opacity: 0.8;
}

.form-group input[type='url']:hover {
  border-color: #f39c12;
}

/* URL input validation styles */
.form-group input[type='url']:valid {
  border-color: #2ecc71;
}

.form-group input[type='url']:invalid:not(:placeholder-shown) {
  border-color: #e74c3c;
}

/* Mobile responsive */
@media screen and (max-width: 768px) {
  .form-group input[type='url'] {
    font-size: clamp(0.8rem, 1.2vw, 0.9rem);
    padding: clamp(0.5rem, 1vw, 0.7rem);
  }
}

@media screen and (max-width: 480px) {
  .form-group input[type='url'] {
    font-size: clamp(0.7rem, 1.1vw, 0.8rem);
    padding: clamp(0.4rem, 0.8vw, 0.6rem);
  }
}

.modal-content.add-ad-modal {
  background: white;
  padding: clamp(1.2rem, 2.5vw, 1.8rem);
  border-radius: 10px;
  width: 90%;
  max-width: clamp(320px, 80vw, 450px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  animation: scaleIn 0.3s ease-out;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content.add-ad-modal::-webkit-scrollbar {
  width: 8px;
}

.modal-content.add-ad-modal::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.modal-content.add-ad-modal::-webkit-scrollbar-thumb {
  background: #f39c12;
  border-radius: 4px;
}

.modal-content.add-ad-modal::-webkit-scrollbar-thumb:hover {
  background: #e67e22;
}

/* For Firefox */
.modal-content.add-ad-modal {
  scrollbar-width: thin;
  
}

@media screen and (max-width: 768px) {
  .modal-content.add-ad-modal {
    width: 95%;
    max-height: 85vh;
    padding: clamp(1rem, 2vw, 1.5rem);
  }
}

@media screen and (max-width: 480px) {
  .modal-content.add-ad-modal {
    width: 98%;
    max-height: 80vh;
    padding: clamp(0.8rem, 1.5vw, 1.2rem);
  }
}

.ad-link {
  color: #3498db;
  text-decoration: none;
  transition: all 0.3s ease;
  display: block;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 4px 8px;
  border-radius: 4px;
}

.ad-link:hover {
  color: #2980b9;
  background: rgba(52, 152, 219, 0.1);
  text-decoration: underline;
}

.ad-link:active {
  transform: translateY(1px);
}

@media screen and (max-width: 768px) {
  .ad-link {
    max-width: 200px;
  }
}

@media screen and (max-width: 480px) {
  .ad-link {
    max-width: 150px;
  }
}
</style>
