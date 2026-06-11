import { useState, useEffect, useCallback } from 'react';
import { getCustomers, updateCustomer } from '../api/customers';

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await getCustomers();
      setCustomers(data ?? []);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const toggleLock = async ({ id, currentStatus }) => {
    try {
      await updateCustomer(id, { active_status: !currentStatus });
      await fetchCustomers();
    } catch (err) {
      console.error('Toggle lock failed:', err.message);
    }
  };

  return {
    customers,
    isLoading,
    isError,
    toggleLock,
    refetch: fetchCustomers
  };
};
