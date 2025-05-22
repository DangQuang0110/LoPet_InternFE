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

//cái này la lấy danh sách lời mời kết bạn nha cầu
export const getListRequestF = async (userId) => {
  try {
    const response = await apiService.get(`/v1/friendships/receive/${userId}`)
    return response.data.data.others
  } catch (error) {
    console.log('Error fetching invite friend list: ', error)
    throw error
  }
}

// cái này cho button chấp nhận lời mời kết bạn
export const acceptFriendRequest = async (receiverId, senderId) => {
  try {
    const response = await apiService.post(`/v1/friendShips/accept`,{receiverId, senderId});
    console.log(response)
    return response.data;
  } catch (error) {
    console.log('Lỗi khi chấp nhận lời mời kết bạn', error);
    throw error;
  }
}

// xóa bạn bè nha cu cầu

// export const deleteFriend = async (receiverId, senderId) =>{
//   try {
//     const response = await apiService.delete(`/v1/friendShips`, {receiverId,senderId});
//     console.log(response);
//     return response
//   } catch (error) {
//     console.log("Lỗi khi xóa kết bạn: ", error);
//     throw error;
//   }
// }
// có bug tí vũ sửa
