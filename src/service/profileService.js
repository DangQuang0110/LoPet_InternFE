import apiService from '@/api/apiService'

export const createProfile = async (data) => {
  const formData = new FormData()
  formData.append('fullName', data.fullName || '')
  formData.append('phoneNumber', data.phoneNumber || '')
  formData.append('bio', data.bio || '')
  formData.append('avatarUrl', '') // Không cần link nữa, backend lo ảnh
  formData.append('coverUrl', '')

  // Gửi file rỗng nếu không có file thật (để tránh multer lỗi)
  const emptyFile = new Blob([], { type: 'image/png' })
  formData.append('avatar', emptyFile, 'empty.png')
  formData.append('cover', emptyFile, 'empty.png')

  const response = await apiService.post('/v1/profiles', formData)
  return response.data.data
}

// Lấy profile theo accountId
export const getProfileByAccountId = async (accountId) => {
  const response = await apiService.get(`/v1/profiles/accounts/${accountId}`)
  return response.data.data
}

// Cập nhật profile
export const updateProfile = async (id, formData) => {
  const response = await apiService.patch(`/v1/profiles/${id}`, formData)
  return response.data.data
}

// Gán profile vào tài khoản
export const setProfileToAccount = async (profileId, accountId) => {
  const response = await apiService.post(`/v1/profiles/${profileId}`, { accountId })
  return response.data.data
}
