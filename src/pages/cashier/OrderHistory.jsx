import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../component/shared/SideBar";
import HistoryAccordion from "../../component/cashier/HistoryAccordion";
import OrderDetailModal from "../../component/cashier/OrderDetailModal";
import { Search, Calendar } from "lucide-react";
import { orderService } from "../../services/orderService";
import { getOrderTotal } from "../../utils/customerOrders";

const getLocalDateValue = (date = new Date()) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().split("T")[0];
};

// 💡 ปรับปรุงการตรวจสอบประเภทออเดอร์ให้รองรับครบถ้วนทุกรูปแบบ
const getDisplayType = (order) => {
  if (!order || !order.type) return "DINE-IN";

  const rawType = order.type.toUpperCase();
  let type = "DINE-IN";

  if (rawType === "DELIVERY") {
    type = "DELIVERY";
  } else if (rawType === "PICK-UP" || rawType === "PICKUP") {
    type = "PICK-UP";
  } else if (rawType === "RESERVATION") {
    type = "RESERVATION";
  } else if (rawType === "DINE-IN") {
    // แยกแยะ Dine-in ที่มาจากการจองโต๊ะ
    if (order.isFromReservation) {
      type = "DINE-IN (RESERVED)";
    } else {
      type = "DINE-IN";
    }
  } else {
    type = rawType; // fallback เผื่อมีประเภทอื่นเพิ่มเติม
  }

  const branch = order?.customer?.note
    ?.match(/Branch:\s*([^|]+)/i)?.[1]
    ?.trim();
  return branch ? `${type} (${branch})` : type;
};

