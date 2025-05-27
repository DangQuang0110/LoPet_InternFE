import apiService from '@/api/apiService'

export const getFriendList = async (userId) => {
  try {
    const response = await apiService.get(`/v1/friendShips/${userId}`)
    return response.data.data.others
  } catch (error) {
    console.error('Error fetching friend list:', error)
    throw error
  }
}
export const getListRequestF = async (userId) => {
  try {
    const response = await apiService.get(`/v1/friendships/receive/${userId}`)
    return response.data.data.others
  } catch (error) {
    console.log('Error fetching invite friend list: ', error)
    throw error
  }
}

export const acceptFriendRequest = async (receiverId, senderId) => {
  try {
    const response = await apiService.post(`/v1/friendships/accept`, { receiverId, senderId })
    return response.data
  } catch (error) {
    console.log('Lỗi khi chấp nhận lời mời kết bạn', error)
    throw error
  }
}

export const rejectFriendReq = async (receiverId, senderId) => {
  try {
    const response = await apiService.post(`/v1/friendShips/reject`, { receiverId, senderId })
    return response.data
  } catch (error) {
    console.log('Lỗi Khi xóa lời mời kết bạn', error)
    throw error
  }
}

export const getSuggestedFriends = async (userId, limit =10) => {
  try {
    const res = await apiService.get(`/v1/accounts/suggest/${userId}`, {
      params: { limit: String(limit) }
    })
    return res.data.data
  } catch (error) {
    console.error('Lỗi khi lấy gợi ý bạn bè:', error)
    return []
  }
}

export const sendFriendRequest = async (senderId, receiverId) => {
  try {
    const response = await apiService.post(`/v1/friendships`, { senderId, receiverId })
    return response.data
  } catch (error) {
    console.error('Lỗi khi gửi lời mời kết bạn:', error)
    throw error
  }
}

// export const removeSuggestedFriend = async (receiverId, senderId) => {
//   try {
//     const response = await apiService.post(`/v1/friendships/reject`, { receiverId, senderId })
//     return response.data
//   } catch (error) {
//     console.error('Lỗi khi xóa gợi ý kết bạn:', error)
//     throw error
//   }
// }



// xóa bạn bè nha cu cầu

export const deleteFriend = async (receiverId, senderId) => {
  try {
    const response = await apiService.request({
      url: `/v1/friendShips`,
      method: 'DELETE',
      data: { senderId, receiverId } // data phải nằm trong object này
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.log("Lỗi khi xóa kết bạn: ", error);
    throw error;
  }
}
