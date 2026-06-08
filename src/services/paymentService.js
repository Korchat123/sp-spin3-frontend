// Payment API Service - Centralize all payment-related API calls
import { api } from "../utils/api";
import { getCookie } from "../utils/cookie";

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const API_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl.replace(/\/$/, '')}/api`
const getAuthHeaders = () => {
  const token = getCookie("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const paymentService = {
  // Get payment methods
  getPaymentMethods: async () => {
    try {
      const response = await fetch(`${API_URL}/payments/methods`);
      if (!response.ok) throw new Error("Failed to fetch payment methods");
      return await response.json();
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      throw error;
    }
  },

  // Initialize payment
  initializePayment: async (paymentData) => {
    try {
      const response = await fetch(`${API_URL}/payments/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(paymentData),
      });
      if (!response.ok) throw new Error("Failed to initialize payment");
      return await response.json();
    } catch (error) {
      console.error("Error initializing payment:", error);
      throw error;
    }
  },

  // Process payment
  processPayment: async (orderId, paymentDetails) => {
    try {
      if (paymentDetails.slip) {
        const formData = new FormData();
        Object.keys(paymentDetails).forEach((key) => {
          formData.append(key, paymentDetails[key]);
        });
        return await api.post(`/payments/${orderId}/process`, formData);
      }
      return await api.post(`/payments/${orderId}/process`, paymentDetails);
    } catch (error) {
      console.error("Error processing payment:", error);
      throw error;
    }
  },

  // Get payment status
  getPaymentStatus: async (paymentId) => {
    try {
      const response = await fetch(`${API_URL}/payments/${paymentId}/status`, {
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) throw new Error("Failed to get payment status");
      return await response.json();
    } catch (error) {
      console.error("Error getting payment status:", error);
      throw error;
    }
  },

  // Verify payment
  verifyPayment: async (paymentId, verificationData) => {
    try {
      const response = await fetch(`${API_URL}/payments/${paymentId}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(verificationData),
      });
      if (!response.ok) throw new Error("Failed to verify payment");
      return await response.json();
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  },

  // Cancel payment
  cancelPayment: async (paymentId) => {
    try {
      const response = await fetch(`${API_URL}/payments/${paymentId}/cancel`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) throw new Error("Failed to cancel payment");
      return await response.json();
    } catch (error) {
      console.error("Error canceling payment:", error);
      throw error;
    }
  },

  // Refund payment
  refundPayment: async (paymentId, refundData) => {
    try {
      const response = await fetch(`${API_URL}/payments/${paymentId}/refund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(refundData),
      });
      if (!response.ok) throw new Error("Failed to refund payment");
      return await response.json();
    } catch (error) {
      console.error("Error refunding payment:", error);
      throw error;
    }
  },
};
