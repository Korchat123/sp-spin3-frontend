// src/pages/customer/OrderTrackingPage.jsx
import React, { useState } from "react";
import PickupConfirmation from "../../component/pickupconfirmation";
import OrderStatus from "../../component/OrderStatus";

const OrderTrackingPage = () => {
  // ย้าย States ของเพื่อนมาไว้ที่นี่
  const [showPickup, setShowPickup] = useState(false);
  const [showStatus, setShowStatus] = useState(true);

  return (
    <div className="min-h-screen bg-[#eeeeee] p-8 pt-24 font-['IBM_Plex_Sans_Thai']">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="font-['Bebas_Neue'] text-5xl mb-4">
          THANK YOU FOR YOUR ORDER!
        </h1>
        <p className="text-gray-600 mb-8">
          You can track your order status below.
        </p>

        {/* ใส่ปุ่มไว้กดดูเล่นๆ เพื่อเทส UI ของเพื่อน */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setShowStatus(true)}
            className="bg-[#242424] text-white px-6 py-2 rounded-full font-bold"
          >
            Check Status
          </button>
        </div>
      </div>

      {/* Component ของเพื่อนทั้งหมด */}
      <PickupConfirmation
        isOpen={showPickup}
        onClose={() => setShowPickup(false)}
        orderNo="ORD-2024-0507"
        menuList={["ไก่ทอดสูตรดั้งเดิม 2 ชิ้น", "มันฝรั่งทอดขนาดใหญ่ 1 ที่"]}
        totalPrice="189.00"
        deliveryTime="15:30 (วันนี้)"
      />

      <OrderStatus
        isOpen={showStatus}
        onClose={() => setShowStatus(false)}
        status="กำลังเตรียมอาหาร"
        timeDelivery="16:00"
        orderNo="ORD-999-TH"
        menuList={["ข้าวยำไก่แซ่บ", "นักเก็ต 6 ชิ้น"]}
        contact="081-234-5678"
      />
    </div>
  );
};

export default OrderTrackingPage;
