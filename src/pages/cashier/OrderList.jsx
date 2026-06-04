import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderCard from "../../component/cashier/OrderCard";
import Sidebar from "../../component/shared/SideBar";
import OrderDetailModal from "../../component/cashier/OrderDetailModal";
import { orderService } from "../../services/orderService";
import { getOrderTotal } from "../../utils/customerOrders";
import {
  LayoutGrid,
  Utensils,
  ShoppingBag,
  CalendarDays,
  PlusCircle,
} from "lucide-react";

const MOCK_ORDERS = [
  {
    orderId: "DEL-1045",
    backendId: "mock_del_1",
    status: "PENDING",
    type: "DELIVERY",
    table: "Grab",
    totalAmount: 349,
    raw: {
      customer: { name: "Somchai", phone: "081-xxx-xxxx" },
      slipAttached: true,
    },
  },
  {
    orderId: "RES-0092",
    backendId: "mock_res_1",
    status: "PENDING",
    type: "RESERVATION",
    table: "4 Pax (K. John)",
    totalAmount: 0,
    raw: { customer: { name: "K. John" } },
  },
  {
    orderId: "PICK-088",
    backendId: "mock_pick_1",
    status: "PAID",
    type: "PICK-UP",
    table: "Walk-in",
    totalAmount: 199,
    raw: { customer: { name: "Minnie" } },
  },
  {
    orderId: "DINE-001",
    backendId: "mock_dine_1",
    status: "PENDING",
    type: "DINE-IN",
    table: "T-02",
    totalAmount: 850,
    raw: { customer: { name: "Walk-in" } },
  },
  {
    orderId: "DINE-002",
    backendId: "mock_dine_2",
    status: "PAID",
    type: "DINE-IN",
    table: "T-05",
    totalAmount: 420,
    raw: { customer: { name: "Walk-in" } },
  },
];

const getDisplayOrderId = (order) =>
  order?._id ? `#${order._id.slice(-6).toUpperCase()}` : "N/A";

const getDisplayType = (order) => {
  if (order?.type === "delivery") return "DELIVERY";
  if (
    order?.type === "pick-up" ||
    order?.type === "pickup" ||
    order?.type === "takeaway"
  )
    return "PICK-UP";
  if (order?.type === "reservation") return "RESERVATION";
  return "DINE-IN";
};

const getTableLabel = (order) => {
  if (order?.tableId) return order.tableId;
  const branch = order?.customer?.note
    ?.match(/Branch:\s*([^|]+)/i)?.[1]
    ?.trim();
  return branch || null;
};

const getPaymentStatus = (order) =>
  order?.payment?.paidAt ? "PAID" : "PENDING";

