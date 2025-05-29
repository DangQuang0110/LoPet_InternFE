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
  try {
    console.log('truoc1',accountId)
  const response = await apiService.get(`/v1/profiles/accounts/${accountId}`)
    console.log('response cua get profile',response)
  return response.data.data    
  } catch (error) {
    console.log(error)
  }

}

// Cập nhật profile
export const updateProfile = async (id, formData) => {
  const response = await apiService.patch(`/v1/profiles/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data.data
}


// Gán profile vào tài khoản
export const setProfileToAccount = async (profileId, accountId) => {
  const response = await apiService.post(`/v1/profiles/${profileId}`, { accountId })
  return response.data.data
}
