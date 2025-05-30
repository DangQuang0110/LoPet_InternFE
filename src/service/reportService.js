import apiService from "@/api/apiService";


// tạo cái báo cáo tố cáo thằng vi phạm nè cầu
export const sendReport = async (reportData) => {
  try {
    const response = await apiService.post(`/v1/reports`, reportData);
    return response.data;
  } catch (error) {
    console.error('Error sending report:', error);
    throw error;
  }
}