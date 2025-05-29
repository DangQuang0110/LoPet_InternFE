import apiService from '@/api/apiService'

export const createProfile = async (data) => {
  const response = await apiService.post('/v1/profiles', {
    fullName: data.fullName,
    phoneNumber: data.phoneNumber,
    bio: data.bio,
    avatarUrl: '',
    coverUrl: '',
  })
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
