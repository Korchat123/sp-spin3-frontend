import { useState, useEffect, useCallback } from 'react';
import { getOrder, getOrders, updateOrderStatus, updateOrder, createOrder, deleteOrder } from '../api/orders';

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

  const updateOrderFn = async ({ id, updates }) => {
    await updateOrder(id, updates);
    await fetchOrders();
  };

  const createOrderFn = async (order) => {
    await createOrder(order);
    await fetchOrders();
  };

  const deleteOrderFn = async (id) => {
    await deleteOrder(id);
    await fetchOrders();
  };

  const getOrderDetail = async (id) => getOrder(id);

  return {
    orders,
    isLoading,
    isError,
    updateStatus,
    updateOrder: updateOrderFn,
    createOrder: createOrderFn,
    deleteOrder: deleteOrderFn,
    getOrderDetail,
  };
};
