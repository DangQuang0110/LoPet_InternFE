import apiService from "@/api/apiService";

export const getProfileById = async (id) => {
  try {
    const response = await apiService.get(`/v1/profiles/accounts/${id}`)
    return response.data.data
  } catch (error) {
    console.error(`Error fetching profile for id ${id}:`, error)
    return null
  }
}