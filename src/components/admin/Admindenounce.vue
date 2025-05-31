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
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ad in ads" :key="ad.id">
          <td>{{ ad.id }}</td>
          <td><img :src="ad.image" alt="Ad Image" class="ad-image" /></td>
          <td>{{ ad.title }}</td>
          <td>{{ ad.content }}</td>
          <td>{{ ad.url }}</td>
          <td>
            <button class="action-btn detail-btn" @click="showDetails(ad)">Chi tiết</button>
            <button class="action-btn edit-btn" @click="openEditModal(ad)">Sửa</button>
            <button class="action-btn delete-btn" @click="openDeleteModal(ad.id)">Xóa</button>
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
            <label>Hình ảnh</label>
            <input type="file" accept="image/*" @change="handleImageUpload($event, 'new')" />
            <img v-if="newAd.image" :src="newAd.image" alt="Preview" class="image-preview" />
          </div>
          <div class="form-group">
            <label>Tiêu đề</label>
            <input type="text" v-model="newAd.title" placeholder="Nhập tiêu đề" />
          </div>
          <div class="form-group">
            <label>Nội dung</label>
            <input type="text" v-model="newAd.content" placeholder="Nhập nội dung" />
          </div>
          <div class="form-group">
            <label>Url</label>
            <input type="text" v-model="newAd.url" placeholder="Nhập URL" />
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
          <label>Hình ảnh</label>
          <input type="file" accept="image/*" @change="handleImageUpload($event, 'edit')" />
          <img v-if="editAd.image" :src="editAd.image" alt="Preview" class="image-preview" />
        </div>
        <div class="form-group">
          <label>Tiêu đề</label>
          <input type="text" v-model="editAd.title" placeholder="Tiêu đề" />
        </div>
        <div class="form-group">
          <label>Nội dung</label>
          <input type="text" v-model="editAd.content" placeholder="Nội dung" />
        </div>
        <div class="form-group">
          <label>Url</label>
          <input type="text" v-model="editAd.url" placeholder="Url" />
        </div>
        <div class="form-actions">
          <button class="submit-btn" @click="updateAd">Cập nhật</button>
          <button class="cancel-btn" @click="showEditModal = false">Hủy</button>
        </div>
      </div>
    </div>

    <!-- Modal for viewing advertisement details -->
    <div v-if="showDetailsModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Chi tiết quảng cáo</h2>
        <div class="form-group">
          <label>ID</label>
          <input type="text" :value="selectedAd.id" readonly />
        </div>
        <div class="form-group">
          <label>Hình ảnh</label>
          <img :src="selectedAd.image" alt="Ad Image" class="image-preview" />
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
          <label>Url</label>
          <input type="text" :value="selectedAd.url" readonly />
        </div>
        <div class="form-actions">
          <button class="cancel-btn" @click="showDetailsModal = false">Đóng</button>
        </div>
      </div>
    </div>

    <!-- Modal for delete confirmation -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Xác nhận xóa</h2>
        <p>Bạn có chắc chắn muốn xóa quảng cáo này?</p>
        <div class="form-actions">
          <button class="submit-btn" @click="confirmDelete">Xóa</button>
          <button class="cancel-btn" @click="showDeleteModal = false">Hủy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getReports, updateReportStatus } from '@/service/reportService'
import { getPostById, deletePost } from '@/service/postService'
import { getProfileByAccountId } from '@/service/profileService'

const reports = ref([])
const showModal = ref(false)
const selectedReport = ref(null)
const showDeleteConfirmModal = ref(false)
const showRemoveConfirmModal = ref(false)
const reportIdToDelete = ref(null)
const reportIdToRemove = ref(null)
const showNotification = ref(false)
const notificationMessage = ref('')
const postMap = ref({}) // map lưu postId theo reportId để gọi xóa

// Gọi API khi mounted
onMounted(async () => {
  try {
    const res = await getReports({ type: 'POST' })
    console.log('📥 Dữ liệu gốc từ backend:', res.data)

    const list = (res.data?.data || []).filter(item => item.action === 'PENDING' || item.action === 0)
    console.log('🧹 Dữ liệu sau khi lọc (PENDING):', list)

    const mappedReports = await Promise.all(
      list.map(async (item) => {
        let image = '/image/default.jpg'
        let content = '(Không có nội dung)'
        let authorName = 'Ẩn danh'
        const postId = item.targetId

        try {
          const post = await getPostById(postId)
          image = post?.postMedias?.[0]?.mediaUrl || image
          content = post?.content || content

          const accountId = post?.accountId
          if (accountId) {
            const profile = await getProfileByAccountId(accountId)
            authorName = profile?.fullName || 'Ẩn danh'
          }

          postMap.value[item.id || item.reportId] = postId
        } catch (e) {
          console.warn('⚠️ Không lấy được bài viết hoặc profile:', e)
        }

        return {
          id: item.id || item.reportId,
          reporter: authorName,
          image,
          reason: item.reason,
          status: item.action === 'PENDING' || item.action === 0 ? 'Chưa xử lý' : 'Đã xử lý',
          date: new Date(item.createdAt).toLocaleString(),
          content
        }
      })
    )
    reports.value = mappedReports
    console.log('✅ Danh sách reports hiển thị:', reports.value)
  } catch (err) {
    console.error('❌ Lỗi khi load danh sách báo cáo:', err)
  }
})

