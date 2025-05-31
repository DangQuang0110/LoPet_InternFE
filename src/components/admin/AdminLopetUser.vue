<template>
  <div class="admin-user">
    <h1>Quản lý người dùng</h1>
    <p class="section-title">Danh sách người dùng</p>
    <div class="table-wrapper">
      <table class="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
            <th>Cập nhật</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td data-label="ID">{{ user.id }}</td>
            <td data-label="User Name">{{ user.name }}</td>
            <td data-label="Email/Sđt">{{ user.email }}</td>
            <td data-label="Vai trò">{{ user.role }}</td>
            <td data-label="Trạng thái">{{ user.status }}</td>
            <td data-label="Hành động">
              <button 
                class="action-btn" 
                :class="{ 'lock-btn': user.status === 'Đã khóa', 'unlock-btn': user.status !== 'Đã khóa' }" 
                @click="toggleStatus(user)"
                :aria-label="user.status === 'Đã khóa' ? 'Kích hoạt người dùng ' + user.name : 'Khóa người dùng ' + user.name">
                {{ user.status === 'Đã khóa' ? 'Kích hoạt' : 'Khóa' }}
              </button>
            </td>
            <td data-label="Cập nhật">
              <button 
                class="update-btn" 
                @click="openUpdateModal(user)"
                aria-label="Cập nhật vai trò người dùng {{ user.name }}">
                Cập nhật
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="modal-overlay" role="dialog" aria-labelledby="modal-title">
      <div class="modal-content" tabindex="0">
        <h2 id="modal-title">Cập nhật vai trò người dùng</h2>
        <div class="form-group">
          <label for="role-select">Chọn Vai trò:</label>
            <select v-model="selectedUser.role" id="role-select">
              <option value="Người dùng">Người dùng</option>
              <option v-for="role in roleOptions" :key="role.id" :value="role.name">
                {{ role.name }}
              </option>
            </select>
        </div>
        <div class="modal-buttons">
          <button class="modal-update-btn" @click="saveUserRole">Cập nhật</button>
          <button class="modal-cancel-btn" @click="closeModal">Hủy</button>
        </div>
      </div>
    </div>
    <div v-if="showConfirmModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Xác nhận</h2>
        <p>
          Bạn có chắc chắn muốn 
          {{ confirmAction === 'ban' ? 'khóa' : 'mở khóa' }}
          tài khoản "<strong>{{ confirmUser?.name }}</strong>" không?
        </p>
        <div class="modal-buttons">
          <button class="modal-update-btn" @click="handleConfirmedAction">Xác nhận</button>
          <button class="modal-cancel-btn" @click="showConfirmModal = false">Hủy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import {
  getAccountList,
  banAccount,
  unbanAccount,
  getRolesList,
  setRolesToAccount
} from '@/service/authService'

const users = ref([])
const showModal = ref(false)
const selectedUser = ref(null)

const roleOptions = ref([]) // 👉 Danh sách vai trò từ API
const confirmUser = ref(null)
const showConfirmModal = ref(false)
const confirmAction = ref('')

onMounted(async () => {
  await loadUsers()
  roleOptions.value = await getRolesList()
})

const loadUsers = async () => {
  const data = await getAccountList()
  users.value = data.map(u => ({
    id: u.id,
    name: u.username,
    email: u.email,
    role: u.roles?.map(r => r.name).join(', ') || 'Người dùng',
    status: u.isBanned === 1 ? 'Đã khóa' : 'Hoạt động'
  }))
}

const toggleStatus = (user) => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  if (currentUser.id === user.id) {
    alert('⛔ Không thể tự khóa tài khoản của chính mình.')
    return
  }

  confirmUser.value = user
  confirmAction.value = user.status === 'Đã khóa' ? 'unban' : 'ban'
  showConfirmModal.value = true
}

const handleConfirmedAction = async () => {
  const user = confirmUser.value
  try {
    if (confirmAction.value === 'ban') {
      await banAccount(user.id)
      user.status = 'Đã khóa'
    } else {
      await unbanAccount(user.id)
      user.status = 'Hoạt động'
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái người dùng:', error)
    alert('⚠️ Có lỗi xảy ra.')
  } finally {
    showConfirmModal.value = false
    confirmUser.value = null
    confirmAction.value = ''
  }
}

const openUpdateModal = (user) => {
  selectedUser.value = { ...user }
  showModal.value = true
  document.body.style.overflow = 'hidden'
  nextTick(() => {
    document.querySelector('.modal-content')?.focus()
  })
}

const saveUserRole = async () => {
  try {
    const roleToSet = selectedUser.value.role === 'Người dùng' ? [] : [selectedUser.value.role]

    await setRolesToAccount(selectedUser.value.id, roleToSet)

    const userIndex = users.value.findIndex(u => u.id === selectedUser.value.id)
    if (userIndex !== -1) {
      users.value[userIndex].role = selectedUser.value.role
    }

    closeModal()
  } catch (error) {
    alert('⚠️ Không thể cập nhật vai trò.')
  }
}


const closeModal = () => {
  showModal.value = false
  selectedUser.value = null
  document.body.style.overflow = ''
}
</script>
<style scoped>
.admin-user {
  padding: 2rem;
  max-width: 90vw;
  margin: 0 auto;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  min-height: 400px;
}

h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: clamp(1.5rem, 4vw, 1.8rem);
  font-weight: 700;
  text-align: left;
  letter-spacing: 0.5px;
}

