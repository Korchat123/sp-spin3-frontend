import { useState, useEffect, useCallback } from 'react';
import { getBookingConfig, updateBookingConfig } from '../api/settings';

export const useBookingConfig = () => {
  const [config, setConfig] = useState({ oneTwoMin: 600, threeSixMin: 1200, sevenTenMin: 2500 });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await getBookingConfig();
      if (data) setConfig(data);
    } catch (err) {
      console.error('Failed to fetch booking config:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const updateConfig = async (data) => {
    try {
      setIsLoading(true);
      await updateBookingConfig(data);
      await fetchConfig();
      return true;
    } catch (err) {
      console.error('Failed to update booking config:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { config, isLoading, isError, updateConfig, refetch: fetchConfig };
};
