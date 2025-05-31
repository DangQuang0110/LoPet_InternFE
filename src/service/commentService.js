import apiService from '@/api/apiService'

export const getCommentsByPostId = async (postId) => {
  const response = await apiService.get(`/v1/comments/${postId}`)

  return response.data.data
}

export const createComment = async (commentData) => {


  const response = await apiService.post('/v1/comments', {
    postId: commentData.postId,
    accountId: commentData.accountId,
    content: commentData.content,
    replyCommentId: commentData.replyCommentId || ''
  })

  return response.data.data
}


// // xóa comment

// export const deleComment = async () =>{
//  try {
//   const response = await apiService.delete(`/v1/comments/${}`) 
//  } catch (error) {
  
//  }

  
//   }