<template>
  <div class="chat-app">
    <nav class="left-bar">
      <div class="nav-icons">
        <router-link to="/home">
          <img src="/image/home.png" class="icon-img" />
        </router-link>
        <!-- <router-link to="/notification">
          <img src="/image/bell.png" class="icon-img" />
        </router-link> -->
        <router-link to="/message">
          <img src="/icon/chat.png" class="icon-img" />
        </router-link>
        <router-link to="/groups">
          <img src="/image/group.png" class="icon-img" />
        </router-link>
        <router-link to="/friend">
          <img src="/image/friend.png" class="icon-img" />
        </router-link>
        <router-link to="/profile">
          <img src="/image/profile.png" class="icon-img" />
        </router-link>
      </div>
      <img :src="currentUserAvatar" class="avatar-icon" />
    </nav>
    <div class="right-main">
    <aside class="sidebar" v-show="!isMobile || showSidebar">
      <div class="search-bar">
        <img src="/image/tim.png" alt="Tìm kiếm" />
        <input type="text" placeholder="Tìm kiếm" />
      </div>
        <div class="tab-section" v-show="!isMobile || showSidebar">
          <button class="tab-btn" :class="{ active: activeTab === 'all' }" @click="switchTab('all')">
            Tất cả tin nhắn
          </button>
          <button class="tab-btn" :class="{ active: activeTab === 'friends' }" @click="switchTab('friends')">
            Bạn bè
          </button>
          <div class="tab-indicator" :style="indicatorStyle"></div>
        </div>
        <div class="friend-section">
          <div
            v-for="friend in friends"
            :key="friend.id"
            class="friend-item"
            :class="{ active: selectedFriend?.id === friend.id }"
            @click="selectFriend(friend)"
          >
            <img :src="friend.avatar" class="avatar" />
            <div class="friend-info">
              <div class="name">
                {{ friend.name }}
                <span v-if="friend.online" class="online-dot" title="Đang hoạt động"></span>
              </div>
              <div class="desc">{{ friend.desc }}</div>
            </div>
          </div>
        </div>
      </aside>

      <section class="main-chat" v-if="selectedFriend && (!isMobile || !showSidebar)">
        <header class="chat-header">
        <button v-if="isMobile" @click="showSidebar = true" class="back-btn">
          <img src="/image/back.png" alt="Back" class="back-icon" />
        </button>
          <img :src="selectedFriend.avatar" class="avatar" />
          <div>
            <div class="name">{{ selectedFriend.name }}</div>
            <div class="status" :class="{ online: selectedFriend.online }">
              {{ selectedFriend.online ? 'Đang hoạt động' : 'Không hoạt động' }}
              <span v-if="selectedFriend.online" class="online-dot" title="Đang hoạt động"></span>
            </div>
          </div>
        </header>

        <div class="chat-body" ref="chatBody">
          <div
            v-for="msg in messages[selectedFriend.id]"
            :key="msg.id"
            :class="['msg-wrapper', msg.fromMe ? 'align-right' : 'align-left']"
          >
            <img v-if="!msg.fromMe" :src="selectedFriend.avatar" class="avatar-msg" />
            <div v-if="msg.image" class="msg-image-wrapper">
              <img :src="msg.image" class="msg-img" />
            </div>
            <div v-else :class="['msg', msg.fromMe ? 'from-me' : 'from-other']">
              <p class="msg-text">{{ msg.text }}</p>
            </div>
          </div>
        </div>
      <footer class="chat-input">
        <input type="text" placeholder="Tin nhắn văn bản" />
        <div class="chat-actions">
          <button type="button" class="icon-btn">
            <img src="/image/image.png" alt="Gửi ảnh" />
          </button>
          <button type="button" class="icon-btn">
            <img src="/image/camera.png" alt="Camera" />
          </button>
          <button type="button" class="icon-btn">
            <img src="/image/send.png" alt="Gửi" />
          </button>
        </div>
      </footer>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, watch } from 'vue'

