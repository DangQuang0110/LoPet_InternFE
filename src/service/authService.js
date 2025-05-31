import apiService from '@/api/apiService'

// Đăng ký tài khoản
export const registerUser = async ({ email, username, password, confirmPassword }) => {
  try {
    const response = await apiService.post('/v1/auth/signup', {
      email,
      username,
      password,
      confirmPassword,
    })
    return response.data
  } catch (error) {
    console.error('❌ Lỗi khi tạo tài khoản:', error.response?.data || error)
    throw error
  }
}

// Đăng nhập
export const loginUser = async ({ username, password }) => {
  try {
    const response = await apiService.post('/v1/auth/login', {
      username,
      password,
    })

    const {
      id: userId,
      username: returnedUsername,
      accessToken,
      refreshToken,
      roles
    } = response.data.data

    // Lưu token và set header mặc định
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    apiService.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

    return { userId, username: returnedUsername, roles }
  } catch (err) {
    console.error('❌ Lỗi đăng nhập:', err.response?.data || err)
    throw err.response?.data ?? err
  }
}

// Đặt lại mật khẩu
export const resetPassword = async ({ email, password, confirmPassword }) => {
  try {
    const res = await apiService.post('/v1/password/reset', {
      email,
      password,
      confirmPassword
    })
    return res.data
  } catch (error) {
    console.error('❌ Lỗi reset mật khẩu:', error.response?.data || error)
    throw error
  }
}

// Lấy thông tin tài khoản theo ID
export const getAccountById = async (id) => {
  try {
    const res = await apiService.get(`/v1/accounts/${id}`)
    return res.data.data
  } catch (err) {
    console.error(`❌ Lỗi khi lấy account ID ${id}:`, err.response?.data || err)
    return null
  }
}

// Đăng xuất người dùng
export const logoutUser = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  delete apiService.defaults.headers.common['Authorization']
}

// Lấy danh sách tất cả tài khoản
export const getAccountList = async () => {
  try {
    const res = await apiService.get('/v1/accounts')
    return res.data.data
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách người dùng:', error.response?.data || error)
    return []
  }
}

// Khóa tài khoản
export const banAccount = async (id) => {
  try {
    const res = await apiService.post(`/v1/accounts/ban/${id}`)
    return res.data.data
  } catch (error) {
    console.error(`❌ Lỗi khi khóa người dùng ID ${id}:`, error.response?.data || error)
    throw error
  }
}

// Mở khóa tài khoản
export const unbanAccount = async (id) => {
  try {
    const res = await apiService.post(`/v1/accounts/unban/${id}`)
    return res.data.data
  } catch (error) {
    console.error(`❌ Lỗi khi mở khóa người dùng ID ${id}:`, error.response?.data || error)
    throw error
  }
}
export const getRolesList = async () => {
  try {
    const res = await apiService.get('/v1/roles')
    return res.data.data // [{ id: 1, name: 'ADMIN' }, ...]
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách vai trò:', error.response?.data || error)
    return []
  }
}
export const setRolesToAccount = async (userId, roles) => {
  try {
    const res = await apiService.put(`/v1/accounts`, {
      userId,
      roles
    })
    return res.data
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật vai trò:', error.response?.data || error)
    throw error
  }
}
