import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PickupConfirmation from "../../component/customer/PickupConfirmation";
import OrderStatus from "../../component/OrderStatus";
import { api } from "../../utils/api";
import {
  getActiveOrderItems,
  getCancelledOrderItems,
  getCancelledRefundAmount,
  getCustomerOrderMode,
  getCustomerOrderServiceText,
} from "../../utils/customerOrders";

const getStatusText = (order) => {
  const status = order?.status;

  switch (status) {
    case "pending": {
      const mode = getCustomerOrderMode(order);
      if (mode === "delivery") return "DELIVERY ORDER RECEIVED";
      if (mode === "reserve") return "PENDING VERIFICATION";
      return "PICK UP ORDER RECEIVED";
    }
    case "reserved":
      return "RESERVED ORDER RECEIVED";
    case "preparing":
      return "Preparing your food";
    case "completed":
      return "Completed";
    case "delivery":
      return "Rider assigned";
    case "shipping":
      return "Rider on the way";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return status || "ORDER RECEIVED";
  }
};

const getRiderContactText = (order) => {
  const rider = order?.rider;
  if (!rider?.name && !rider?.phone) return "";
  return `Rider: ${rider?.name || "Assigned rider"}${rider?.phone ? ` | Tel: ${rider.phone}` : ""}`;
};

const OrderTrackingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;
  const [showPickup, setShowPickup] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [order, setOrder] = useState(location.state?.order || null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;
    if (order?.isLocalCheckout) return;

    const fetchOrder = async () => {
      try {
        const data = await api.get(`/orders/${orderId}`);
        setOrder(data);
        setError("");
      } catch {
        setError("Unable to load the latest order status.");
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [orderId, order?.isLocalCheckout]);

  const items = getActiveOrderItems(order);
  const cancelledItems = getCancelledOrderItems(order);
  const refundAmount = getCancelledRefundAmount(order);
  const calculatedTotal = items.reduce(
    (sum, item) => sum + (item.price || item.price_at_purchase || 0) * (item.quantity || 1),
    0,
  );
  const totalPrice = location.state?.totalPrice || (calculatedTotal ? calculatedTotal.toLocaleString() : "");
  const orderNo = order?.orderId ? `#${order.orderId}` : "N/A";
  const statusText = getStatusText(order);
  const showDeliveryRider =
    order?.status === "pending" &&
    statusText === "DELIVERY ORDER RECEIVED";
  const riderContactText = showDeliveryRider ? getRiderContactText(order) : "";
  const orderItemsText = items.map((item) => `${item.name || "Menu item"} x${item.quantity || 1}`);

  return (
    <div className="min-h-screen bg-[#eeeeee] p-8 pt-24 font-['IBM_Plex_Sans_Thai']">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="font-['Bebas_Neue'] text-5xl mb-4">
          THANK YOU FOR YOUR ORDER!
        </h1>
        <p className="text-gray-600 mb-8">
          {orderId ? `Tracking order ${orderNo}.` : "You can track your order status below."}
        </p>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        {cancelledItems.length > 0 && (
          <div className="mx-auto mb-6 max-w-xl rounded-2xl border-2 border-red-200 bg-red-50 px-5 py-4 text-left text-sm font-bold text-red-700">
            <p className="font-black uppercase">Refund required for cancelled menu</p>
            <p className="mt-1">
              {cancelledItems.map((item) => `${item.name || "Menu item"} x${item.quantity || 1}`).join(", ")}
            </p>
            <p className="mt-2">
              Refund amount: ฿{refundAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Please contact staff or wait for payment return.
            </p>
          </div>
        )}

        <div className="mx-auto mb-8 max-w-xl rounded-3xl border-4 border-[#242424] bg-white p-6 text-left shadow-[8px_8px_0_#242424]">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">
            Current Status
          </p>
          <h2 className="mt-1 font-['Bebas_Neue'] text-4xl tracking-widest text-[#e4002b]">
            {statusText}
          </h2>
          {riderContactText && (
            <p className="mt-2 text-sm font-black uppercase tracking-wide text-[#242424]">
              {riderContactText}
            </p>
          )}
          <div className="mt-4 grid gap-3 text-sm font-bold text-gray-700">
            <div className="flex justify-between gap-4">
              <span className="text-gray-400 uppercase">Order no</span>
              <span>{orderNo}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400 uppercase">Time</span>
              <span className="text-right">{getCustomerOrderServiceText(order)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400 uppercase">Total</span>
              <span>฿{totalPrice || "0"}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate("/menu")}
            className="bg-[#e4002b] text-white px-8 py-3 rounded-full font-bold shadow-[4px_4px_0_#242424] hover:translate-y-1 hover:shadow-none transition-all cursor-pointer"
          >
            Back to Menu
          </button>
          <button
            onClick={() => setShowStatus(true)}
            className="bg-white text-[#242424] border-2 border-[#242424] px-8 py-3 rounded-full font-bold hover:bg-[#242424] hover:text-white transition-all cursor-pointer"
          >
            View Details
          </button>
        </div>
      </div>

      <PickupConfirmation
        isOpen={showPickup}
        onClose={() => setShowPickup(false)}
        orderNo={orderNo}
        menuList={orderItemsText}
        cancelledItems={cancelledItems.map((item) => `${item.name || "Menu item"} x${item.quantity || 1}`)}
        refundAmount={refundAmount}
        totalPrice={totalPrice}
        deliveryTime={getCustomerOrderServiceText(order)}
      />

      <OrderStatus
        isOpen={showStatus}
        onClose={() => setShowStatus(false)}
        status={statusText}
        timeDelivery={getCustomerOrderServiceText(order)}
        orderNo={orderNo}
        menuList={orderItemsText}
        totalPrice={totalPrice}
        contact={order?.customer?.contact || ""}
      />
    </div>
  );
};

export default OrderTrackingPage;
