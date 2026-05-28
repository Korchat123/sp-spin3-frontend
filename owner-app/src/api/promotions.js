import { api } from '../utils/api'

export const getPromotions = () => api.get('/api/owner/promotions')

export const updatePromotion = (id, updates) => api.patch(`/api/owner/promotions/${id}`, updates)

export const deletePromotion = (id) => api.delete(`/api/owner/promotions/${id}`)
