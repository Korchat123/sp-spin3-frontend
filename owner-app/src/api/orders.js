import { api } from '../utils/api'

export const getOrders = () => api.get('/api/orders')

export const getOrder = (id) => api.get(`/api/orders/${id}`)

export const updateOrderStatus = (id, status) => api.patch(`/api/orders/${id}`, { status })

export const updateOrder = (id, updates) => api.patch(`/api/orders/${id}`, updates)

export const createOrder = (order) => api.post('/api/orders', order)

export const deleteOrder = (id) => api.delete(`/api/orders/${id}`)

export const getDeliveriesList = () => api.get('/api/deliveries')

export const updateDeliveryStatus = (id, status) =>
  api.patch('/api/deliveries/' + id, { status })

export const reassignRider = (id, riderId) =>
  api.patch('/api/deliveries/' + id, { rider_id: riderId })
