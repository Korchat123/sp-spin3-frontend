import { useState, useEffect, useCallback } from 'react';
import { getOrders, updateOrderStatus, createOrder } from '../api/orders';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await getOrders();
      setOrders(data ?? []);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async ({ id, status }) => {
    await updateOrderStatus(id, status);
    await fetchOrders();
  };

  const createOrderFn = async (order) => {
    await createOrder(order);
    await fetchOrders();
  };

  return {
    orders,
    isLoading,
    isError,
    updateStatus,
    createOrder: createOrderFn,
  };
};
