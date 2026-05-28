import { useState, useEffect, useCallback } from 'react';
import { getWaste, createWasteEntries } from '../api/waste';

export const useWaste = () => {
  const [waste, setWaste] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchWaste = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await getWaste();
      setWaste(data ?? []);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchWaste(); }, [fetchWaste]);

  const recordWaste = async (entries, options = {}) => {
    await createWasteEntries(entries);
    await fetchWaste();
    options.onSuccess?.();
  };

  return { waste, isLoading, isError, recordWaste };
};
