import apiService from '@/api/apiService'


export const createPost = async (formData) => {
  try {
    const response = await apiService.post('/v1/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}
export const deletePost = async (postId) => {
  const res = await apiService.delete(`/v1/posts/${postId}`)
  return res.data
}

export const getPostById = async (postId) => {
  const res = await apiService.get(`/v1/posts/${postId}`)
  return res.data.data
}

export const getPosts = async () => {
  try {
    const response = await apiService.get('/v1/posts')
    return response.data.data // backend trả về trong { data, message, ... }
  } catch (error) {
    console.error('Lỗi khi lấy bài viết:', error)
    throw error
  }
}
export const getPostsByAccountId = async (accountId) => {
  try {
    const response = await apiService.get(`/v1/posts/accounts/${accountId}`)
    return response.data.data
  } catch (error) {
    console.error('Lỗi khi lấy bài viết theo accountId:', error)
    throw error
  }
}
// export const likePost = (accountId, postId) =>
//   apiService.post('/v1/posts/like', { accountId, postId }

// )

// export const unlikePost = (accountId, postId) =>
//   apiService.post('/v1/posts/unlike', { accountId, postId }

// )

export async function likePost(accountId, postId) {
  console.log('📤 Gửi request LIKE:', { accountId, postId })
  const res = await apiService.post('/v1/posts/like', { accountId, postId })
  console.log('📥 Response LIKE:', res.data)
  return res.data
}

export async function unlikePost(accountId, postId) {
  console.log('📤 Gửi request UNLIKE:', { accountId, postId })
  const res = await apiService.post('/v1/posts/unlike', { accountId, postId })
  console.log('📥 Response UNLIKE:', res.data)
  return res.data
}
export const updatePost = async (postId, formData) => {
  try {
    
    const response = await apiService.put(`/v1/posts/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    // console.log('log ne cu',response)
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

