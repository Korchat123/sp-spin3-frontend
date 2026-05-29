import { useState, useEffect, useCallback } from 'react'
import { getMenuLogs } from '../api/menu'

export const useMenuLogs = () => {
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true)
      setIsError(false)
      const data = await getMenuLogs()
      setLogs(data ?? [])
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  return { logs, isLoading, isError, refetch: fetchLogs }
}
