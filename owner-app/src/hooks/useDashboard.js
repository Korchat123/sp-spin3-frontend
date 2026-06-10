import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api'

export const useDashboard = (period = 'week', dateRange = { startDate: null, endDate: null }) => {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchSummary = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      let res;
      if (dateRange.startDate && dateRange.endDate) {
        res = await api.get('/api/owner/summary?startDate=' + dateRange.startDate + '&endDate=' + dateRange.endDate + '&_t=' + Date.now())
      } else {
        res = await api.get(`/api/owner/summary?period=${period}&_t=${Date.now()}`)
      }
      setSummary(res);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [period, dateRange.startDate, dateRange.endDate]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    const BASE_URL_RAW = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const BASE_URL = BASE_URL_RAW.endsWith('/api')
      ? BASE_URL_RAW.slice(0, -4)
      : BASE_URL_RAW.replace(/\/$/, '')
    const es = new EventSource(BASE_URL + '/api/orders/stream')
    es.onmessage = () => { fetchSummary() }
    es.onerror = () => { es.close() }
    return () => { es.close() }
  }, [fetchSummary])

  return { summary, isLoading, isError, fetchSummary };
};
