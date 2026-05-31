import { api } from '../utils/api'

export const getOrders = () => api.get('/api/api/orders')

export const updateOrderStatus = (id, status) => api.patch(`/api/api/orders/${id}`, { status })

export const createOrder = (order) => api.post('/api/api/orders', order)
