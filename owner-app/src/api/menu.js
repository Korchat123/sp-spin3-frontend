import { api } from '../utils/api'

export const getMenu = () => api.get('/api/menus?all=true')

export const patchMenuItemAvailability = (id, available) =>
  api.patch(`/api/menus/${id}`, { available })

export const createMenu = (data) => api.post('/api/menus', data)

export const deleteMenu = (id) => api.delete(`/api/menus/${id}`)

export const getMenuLogs = () => api.get('/api/menus/logs/all')