const currentUserAvatar = ref('/image/quang.png')
const friends = ref([])
const messages = ref({})
const selectedFriend = ref(null)
const chatBody = ref(null)
const activeTab = ref('all')
const isMobile = ref(window.innerWidth <= 426)
const showSidebar = ref(true)

const handleResize = () => {
  isMobile.value = window.innerWidth <= 432
  if (!isMobile.value) showSidebar.value = true
}

window.addEventListener('resize', handleResize)

watch(selectedFriend, (newVal) => {
  if (isMobile.value && newVal) {
    showSidebar.value = false
  }
})

const switchTab = (tab) => {
  activeTab.value = tab
}

const indicatorStyle = computed(() => {
  const index = activeTab.value === 'all' ? 0 : 1
  return {
    transform: `translateX(${index * 100}%)`,
    width: '50%'
  }
})

const scrollToBottom = () => {
  if (chatBody.value) {
    chatBody.value.scrollTop = chatBody.value.scrollHeight
  }
}

const selectFriend = (friend) => {
  selectedFriend.value = friend
  nextTick(() => scrollToBottom())
}

onMounted(() => {
  friends.value = [
    { id: 1, name: 'Nhân', avatar: '/image/nhan.png', desc: 'Hello cậu', online: true },
    { id: 2, name: 'Cầu', avatar: '/image/cau.png', desc: 'Hello cậu', online: false },
    { id: 3, name: 'Trường', avatar: '/image/truong.png', desc: 'Chào bạn', online: true },
    { id: 4, name: 'Phong', avatar: '/image/phong.png', desc: 'Phong thích quang', online: false },
    { id: 5, name: 'Vũ', avatar: '/image/vu.png', desc: 'Bạn: Vậy chốt mình đặt bé này', online: true }
  ]

  messages.value = {
    5: [
      { id: 1, fromMe: true, text: 'Bạn ơi, mình muốn mua thú cưng' },
      { id: 2, fromMe: false, text: 'Ok bạn, để mình nhắn chủ shop nhé' },
      { id: 3, fromMe: true, text: 'Để mình gửi bạn xem hình thú cưng nhé' },
      { id: 4, fromMe: true, text: 'Chó đây bạn, có dễ thương không??' },
      { id: 5, fromMe: true, image: '/image/phong.png' },
      { id: 6, fromMe: false, text: 'Chó dễ thương quá trời' },
      { id: 7, fromMe: true, text: 'Vậy chốt mình đặt bé này' }
    ]
  }

  // if (friends.value.length > 0) {
  //   selectedFriend.value = friends.value[0]
  // }
})
</script>

<style scoped>
.chat-app {
  display: flex;
  height: 100vh;
  font-family: 'Segoe UI', roboto;
  background: #FFF8F0;

}
.left-bar {
  width: 60px;
  background: #FAEBD7;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 0;
  border-right: 2px solid #ddd;
  height: 330px;
  margin-top:50px;
  position: relative;
  border-radius: 10px;
  margin-left:10px;
}

.left-bar::before {
  content: "";
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background-image: url('/image/logoPetGram.png');
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 60px 40px;
  width: 60px;
  height: 60px;
}


.icon-img {
  width: 24px;
  height: 24px;
  cursor: pointer;
  opacity: 0.9;
  transition: 0.2s;
}
.icon-img:hover {
  opacity: 1;
  transform: scale(1.05);
}

.nav-icons {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
}
.icon {
  font-size: 20px;
  cursor: pointer;
}
.avatar-icon {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-top: auto;
}
.right-main {
  display: flex;
  flex: 1;
  background: #FAEBD7;
  margin-left:10px;
}
.sidebar {
  width: 290px;
  margin-right:0;
  background: #FAEBD7;
  padding: 10px;
  display: flex;
  flex-direction: column;
}
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #FAEBD7;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 6px 12px;
  height: 35px;
  gap: 8px;
}

.search-bar img {
  width: 18px;
  height: 18px;
  opacity: 0.6;
}

.search-bar input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 14px;
  background: transparent;
}

.tab-section {
  display: flex;
  position: relative;
  border-bottom: 1px solid #ddd;
  margin: 20px 0;
}
.tab-btn {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  position: relative;
  z-index: 1;
  transition: color 0.3s;
}

