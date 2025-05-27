<template>
  <div class="wrapper">
    <!-- Thanh tìm kiếm -->
    <div class="search-bar">
      <input type="text" placeholder="Tìm kiếm" />
      <button @click="showCreateGroup = true">+ Tạo nhóm mới</button>
    </div>

    <!-- Popup tạo nhóm mới -->
    <div class="overlay" v-if="showCreateGroup">
      <div class="create-form">
        <div class="form-header">
          <h3>Tạo nhóm mới</h3>
          <button class="close-btn" @click="showCreateGroup = false">×</button>
        </div>
        <input type="text" v-model="newGroupName" placeholder="Nhập tên nhóm" />
        <select v-model="newGroupPrivacy">
          <option disabled value="">Chọn quyền riêng tư</option>
          <option>Công khai</option>
          <option>Riêng tư</option>
        </select>
        <button class="submit-btn" @click="createGroup">Tạo nhóm</button>
      </div>
    </div>

    <!-- Tiêu đề -->
    <div class="header">
      <h2>Gợi ý cộng đồng thú cưng</h2>
      <a href="#">Quay lại</a>
    </div>

    <!-- Danh sách nhóm -->
    <div class="group-grid">
      <div
        v-for="(group, index) in petGroups"
        :key="index"
        class="group-card"
      >
        <img :src="group.image" alt="Group Image" />
        <div class="content">
          <div class="info">
            <h3>{{ group.name }}</h3>
            <p>{{ group.members }} Thành viên</p>
          </div>

          <button
            :class="[
              'join-btn',
              group.status === 'joining' ? 'joining' :
              group.status === 'joined' ? 'joined' : ''
            ]"
            :disabled="group.status !== 'idle'"
            @click="handleJoin(index)"
          >
            {{
              group.status === 'joined' ? 'Đã tham gia' :
              group.status === 'joining' ? '' :
              'Tham gia nhóm'
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const petGroups = reactive([
  {
    name: "Hội yêu thích chó",
    image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-05/cho_1.jpg",
    members: "9.7k",
    status: 'idle'
  },
  {
    name: "Hội Yêu chó lạp xưởng TPHCM",
    image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-05/cho_1.jpg",
    members: "5.1k",
    status: 'idle'
  },
  {
    name: "Hội Yêu chó bitpull TPHCM",
    image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-05/cho_1.jpg",
    members: "9.7k",
    status: 'idle'
  },
  {
    name: "Hội Yêu chó corgi TPHCM",
    image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-05/cho_1.jpg",
    members: "9.7k",
    status: 'idle'
  },
  {
    name: "Hội Yêu chó lạp xưởng Bình Định",
    image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-05/cho_1.jpg",
    members: "5.1k",
    status: 'idle'
  },
  {
    name: "Hội Yêu chó bitpull TPHCM",
    image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-05/cho_1.jpg",
    members: "9.7k",
    status: 'idle'
  }
])

const showCreateGroup = ref(false)
const newGroupName = ref('')
const newGroupPrivacy = ref('')

function handleJoin(index) {
  const group = petGroups[index]
  if (group.status === 'idle') {
    group.status = 'joining'
    setTimeout(() => {
      group.status = 'joined'
    }, 600)
  }
}

function createGroup() {
  if (!newGroupName.value.trim() || !newGroupPrivacy.value) return
  petGroups.unshift({
    name: newGroupName.value,
    image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-05/cho_1.jpg",
    members: "1",
    status: 'idle'
  })
  newGroupName.value = ''
  newGroupPrivacy.value = ''
  showCreateGroup.value = false
}
</script>

<style scoped>
/* Layout và style cơ bản giữ nguyên */
.wrapper {
  width: 75vw;
  min-height: 100vh;
  padding: 24px 40px;
  background-color: #fff5ec;
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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

.group-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.group-card {
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
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

/* Nút với hiệu ứng mượt */
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

/* Khi đang chuyển */
.joining {
  opacity: 0;
  transform: scale(0.7);
  pointer-events: none;
}

/* Khi đã tham gia */
.joined {
  background-color: #d6f5d6;
  color: #2f7a2f;
  font-weight: bold;
  cursor: default;
  transform: scale(1.03);
}

/* Popup tạo nhóm */
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.create-form {
  background: #fff5ec;
  padding: 24px;
  border-radius: 16px;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
}

.create-form input,
.create-form select {
  padding: 12px;
  border: none;
  border-radius: 12px;
  background-color: #ffe9cf;
  font-size: 14px;
  color: #444;
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
</style>
