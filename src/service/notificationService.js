import apiService from '@/api/apiService'

export const getNotificationList = async (accountId) => {
  const res = await apiService.get(`/v1/notifications/me/${accountId}`)
  return res.data.data
}

export const updateNotificationStatus = (id, status) => {
  return apiService.put(`/v1/notifications/${id}`, { status })
}
export const createNotification = async (data) => {
  try {
    const res = await apiService.post('/v1/notifications', data)
    return res.data
  } catch (err) {
    console.error('❌ Lỗi tạo thông báo:', err)
    throw err
  }
}