const toCashierOrder = (order) => ({
  raw: order,
  orderId: getDisplayOrderId(order),
  backendId: order._id,
  status: getPaymentStatus(order),
  type: getDisplayType(order),
  table: getTableLabel(order),
  totalAmount: order.payment?.amount || getOrderTotal(order),
});

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getOrders();
      setOrders(
        data
          .filter(
            (order) =>
              order.status !== "cancelled" && order.status !== "completed",
          )
          .map(toCashierOrder),
      );
      setStatusMessage("");
    } catch (error) {
      console.error(
        "Failed to fetch cashier orders. USING MOCK DATA instead.",
        error,
      );
      setStatusMessage(
        "Offline Mode: Showing Mock Data (Backend Disconnected)",
      );
      setOrders(MOCK_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handlePrintBill = (orderId) => {
    navigate("/cashier/checkout", { state: { orderId: orderId } });
  };

  const handleEditOrder = (orderId) => {
    navigate("/cashier/menu", {
      state: { orderId: orderId, type: "EDIT-ORDER" },
    });
  };

  const handleMarkAsCompleted = async (orderId) => {
    if (window.confirm(`ยืนยันการเคลียร์ออเดอร์ ${orderId} ลงประวัติ?`)) {
      try {
        setOrders((prevOrders) =>
          prevOrders.filter((item) => item.orderId !== orderId),
        );
        const order = orders.find((item) => item.orderId === orderId);
        if (order?.backendId && !order.backendId.includes("mock")) {
          await orderService.updateOrder(order.backendId, {
            status: "completed",
          });
        }
      } catch (error) {
        console.error("Failed to complete order:", error);
      }
    }
  };

  const dineInOrders = orders.filter((order) => order.type === "DINE-IN");
  const deliveryPickUpOrders = orders.filter(
    (order) => order.type === "DELIVERY" || order.type === "PICK-UP",
  );
  const reservationOrders = orders.filter(
    (order) => order.type === "RESERVATION",
  );

  const TABS = [
    { id: "ALL", label: "ALL ORDERS", icon: LayoutGrid },
    { id: "DINE-IN", label: "DINE-IN", icon: Utensils },
    { id: "DELI_PICKUP", label: "DELIVERY / PICK-UP", icon: ShoppingBag },
    { id: "RESERVATION", label: "RESERVATION", icon: CalendarDays },
  ];

  const renderOrderColumn = (title, count, ordersList) => (
    <div className="flex flex-col gap-4 animate-[slideUp_0.3s_ease-out]">
      <div className="border-b-[3px] border-[#242424] pb-2 mb-2 flex flex-wrap justify-between items-end gap-2">
        <h2 className="font-['Bebas_Neue'] text-2xl xl:text-3xl tracking-wide text-[#242424] leading-none">
          {title}
        </h2>
        <span className="text-xs font-bold bg-[#e4002b]/10 text-[#e4002b] px-3 py-1 rounded-full leading-none whitespace-nowrap">
          {count} Orders
        </span>
      </div>

      {ordersList.length > 0 ? (
        ordersList.map((order) => (
          <OrderCard
            key={order.backendId || order.orderId}
            order={order}
            onClick={() => setSelectedOrder(order)}
            onPrintBill={handlePrintBill}
            onEditOrder={handleEditOrder}
            onMarkAsCompleted={handleMarkAsCompleted}
          />
        ))
      ) : (
        <div className="bg-white/50 border-2 border-dashed border-[#cccccc] rounded-xl p-8 flex flex-col items-center justify-center text-[#888888] h-32 transition-all">
          <p className="font-bold">ไม่มีออเดอร์</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex bg-[#eeeeee] min-h-screen font-['IBM_Plex_Sans_Thai']">
      <Sidebar />
      <main className="flex-1 ml-60 p-6 md:p-10 flex flex-col h-screen overflow-y-auto">
        {/* 💡 อัปเดต Header: เติม pr-20 เพื่อหลบกระดิ่งแจ้งเตือน */}
        <header className="mb-6 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 md:pr-20">
          <div>
            <h1 className="font-['Bebas_Neue'] text-4xl md:text-5xl tracking-wide text-[#242424] mb-1">
              CASHIER <span className="text-[#e4002b]">ORDER-LIST</span>
            </h1>
            <p className="text-[#888888] font-medium text-sm md:text-base">
              จัดการรายการออเดอร์ การจอง และชำระเงิน
            </p>
          </div>

          {/* 💡 อัปเดตปุ่ม: เป็นสไตล์ Minimal Outline สีเข้ม ดูโมเดิร์น */}
          <button
            onClick={() =>
              navigate("/cashier/menu", { state: { type: "WALK-IN" } })
            }
            className="border-2 border-[#242424] text-[#242424] bg-white hover:bg-[#242424] hover:text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer uppercase tracking-widest text-sm"
          >
            <PlusCircle size={18} strokeWidth={2.5} /> NEW ORDER
          </button>
        </header>

        {statusMessage && (
          <div className="mb-6 shrink-0 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-bold text-yellow-700 flex justify-between items-center">
            {statusMessage}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-8 shrink-0">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-bold text-xs md:text-sm tracking-wide transition-all duration-200 whitespace-nowrap outline-none shrink-0 cursor-pointer
                  ${
                    isActive
                      ? "bg-[#242424] text-white shadow-md -translate-y-0.5"
                      : "bg-white text-[#888888] border-2 border-transparent hover:border-gray-200 hover:text-[#242424]"
                  }
                `}
              >
                <tab.icon size={16} strokeWidth={isActive ? 3 : 2} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="rounded-xl border-2 border-dashed border-[#cccccc] bg-white/60 p-10 text-center font-bold text-[#888888]">
            กำลังโหลดออเดอร์...
          </div>
        )}

        {!loading && (
          <div className="flex-1 w-full max-w-screen-2xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 items-start pb-10">
            {(activeTab === "ALL" || activeTab === "DINE-IN") &&
              renderOrderColumn("DINE-IN", dineInOrders.length, dineInOrders)}

            {(activeTab === "ALL" || activeTab === "DELI_PICKUP") &&
              renderOrderColumn(
                "DELIVERY / PICK-UP",
                deliveryPickUpOrders.length,
                deliveryPickUpOrders,
              )}

            {(activeTab === "ALL" || activeTab === "RESERVATION") &&
              renderOrderColumn(
                "RESERVATION",
                reservationOrders.length,
                reservationOrders,
              )}
          </div>
        )}
      </main>

      <OrderDetailModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onPrintBill={handlePrintBill}
        onEditOrder={handleEditOrder}
        onMarkAsCompleted={handleMarkAsCompleted}
      />
    </div>
  );
};

export default OrderList;
