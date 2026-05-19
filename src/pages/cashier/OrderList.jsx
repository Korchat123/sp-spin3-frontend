// src/pages/cashier/OrderList.jsx
// ไฟล์นี้จะเป็นคนจัดการ State (ข้อมูลจำลอง) และแสดงรายการการ์ด

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderCard from "../../component/cashier/OrderCard";
import Sidebar from "../../component/shared/SideBar";

const OrderList = () => {
  const navigate = useNavigate();

  // 1. จำลองข้อมูล Order (มีทั้งแบบรอจ่าย และ จ่ายแล้ว)
  const [orders, setOrders] = useState([
    {
      orderId: "#SP-8829",
      status: "PENDING",
      type: "DINE-IN",
      table: "T-02",
      totalAmount: 666.61,
    },
    {
      orderId: "#SP-8830",
      status: "PENDING",
      type: "TAKE-AWAY",
      table: null,
      totalAmount: 250.0,
    },
    {
      orderId: "#SP-8825",
      status: "PAID",
      type: "DINE-IN",
      table: "VIP-1",
      totalAmount: 1450.0,
    }, // จ่ายแล้ว รอเคลียร์โต๊ะ
    {
      orderId: "#SP-8831",
      status: "PENDING",
      type: "DELIVERY",
      table: null,
      totalAmount: 320.0,
    },
  ]);

  // 2. ฟังก์ชันเมื่อกด Print Bill / Edit
  const handlePrintBill = (orderId) => {
    // นำทางไปหน้า Checkout พร้อมแนบ orderId ไปด้วย
    navigate("/cashier/checkout", { state: { orderId: orderId } });
  };

  // 3. ฟังก์ชันเมื่อกด PAID (ดันเข้า History & ลบออกจากหน้านี้)
  const handleMarkAsCompleted = (orderId) => {
    if (
      window.confirm(`ยืนยันการเคลียร์โต๊ะและย้ายออเดอร์ ${orderId} ลงประวัติ?`)
    ) {
      // อนาคต: ตรงนี้จะยิง API ไปบอกหลังบ้านว่าเปลี่ยนสถานะโต๊ะเป็น FREE นะ

      // อัปเดตหน้าจอ: กรองเอาออเดอร์นี้ออกจาก array (ลบออกจากลิสต์)
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.orderId !== orderId),
      );
    }
  };

  //แยก Array ออเดอร์ออกเป็น 2 ฝั่ง
  const dineInOrders = orders.filter((order) => order.type === "DINE-IN");
  const takeawayDeliveryOrders = orders.filter(
    (order) => order.type === "TAKE-AWAY" || order.type === "DELIVERY",
  );

  return (
    <div className="flex bg-[#eeeeee] min-h-screen font-['IBM_Plex_Sans_Thai']">
      <Sidebar />
      <main className="flex-1 ml-60 p-6 md:p-10 flex flex-col h-screen overflow-y-auto">
        {/* Header Area */}
        <header className="mb-8">
          <h1 className="font-['Bebas_Neue'] text-5xl tracking-wide text-[#242424] mb-1">
            CASHIER <span className="text-[#e4002b]">ORDER-LIST</span>
          </h1>
          <p className="text-[#888888] font-medium">
            จัดการรายการออเดอร์และชำระเงิน
          </p>
        </header>

        {/* Order List Container */}
        <div className="flex-1 full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* ================= ซ้าย: ทานที่ร้าน (DINE-IN) ================= */}
          <div className="flex flex-col gap-4">
            <div className="border-b-[3px] border-[#242424] pb-2 mb-2">
              <h2 className="font-['Bebas_Neue'] text-3xl tracking-wide text-[#242424] leading-none">
                DINE-IN{" "}
                <span className="text-xl text-[#888888]">
                  ({dineInOrders.length})
                </span>
              </h2>
            </div>

            {dineInOrders.length > 0 ? (
              dineInOrders.map((order) => (
                <OrderCard
                  key={order.orderId}
                  order={order}
                  onPrintBill={handlePrintBill}
                  onMarkAsCompleted={handleMarkAsCompleted}
                />
              ))
            ) : (
              <div className="bg-white/50 border-2 border-dashed border-[#cccccc] rounded-lg p-8 flex flex-col items-center justify-center text-[#888888]">
                <p className="font-bold">ไม่มีออเดอร์ทานที่ร้าน</p>
              </div>
            )}
          </div>

          {/* ================= ขวา: สั่งกลับบ้าน / เดลิเวอรี่ ================= */}
          <div className="flex flex-col gap-4">
            <div className="border-b-[3px] border-[#242424] pb-2 mb-2">
              <h2 className="font-['Bebas_Neue'] text-3xl tracking-wide text-[#242424] leading-none">
                TAKE-AWAY / DELIVERY{" "}
                <span className="text-xl text-[#888888]">
                  ({takeawayDeliveryOrders.length})
                </span>
              </h2>
            </div>

            {takeawayDeliveryOrders.length > 0 ? (
              takeawayDeliveryOrders.map((order) => (
                <OrderCard
                  key={order.orderId}
                  order={order}
                  onPrintBill={handlePrintBill}
                  onMarkAsCompleted={handleMarkAsCompleted}
                />
              ))
            ) : (
              <div className="bg-white/50 border-2 border-dashed border-[#cccccc] rounded-lg p-8 flex flex-col items-center justify-center text-[#888888]">
                <p className="font-bold">ไม่มีออเดอร์กลับบ้าน</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderList;