const openReviewModal = (report) => {
  selectedReport.value = { ...report }
  showModal.value = true
}

const openDeleteConfirmModal = (reportId) => {
  reportIdToDelete.value = reportId
  showDeleteConfirmModal.value = true
}

const openRemoveConfirmModal = (reportId) => {
  reportIdToRemove.value = reportId
  showRemoveConfirmModal.value = true
}
const confirmDelete = async () => {
  const reportId = reportIdToDelete.value
  const report = reports.value.find(r => r.id === reportId)
  const postId = postMap.value[reportId]

  try {
    // 1. Xóa bài viết
    await deletePost(postId)

    // 2. Gửi update status (sử dụng đúng targetId để backend hiểu)
    const payload = {
      type: 'POST',
      action: 'APPROVED'
    }

    await updateReportStatus(postId, payload) // ✅ Gửi postId = targetId (khớp API backend)

    // 3. Cập nhật UI
    reports.value = reports.value.filter(r => r.id !== reportId)
    notificationMessage.value = `✅ Đã xóa bài viết ID ${postId} và đánh dấu báo cáo là đã xử lý.`
  } catch (err) {
    console.error('❌ Lỗi khi xóa bài viết hoặc cập nhật báo cáo:', err)
    notificationMessage.value = `❌ Lỗi khi xóa bài viết hoặc cập nhật báo cáo.`
  }

  showNotification.value = true
  setTimeout(() => (showNotification.value = false), 3000)
  closeDeleteConfirmModal()
}

const confirmRemove = async () => {
  const reportId = reportIdToRemove.value
  const report = reports.value.find(r => r.id === reportId)

  try {
    const payload = {
      type: 'POST',
      action: 'CANCELLED'
    }

    await updateReportStatus(postMap.value[reportId], payload) // ✅ Gửi targetId đúng là postId

    reports.value = reports.value.filter(r => String(r.id) !== String(reportId))
    notificationMessage.value = `✅ Đã gỡ tố cáo với ID: ${reportId}.`
  } catch (err) {
    console.error('❌ Lỗi gỡ báo cáo:', err?.response?.data || err)
    notificationMessage.value = `❌ Không thể gỡ tố cáo ID: ${reportId}.`
  }

  showNotification.value = true
  setTimeout(() => (showNotification.value = false), 3000)
  closeRemoveConfirmModal()
}

// Đóng modal
const closeDeleteConfirmModal = () => {
  showDeleteConfirmModal.value = false
  reportIdToDelete.value = null
}

const closeRemoveConfirmModal = () => {
  showRemoveConfirmModal.value = false
  reportIdToRemove.value = null
}

const closeModal = () => {
  showModal.value = false
  selectedReport.value = null
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
  background: linear-gradient(45deg, #ff6b6b, #ff8e53);
  color: white;
  padding: clamp(0.5rem, 1vw, 0.7rem) clamp(1rem, 1.8vw, 1.2rem);
  border: none;
  border-radius: 6px;
  font-size: clamp(0.8rem, 1.2vw, 0.9rem);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
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
  background: #A59A9A;
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
  transition: background 0.3s ease, transform 0.2s ease;
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
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  padding: clamp(1.2rem, 2.5vw, 1.8rem);
  border-radius: 10px;
  width: 90%;
  max-width: clamp(320px, 80vw, 450px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  animation: scaleIn 0.3s ease-out;
}

.add-ad-modal {
  max-width: clamp(600px, 90vw, 800px);
  padding: clamp(1.5rem, 2.8vw, 2rem);
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
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

.form-group input[type="text"],
.form-group input[type="file"] {
  width: 100%;
  padding: clamp(0.6rem, 1.2vw, 0.8rem);
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: clamp(0.9rem, 1.3vw, 1rem);
  background: #fff;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input[readonly] {
  background: #f0f0f0;
  cursor: not-allowed;
}

.form-group input[type="text"]:focus,
.form-group input[type="file"]:focus {
  border-color: #f39c12;
  outline: none;
  box-shadow: 0 0 6px rgba(243, 156, 18, 0.3);
}

.form-group input[type="file"] {
  padding: clamp(0.4rem, 0.8vw, 0.6rem);
  background: #f9f9f9;
  cursor: pointer;
}

.form-group input[type="file"]::-webkit-file-upload-button {
  background: #f39c12;
  color: white;
  border: none;
  padding: clamp(0.4rem, 0.8vw, 0.6rem) clamp(0.8rem, 1.5vw, 1rem);
  border-radius: 4px;
  cursor: pointer;
  font-size: clamp(0.8rem, 1.2vw, 0.9rem);
  transition: background 0.3s ease;
}

.form-group input[type="file"]::-webkit-file-upload-button:hover {
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
  transition: background 0.3s ease, transform 0.2s ease;
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
</style>