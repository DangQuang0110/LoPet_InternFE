<template>
  <div class="admin-report">
    <h1>Quản lý tố cáo</h1>
    <p class="section-title">Danh sách bị việt bị cáo</p>
    <div class="table-wrapper">
      <table class="report-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tác Giả</th>
            <th>Hình Ảnh</th>
            <th>Lý Do Tố Cáo</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in reports" :key="report.id">
            <td>{{ report.id }}</td>
            <td>{{ report.reporter }}</td>
            <td><img :src="report.image" alt="Hình ảnh" class="report-image" /></td>
            <td>{{ report.reason }}</td>
            <td class="action-column">
              <button class="action-btn review-btn" @click="openReviewModal(report)">
                Chi tiết
              </button>
              <button class="action-btn delete-btn" @click="openDeleteConfirmModal(report.id)">
                Xóa
              </button>
              <button class="action-btn remove-btn" @click="openRemoveConfirmModal(report.id)">
                Gỡ
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal for reviewing report details -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Chi tiết tố cáo</h2>
        <div class="form-group">
          <label>Người tố cáo:</label>
          <p>{{ selectedReport.reporter }}</p>
        </div>
        <div class="form-group">
          <label>Ngày bị tố cáo:</label>
          <p>{{ selectedReport.date }}</p>
        </div>
        <div class="form-group">
          <label>Nội dung:</label>
          <p>{{ selectedReport.content }}</p>
        </div>
        <div class="form-group">
          <label>Hình ảnh:</label>
          <img :src="selectedReport.image" alt="Hình ảnh" class="report-image" />
        </div>
        <div class="form-group">
          <label>Lý do tố cáo:</label>
          <p>{{ selectedReport.reason }}</p>
        </div>
        <div class="form-group">
          <label>Trạng thái:</label>
          <p>{{ selectedReport.status }}</p>
        </div>
        <div class="modal-buttons">
          <button class="modal-close-btn" @click="closeModal">Đóng</button>
        </div>
      </div>
    </div>

    <!-- Modal for delete confirmation -->
    <div v-if="showDeleteConfirmModal" class="modal-overlay">
      <div class="delete-confirm-modal">
        <h2>Xác nhận</h2>
        <div class="confirm-icon">
          <span class="checkmark">✔</span>
        </div>
        <p>Xóa bài viết vi phạm</p>
        <div class="confirm-buttons">
          <button class="confirm-btn" @click="confirmDelete">Xác nhận</button>
          <button class="cancel-btn" @click="closeDeleteConfirmModal">Hủy</button>
        </div>
      </div>
    </div>

    <!-- Modal for remove confirmation -->
    <div v-if="showRemoveConfirmModal" class="modal-overlay">
      <div class="remove-confirm-modal">
        <h2>Xác nhận</h2>
        <div class="confirm-icon">
          <span class="checkmark">✔</span>
        </div>
        <p>Gỡ tố cáo bài viết</p>
        <div class="confirm-buttons">
          <button class="confirm-btn" @click="confirmRemove">Xác nhận</button>
          <button class="cancel-btn" @click="closeRemoveConfirmModal">Hủy</button>
        </div>
      </div>
    </div>

    <!-- Notification Form -->
    <div v-if="showNotification" class="notification">
      <p>{{ notificationMessage }}</p>
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
.admin-report {
  padding: 2rem;
  max-width: 95vw;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  min-height: 400px;
  position: relative;
}

h1 {
  color: #2c3e50;
  margin-bottom: 1.2rem;
  font-size: clamp(1.5rem, 2.8vw, 2rem);
  font-weight: 700;
  text-align: left;
  letter-spacing: 0.3px;
}

