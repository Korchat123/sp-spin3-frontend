import { api } from '../utils/api'

export const getWaste = () => api.get('/api/owner/waste')

export const createWasteEntries = (entries) => api.post('/api/owner/waste', entries)
