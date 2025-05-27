
<template>
  <div>
    <header class="headerss">
      <div class="logo">
        <img src="/images/logoLight.png" alt="" />
        <span class="logo-text">LoPet</span>
      </div>
      <h1>ADMIN</h1>
      <div class="admin-info">
        <span>{{ currentUser.name }}</span>
        <button @click="handleLogout" class="logout-button">
          <img src="/icon/logout.png" alt="Logout" class="logout-icon" />Đăng xuất
        </button>
      </div>
    </header>
    <div class="admin-layout">
      <aside class="sidebar">
        <h2 @click="goToAdminHome">Admin Panel</h2>
        <ul>
          <li>
            <router-link to="/admin/user" class="nav-link">
              <img src="/icon/user.png" alt="Photo" class="nav-icon" />Quản lý người dùng
            </router-link>
          </li>
          <li>
            <router-link to="/admin/denounce" class="nav-link">
              <img src="/icon/accuse.png" alt="Photo" class="nav-icon" />Quản lý tố cáo
            </router-link>
          </li>
          <li>
            <router-link to="/admin/advertisement" class="nav-link">
              <img src="/icon/management.png" alt="Photo" class="nav-icon" />Quản lý quảng cáo
            </router-link>
          </li>
        </ul>
      </aside>
      <main class="content">
        <router-view v-if="$route.path !== '/admin'"></router-view>
        <div v-else class="statistics">
          <h2 class="statistics-title">Thống kê tổng quan</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <img src="/icon/user.png" alt="Users" />
              </div>
              <h3>Tổng số người dùng</h3>
              <p>{{ stats.totalUsers.toLocaleString() }}</p>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <img src="/icon/accuse.png" alt="Denunciations" />
              </div>
              <h3>Tổng số tố cáo</h3>
              <p>{{ stats.totalDenunciations.toLocaleString() }}</p>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <img src="/icon/management.png" alt="Ads" />
              </div>
              <h3>Tổng số quảng cáo</h3>
              <p>{{ stats.totalAds.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Default user data (since login is removed)
const currentUser = ref({
  name: 'Admin',
  role: 'admin'
})

// Statistics data
const stats = ref({
  totalUsers: 0,
  totalDenunciations: 0,
  totalAds: 0,
  userGrowth: [50, 75, 100, 125, 150, 200, 250, 300, 350, 400, 450, 500],
  denunciationStatus: {
    pending: 20,
    resolved: 50,
    rejected: 10
  }
})

// Fetch statistics data on mount
onMounted(async () => {
  if (route.path === '/admin') {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/admin/stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      stats.value = {
        totalUsers: data.totalUsers || 1200,
        totalDenunciations: data.totalDenunciations || 80,
        totalAds: data.totalAds || 150,
        userGrowth: data.userGrowth || stats.value.userGrowth,
        denunciationStatus: data.denunciationStatus || stats.value.denunciationStatus
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }
})

// Handle logout
const handleLogout = () => {
  router.push('/')
  alert("Đăng xuất thành công")
}

// Navigate to admin homepage
const goToAdminHome = () => {
  router.push('/admin')
}
</script>

<style scoped>


/* Shared styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Poppins', sans-serif;
  margin: 0;
}

/* Header styles */
.headerss {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #FFFFFF;
  padding: 15px 30px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 80px;
  max-width: 100%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

/* Logo styles */
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  transition: transform 0.3s ease;
}

.logo img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background: #FFF8F0;
  padding: 5px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.logo:hover img {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  color: #ff6b6b;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  font-family: 'Poppins', sans-serif;
}

.headerss h1 {
  color: #333;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  flex: 1;
  text-align: center;
  letter-spacing: 0.5px;
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-info span {
  color: #333;
  font-weight: 500;
  font-size: 15px;
}

/* Logout button styles */
.logout-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(45deg, #ff6b6b, #ff8e53);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease;
  animation: pulse 2s infinite ease-in-out;
}

.logout-button:hover {
  background: linear-gradient(45deg, #ff8e53, #ff6b6b);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: none;
}

.logout-icon {
  width: 16px;
  height: 16px;
}

/* Pulse animation for logout button */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
  100% {
    transform: scale(1);
  }
}

.admin-layout {
  display: flex;
  min-height: calc(100vh - 80px);
  margin-top: 80px;
  background-color: #FFFFFF;
}

.sidebar {
  width: 250px;
  background: #FFFFFF;
  color: #333;
  padding: 30px;
  transition: width 0.3s ease;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
}

.sidebar h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 20px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 10px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.sidebar h2:hover {
  color: #ff6b6b;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  margin: 5px 0;
}

.sidebar a,
.sidebar .logout-button {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
  text-decoration: none;
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.sidebar .logout-button {
  background: linear-gradient(45deg, #ff6b6b, #ff8e53);
  color: white;
  font-weight: 600;
}

.sidebar .logout-button:hover {
  background: linear-gradient(45deg, #ff8e53, #ff6b6b);
  transform: translateX(5px) scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: none;
}

.sidebar a:hover,
.sidebar a.router-link-active {
  background: rgba(255, 107, 107, 0.1);
  transform: translateX(5px);
}

.sidebar a.router-link-active {
  background: linear-gradient(45deg, #ff6b6b, #ff8e53);
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.sidebar .nav-icon,
.sidebar .logout-icon {
  margin-right: 10px;
  width: 18px;
  height: 18px;
}

.content {
  flex-grow: 1;
  padding: 30px;
  background: #F9F9F9;
}

/* Statistics styles */
.statistics {
  padding: 20px;
  background: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.statistics-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
  background: linear-gradient(45deg, #ff6b6b, #ff8e53);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: linear-gradient(135deg, #FFFFFF, #FFF8F0);
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(45deg, #ff6b6b, #ff8e53);
  transition: height 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.stat-card:hover::before {
  height: 8px;
}

.stat-icon {
  margin-bottom: 10px;
}

.stat-icon img {
  width: 32px;
  height: 32px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.stat-card h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}

.stat-card p {
  font-size: 28px;
  font-weight: 700;
  color: #ff6b6b;
  margin: 0;
}



/* Responsive design */
@media (max-width: 768px) {
  .headerss {
    padding: 12px 20px;
    height: 70px;
  }

  .logo img {
    width: 40px;
    height: 40px;
    padding: 4px;
  }

  .logo-text {
    font-size: 18px;
  }

  .headerss h1 {
    font-size: 20px;
  }

  .admin-info {
    gap: 10px;
  }

  .admin-info span {
    font-size: 14px;
  }

  .logout-button {
    padding: 8px 16px;
    font-size: 13px;
  }

  .sidebar {
    width: 200px;
  }

  .admin-layout {
    margin-top: 70px;
  }

  .content {
    padding: 20px;
  }

  .statistics {
    padding: 15px;
  }

  .statistics-title {
    font-size: 24px;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .stat-card h3 {
    font-size: 16px;
  }

  .stat-card p {
    font-size: 24px;
  }

  .charts-title {
    font-size: 20px;
  }

  .chart-container h4 {
    font-size: 14px;
  }
}

@media (max-width: 576px) {
  .headerss {
    flex-direction: column;
    align-items: center;
    padding: 10px;
    height: 100px;
  }

  .logo {
    justify-content: center;
    gap: 8px;
  }

  .logo img {
    width: 36px;
    height: 36px;
    padding: 3px;
  }

  .logo-text {
    font-size: 16px;
    letter-spacing: 0.5px;
  }

  .headerss h1 {
    font-size: 16px;
    margin: 8px 0;
  }

  .admin-info {
    flex-direction: column;
    gap: 10px;
  }

  .logout-button {
    width: 100%;
    max-width: 180px;
    justify-content: center;
  }

  .admin-layout {
    flex-direction: column;
    margin-top: 100px;
  }

  .sidebar {
    width: 100%;
    padding: 15px;
  }

  .sidebar ul {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .sidebar li {
    flex: 1 1 auto;
  }

  .sidebar a,
  .sidebar .logout-button {
    justify-content: center;
  }

  .statistics {
    padding: 10px;
  }

  .statistics-title {
    font-size: 20px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card h3 {
    font-size: 14px;
  }

  .stat-card p {
    font-size: 20px;
  }

  .stat-icon img {
    width: 28px;
    height: 28px;
  }

  
}
</style>
