import { api } from '../utils/api'

export const getTables = () => api.get('/api/tables')

export const updateTable = (id, updates) => api.patch(`/api/tables/${id}`, updates)

export const createTable = (table) => api.post('/api/tables', table)
