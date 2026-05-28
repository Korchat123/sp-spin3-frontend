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

  const updateCustomerFn = async ({ id, updates }) => {
    await updateCustomer(id, updates);
    await fetchCustomers();
  };

  return {
    customers,
    isLoading,
    isError,
    updateCustomer: updateCustomerFn,
  };
};
