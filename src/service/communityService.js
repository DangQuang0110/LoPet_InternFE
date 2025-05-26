import apiService from "@/api/apiService";

// lấy danh sách nhóm sở hữu của người chủ tài khoản
export const getListGroupUserCreate = async (userId) =>{
    try {
        const response = await apiService.get(`/v1/groups/owned/${userId}`)
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách nhóm đã tạo', error);
        return error;
    }
}

//lấy danh sách nhóm đã tham gia của chủ tài khoản
export const getListGroupJoin = async (userId) =>{
    try {
        const response = await apiService.get(`/v1/groups/joined/${userId}`)
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách nhóm đã tham gia', error);
        throw error;
    }
}
// lấy danh sách nhóm gợi ý
export const getSuggestCom = async () => {
    try {
        const response = await apiService.get('/v1/groups/suggest');
        return response.data.data || [];
    } catch (error) {
        console.error('Lỗi khi lấy danh sách cộng đồng: ', error);
        throw error;
    }
}

// tạo nhóm người chủ sở hữu
export const createGroup = async (formData) => {
    try {
        const response = await apiService.post('/v1/groups', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo nhóm: ', error);
        throw error;
    }
}

// tham gia nhóm
export const joinGroup = async (groupId, ownerId, inviteeId) => {
    try {
        
        const response = await apiService.post('/v1/groups/invites', {
            groupId: groupId,
            owner: ownerId,
            invitee: inviteeId
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tham gia nhóm:', error);
        throw error;
    }
}

