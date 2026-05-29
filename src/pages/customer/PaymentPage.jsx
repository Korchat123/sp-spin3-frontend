import React, { useContext,useEffect } from "react";
import { OrdersContext } from "../../context/ordersContext/OrdersContext";
import { PaymentContext } from "../../context/paymentContext";
import CheckoutSteps from "../../component/customer/CheckOutStep";
import OrderSummary from "../../component/customer/OrderSummary";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const { orderList } = useContext(OrdersContext);
  const { setAmount } = useContext(PaymentContext);
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const allCartItems = orderList
    ? orderList.flatMap((order) => order.List || order.orderList || [])
    : [];

  // Calculate totals
  const subTotal = allCartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const tax = subTotal * 0.07;
  const netTotal = subTotal + tax;

  // Initialize payment amount when component loads
  useEffect(() => {
    if (netTotal > 0) {
      setAmount(netTotal);
    }
  }, [netTotal, setAmount]);

  // Redirect if no booking data
  useEffect(() => {
    if (!bookingData) {
      navigate("/booking");
    }
  }, [bookingData, navigate]);

  return (
    <div className="bg-[#eeeeee] min-h-screen py-10 font-['IBM_Plex_Sans_Thai'] text-[#242424]">
      <main className="container mx-auto px-4 max-w-6xl">
        <h1 className="font-['Bebas_Neue'] uppercase tracking-widest text-4xl mb-8 flex items-center gap-3 text-[#242424]">
          <span className="bg-[#e4002b] w-2 h-9 pt-12 rounded-full border-2 border-[#242424] shadow-[4px_4px_0_#242424]"></span>
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-white rounded-4xl border">
            <CheckoutSteps bookingData={bookingData} />
          </div>

          <div className="lg:col-span-1 bg-white rounded-4xl border p-6">
            <OrderSummary cartItems={allCartItems} bookingData={bookingData} />
          </div>
        </div>
      </main>
    </div>
  );
}