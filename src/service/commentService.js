import apiService from '@/api/apiService'

export const getCommentsByPostId = async (postId) => {
  const response = await apiService.get(`/v1/comments/${postId}`)
  console.log('🧪 Dữ liệu từ API getCommentsByPostId:', response.data.data)
  return response.data.data
}

export const createComment = async (commentData) => {
  console.log('📦 JSON gửi lên:', commentData)

  const response = await apiService.post('/v1/comments', {
    postId: commentData.postId,
    accountId: commentData.accountId,
    content: commentData.content,
    replyCommentId: commentData.replyCommentId || ''
  })

  return response.data.data
}
