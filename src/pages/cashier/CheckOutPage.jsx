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
import { useShop } from "../../context/ShopProvider";

const toCheckoutItem = (item) => {
  const qty = item.quantity || item.qty || 1;
  const unitPrice = item.price ?? item.price_at_purchase ?? 0;
  return {
    id: item.id || item._id || item.menu_id || item.menuId,
    menu_id: item.menu_id || item.menuId || item.id || item._id,
    name: item.name || "Menu item",
    qty,
    unitPrice,
    price: unitPrice * qty,
    image: item.image || item.img || "",
    note: item.note || "",
  };
};

const getOrderNumber = (order) => {
  if (order?.orderId) return order.orderId.startsWith("#") ? order.orderId : `#${order.orderId}`;
  return order?._id ? `#${order._id.slice(-6).toUpperCase()}` : "N/A";
};

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
  const { cart, clearCart } = useShop();
  const orderId = location.state?.orderId;
  const tableId = location.state?.tableId || "";
  const orderType = location.state?.type || "DINE-IN";
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
        if (cart.length === 0) {
          setOrder(null);
          setItems([]);
          setStatusMessage("No order selected.");
        } else {
          setOrder({
            type: "Onsite",
            tableId,
            createdAt: new Date().toISOString(),
            customer: {
              name: "Walk-in Customer",
              note: orderType,
            },
          });
          setItems(cart.map(toCheckoutItem));
          setStatusMessage("");
        }
        setLoading(false);
        return;
      }

      try {
        const data = await orderService.getOrder(orderId);
        setOrder(data);
        setItems((data.orderList || []).map(toCheckoutItem));
        setStatusMessage("");
      } catch (error) {
        console.error('Failed to load checkout order:', error);
        setOrder(null);
        setItems([]);
        setStatusMessage('Unable to load this order from the database.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [cart, orderId, orderType, tableId]);

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
    try {
      let payableOrder = order;

      if (!payableOrder?._id) {
        if (items.length === 0) return;

        payableOrder = await orderService.createOrder({
          type: "Onsite",
          tableId,
          note_global: `Cashier POS ${orderType}`.trim(),
          customer: {
            name: "Walk-in Customer",
            contact: "",
            note: tableId ? `cashier|Table ${tableId}` : "cashier|Walk-in",
          },
          orderList: items.map((item) => ({
            name: item.name,
            menu_id: item.menu_id || item.id,
            quantity: item.qty,
            price: item.unitPrice,
            price_at_purchase: item.unitPrice,
            image: item.image,
            note: item.note,
            status: "InKitchen",
          })),
        });
        setOrder(payableOrder);
      }

      await paymentService.processPayment(payableOrder._id, {
        paymentMethod: paymentType.toLowerCase(),
        amount: finalTotal,
      });
      clearCart();
      alert(`Payment received via ${paymentType} for ${finalTotal.toFixed(2)} baht.`);
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

