<template>
  <div class="app-container">
    <header class="header">
      <div class="logo">LOPET 🐱</div>
      <input class="search" placeholder="Tìm kiếm..." />
    </header>

    <div class="cover"></div>

    <main class="main">
      <!-- Thông tin nhóm -->
      <section class="group-info">
        <h1>Hội cứu trợ động vật Việt Nam</h1>
        <p class="members">👥 3.2 Triệu thành viên</p>
        <div class="avatars">
          <img v-for="i in 6" :key="i" class="avatar" :src="`https://i.pravatar.cc/40?img=${i}`" />
        </div>
        <div class="group-actions">
          <button class="invite">Tham gia</button>
        </div>
      </section>

      <div class="layout">
        <!-- Bên trái: Status & Bài viết -->
        <div class="left">
          <!-- Ô đăng status -->
          <div class="new-post">
            <div class="status-box">
            </div>
          </div>

          <!-- Bài viết -->
          <div class="post">
            <div class="post-header">
              <img class="avatar" src="https://i.pravatar.cc/40?img=7" />
              <div class="info">
                <strong>Phạm Cầu</strong>
                <div class="time">7 tháng 5 lúc 15:48</div>
              </div>
              <div class="menu">⋮</div>
            </div>
            <p>Mình đang bị lạc mất con chó màu vàng ai thấy báo giúp mình</p>
            <img src="@/assets/anhbia.jpg" alt="Post Image" class="post-image" />

            <div class="interactions">
              ❤️ 120 lượt thích – 💬 Bình luận – 🔄 Chia sẻ
            </div>

            <!-- Bình luận có avatar -->
            <div class="comment" style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 6px;">
              <img src="https://i.pravatar.cc/30?img=9" style="width: 28px; height: 28px; border-radius: 50%;" />
              <div style="background-color: #f2f2f2; padding: 6px 10px; border-radius: 12px;">
                <strong>Phong:</strong> Chó này mình làm thịt rồi nha bạn
              </div>
            </div>

            <input class="comment-box" placeholder="Viết bình luận..." />
          </div>
        </div>

        <!-- Bên phải: Giới thiệu & Bài viết mới -->
        <div class="right">
          <div class="introduction">
            <p><strong>Chào ae vào hội cứu trợ động vật Việt Nam</strong></p>
            <p>📞 Hotline: 0359630631</p>
            <p>✉️ Email: caupham25@gmail.com</p>
            <p>📍 Hoài Nhơn, Bình Định, Việt Nam</p>
          </div>

          <div class="sidebar-box">
            <div class="recent-post" v-for="i in 6" :key="i">
              <div class="recent-info">

              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.app-container {
  font-family: 'Arial', sans-serif;
  background: #f9f9f9;
  width: 100%;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 12px 20px;
  background: #fff3e0;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.logo {
  font-weight: bold;
  color: orange;
}

.search {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  width: 220px;
}

.cover {
  width: 100%;
  height: 325px;
  background: url('@/assets/anhbia.jpg') center/cover no-repeat;
}


.main {
  padding: 20px 90px;
  width: 100%;
  box-sizing: border-box;
}

.group-info {
  background: #fff3e0;
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.members {
  margin: 6px 0;
}

.avatars {
  margin: 10px 0;
}

.avatars .avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 6px;
}

.group-actions button {
  margin-right: 10px;
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.invite {
  background-color: orange;
  color: #fff;
}

.joined {
  background-color: #eee;
}

.layout {
  display: flex;
  width: 108%;
  gap: 30px;
}

.left {
  flex: 1.5;
}

.right {
  flex: 2;
}

.new-post {
  background: #f8f8f8;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: -30px;
}

.status-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-box .avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.status-input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 16px;
  border: 1px solid #ccc;
}

.status-actions {
  margin-top: 10px;
  font-size: 20px;
}

.post {
  background: #fff3e0;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.post-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.post-header .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.post-header .info {
  flex-grow: 1;
}

.post-header .menu {
  cursor: pointer;
}

.post-img {
  margin-top: 10px;
  width: 100%;
  border-radius: 10px;
}

.interactions {
  margin: 10px 0;
  font-size: 14px;
  color: #666;
}

.comment {
  margin-bottom: 6px;
}

.comment-box {
  width: 100%;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.introduction,
.sidebar-box {
  background: #fff3e0;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: -152px;
  width: 100%;
  box-sizing: border-box;
}

.recent-post {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.recent-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid #880e4f;
}

.recent-info {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
}

.recent-time {
  color: #0288d1;
  font-size: 13px;
}

.recent-button {
  background-color: #fbc02d;
  color: #000;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 13px;
  cursor: pointer;
}

.verified {
  color: #2196f3;
  font-size: 14px;
}
</style>
