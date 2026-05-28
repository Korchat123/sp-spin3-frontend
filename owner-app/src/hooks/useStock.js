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

  const updateLot = async ({ id, updates }) => {
    await updateStockLot(id, updates);
    await fetchStock();
  };

  return { stock, isLoading, isError, updateLot };
};
