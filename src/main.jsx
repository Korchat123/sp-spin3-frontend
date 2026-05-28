import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { OrdersProvider } from "./context/ordersContext/OrdersProvider";
import { UserProvider } from "./context/userContext/UserProvider.jsx";
import { PaymentProvider } from "./context/PaymentProvider.jsx";
import { ShopProvider } from "./context/ShopProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <ShopProvider>
        <OrdersProvider>
          <PaymentProvider>
            <App />
          </PaymentProvider>
        </OrdersProvider>
      </ShopProvider>
    </UserProvider>
  </StrictMode>,
);
