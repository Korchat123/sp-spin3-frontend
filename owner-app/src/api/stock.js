import { api } from '../utils/api'

export const getStock = () => api.get('/api/owner/stock')

export const updateStockLot = (id, updates) => api.patch(`/api/owner/stock/${id}`, updates)
