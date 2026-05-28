import { api } from '../utils/api'

export const getDashboardSummary = (period) => api.get(`/api/owner/summary?period=${period}`)
