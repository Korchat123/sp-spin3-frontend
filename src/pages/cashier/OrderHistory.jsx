// src/pages/cashier/OrderHistory.jsx
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../component/shared/SideBar";
import HistoryAccordion from "../../component/cashier/HistoryAccordion";
import { Search } from "lucide-react";
import { orderService } from "../../services/orderService";
import { getOrderTotal } from "../../utils/customerOrders";

const getLocalDateValue = (date = new Date()) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().split("T")[0];
};

const getDisplayType = (order) => {
  const type = order?.type === "delivery" ? "DELIVERY" : "DINE-IN";
  const branch = order?.customer?.note?.match(/Branch:\s*([^|]+)/i)?.[1]?.trim();
  return branch ? `${type} (${branch})` : type;
};

const toHistoryOrder = (order) => ({
  orderId: order?._id ? `#${order._id.slice(-6).toUpperCase()}` : "N/A",
  type: getDisplayType(order),
  customer: order?.customer?.name || order?.customer?.contact || `Order ${order?._id?.slice(-6).toUpperCase() || "N/A"}`,
  time: new Date(order.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
  totalAmount: order?.payment?.amount || getOrderTotal(order),
  items: (order?.orderList || []).map((item) => ({
    name: item.name || "Menu item",
    qty: item.quantity || item.qty || 1,
    price: item.price ?? item.price_at_purchase ?? 0,
  })),
});

const OrderHistory = () => {
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateValue());
  const [searchText, setSearchText] = useState("");
  const [historyOrders, setHistoryOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const orders = await orderService.getOrders();
        setHistoryOrders(
          orders
            .filter((order) => order?.payment?.paidAt || order?.status === "completed")
            .filter((order) => getLocalDateValue(new Date(order.createdAt)) === selectedDate)
            .map(toHistoryOrder),
        );
        setStatusMessage("");
      } catch (error) {
        console.error("Failed to fetch cashier history:", error);
        setStatusMessage("Unable to sync order history. Check the backend connection.");
        setHistoryOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [selectedDate]);

  const filteredOrders = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return historyOrders;
    return historyOrders.filter((order) => order.orderId.toLowerCase().includes(query));
  }, [historyOrders, searchText]);

  const totalSales = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);

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
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
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
              รายการประจำวันที่ {selectedDate}
            </h3>
            <p className="text-sm font-medium text-[#888888]">
              ยอดรวม:{" "}
              <span className="text-[#242424] font-bold">
                ฿{totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>{" "}
              ({filteredOrders.length} ออเดอร์)
            </p>
          </div>

          <div className="mb-6 rounded-lg border-2 border-[#cccccc] bg-white p-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="rounded border border-[#cccccc] px-3 py-2 text-sm font-bold text-[#242424] outline-none focus:border-[#242424]"
            />
          </div>

          {statusMessage && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {statusMessage}
            </div>
          )}

          {/* Component: ลิสต์รายการออเดอร์แบบพับได้ */}
          <div className="flex flex-col">
            {loading ? (
              <div className="rounded-lg border-2 border-dashed border-[#cccccc] bg-white/60 p-8 text-center font-bold text-[#888888]">
                Loading history...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-[#cccccc] bg-white/60 p-8 text-center font-bold text-[#888888]">
                No paid orders for this date.
              </div>
            ) : filteredOrders.map((order) => (
              <HistoryAccordion key={order.orderId} order={order} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderHistory;
