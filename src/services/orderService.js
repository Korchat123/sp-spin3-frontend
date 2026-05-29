// Order API Service - Centralize all order-related API calls
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const orderService = {
  // Get all orders
  getOrders: async () => {
    try {
      const response = await fetch(`${API_URL}/orders`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  },

  // Get all orders (alias)
  getAllOrders: async () => {
    try {
      const response = await fetch(`${API_URL}/orders`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      return await response.json();
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Get single order by ID
  getOrder: async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`);
      if (!response.ok) throw new Error("Failed to fetch order");
      return await response.json();
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  },

  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error("Failed to create order");
      return await response.json();
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  // Update order
  updateOrder: async (orderId, updateData) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error("Failed to update order");
      return await response.json();
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  },

  // Submit order for processing
  submitOrder: async (orderId, submissionData) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(submissionData),
      });
      if (!response.ok) throw new Error("Failed to submit order");
      return await response.json();
    } catch (error) {
      console.error("Error submitting order:", error);
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to cancel order");
      return await response.json();
    } catch (error) {
      console.error("Error canceling order:", error);
      throw error;
    }
  },
};
