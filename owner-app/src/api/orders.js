import { api } from '../utils/api'

export const getOrders = () => api.get('/api/api/orders')

export const getOrder = (id) => api.get(`/api/api/orders/${id}`)

export const updateOrderStatus = (id, status) => api.patch(`/api/api/orders/${id}`, { status })

export const updateOrder = (id, updates) => api.patch(`/api/api/orders/${id}`, updates)

export const createOrder = (order) => api.post('/api/api/orders', order)

export const deleteOrder = (id) => api.delete(`/api/api/orders/${id}`)
