// Order API Service - Centralize all order-related API calls
import { api } from "../utils/api";

export const orderService = {
  // Get all orders
  getOrders: async () => {
    try {
      const data = await api.get("/orders");
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Get all orders (alias)
  getAllOrders: async () => {
    try {
      return await api.get("/orders");
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Get single order by ID
  getOrder: async (orderId) => {
    try {
      return await api.get(`/orders/${orderId}`);
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  },

  // Create new order
  createOrder: async (orderData) => {
    try {
      return await api.post("/orders", orderData);
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  // Update order
  updateOrder: async (orderId, updateData) => {
    try {
      return await api.patch(`/orders/${orderId}`, updateData);
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  },

  // Submit order for processing
  submitOrder: async (orderId, submissionData) => {
    try {
      return await api.post(`/orders/${orderId}/submit`, submissionData);
    } catch (error) {
      console.error("Error submitting order:", error);
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      return await api.patch(`/orders/${orderId}`, { status: "cancelled" });
    } catch (error) {
      console.error("Error canceling order:", error);
      throw error;
    }
  },
};
