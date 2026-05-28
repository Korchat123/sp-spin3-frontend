const fs = require('fs');
const path = require('path');

const contextDir = path.join(__dirname, 'paymentContext');

// Create directory if it doesn't exist
if (!fs.existsSync(contextDir)) {
  fs.mkdirSync(contextDir, { recursive: true });
  console.log('Created paymentContext directory');
}

// Create PaymentContext.jsx
const paymentContextContent = `import { createContext } from "react";

export const PaymentContext = createContext();
`;

fs.writeFileSync(path.join(contextDir, 'PaymentContext.jsx'), paymentContextContent);
console.log('Created PaymentContext.jsx');

// Create PaymentProvider.jsx
const paymentProviderContent = `import { useState, useReducer } from "react";
import { PaymentContext } from "./PaymentContext";

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
  status: "pending",
  transactionId: null,
  error: null,
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
`;

fs.writeFileSync(path.join(contextDir, 'PaymentProvider.jsx'), paymentProviderContent);
console.log('Created PaymentProvider.jsx');

console.log('All files created successfully!');
