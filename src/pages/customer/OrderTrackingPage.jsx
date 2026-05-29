import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PickupConfirmation from "../../component/pickupconfirmation";
import OrderStatus from "../../component/OrderStatus";
import { api } from "../../utils/api";

const getStatusText = (status) => {
  switch (status) {
    case "pending":
      return "Order received";
    case "preparing":
      return "Preparing your food";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return status || "Order received";
  }
};

const OrderTrackingPage = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;
  const [showPickup, setShowPickup] = useState(false);
  const [showStatus, setShowStatus] = useState(true);
  const [order, setOrder] = useState(location.state?.order || null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;

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
  }, [orderId]);

  const items = order?.orderList || [];
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.price || item.price_at_purchase || 0) * (item.quantity || 1),
    0,
  );
  const orderNo = order?._id ? `#${order._id.slice(-6).toUpperCase()}` : "N/A";

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

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setShowStatus(true)}
            className="bg-[#242424] text-white px-6 py-2 rounded-full font-bold"
          >
            Check Status
          </button>
        </div>
      </div>

      <PickupConfirmation
        isOpen={showPickup}
        onClose={() => setShowPickup(false)}
        orderNo={orderNo}
        menuList={items.map((item) => `${item.name || "Menu item"} x${item.quantity || 1}`)}
        totalPrice={totalPrice ? totalPrice.toLocaleString() : ""}
        deliveryTime={order?.customer?.note || "As soon as possible"}
      />

      <OrderStatus
        isOpen={showStatus}
        onClose={() => setShowStatus(false)}
        status={getStatusText(order?.status)}
        timeDelivery={order?.customer?.note || "As soon as possible"}
        orderNo={orderNo}
        menuList={items.map((item) => `${item.name || "Menu item"} x${item.quantity || 1}`)}
        totalPrice={totalPrice ? totalPrice.toLocaleString() : ""}
        contact={order?.customer?.contact || ""}
      />
    </div>
  );
};

export default OrderTrackingPage;
