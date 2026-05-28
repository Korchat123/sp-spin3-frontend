import { useState, useReducer } from "react";
import { PaymentContext } from "./paymentContext";

// Payment reducer for complex state management
const paymentReducer = (state, action) => {
  switch (action.type) {
    case "SET_PAYMENT_METHOD":
      return { ...state, selectedPaymentMethod: action.payload };
    case "SET_AMOUNT":
      return { ...state, amount: action.payload };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "SET_TRANSACTION_ID":
      return { ...state, transactionId: action.payload };
    case "SET_ERROR":
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
  const setPaymentMethod = (method) =>
    dispatch({ type: "SET_PAYMENT_METHOD", payload: method });

  const setAmount = (amount) =>
    dispatch({ type: "SET_AMOUNT", payload: amount });

  const setStatus = (status) =>
    dispatch({ type: "SET_STATUS", payload: status });

  const setTransactionId = (id) =>
    dispatch({ type: "SET_TRANSACTION_ID", payload: id });

  const setError = (error) =>
    dispatch({ type: "SET_ERROR", payload: error });

  const resetPayment = () =>
    dispatch({ type: "RESET_PAYMENT" });

  const value = {
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
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};