.tab-btn.active {
  color: #000;
  font-weight: bold;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: #FFA500;
  width: 50%;
  transition: transform 0.3s ease;
  border-radius: 2px;
}
.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.all-msg-btn {
  width: 100%;
  padding: 10px;
  background: #ffcc80;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
.friend-section h3,
.stranger-section h3 {
  margin: 15px 0 10px;
  font-size: 14px;
}
.friend-item,
.stranger-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
}

.friend-item.active {
  background: #ffe0b2;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.friend-info,
.stranger-item > div {
  margin-left: 10px;
}
.name {
  font-weight: 600;
  font-size: 14px;
}
.desc {
  font-size: 12px;
  color: #555;
}
.main-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-left: 2px solid black;
}
.chat-header {
  padding: 20px;
  height:55px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 2px solid black;
}
.status {
  font-size: 12px;
  color: green;
}
.chat-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.msg {
  max-width: 60%;
  padding: 10px;
  border-radius: 10px;
}
.msg-wrapper {
  display: flex;
  align-items: flex-end;
  margin-bottom: 10px;
}
.avatar-msg {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin: 0 8px 4px 8px;
}
.align-right {
  display: flex;
  justify-content: flex-end;
}
.align-left {
  display: flex;
  justify-content: flex-start;
}
.from-me {
  align-self: flex-end;
  background: #3b6eee;
  color: white;
}
.from-other {
  align-self: flex-start;
  background: #cecaca;
}
.msg-img {
  width: 200px;
  border-radius: 10px;
  object-fit: cover;
  border: none; 
  background: none;
  padding: 0;
}
.msg-image-wrapper {
  margin: 8px 0;
}
.msg-text {
  margin: 0;
}
.chat-input {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #DCD9D4;
}

.chat-input input {
  flex: 1;
  padding: 10px 12px;
  border-radius: 6px;
  border: none;
  outline: none;
  font-size: 14px;
  background: #DCD9D4;
}

.chat-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 12px;
}
.chat-actions img {
  width: 20px;
  height: 20px;
  cursor: pointer;
  opacity: 0.8;
  transition: transform 0.2s ease, opacity 0.2s;
}
.chat-input button {
  /* margin-left: 10px;
  padding: 0 12px; */
  padding-right:20px;
  background: #DCD9D4;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.main-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 18px;
}
.online-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #00cc00;
  border-radius: 50%;
  margin-left: 6px;
}

.status {
  font-size: 12px;
  color: gray;
}
.status.online {
  color: green;
}
.icon-btn {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.icon-btn img {
  width: 20px;
  height: 20px;
  opacity: 0.8;
  transition: opacity 0.2s, transform 0.2s;
}
@media (max-width: 432px) {
  .chat-app {
    display: flex;
    flex-direction: row;
    height: 100vh;
    overflow: hidden;
  }

  .left-bar {
    width: 60px;
    background: #FAEBD7;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 0;
    border-right: 1px solid #ddd;
    position: relative;
    border-radius: 0;
    margin-left: 0;
    height: 100%;
  }

  .left-bar::before {
    bottom: 20px;
  }

  .right-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 0;
    height: 100vh;
    overflow: hidden;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #ccc;
    overflow-y: auto;
    flex-shrink: 0;
  }

  .main-chat {
    width: 100%;
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .chat-body {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
    min-height: 0;
  }

  .chat-input {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding: 10px;
    flex-shrink: 0;
    background-color: #DCD9D4;
  }

  .chat-actions {
    display: flex;
    align-items: center;
    gap: 1px;
    margin-left: 10px;
  }

  .chat-header {
    padding: 10px;
    flex-shrink: 0;
  }

  .back-btn {
    background: none;
    border: none;
    font-size: 20px;
    margin-right: 10px;
    cursor: pointer;
  }

  .back-icon {
    width: 20px;
    height: 20px;
    opacity: 0.8;
    transition: opacity 0.2s;
  }

  .back-icon:hover {
    opacity: 1;
  }
}
</style>