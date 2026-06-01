// Payment API Service - Centralize all payment-related API calls
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
  processPayment: async (paymentId, paymentDetails) => {
    try {
      const response = await fetch(`${API_URL}/payments/${paymentId}/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(paymentDetails),
      });
      if (!response.ok) throw new Error("Failed to process payment");
      return await response.json();
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
