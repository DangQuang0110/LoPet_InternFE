<template>
  <div class="layout-wrapper">
    <!-- Sidebar -->
    <aside class="sidebar">
      
      <!-- Logo Section -->
     <div class="logo">
        <img src="/assets/logoPetGram.png" alt="LOPET Logo" class="logo-img" />
        
      </div>
      <!-- User Info at the top -->
     
      <!-- Menu Section with Border -->
      <div class="menu-container">
        <nav class="nav-menu">
          <ul>
            <li class="nav-item">
              <i class="fas fa-home"></i>
              <span>Trang chủ</span>
            </li>
            <li class="nav-item">
              <i class="fas fa-bell"></i>
              <span>Thông báo</span>
            </li>
            <li class="nav-item">
              <i class="fas fa-comment"></i>
              <span>Nhắn tin</span>
            </li>
            <li class="nav-item">
              <i class="fas fa-users"></i>
              <span>Cộng đồng</span>
            </li>
            <li class="nav-item">
              <i class="fas fa-user-friends"></i>
              <span>Bạn bè</span>
            </li>
            <li class="nav-item">
              <i class="fas fa-user"></i>
              <span>Profile</span>
            </li>
            <hr>
            <div class="sidebar-footer">
        <img class="avatar" src="/assets/quang.jpg" alt="User Avatar" />
        <span class="username">Quang Đang</span>
        <i class="fas fa-cog" style="margin-left: 8px;"></i>
      </div> 
          </ul>
        </nav>
      </div>
      <!-- Footer with additional user info -->
    </aside>

    <!-- Main content area -->
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
// No script logic needed
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  height: 100vh;
  background: #FAEBD7;
}

.sidebar {
  width: 260px;
  background: #FFF8F0;
  border-right: 1px solid #FAEBD7;
  display: flex;
  flex-direction: column;
  padding: 15px;
  
  box-sizing: border-box;
}

.logo {
  font-size: 20em;
  font-weight: bold;
  color: #000;
  margin-bottom: 10px;
}
.logo {
  position: relative;
  text-align: center;      /* căn giữa chữ và ảnh theo chiều ngang */
  margin-bottom: 10px;
  /* giữ lại các thuộc tính font-size, font-weight nếu cần */
}

.logo .logo-img {
  position: absolute;
  top: -12px;              /* điều chỉnh cho ảnh “nhô” lên trên */
  left: 50%;
  transform: translateX(-50%);
  width: 100px;             /* kích thước logo, bạn chỉnh lại tuỳ ý */
  height: 80px;
  z-index: 1;
}

.logo span {
  display: block;
  padding-top: 20px;       /* tạo khoảng trống bên trên cho logo */
  font-size: 1.3rem;
  font-weight: bold;
  color: #000;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 6px 0;
  margin-bottom: 10px;
  border-bottom: 1px solid #FAEBD7;
}

.user-info .avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 6px;
}

.user-info .username {
  font-weight: 500;
  color: #000;
  font-size: 0.85rem;
}

.menu-container {
  border: 5px solid #FAEBD7; /* Thêm viền cho phần menu */
  border-radius: 5px; /* Bo góc nhẹ */
  padding: 5px; /* Thêm padding trong phần menu */
  margin-top: 80px; /* Khoảng cách dưới menu */
  background: #FAEBD7;
 
}

.nav-menu ul {
  list-style: none;
  padding: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 4px 0;
  cursor: pointer;
  color: #000;
  font-size: 0.9rem;
  font-weight: 500;
}

.nav-item i {
  width: 20px;
  margin-right: 8px;
  color: #000;
}

.sidebar-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  padding: 6px 0;
  border-top: 1px solid #FAEBD7;
}

.sidebar-footer .avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 6px;
}

.sidebar-footer .username {
  font-weight: 500;
  color: #000;
  font-size: 0.85rem;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background: #FFF8F0 ;
  box-sizing: border-box;
  padding: -25px;
}
</style>