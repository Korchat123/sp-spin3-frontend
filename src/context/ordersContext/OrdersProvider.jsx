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

  // Fetch all orders from backend
  const fetchAllOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const orders = await orderService.getAllOrders();
      // Map _id to id for compatibility with existing components
      const mappedOrders = orders.map(order => ({
        ...order,
        id: order._id,
        orderId: order._id,
        orderList: order.orderList.map(item => ({
          ...item,
          id: item._id
        }))
      }));
      setOrderList(mappedOrders);
      return mappedOrders;
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch all orders:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync with ShopContext cart
  useEffect(() => {
    if (cart && cart.length > 0) {
      // Create a single active order from cart items
      const activeOrder = {
        id: "current-cart",
        orderId: "current-cart",
        type: "Onsite", // Default for cart
        orderList: cart.map(item => ({
          ...item,
          quantity: item.qty, // Map qty to quantity for consistency
          id: item.id
        }))
      };
      
      // Update or add the current cart to the list
      setOrderList(prev => {
        const otherOrders = prev.filter(o => o.id !== "current-cart");
        return [activeOrder, ...otherOrders];
      });
    }
  }, [cart]);

  // Update single order in list
  const updateOrder = useCallback(async (orderId, updates) => {
    try {
      // If it's a real order (not current-cart), sync with backend
      if (orderId !== "current-cart") {
        await orderService.updateOrder(orderId, updates);
      }
      
      setOrderList((prev) =>
        prev.map((order) =>
          (order.orderId === orderId || order.id === orderId) ? { ...order, ...updates } : order
        )
      );
    } catch (err) {
      console.error("Failed to update order:", err);
      throw err;
    }
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
    fetchAllOrders,
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
