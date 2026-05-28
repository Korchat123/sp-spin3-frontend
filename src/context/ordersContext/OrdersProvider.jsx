// เก็บข้อมูลตะกร้าสินค้า/ออเดอร์
import { useState, useCallback, useContext, useEffect } from "react";
import { orders as initialMockOrders } from "../../assets/order";
import { OrdersContext } from "./OrdersContext";
import { orderService } from "../../services/orderService";
import { ShopContext } from "../ShopProvider";

export const OrdersProvider = ({ children }) => {
  const { cart } = useContext(ShopContext);

  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Sync with ShopContext cart
  useEffect(() => {
    if (cart && cart.length > 0) {
      // Create a single active order from cart items
      const activeOrder = {
        orderId: "current-cart",
        orderList: cart.map(item => ({
          ...item,
          quantity: item.qty, // Map qty to quantity for consistency
          id: item.id
        }))
      };
      setOrderList([activeOrder]);
    } else {
      setOrderList([]);
    }
  }, [cart]);

  // Update single order in list
  const updateOrder = useCallback((orderId, updates) => {
    setOrderList((prev) =>
      prev.map((order) =>
        order.orderId === orderId ? { ...order, ...updates } : order
      )
    );
  }, []);

  // Remove order from list
  const removeOrder = useCallback((orderId) => {
    setOrderList((prev) => prev.filter((order) => order.orderId !== orderId));
  }, []);

  // Update item quantity in order
  const updateItemQty = useCallback((orderId, itemId, newQty) => {
    setOrderList((prev) =>
      prev.map((order) => {
        if (order.orderId !== orderId) return order;
        const key = order.List ? "List" : "orderList";
        return {
          ...order,
          [key]: order[key].map((item) =>
            item.id === itemId ? { ...item, quantity: Math.max(1, newQty) } : item
          ),
        };
      })
    );
  }, []);

  // Remove item from order
  const removeItem = useCallback((orderId, itemId) => {
    setOrderList((prev) =>
      prev
        .map((order) => {
          if (order.orderId !== orderId) return order;
          const key = order.List ? "List" : "orderList";
          return {
            ...order,
            [key]: order[key].filter((item) => item.id !== itemId),
          };
        })
        .filter((order) => {
          const items = order.List || order.orderList || [];
          return items.length > 0;
        })
    );
  }, []);

  // Clear all orders
  const clearCart = useCallback(() => {
    setOrderList([]);
  }, []);

  // Submit order to API
  const submitOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.submitOrder(orderData.orderId, orderData);
      setCurrentOrder(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Legacy handler for compatibility
  const ordersListHandler = (e) => {
    setOrderList(e);
  };

  const value = {
    orderList,
    setOrderList,
    ordersListHandler,
    currentOrder,
    setCurrentOrder,
    loading,
    error,
    updateOrder,
    removeOrder,
    updateItemQty,
    removeItem,
    clearCart,
    submitOrder,
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};
