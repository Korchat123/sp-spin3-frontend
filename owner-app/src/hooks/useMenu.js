import { useState, useEffect, useCallback } from 'react'
import {
  getMenu,
  patchMenuItemAvailability,
  createMenu,
  deleteMenu,
} from '../api/menu'

export const useMenu = () => {
  const [menu, setMenu] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const fetchMenu = useCallback(async () => {
    try {
      setIsLoading(true)
      setIsError(false)
      const data = await getMenu()
      setMenu(data ?? [])
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchMenu() }, [fetchMenu])

  useEffect(() => {
    const BASE_URL_RAW = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const BASE_URL = BASE_URL_RAW.endsWith('/api')
      ? BASE_URL_RAW.slice(0, -4)
      : BASE_URL_RAW.replace(/\/$/, '')
    const es = new EventSource(BASE_URL + '/api/menus/stream')
    es.onmessage = () => { fetchMenu() }
    es.onerror = () => { es.close() }
    return () => { es.close() }
  }, [fetchMenu])

  const toggleAvailability = async ({ id, available }) => {
    try {
      await patchMenuItemAvailability(id, available)
      await fetchMenu()
    } catch (err) {
      console.error('Toggle failed:', err.message)
    }
  }

  const addItem = async (data) => {
    try {
      await createMenu(data)
      await fetchMenu()
    } catch (err) {
      console.error('Create failed:', err.message)
      throw err
    }
  }

  const removeItem = async (id) => {
    try {
      await deleteMenu(id)
      await fetchMenu()
    } catch (err) {
      console.error('Delete failed:', err.message)
      throw err
    }
  }

  const getMenuStatus = (item) => {
    if (item.available === false) return 'deactivate'
    if (
      item.ingredients &&
      item.ingredients.length > 0 &&
      item.ingredients.some(ing => (ing.quantity ?? ing.ingredient?.quantity ?? 1) <= 0)
    ) return 'no_ingredient'
    return 'active'
  }

  return { menu, isLoading, isError, toggleAvailability, addItem, removeItem, getMenuStatus }
}
