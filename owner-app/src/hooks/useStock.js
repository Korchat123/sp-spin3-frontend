import { useState, useEffect, useCallback } from 'react';
import { getStock, updateStockLot } from '../api/stock';

export const useStock = () => {
  const [stock, setStock] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchStock = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await getStock();
      setStock(Array.isArray(data) ? data : []);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchStock(); }, [fetchStock]);

  useEffect(() => {
    const BASE_URL_RAW = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const BASE_URL = BASE_URL_RAW.endsWith('/api')
      ? BASE_URL_RAW.slice(0, -4)
      : BASE_URL_RAW.replace(/\/$/, '')
    const es = new EventSource(BASE_URL + '/api/ingredients/stream')
    es.onmessage = () => { fetchStock() }
    es.onerror = () => { es.close() }
    return () => { es.close() }
  }, [fetchStock])

  const updateLot = async ({ id, updates }) => {
    await updateStockLot(id, updates);
    await fetchStock();
  };

  return { stock, isLoading, isError, updateLot, fetchStock };
};
