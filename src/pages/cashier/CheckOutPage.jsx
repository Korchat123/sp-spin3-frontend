// src/pages/cashier/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import OrderHeader from "../../component/cashier/OrderHeader";
import OrderItemList from "../../component/cashier/OrderItemList";
import BillingSummary from "../../component/cashier/BillingSummary";
import PaymentMethodSelector from "../../component/cashier/PaymentMethodSelector";
import CashCalculator from "../../component/cashier/CashCalculator";
import CheckoutButton from "../../component/cashier/CheckoutButton";
import Sidebar from "../../component/shared/SideBar";

const CheckoutPage = () => {
  // 1. Define State (The Data)
  const [items, setItems] = useState([
    { name: "Serious Punch Burger", qty: 2, price: 240 },
    { name: "KFC Styled Fries (L)", qty: 1, price: 89 },
    { name: "Coca-Cola Refill", qty: 3, price: 135 },
    { name: "Spicy Wing (6pcs)", qty: 1, price: 159 },
  ]);

  const [discount, setDiscount] = useState(0);
  const [serviceChargeRate, setServiceChargeRate] = useState(0);
  const [paymentType, setPaymentType] = useState("CASH");
  const [payAmount, setPayAmount] = useState("");

  // 2. Calculations
  const rawSubtotal = items.reduce((sum, item) => sum + item.price, 0);
  let afterDiscount = Math.max(0, rawSubtotal - discount);
  let scAmount = afterDiscount * (serviceChargeRate / 100);
  let beforeTax = afterDiscount + scAmount;
  let taxAmount = beforeTax * 0.07;
  let finalTotal = beforeTax + taxAmount;

  // Handle auto-filling payAmount for non-cash methods
  useEffect(() => {
    if (paymentType !== "CASH") {
      setPayAmount(finalTotal);
    } else {
      setPayAmount(""); // Reset when switching back to cash
    }
  }, [paymentType, finalTotal]);

  const changeAmount =
    paymentType === "CASH" ? Math.max(0, Number(payAmount) - finalTotal) : 0;

  // Disable checkout if no items, or if cash payment is less than total
  const isCheckoutDisabled =
    items.length === 0 ||
    (paymentType === "CASH" && Number(payAmount) < finalTotal);

  // 3. Actions
  const handleRemoveItem = (indexToRemove) => {
    if (window.confirm("ต้องการยกเลิกรายการนี้ใช่หรือไม่?")) {
      setItems(items.filter((_, index) => index !== indexToRemove));
    }
  };

  const handleCheckout = () => {
    alert(
      `รับชำระเงินเรียบร้อยผ่าน ${paymentType} จำนวน ${finalTotal.toFixed(2)} บาท! กำลังพิมพ์ใบเสร็จ...`,
    );
    // Reset state after checkout
    setItems([]);
    setDiscount(0);
    setServiceChargeRate(0);
    setPayAmount("");
    setPaymentType("CASH");
  };

  // 4. Render
  return (
    <div className="flex bg-[#eeeeee] min-h-screen font-['IBM_Plex_Sans_Thai']">
      <Sidebar />
      <main className="flex-1 ml-60 flex flex-col h-screen p-6 md:p-10">
        <OrderHeader
          orderNo="#SP-8829"
          tableType="DINE-IN: T-02"
          dateStr="9 APR 2024 | 14:30"
        />

        <div className="flex flex-1 gap-6 overflow-hidden min-h-0">
          {/* Left Side: Items */}
          <div className="flex-[1.2] flex flex-col min-w-0">
            <OrderItemList
              items={items}
              onRemoveItem={handleRemoveItem}
              discount={discount}
              setDiscount={setDiscount}
              serviceCharge={serviceChargeRate}
              setServiceCharge={setServiceChargeRate}
            />
          </div>

          {/* Right Side: Payment */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 pb-4">
            <BillingSummary
              rawSubtotal={rawSubtotal}
              discountAmount={discount}
              scAmount={scAmount}
              taxAmount={taxAmount}
              finalTotal={finalTotal}
            />

            <PaymentMethodSelector
              selectedMethod={paymentType}
              onSelectMethod={setPaymentType}
            />

            <CashCalculator
              paymentType={paymentType}
              payAmount={payAmount}
              setPayAmount={setPayAmount}
              finalTotal={finalTotal}
              changeAmount={changeAmount}
            />

            <div className="mt-auto pt-2">
              <CheckoutButton
                onCheckout={handleCheckout}
                disabled={isCheckoutDisabled}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
