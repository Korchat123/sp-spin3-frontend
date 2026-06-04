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

// 💡 ฐานข้อมูลเมนูอาหารจำลองสำหรับแสดงผลเมื่อทดสอบด้วยออเดอร์จำลอง
const MOCK_CHECKOUT_ORDERS = {
  "DEL-001": {
    _id: "DEL-001",
    type: "delivery",
    orderList: [
      { name: "Serious Fried Chicken Set (L)", quantity: 1, price: 299 },
      { name: "French Fries", quantity: 1, price: 79 },
      { name: "Coke (Refill)", quantity: 1, price: 49 },
    ],
    createdAt: new Date().toISOString(),
  },
  "DEL-002": {
    _id: "DEL-002",
    type: "delivery",
    orderList: [
      { name: "French Fries", quantity: 1, price: 79 },
      { name: "Chicken Pop", quantity: 1, price: 99 },
    ],
    createdAt: new Date().toISOString(),
  },
  "PIC-001": {
    _id: "PIC-001",
    type: "pickup",
    orderList: [
      { name: "Serious Fried Chicken Set (S)", quantity: 1, price: 199 },
      { name: "Coke (Refill)", quantity: 1, price: 49 },
    ],
    createdAt: new Date().toISOString(),
  },
  "PIC-002": {
    _id: "PIC-002",
    type: "pickup",
    orderList: [
      { name: "French Fries", quantity: 1, price: 79 },
      { name: "Coke (Refill)", quantity: 1, price: 49 },
    ],
    createdAt: new Date().toISOString(),
  },
  "DIN-001": {
    _id: "DIN-001",
    type: "dine-in",
    orderList: [
      { name: "Serious Fried Chicken Set (L)", quantity: 2, price: 299 },
      { name: "French Fries", quantity: 2, price: 79 },
      { name: "Coke (Refill)", quantity: 2, price: 49 },
    ],
    createdAt: new Date().toISOString(),
  },
  "DIN-002": {
    _id: "DIN-002",
    type: "dine-in",
    orderList: [
      { name: "Chicken Pop", quantity: 2, price: 99 },
      { name: "French Fries", quantity: 1, price: 79 },
    ],
    createdAt: new Date().toISOString(),
  },
  "DIN-003": {
    _id: "DIN-003",
    type: "dine-in",
    orderList: [
      { name: "Serious Fried Chicken Set (L)", quantity: 3, price: 299 },
      { name: "French Fries", quantity: 1, price: 79 },
      { name: "Coke (Refill)", quantity: 3, price: 49 },
    ],
    createdAt: new Date().toISOString(),
  },
  "DIN-004": {
    _id: "DIN-004",
    type: "dine-in",
    isFromReservation: true,
    orderList: [
      { name: "Serious Fried Chicken Set (L)", quantity: 3, price: 299 },
      { name: "French Fries", quantity: 2, price: 79 },
      { name: "Coke (Refill)", quantity: 3, price: 49 },
    ],
    createdAt: new Date().toISOString(),
  },
};

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
        console.error(
          "Failed to load checkout order from backend, trying mock fallback:",
          error,
        );

        // 💡 ปรับปรุงตรงนี้: สลับมาใช้ข้อมูลทดสอบเมื่อเชื่อมหลังบ้านไม่เจอออเดอร์
        const cleanId = orderId.replace("#", "");
        const mockOrder =
          MOCK_CHECKOUT_ORDERS[cleanId] ||
          Object.values(MOCK_CHECKOUT_ORDERS)[0];

        if (mockOrder) {
          setOrder(mockOrder);
          setItems((mockOrder.orderList || []).map(toCheckoutItem));
          setStatusMessage("Offline Mode: Showing Mock Checkout Data");
        } else {
          setStatusMessage("Unable to load this order.");
        }
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
  let taxAmount = beforeTax * (vatRate / 100);
  let finalTotal = beforeTax + taxAmount;

  // Handle auto-filling payAmount for non-cash methods
  useEffect(() => {
    if (paymentType !== "CASH") {
      setPayAmount(finalTotal);
    } else {
      setPayAmount("");
    }
  }, [paymentType, finalTotal]);

  const changeAmount =
    paymentType === "CASH" ? Math.max(0, Number(payAmount) - finalTotal) : 0;

  // Disable checkout if no items, or if cash payment is less than total
  const isCheckoutDisabled =
    items.length === 0 ||
    (paymentType === "CASH" && Number(payAmount) < finalTotal);

  // Actions
  const handleRemoveItem = (indexToRemove) => {
    if (window.confirm("ต้องการยกเลิกรายการนี้ใช่หรือไม่?")) {
      setItems(items.filter((_, index) => index !== indexToRemove));
    }
  };

  const handleCheckout = async () => {
    if (!order?._id) return;

    // 💡 ปรับปรุงตรงนี้: หากเป็นออเดอร์จำลอง ให้ยืนยันจ่ายเงินจำลองเพื่อไม่ให้เกิด Error หน้าเว็บพัง
    const isMockOrder =
      order._id.startsWith("DEL-") ||
      order._id.startsWith("PIC-") ||
      order._id.startsWith("DIN-") ||
      order._id.startsWith("RES-");

    if (isMockOrder) {
      alert(
        `[MOCK PAY] รับชำระเงินเรียบร้อยผ่าน ${paymentType} จำนวน ${finalTotal.toFixed(2)} บาท! กำลังพิมพ์ใบเสร็จ...`,
      );
      navigate("/cashier/orders");
      return;
    }

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
          <div className="mb-4 rounded-xl border border-yellow-250 bg-yellow-50 px-4 py-3 text-sm font-bold text-yellow-700">
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
