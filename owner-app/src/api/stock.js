import { api } from '../utils/api'

export const getStock = () => api.get('/api/owner/stock')

export const updateStockLot = (id, updates) => api.patch(`/api/owner/stock/${id}`, updates)

export const createIngredient = (data) => api.post('/api/ingredients', data)

export const addIngredientStock = (id, data) =>
  api.post('/api/ingredients/' + id + '/stock', data)
