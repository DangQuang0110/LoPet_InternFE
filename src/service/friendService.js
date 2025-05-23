import apiService from '@/api/apiService';

export const getFriendList = async (userId) => {
  try {
    const response = await apiService.get(`/v1/friendShips/${userId}`);
    return response.data.data.receivers;
  } catch (error) {
    console.error('Error fetching friend list:', error);
    throw error;
  }
};
