// เก็บข้อมูลตะกร้าสินค้า/ออเดอร์
import { useState, useCallback, useContext, useEffect } from "react";
import { OrdersContext } from "./OrdersContext";
import { orderService } from "../../services/orderService";
import { ShopContext } from "../ShopProvider";

export const OrdersProvider = ({ children }) => {
  const { cart, setCart } = useContext(ShopContext);

  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Fetch all orders for role dashboards. Customer checkout uses ShopContext.cart.
  const fetchAllOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getAllOrders();
      if (!Array.isArray(data)) {
        throw new Error("Invalid orders response");
      }
      setOrderList(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.warn("Order API unavailable:", err.message);
      setOrderList([]);
      return [];
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
          quantity: item.qty || item.quantity || 1, // Map qty to quantity for consistency
          id: item.id
        }))
      };
      
      // Update or add the current cart to the list
      setOrderList(prev => {
        const otherOrders = prev.filter(o => o.id !== "current-cart" && o.orderId !== "current-cart");
        return [activeOrder, ...otherOrders];
      });
    } else {
      setOrderList(prev => prev.filter(o => o.id !== "current-cart" && o.orderId !== "current-cart"));
    }
  }, [cart]);

  // Update single order in list
  const updateOrder = useCallback(async (orderId, updates) => {
    try {
      if (orderId !== "current-cart") {
        await orderService.updateOrder(orderId, updates);
      }
    } catch (err) {
      console.warn("Could not update order via API, falling back to local state:", err.message);
    } finally {
      setOrderList((prev) =>
        prev.map((order) =>
          (order.orderId === orderId || order.id === orderId) ? { ...order, ...updates } : order
        )
      );
    }
  }, []);

  // Remove order from list
  const removeOrder = useCallback((orderId) => {
    setOrderList((prev) => prev.filter((order) => order.orderId !== orderId && order.id !== orderId));
  }, []);

  // Update item quantity in order
  const updateItemQty = useCallback((orderId, itemId, newQty) => {
    const quantity = Math.max(1, newQty);
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, qty: quantity, quantity } : item
      )
    );

    setOrderList((prev) =>
      prev.map((order) => {
        if (order.orderId !== orderId) return order;
        const key = order.List ? "List" : "orderList";
        return {
          ...order,
          [key]: order[key].map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        };
      })
    );
  }, [setCart]);

  // Remove item from order
  const removeItem = useCallback((orderId, itemId) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));

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
  }, [setCart]);

  // Clear all orders
  const clearCart = useCallback(() => {
    setCart([]);
    setOrderList([]);
  }, [setCart]);

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
      console.warn("Submit order API unavailable, using local order data:", err.message);
      setCurrentOrder(orderData);
      return orderData;
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