.section-title {
  font-size: clamp(1rem, 3vw, 1.1rem);
  color: #6c757d;
  margin-bottom: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.user-table {
  width: 100%;
  min-width: 600px;
  border-collapse: separate;
  border-spacing: 0;
  background: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.user-table th,
.user-table td {
  padding: clamp(0.8rem, 2vw, 1rem) clamp(0.8rem, 2vw, 1.2rem);
  text-align: left;
  border-bottom: 1px solid #e9ecef;
  font-size: clamp(0.8rem, 2.5vw, 0.9rem);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-table th {
  background: #A59A9A;
  color: black;
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(0.7rem, 2vw, 0.8rem);
  letter-spacing: 0.5px;
}

.user-table td {
  color: black;
  font-weight: 400;
  transition: background 0.3s ease;
}

.user-table tr {
  transition: background 0.3s ease;
}

.user-table tr:hover {
  background-color: #f1f3f5;
}

.user-table tr:last-child td {
  border-bottom: none;
}

.user-table td:first-child {
  font-weight: 500;
  color: #495057;
}

.user-table td:nth-child(2) {
  font-weight: 600;
  color: black;
}

.action-btn,
.update-btn,
.modal-update-btn,
.modal-cancel-btn {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.8rem, 2vw, 1rem);
  border: none;
  border-radius: 5px;
  font-size: clamp(0.8rem, 2.5vw, 0.9rem);
  cursor: pointer;
  transition: background 0.3s ease;
}

.action-btn.lock-btn {
  background-color: #28a745;
  color: white;
}

.action-btn.lock-btn:hover {
  background-color: #218838;
}

.action-btn.unlock-btn {
  background-color: #dc3545;
  color: white;
}

.action-btn.unlock-btn:hover {
  background-color: #c82333;
}

.update-btn {
  background-color: #007bff;
  color: white;
}

.update-btn:hover {
  background-color: #0056b3;
}

.modal-overlay {
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
  overflow-y: auto;
}

.modal-content {
  background: white;
  padding: clamp(1rem, 3vw, 1.2rem);
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin: 1rem;
}

.modal-content h2 {
  font-size: clamp(1rem, 3vw, 1.2rem);
  margin-bottom: 1rem;
  color: #2c3e50;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: clamp(0.8rem, 2.5vw, 0.9rem);
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: clamp(0.8rem, 2.5vw, 0.9rem);
  color: #495057;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
}

.modal-update-btn {
  background-color: #007bff;
  color: white;
}

.modal-update-btn:hover {
  background-color: #0056b3;
}

.modal-cancel-btn {
  background-color: #dc3545;
  color: white;
}

.modal-cancel-btn:hover {
  background-color: #c82333;
}
/* Hiệu ứng transition cho modal */
.modal-overlay {
  animation: fadeIn 0.3s ease;
}

.modal-content {
  animation: slideUp 0.3s ease;
  text-align: center;
}

.modal-content p {
  font-size: clamp(0.85rem, 2.5vw, 1rem);
  color: #343a40;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.modal-content strong {
  color: #007bff;
  font-weight: 600;
}

@keyframes fadeIn {
  from { background: rgba(0, 0, 0, 0); }
  to { background: rgba(0, 0, 0, 0.5); }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media screen and (max-width: 768px) {
  .admin-user {
    padding: 1rem;
    max-width: 95vw;
  }

  h1 {
    font-size: clamp(1.2rem, 5vw, 1.5rem);
  }

  .section-title {
    font-size: clamp(0.9rem, 4vw, 1rem);
  }

  .user-table th,
  .user-table td {
    padding: 0.6rem 0.8rem;
  }

  .action-btn,
  .update-btn {
    padding: 0.3rem 0.6rem;
    font-size: clamp(0.7rem, 2vw, 0.8rem);
  }

  .modal-content {
    padding: clamp(0.8rem, 2.5vw, 1rem);
  }
}

@media screen and (max-width: 600px) {
  .user-table {
    display: block;
    min-width: unset;
  }

  .user-table thead {
    display: none;
  }

  .user-table tbody, .user-table tr {
    display: block;
  }

  .user-table tr {
    margin-bottom: 1rem;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 0.5rem;
    background: #fff;
  }

  .user-table td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border-bottom: none;
    font-size: clamp(0.8rem, 2.5vw, 0.9rem);
    max-width: none;
    white-space: normal;
  }

  .user-table td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #2c3e50;
    flex: 1;
  }

  .user-table td:not(:last-child) {
    border-bottom: 1px solid #e9ecef;
  }
}

@media screen and (max-width: 480px) {
  .admin-user {
    padding: 0.5rem;
  }

  .user-table th,
  .user-table td {
    padding: 0.5rem 0.6rem;
    font-size: clamp(0.7rem, 2vw, 0.8rem);
  }

  .action-btn,
  .update-btn {
    padding: 0.2rem 0.5rem;
    font-size: clamp(0.6rem, 2vw, 0.7rem);
  }

  .modal-content h2 {
    font-size: clamp(0.9rem, 2.5vw, 1rem);
  }

  .form-group label,
  .form-group select {
    font-size: clamp(0.7rem, 2vw, 0.8rem);
  }

  .modal-update-btn,
  .modal-cancel-btn {
    padding: clamp(0.3rem, 1.5vw, 0.4rem) clamp(0.6rem, 2vw, 0.8rem);
    font-size: clamp(0.7rem, 2vw, 0.8rem);
  }
}
</style>