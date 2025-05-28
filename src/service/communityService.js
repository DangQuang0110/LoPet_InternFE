import apiService from '@/api/apiService'

// lấy danh sách nhóm sở hữu của người chủ tài khoản
export const getListGroupUserCreate = async (userId) => {
  try {
    const response = await apiService.get(`/v1/groups/owned/${userId}`)
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhóm đã tạo', error)
    return error
  }
}

//lấy danh sách nhóm đã tham gia của chủ tài khoản
export const getListGroupJoin = async (userId) => {
  try {
    const response = await apiService.get(`/v1/groups/joined/${userId}`)
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhóm đã tham gia', error)
    throw error
  }
}
// lấy danh sách nhóm gợi ý
export const getSuggestCom = async () => {
  try {
    const response = await apiService.get('/v1/groups/suggest')
    return response.data.data || []
  } catch (error) {
    console.error('Lỗi khi lấy danh sách cộng đồng: ', error)
    throw error
  }
}

// tạo nhóm người chủ sở hữu
export const createGroup = async (formData) => {
  try {
    const response = await apiService.post('/v1/groups', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Lỗi khi tạo nhóm: ', error)
    throw error
  }
}

// tham gia nhóm
export const joinGroup = async (groupId, ownerId, inviteeId) => {
  try {
    const response = await apiService.post('/v1/groups/invites', {
      groupId: groupId,
      owner: ownerId,
      invitee: inviteeId,
    })
    return response.data
  } catch (error) {
    console.error('Lỗi khi tham gia nhóm:', error)
    throw error
  }
}

//xóa nhóm đã tạo
export const deleteGroupByOwner = async (ownerId, groupId) => {
  try {
    const response = await apiService.delete('/v1/groups', {
      data: {
        owner: ownerId,
        groupId: groupId,
      },
    })
    return response.data
  } catch (error) {
    console.error('Lỗi khi xóa nhóm:', error)
    throw error
  }
}

// Cập nhật thông tin nhóm
export const updateGroup = async (groupId, ownerId, formData) => {
  try {
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value)
    }
    console.log('gorupID khi thuc hien trnog ham', groupId)
    console.log('userId khi thuc hien trnog ham', ownerId)
    // Thêm owner vào formData
    formData.append('owner', ownerId)

    const response = await apiService.put(`/v1/groups/${groupId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật nhóm:', error)
    throw error
  }
}

// Lấy thông tin chi tiết của nhóm
export const getGroupDetails = async (groupId) => {
  try {
    const response = await apiService.get(`/v1/groups/${groupId}`)
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy thông tin nhóm:', error)
    throw error
  }
}

//-----------------------------------------------------------
//                 XỬ LÝ ĐĂNG BÀI Ở NHÓM


// Tạo bài viết trong nhóm 
export const createPostGroup = async (formData) => {
  try {
   
    console.log('Data nè con lợn :', formData)
    const response = await apiService.post('/v1/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    console.log('API Response:', response)
    return response.data
  } catch (error) {
    console.error('Lỗi khi đăng bài viết:', error)
    if (error.response) {
      console.error('Error response:', error.response.data)
    }
    throw error
  }
}


// lấy bài viết 
export const getPostsGroup = async (groupId) => {
  try {
    const response = await apiService.get(`/v1/posts?groupId=${groupId}`)
    return response.data.data
  } catch (error) {
    console.error('Lỗi khi lấy bài viết:', error)
    throw error
  }
}

// Thoát khỏi nhóm
export const leaveGroup = async (groupId, ownerId, memberId) => {
  try {
    const response = await apiService.delete('/v1/groups/members', {
      data: {
        groupId: groupId,
        owner: ownerId,
        member: memberId
      }
    })
    return response.data
  } catch (error) {
    console.error('Lỗi khi thoát khỏi nhóm:', error)
    throw error
  }
}