// src/pages/cashier/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OrderHeader from "../../component/cashier/OrderHeader";
import OrderItemList from "../../component/cashier/OrderItemList";
import BillingSummary from "../../component/cashier/BillingSummary";
import PaymentMethodSelector from "../../component/cashier/PaymentMethodSelector";
import CashCalculator from "../../component/cashier/CashCalculator";
import CheckoutButton from "../../component/cashier/CheckoutButton";
import Sidebar from "../../component/shared/SideBar";
import { orderService } from "../../services/orderService";
import { paymentService } from "../../services/paymentService";

const toCheckoutItem = (item) => {
  const qty = item.quantity || item.qty || 1;
  const unitPrice = item.price ?? item.price_at_purchase ?? 0;
  return {
    name: item.name || "Menu item",
    qty,
    price: unitPrice * qty,
  };
};

const getOrderNumber = (order) =>
  order?._id ? `#${order._id.slice(-6).toUpperCase()}` : "N/A";

const getTableType = (order) => {
  const type = order?.type === "delivery" ? "DELIVERY" : "DINE-IN";
  const branch = order?.customer?.note
    ?.match(/Branch:\s*([^|]+)/i)?.[1]
    ?.trim();
  return branch ? `${type}: ${branch}` : type;
};

const getOrderDate = (order) => {
  if (!order?.createdAt) return "";
  return new Date(order.createdAt).toLocaleString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  const [discount, setDiscount] = useState(0);
  const [serviceChargeRate, setServiceChargeRate] = useState(0);

  // เพิ่ม State สำหรับ VAT ตั้ง Default ไว้ที่ 7%
  // const [vatRate, setVatRate] = useState(7); = ทำช่องให้แคชเชียร์กรอกเปลี่ยน % VAT ได้
  const [vatRate] = useState(7);

  const [paymentType, setPaymentType] = useState("CASH");
  const [payAmount, setPayAmount] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setStatusMessage("No order selected.");
        setLoading(false);
        return;
      }

      try {
        const data = await orderService.getOrder(orderId);
        setOrder(data);
        setItems((data.orderList || []).map(toCheckoutItem));
        setStatusMessage("");
      } catch (error) {
        console.error("Failed to load checkout order:", error);
        setStatusMessage("Unable to load this order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // 2. Calculations
  const rawSubtotal = items.reduce((sum, item) => sum + item.price, 0);
  let afterDiscount = Math.max(0, rawSubtotal - discount);
  let scAmount = afterDiscount * (serviceChargeRate / 100);
  let beforeTax = afterDiscount + scAmount;

  // 💡 คำนวณ VAT แบบไดนามิกตาม State vatRate
  let taxAmount = beforeTax * (vatRate / 100);
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

  const handleCheckout = async () => {
    if (!order?._id) return;

    try {
      await paymentService.processPayment(order._id, {
        paymentMethod: paymentType.toLowerCase(),
        amount: finalTotal,
      });
      alert(
        `รับชำระเงินเรียบร้อยผ่าน ${paymentType} จำนวน ${finalTotal.toFixed(2)} บาท! กำลังพิมพ์ใบเสร็จ...`,
      );
      navigate("/cashier/orders");
    } catch (error) {
      console.error("Checkout failed:", error);
      alert(
        `Unable to process payment right now. ${error.message || ""}`.trim(),
      );
    }
  };

  // 4. Render
  return (
    <div className="flex bg-[#eeeeee] min-h-screen font-['IBM_Plex_Sans_Thai']">
      <Sidebar />
      <main className="flex-1 ml-60 flex flex-col h-screen p-6 md:p-10">
        <OrderHeader
          orderNo={getOrderNumber(order)}
          tableType={getTableType(order)}
          dateStr={getOrderDate(order)}
        />

        {statusMessage && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {statusMessage}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border-2 border-dashed border-[#cccccc] bg-white/60 p-8 text-center font-bold text-[#888888]">
            Loading order...
          </div>
        ) : (
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
                // 💡 (Optional) ถ้าในอนาคตบัวอยากส่ง vatRate ไปโชว์ใน Summary ก็เพิ่มตรงนี้ได้ครับ
                // vatRate={vatRate}
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
        )}
      </main>
    </div>
  );
};

export default CheckoutPage;
