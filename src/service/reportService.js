// src/service/reportService.js
import apiService from '@/api/apiService'

export async function createReport(payload) {
  return await apiService.post('/v1/reports', payload)
}
export function getReports(params) {
  return apiService.get('/v1/reports', { params })
}

export async function updateReportStatus(targetId, payload) {
  return apiService.put(`/v1/reports/${targetId}`, payload)
}
