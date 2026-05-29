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

  return { menu, isLoading, isError, toggleAvailability, addItem, removeItem }
}
