import { api } from '../utils/api'

export const getCustomers = () => api.get('/api/owner/customers')

export const updateCustomer = (id, updates) => api.patch(`/api/owner/customers/${id}`, updates)
