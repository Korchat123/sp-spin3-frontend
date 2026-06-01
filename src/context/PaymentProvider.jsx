import { useState, useReducer, useCallback, useMemo } from "react";
import { PaymentContext } from "./paymentContext";

// Payment reducer for complex state management
const paymentReducer = (state, action) => {
  switch (action.type) {
    case "SET_PAYMENT_METHOD":
      if (state.selectedPaymentMethod === action.payload) return state;
      return { ...state, selectedPaymentMethod: action.payload };
    case "SET_AMOUNT":
      if (state.amount === action.payload) return state;
      return { ...state, amount: action.payload };
    case "SET_STATUS":
      if (state.status === action.payload) return state;
      return { ...state, status: action.payload };
    case "SET_TRANSACTION_ID":
      if (state.transactionId === action.payload) return state;
      return { ...state, transactionId: action.payload };
    case "SET_ERROR":
      if (state.error === action.payload) return state;
      return { ...state, error: action.payload };
    case "RESET_PAYMENT":
      return initialPaymentState;
    default:
      return state;
  }
};

const initialPaymentState = {
  selectedPaymentMethod: null,
  amount: 0,
  status: "pending", // pending, processing, completed, failed
  transactionId: null,
  error: null,
  bookingData: null,
};

export const PaymentProvider = ({ children }) => {
  const [paymentState, dispatch] = useReducer(
    paymentReducer,
    initialPaymentState
  );

  const [paymentMethods, setPaymentMethods] = useState([
    { id: "credit", label: "Credit Card", icon: "💳" },
    { id: "debit", label: "Debit Card", icon: "🏦" },
    { id: "mobile", label: "Mobile Banking", icon: "📱" },
    { id: "cash", label: "Cash on Delivery", icon: "💵" },
  ]);

  // Payment actions
  const setPaymentMethod = useCallback((method) => {
    dispatch({ type: "SET_PAYMENT_METHOD", payload: method });
  }, []);

  const setAmount = useCallback((amount) => {
    dispatch({ type: "SET_AMOUNT", payload: amount });
  }, []);

  const setStatus = useCallback((status) => {
    dispatch({ type: "SET_STATUS", payload: status });
  }, []);

  const setTransactionId = useCallback((id) => {
    dispatch({ type: "SET_TRANSACTION_ID", payload: id });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  const resetPayment = useCallback(() => {
    dispatch({ type: "RESET_PAYMENT" });
  }, []);

  const value = useMemo(() => ({
    paymentState,
    dispatch,
    paymentMethods,
    setPaymentMethods,
    setPaymentMethod,
    setAmount,
    setStatus,
    setTransactionId,
    setError,
    resetPayment,
  }), [
    paymentState,
    paymentMethods,
    setPaymentMethod,
    setAmount,
    setStatus,
    setTransactionId,
    setError,
    resetPayment,
  ]);

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};
