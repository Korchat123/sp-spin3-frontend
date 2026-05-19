// src/pages/cashier/OrderHistory.jsx
// ดึง Component ลูก 2 ตัวบนมาประกอบร่างกัน พร้อม Sidebar และกล่องค้นหา

import React, { useState } from "react";
import Sidebar from "../../component/shared/SideBar";
import WeekDateSelector from "../../component/cashier/WeekDateSelector";
import HistoryAccordion from "../../component/cashier/HistoryAccordion";
import { Search } from "lucide-react";

const OrderHistory = () => {
  const [selectedDate, setSelectedDate] = useState(4); // สมมติค่าเริ่มต้นเป็นวันที่ 4

  // จำลองข้อมูลประวัติออเดอร์ (เพิ่มรายการอาหารเข้าไปด้วย)
  const [historyOrders] = useState([
    {
      orderId: "#SP-8828",
      type: "DINE-IN (T-05)",
      staff: "Bua",
      time: "13:45",
      totalAmount: 464,
      items: [
        { name: "Serious Punch Burger", qty: 1, price: 240 },
        { name: "KFC Styled Fries (L)", qty: 1, price: 89 },
        { name: "Coca-Cola Refill", qty: 1, price: 135 },
      ],
    },
    {
      orderId: "#SP-8827",
      type: "TAKE-AWAY",
      staff: "Bua",
      time: "13:20",
      totalAmount: 250,
      items: [
        { name: "Spicy Wing (6pcs)", qty: 1, price: 159 },
        { name: "KFC Styled Fries (L)", qty: 1, price: 91 },
      ],
    },
    {
      orderId: "#SP-8826",
      type: "DELIVERY",
      staff: "John",
      time: "12:55",
      totalAmount: 680,
      items: [
        { name: "Serious Punch Burger", qty: 2, price: 240 },
        { name: "Spicy Wing (6pcs)", qty: 1, price: 159 },
        { name: "Sprite Can", qty: 1, price: 41 },
      ],
    },
  ]);

  return (
    <div className="flex bg-[#eeeeee] min-h-screen font-['IBM_Plex_Sans_Thai']">
      <Sidebar />

      <main className="flex-1 ml-60 p-6 md:p-10 flex flex-col h-screen overflow-y-auto">
        {/* Header & Search Area */}
        <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-['Bebas_Neue'] text-5xl tracking-wide text-[#242424] mb-1">
              ORDER <span className="text-[#888888]">HISTORY</span>
            </h1>
            <p className="text-[#888888] font-medium">
              ประวัติรายการออเดอร์ที่ชำระเงินแล้ว
            </p>
          </div>

          {/* กล่องค้นหาออเดอร์ คลีนๆ ไม่แย่งซีน */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="ค้นหา Order ID..."
              className="w-full pl-10 pr-4 py-2 border-2 border-[#cccccc] rounded-lg focus:outline-none focus:border-[#242424] text-sm"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#888888]"
            />
          </div>
        </header>

        <div className="flex-1 w-full max-w-5xl flex flex-col mx-auto">
          {/* สรุปยอดขายรายวันเล็กๆ */}
          <div className="flex justify-between items-center mb-2 px-1">
            <h3 className="font-bold text-[#242424]">
              รายการประจำวันที่ {selectedDate} พ.ค.
            </h3>
            <p className="text-sm font-medium text-[#888888]">
              ยอดรวม:{" "}
              <span className="text-[#242424] font-bold">฿1,394.00</span> (3
              ออเดอร์)
            </p>
          </div>

          {/* Component: เลือกวันที่ */}
          <WeekDateSelector
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          {/* Component: ลิสต์รายการออเดอร์แบบพับได้ */}
          <div className="flex flex-col">
            {historyOrders.map((order) => (
              <HistoryAccordion key={order.orderId} order={order} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderHistory;
