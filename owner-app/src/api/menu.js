import { api } from '../utils/api'

export const getMenu = () => api.get('/api/menus')

export const patchMenuItemAvailability = (id, available) => api.patch(`/api/menus/${id}`, { available })
