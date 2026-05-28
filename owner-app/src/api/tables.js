import { api } from '../utils/api'

export const getTables = () => api.get('/api/tables')