.section-title {
  font-size: clamp(1rem, 1.8vw, 1.2rem);
  color: #6c757d;
  margin-bottom: 1.2rem;
  font-weight: 500;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.report-table {
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.report-table th,
.report-table td {
  padding: clamp(0.8rem, 1.8vw, 1.2rem);
  /* border-bottom: 5px solid #e9ecef; */
  font-size: clamp(0.8rem, 1.3vw, 1rem);
}

.report-table th {
  background: #A59A9A;
  color: #2c3e50;
  font-weight: 600;
  font-size: clamp(0.7rem, 1.3vw, 0.9rem);
}

.report-table td {
  color: #2c3e50;
  font-weight: 400;
}

.report-table tr:hover {
  background-color: #f8f9fa;
}

.report-image {
  width: clamp(50px, 3vw, 60px);
  height: clamp(50px, 3vw, 60px);
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.action-column {
  display: flex;
  flex-wrap: nowrap;
  gap: 0.5rem;
  align-items: center;
  white-space: nowrap;
}

.action-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: clamp(0.4rem, 1vw, 0.6rem) clamp(0.8rem, 1.5vw, 1rem);
  border: none;
  border-radius: 6px;
  font-size: clamp(0.7rem, 1vw, 0.9rem);
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  flex: 1;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.review-btn {
  background-color: #007bff;
  color: white;
}

.review-btn:hover {
  background-color: #0056b3;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #b02a37;
}

.remove-btn {
  background-color: #28a745;
  color: white;
}

.remove-btn:hover {
  background-color: #1c7d33;
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

.form-group {
  margin-bottom: clamp(1rem, 1.8vw, 1.2rem);
}

.form-group label {
  display: block;
  font-size: clamp(0.9rem, 1.3vw, 1rem);
  color: #495057;
  margin-bottom: 0.4rem;
}

.form-group p {
  font-size: clamp(0.9rem, 1.3vw, 1rem);
  color: #2c3e50;
  margin: 0;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
}

.modal-close-btn {
  padding: clamp(0.5rem, 1vw, 0.7rem) clamp(1rem, 1.8vw, 1.2rem);
  border: none;
  border-radius: 6px;
  font-size: clamp(0.8rem, 1.2vw, 0.9rem);
  cursor: pointer;
  background-color: #6c757d;
  color: white;
  width: 50%;
  transition: background-color 0.3s ease;
}

.modal-close-btn:hover {
  background-color: #5a6268;
}

/* Delete Confirmation Modal Styles */
.delete-confirm-modal {
  background: white;
  padding: clamp(1.2rem, 2.5vw, 1.8rem);
  border-radius: 10px;
  width: 90%;
  max-width: clamp(280px, 65vw, 320px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: scaleIn 0.3s ease-out;
}

.delete-confirm-modal h2 {
  font-size: clamp(1.2rem, 1.8vw, 1.4rem);
  color: #2c3e50;
  margin-bottom: 0.8rem;
}

.confirm-icon {
  margin: 1.2rem 0;
}

.checkmark {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  background-color: #28a745;
  color: white;
  font-size: 28px;
  border-radius: 50%;
  margin: 0 auto;
}

.delete-confirm-modal p {
  font-size: clamp(1rem, 1.5vw, 1.1rem);
  color: #2c3e50;
  margin-bottom: 1.2rem;
}

.confirm-buttons {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
}

.confirm-btn,
.cancel-btn {
  padding: clamp(0.5rem, 1vw, 0.7rem) clamp(1rem, 1.8vw, 1.2rem);
  border: none;
  border-radius: 6px;
  font-size: clamp(0.8rem, 1.2vw, 0.9rem);
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 45%;
}

.confirm-btn {
  background-color: #dc3545;
  color: white;
}

.confirm-btn:hover {
  background-color: #b02a37;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background-color: #5a6268;
}

/* Remove Confirmation Modal Styles */
.remove-confirm-modal {
  background: white;
  padding: clamp(1.2rem, 2.5vw, 1.8rem);
  border-radius: 10px;
  width: 90%;
  max-width: clamp(280px, 65vw, 320px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: scaleIn 0.3s ease-out;
}

.remove-confirm-modal h2 {
  font-size: clamp(1.2rem, 1.8vw, 1.4rem);
  color: #2c3e50;
  margin-bottom: 0.8rem;
}

.remove-confirm-modal p {
  font-size: clamp(1rem, 1.5vw, 1.1rem);
  color: #2c3e50;
  margin-bottom: 1.2rem;
}

/* Notification Styles */
.notification {
  position: fixed;
  top: 30px;
  right: 30px;
  background-color: #28a745;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  z-index: 2000;
  animation: slideInOut 3.5s ease-in-out forwards;
}

@keyframes slideInOut {
  0% { opacity: 0; transform: translateX(20px); }
  10% { opacity: 1; transform: translateX(0); }
  90% { opacity: 1; transform: translateX(0); }
  100% { opacity: 0; transform: translateX(20px); }
}

/* Media Queries */
@media screen and (max-width: 1024px) {
  .admin-report {
    padding: 1.5rem;
    max-width: 98vw;
  }

  .report-table {
    min-width: 500px;
  }

  .action-btn {
    padding: clamp(0.3rem, 0.8vw, 0.5rem) clamp(0.6rem, 1.2vw, 0.8rem);
    font-size: clamp(0.6rem, 0.9vw, 0.8rem);
  }
}

@media screen and (max-width: 768px) {
  .admin-report {
    padding: 1rem;
    max-width: 100vw;
  }

  h1 {
    font-size: clamp(1.2rem, 2.2vw, 1.6rem);
  }

  .section-title {
    font-size: clamp(0.9rem, 1.4vw, 1.1rem);
  }

  .report-table th,
  .report-table td {
    padding: clamp(0.6rem, 1.2vw, 0.9rem);
    font-size: clamp(0.7rem, 1.1vw, 0.9rem);
  }

  .report-image {
    width: clamp(40px, 2.5vw, 50px);
    height: clamp(40px, 2.5vw, 50px);
  }

  .modal-content {
    max-width: clamp(280px, 80vw, 360px);
    padding: clamp(1rem, 1.8vw, 1.4rem);
  }
}

@media screen and (max-width: 480px) {
  .admin-report {
    padding: 0.8rem;
  }

  .report-table {
    min-width: 320px;
  }

  .report-table th,
  .report-table td {
    padding: clamp(0.5rem, 1vw, 0.7rem);
    font-size: clamp(0.6rem, 0.9vw, 0.8rem);
  }

  .action-btn {
    padding: clamp(0.2rem, 0.6vw, 0.4rem) clamp(0.4rem, 0.8vw, 0.6rem);
    font-size: clamp(0.5rem, 0.8vw, 0.7rem);
  }

  .modal-close-btn,
  .confirm-btn,
  .cancel-btn {
    padding: clamp(0.3rem, 0.6vw, 0.5rem) clamp(0.6rem, 1vw, 0.8rem);
    font-size: clamp(0.6rem, 0.8vw, 0.8rem);
  }
}
</style>