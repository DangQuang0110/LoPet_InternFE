import apiService from '@/api/apiService'

export const getCommentsByPostId = async (postId) => {
  const response = await apiService.get(`/v1/comments/${postId}`)
  console.log('🧪 Dữ liệu từ API getCommentsByPostId:', response.data.data)
  return response.data.data
}

export const createComment = async (commentData) => {
  console.log('📦 Dữ liệu truyền vào createComment:', commentData)
  console.log('📌 typeof postId:', typeof commentData.postId)
  console.log('📌 typeof accountId:', typeof commentData.accountId)

  const formData = new FormData()
  formData.append('postId', parseInt(commentData.postId))
  formData.append('accountId', parseInt(commentData.accountId))
  formData.append('content', commentData.content)

  if (commentData.replyCommentId) {
    formData.append('replyCommentId', commentData.replyCommentId)
  } else {
    formData.append('replyCommentId', '')
  }

  if (commentData.image) {
    console.log('📷 Có ảnh kèm theo:', commentData.image.name)
    formData.append('image', commentData.image, commentData.image.name)
  } else {
    console.log('📷 Không có ảnh')
  }

  for (const [key, value] of formData.entries()) {
    console.log('🧾 FormData:', key, '=', value)
  }

  const response = await apiService.post('/v1/comments', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.data.data
}



