import { api } from '../utils/api'

export const getStaff = () => api.get('/api/owner/staff')

export const updateStaffStatus = (id, isLocked) => api.patch(`/api/owner/staff/${id}`, { isLocked })

export const inviteStaff = (email, role) => api.post('/api/owner/staff', { email, role })
