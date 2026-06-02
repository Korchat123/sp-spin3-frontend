import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PickupConfirmation from "../../component/OrderStatus";

export default function OrderStatusPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state || {};

  // Extract order tracking data from routing state or use safe defaults
  const orderNo = orderData.orderNo || `#SP-${Math.floor(100000 + Math.random() * 900000)}`;
  const status = orderData.status || "Order received";
  const timeDelivery = orderData.timeDelivery || "As soon as possible (~30 mins)";
  const menuList = orderData.menuList || ["Chicken Wings Bucket x1"];
  const totalPrice = orderData.totalPrice || "0";
  const contact = orderData.contact || "081-234-5678";

  // Direct reuse of the PickupConfirmation (OrderStatus) component inside the success page route
  return (
    <div className="min-h-screen bg-[#eeeeee] flex flex-col items-center justify-center p-4">
      {/* Background placeholder card while component overlays */}
      <div className="text-center text-gray-500 py-10 uppercase font-black tracking-widest text-sm">
        Loading Order Status...
      </div>

      <PickupConfirmation
        isOpen={true}
        onClose={() => navigate("/")}
        status={status}
        orderNo={orderNo}
        timeDelivery={timeDelivery}
        menuList={menuList}
        totalPrice={totalPrice}
        contact={contact}
      />
    </div>
  );
}
