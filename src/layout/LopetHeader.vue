<template>
  <div class="app-layout">
    <!-- Header -->
    <header class="header-container">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo">
          <div class="logo-icon">🦊</div>
          <span class="logo-text">LOPET</span>
        </div>
        
        <div class="search-container">
        <div class="search-box-minimal">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            v-model="searchQuery"
            class="search-input-minimal"
            @keyup.enter="handleSearch"
          />
        </div>
      </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <div class="main-content">
      <div class="sidebar-container">
        <div class="sidebar-wrapper">
          <!-- Sidebar -->
          <aside class="sidebar">
            <nav class="sidebar-nav">
              <ul class="nav-list">
                <li class="nav-item" :class="{ active: $route.path === '/' }">
                <router-link to="/" class="nav-link">
                    <img src="/icon/home.png" alt="Home" class="nav-icon" />
                    <span class="nav-text">Trang chủ</span>
                </router-link>
                </li>
                
                <li class="nav-item" :class="{ active: $route.path === '/notifications' }">
                  <router-link to="/notifications" class="nav-link">
                    <img src="/icon/happy.png" alt="Home" class="nav-icon" />
                    <span class="nav-text">Thông báo</span>
                  </router-link>
                </li>
                
                <li class="nav-item" :class="{ active: $route.path === '/messages' }">
                  <router-link to="/messages" class="nav-link">
                    <img src="/icon/texting.png" alt="Home" class="nav-icon" />
                    <span class="nav-text">Nhắn tin</span>
                  </router-link>
                </li>
                
                <li class="nav-item" :class="{ active: $route.path === '/community' }">
                  <router-link to="/community" class="nav-link">
                    <img src="/icon/social-justice.png" alt="Home" class="nav-icon" /> 
                    <span class="nav-text">Cộng đồng</span>
                  </router-link>
                </li>
                
                <li class="nav-item" :class="{ active: $route.path === '/friends' }">
                  <router-link to="/friend" class="nav-link">
                    <img src="/icon/friends.png" alt="Home" class="nav-icon" />
                    <span class="nav-text">Bạn bè</span>
                  </router-link>
                </li>
                
                <li class="nav-item" :class="{ active: $route.path === '/profile' }">
                  <router-link to="/profile" class="nav-link">
                    <img src="/icon/user.png" alt="Home" class="nav-icon" />
                    <span class="nav-text">Profile</span>
                  </router-link>
                </li>
              </ul>
            </nav>
            
            <!-- User Profile at bottom -->
            <div class="user-profile" @click="goToProfile">
            <!-- Ảnh đại diện -->
            <div class="avatar">
                <img src="/images/cau.jpg" alt="User Avatar">
            </div>
            
            <!-- Tên người dùng -->
            <span class="user-name">Quang Dang</span>
            
            <!-- Icon cài đặt -->
            <div class="settings-icon" @click.stop="openSettings">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
                </svg>
            </div>
            </div>
          </aside>
        </div>
      </div>

      <!-- Content Area -->
      <main class="content">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppLayout',
  data() {
    return {
      searchQuery: '',
      user: {
        name: 'Quang Dang',
        avatar: null
      }
    }
  },
  methods: {
    handleSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({
          name: 'Search',
          query: { q: this.searchQuery }
        });
      }
    },
    // goToProfile() {
    //   this.$router.push('/profile');
    // }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.app-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

/* Header Styles */
.header-container {
  background: #FFF8F0;
  padding: 12px 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 60px;
}

.header-content {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 50px;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: #e67e22;
  min-width: 120px;
  cursor: pointer;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 20px;
  letter-spacing: -0.02em;
}

.search-container {
  width: 100%;
  max-width: 500px;
  margin: 0 0;
  padding: 20px;
}

.search-box-minimal {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border: 2px solid #d1d5db;
  border-radius: 20px;
  padding: 10px 10px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.search-box-minimal:hover {
  border-color: #9ca3af;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.search-box-minimal:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background-color: #ffffff;
}

.search-icon {
  flex-shrink: 0;
  margin-right: 12px;
  color: #6b7280;
  transition: color 0.2s ease;
}

.search-box-minimal:focus-within .search-icon {
  color: #3b82f6;
}

.search-input-minimal {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 16px;
  color: #374151;
  font-weight: 400;
  line-height: 1.5;
}

.search-input-minimal::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.search-input-minimal:focus::placeholder {
  color: #d1d5db;
}

/* Responsive design */
@media (max-width: 640px) {
  .search-container {
    padding: 16px;
  }
  
  .search-box-minimal {
    padding: 10px 14px;
  }
  
  .search-input-minimal {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}

/* Main Content */
.main-content {
  display: flex;
  margin-top: 60px;
  height: calc(100vh - 60px);
}

/* Sidebar Container */
.sidebar-container {
  width: 250px;
  padding: 15px;
  background-color: #FFF8F0;
}



/* Sidebar Styles */
.sidebar {
  width: 100%;
  background-color: #fbeedc;
  border-radius: 16px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 65%;
  font-family: sans-serif;
}

.sidebar-nav {
  flex: 1;
}

.nav-list {
  list-style: none;
  padding: 0;
}

.nav-item {
  margin: 8px 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  color: #333;
  text-decoration: none;
  font-size: 16px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}
.nav-icon {
  margin-right: 8px; /* Khoảng cách giữa icon và text */
  width: 20px; /* Điều chỉnh kích thước icon */
  height: 20px;
}

.nav-link:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.nav-item.active .nav-link {
  background-color: rgba(0, 0, 0, 0.1);
  font-weight: 500;
}

/* User Profile */
.user-profile {
  padding: 16px;
  cursor: pointer;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: auto;
}

.user-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}
.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  cursor: pointer;
  position: relative;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-weight: 500;
  flex-grow: 1;
}

.settings-icon {
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-icon:hover {
  background-color: #f0f0f0;
}

/* Content Area */
.content {
  flex: 1;
  background: #ffffff;
  overflow-y: auto;
  
  /* margin-right: 15px;
  margin-top: 15px;
  border-radius: 16px; */
}

/* Responsive Design */
@media (max-width: 768px) {
  .sidebar-container {
    position: fixed;
    left: -250px;
    top: 60px;
    height: calc(100vh - 60px);
    z-index: 50;
    transition: left 0.3s ease;
    padding: 0;
  }
  
  .sidebar-container.open {
    left: 0;
  }
  
  .sidebar {
    height: 100%;
    border-radius: 0;
  }
  
  

  
  .logo {
    min-width: 100px;
  }
}



</style>