import { api } from '../utils/api'

export const getBookingConfig = () => api.get('/api/config/booking')
export const updateBookingConfig = (data) => api.patch('/api/config/booking', data)
