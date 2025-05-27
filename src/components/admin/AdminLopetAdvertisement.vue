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
import { ref, onMounted } from 'vue';

// Static ad data
const AD_CONSTANT = [
  { id: 1, image: 'placeholder-image-1.jpg', title: 'Trà sữa toyo', content: 'Trà sữa thơm ngon', url: 'toto.com.vn' },
  { id: 2, image: 'placeholder-image-2.jpg', title: 'Free FPS game', content: 'Free FPS', url: 'fps.com.vn' },
  { id: 3, image: 'placeholder-image-3.jpg', title: 'Best Movie', content: 'Best Movie', url: 'movie.com.vn' },
  { id: 4, image: 'placeholder-image-4.jpg', title: 'Trà sữa toyo', content: 'Trà sữa thơm ngon', url: 'toto.com.vn' },
];

// Reactive data
const ads = ref([]);
const showModal = ref(false);
const showEditModal = ref(false);
const showDetailsModal = ref(false);
const showDeleteModal = ref(false);
const deleteAdId = ref(null);
const newAd = ref({
  image: '',
  title: '',
  content: '',
  url: ''
});
const editAd = ref({
  id: null,
  image: '',
  title: '',
  content: '',
  url: ''
});
const selectedAd = ref({});

onMounted(() => {
  ads.value = [...AD_CONSTANT];
});

const handleImageUpload = (event, mode) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (mode === 'new') {
        newAd.value.image = e.target.result;
      } else if (mode === 'edit') {
        editAd.value.image = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
};

const addNewAd = () => {
  if (newAd.value.title && newAd.value.content && newAd.value.url) {
    const newId = ads.value.length ? ads.value[ads.value.length - 1].id + 1 : 1;
    ads.value.push({
      id: newId,
      image: newAd.value.image || 'default-image.jpg',
      title: newAd.value.title,
      content: newAd.value.content,
      url: newAd.value.url
    });
    // Reset form and close modal
    newAd.value = { image: '', title: '', content: '', url: '' };
    showModal.value = false;
  } else {
    alert('Vui lòng điền đầy đủ các trường bắt buộc!');
  }
};

const openEditModal = (ad) => {
  editAd.value = { ...ad };
  showEditModal.value = true;
};

const updateAd = () => {
  if (editAd.value.title && editAd.value.content && editAd.value.url) {
    const index = ads.value.findIndex(ad => ad.id === editAd.value.id);
    if (index !== -1) {
      ads.value[index] = {
        id: editAd.value.id,
        image: editAd.value.image || 'default-image.jpg',
        title: editAd.value.title,
        content: editAd.value.content,
        url: editAd.value.url
      };
      showEditModal.value = false;
      editAd.value = { id: null, image: '', title: '', content: '', url: '' };
    }
  } else {
    alert('Vui lòng điền đầy đủ các trường bắt buộc!');
  }
};

const openDeleteModal = (id) => {
  deleteAdId.value = id;
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  if (deleteAdId.value !== null) {
    ads.value = ads.value.filter(ad => ad.id !== deleteAdId.value);
    showDeleteModal.value = false;
    deleteAdId.value = null;
  }
};

const showDetails = (ad) => {
  selectedAd.value = { ...ad };
  showDetailsModal.value = true;
};
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