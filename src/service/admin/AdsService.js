import apiService from "@/api/apiService";

// Lấy danh sách quảng cáo 
export const getListAds = async () => {
  try {
    const response = await apiService.get(`/v1/advertisements`)
    return response.data?.data || []  // ✅ luôn là array
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách quảng cáo:', error)
    return []  // fallback an empty array
  }
}

// Tạo quảng cáo nè cu bug tìm ở đây

export const createAds = async (formData) =>{
    try {
    const response = await apiService.post('/v1/advertisements', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error('Lỗi khi thêm quảng cáo:', error)
    throw error
  }
}
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++    Tại vũ                    +++++++++++++++++++++++++++++++++++
// _______________________________________________________________________________
// Cập nhật quảng cáo
export const updateAds = async (adsId, formData) => {
    console.log('bug nè cu: ', adsId)
    console.log('bug nè cu2: ', formData)
  try {
    const response = await apiService.put(`/v1/advertisements/${adsId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('bug nè cu: ', response)
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật quảng cáo:', error);
    throw error;
  }
}


// chức  năng xóa quảng cáo đó

export const delAds = async (adsId) =>{
    try {
        const response = await apiService.delete(`/v1/advertisements/${adsId}`);
        return response.data;
    } catch (error) {
        console.log('lỗi  khi xóa quảng cáo: ', error);
        throw error;
    }
}
