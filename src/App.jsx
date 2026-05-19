import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbarmenu from "./component/Navbarmenu";
import CookBoard from "./pages/CookBoard";
import IndexPage from "./pages/customer/IndexPage";
import Order from "./pages/Order";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CheckoutPage from "./pages/cashier/CheckoutPage";
import TableMap from "./pages/shared/TableMap";
import OrderList from "./pages/cashier/OrderList";
import OrderHistory from "./pages/cashier/OrderHistory";
import MenuPage from "./pages/customer/MenuPage";

export default function App() {
  return (
    <Router>
      <Navbarmenu />
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/order" element={<Order />} />
        <Route path="/home" element={<IndexPage />} />
        <Route path="/menu" element={<MenuPage />} />

        {/* เพิ่ม Route ของ chasier / shared (with waiter)  */}
        <Route path="/cashier/checkout" element={<CheckoutPage />} />
        <Route path="/shared/tables" element={<TableMap />} />
        <Route path="/cashier/orders" element={<OrderList />} />
        <Route path="/cashier/history" element={<OrderHistory />} />
        <Route path="/cookBoard" element={<CookBoard />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    </Router>
  );
}

