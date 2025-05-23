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
export const getPosts = async () => {
  try {
    const response = await apiService.get('/v1/posts')
    return response.data.data // backend trả về trong { data, message, ... }
  } catch (error) {
    console.error('Lỗi khi lấy bài viết:', error)
    throw error
  }
}
