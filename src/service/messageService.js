import apiService from '@/api/apiService'

export const getMessageList = async (senderId, receiverId) => {
  try {
    const response = await apiService.get(`/v1/messages/me/${senderId}`, {
      params: {
        targetId: receiverId
      }
    })
    return response.data.data
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tin nhắn:', error)
    throw error
  }
}
export const createMessage = async (formData) => {
  try {
    const response = await apiService.post(`/v1/messages`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data.data
  } catch (error) {
    console.error('Lỗi khi gửi tin nhắn:', error)
    throw error
  }
}

export const getMessageDetail = async (messageId) => {
  try {
    const response = await apiService.get(`/v1/messages/${messageId}`)
    return response.data.data
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết tin nhắn:', error)
    throw error
  }
}

export const updateMessageStatus = async (messageId, status) => {
  try {
    const response = await apiService.patch(`/v1/messages/status/${messageId}`, { status })
    return response.data.data
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái tin nhắn:', error)
    throw error
  }
}
