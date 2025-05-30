import apiService from '@/api/apiService'

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
    console.log('error khi tao tai khoan ne: ', error)
  }
  
}
export const loginUser = async ({ username, password }) => {
  try {
    const response = await apiService.post('/v1/auth/login', {
      username,
      password,
    });

    const {
      id: userId,
      username: returnedUsername, // 🟢 lấy đúng username từ API
      accessToken,
      refreshToken,
      roles
    } = response.data.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    return {
      userId,
      username: returnedUsername, // ✅ sửa tại đây
      roles
    };
  } catch (err) {
    throw err.response?.data ?? err;
  }
};

export const resetPassword = async ({ email, password, confirmPassword }) => {
  return await apiService.post('/v1/password/reset', {
    email,
    password,
    confirmPassword
  }).then(res => res.data)
}
// export const verifyAccount = async ({ email, password }) => {
//   return await apiService.post('/v1/auth/verify', {
//     email, password
//   }).then(res => res.data)
// }
export const getAccountById = async (id) => {
  try {
    console.log('vo day ne')
    const res = await apiService.get(`/v1/accounts/${id}`)
    return res.data.data // Trả về { id, username, email, ... }
  } catch (err) {
    console.error(`Lỗi khi lấy account ID ${id}:`, err)
    return null
  }
}
export const logoutUser = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  
  delete apiService.defaults.headers.common['Authorization']
}