const toHistoryOrder = (order) => ({
  // 💡 เช็ค orderId สวยงามก่อน หากไม่มีค่อยแปลงจาก ID ตัวจริงหลังบ้าน
  orderId:
    order?.orderId ||
    (order?._id ? `#${order._id.slice(-6).toUpperCase()}` : "N/A"),
  type: getDisplayType(order),
  status: order?.status || "completed",
  customer:
    order?.customer?.name ||
    order?.customer?.contact ||
    `Order ${order?._id?.slice(-6).toUpperCase() || "N/A"}`,
  time: new Date(order.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
  totalAmount: order?.payment?.amount || getOrderTotal(order),
  // 💡 รองรับทั้งกรณีส่งมาเป็น orderList หรือ items
  items: (order?.orderList || order?.items || []).map((item) => ({
    name: item.name || "Menu item",
    qty: item.quantity || item.qty || 1,
    price: item.price ?? item.price_at_purchase ?? 0,
  })),
  raw: order,
});

const mockHistoryData = [
  {
    orderId: "#DINE-001",
    type: "DINE-IN",
    status: "completed",
    customer: "Walk-in Customer",
    time: "10:30",
    totalAmount: 599,
    items: [
      { name: "Serious Fried Chicken Set (L)", qty: 1, price: 299 },
      { name: "French Fries", qty: 2, price: 79 },
      { name: "Coke (Refill)", qty: 2, price: 49 },
      { name: "Mashed Potato", qty: 1, price: 59 },
    ],
    raw: { status: "completed", customer: { name: "Walk-in Customer" } },
  },
  {
    orderId: "#DEL-045",
    type: "DELIVERY",
    status: "cancelled",
    customer: "Grab - คุณสมปอง",
    time: "09:15",
    totalAmount: 349,
    items: [
      { name: "Spicy Chicken Burger", qty: 2, price: 120 },
      { name: "Iced Tea", qty: 2, price: 54 },
    ],
    raw: { status: "cancelled", customer: { name: "Grab - คุณสมปอง" } },
  },
];

const OrderHistory = () => {
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateValue());
  const [searchText, setSearchText] = useState("");
  const [historyOrders, setHistoryOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const orders = await orderService.getOrders();

        // 💡 เพิ่มรายการสถานะปลายทางที่ต้องการเก็บลงประวัติทั้งหมด
        const historyStatuses = [
          "COMPLETED",
          "CANCELLED",
          "DELIVERED",
          "PICKED UP",
          "PICKED-UP",
          "SERVED",
          "RECEIVED",
        ];

        let filtered = orders
          .filter((order) => {
            const status = order?.status?.toUpperCase();
            return historyStatuses.includes(status);
          })
          .filter(
            (order) =>
              getLocalDateValue(new Date(order.createdAt)) === selectedDate,
          )
          .map(toHistoryOrder);

        if (filtered.length === 0) {
          filtered = mockHistoryData;
        }

        setHistoryOrders(filtered);
        setStatusMessage("");
      } catch {
        setHistoryOrders(mockHistoryData);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [selectedDate]);

  const filteredOrders = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return historyOrders;
    return historyOrders.filter(
      (order) =>
        order.orderId.toLowerCase().includes(query) ||
        order.type.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query),
    );
  }, [historyOrders, searchText]);

  // 💡 ปรับการตรวจสอบให้เป็น Casing-insensitive (ป้องกันหลุดยอดขายยกเลิก)
  const totalSales = filteredOrders
    .filter((order) => order.status?.toLowerCase() !== "cancelled")
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="flex bg-[#eeeeee] min-h-screen font-['IBM_Plex_Sans_Thai']">
      <Sidebar />
      <main className="flex-1 ml-60 p-6 md:p-10 flex flex-col h-screen overflow-y-auto">
        <header className="mb-6 flex flex-col xl:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="font-['Bebas_Neue'] text-5xl tracking-wide text-[#242424] mb-1">
              ORDER <span className="text-[#888888]">HISTORY</span>
            </h1>
            <p className="text-[#888888] font-medium">ประวัติรายการออเดอร์</p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 items-center w-full xl:w-auto">
            <div className="relative flex-1 md:w-56">
              <Calendar
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#888888] pointer-events-none"
              />
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-[#cccccc] rounded-lg focus:outline-none focus:border-[#242424] text-sm font-bold text-[#242424]"
              />
            </div>
            <div className="relative flex-1 md:w-72">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#888888]"
              />
              <input
                type="text"
                placeholder="ค้นหา (ID, ประเภท, ชื่อลูกค้า)..."
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-[#cccccc] rounded-lg focus:outline-none focus:border-[#242424] text-sm"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 w-full max-w-6xl flex flex-col mx-auto">
          <div className="flex justify-between items-center mb-4 px-1 pb-2 border-b-2 border-[#cccccc]">
            <h3 className="font-bold text-[#242424] flex items-center gap-2">
              รายการประจำวันที่ {selectedDate}
            </h3>
            <p className="text-sm font-medium text-[#888888]">
              ยอดรวม:{" "}
              <span className="text-[#e4002b] font-bold text-lg">
                ฿
                {totalSales.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
              <span className="bg-[#242424] text-white px-2 py-0.5 rounded-full text-xs ml-1">
                {filteredOrders.length} ออเดอร์
              </span>
            </p>
          </div>

          {statusMessage && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {statusMessage}
            </div>
          )}

          <div className="flex flex-col">
            {loading ? (
              <div className="rounded-lg border-2 border-dashed border-[#cccccc] bg-white/60 p-12 text-center font-bold text-[#888888] animate-pulse">
                กำลังโหลดประวัติออเดอร์...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-[#cccccc] bg-white/60 p-12 text-center flex flex-col items-center gap-2">
                <Calendar size={32} className="text-[#cccccc]" />
                <p className="font-bold text-[#888888]">
                  ไม่มีรายการออเดอร์ในวันนี้
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <HistoryAccordion
                  key={order.orderId}
                  order={order}
                  onViewDetails={() => setSelectedOrder(order)}
                />
              ))
            )}
          </div>
        </div>
      </main>

      <OrderDetailModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        isHistoryMode={true}
      />
    </div>
  );
};

export default OrderHistory;
