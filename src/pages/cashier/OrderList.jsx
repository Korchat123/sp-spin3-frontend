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

// 💡 Mock Data เพิ่มออเดอร์ Reservation ให้ครบทั้ง 5 สถานะเพื่อใช้เทสโฟลว์ใหม่
const MOCK_ORDERS = [
  // --- DELIVERY ---
  {
    orderId: "DEL-001",
    status: "PENDING",
    type: "DELIVERY",
    totalAmount: 349,
    raw: {
      slipAttached: true,
      customer: { name: "Bua", phone: "081-234-5678" },
      address: "The Base Condo, Asok, Room 502",
    },
  },
  {
    orderId: "DEL-002",
    status: "COOKING",
    type: "DELIVERY",
    totalAmount: 150,
    raw: {
      slipAttached: true,
      customer: { name: "Somchai", phone: "099-888-7777" },
      address: "123/4 Sukhumvit Soi 10, Klong Toei",
    },
  },
  {
    orderId: "DEL-003",
    status: "ON THE WAY",
    type: "DELIVERY",
    totalAmount: 220,
    raw: {
      slipAttached: true,
      customer: { name: "Alice", phone: "088-111-2222" },
      address: "Ekkamai Soi 4, House No. 5",
    },
  },
  {
    orderId: "DEL-004",
    status: "DELIVERED",
    type: "DELIVERY",
    totalAmount: 500,
    raw: {
      slipAttached: true,
      customer: { name: "John Doe", phone: "080-000-0000" },
      address: "Thong Lo Soi 13, Building B",
    },
  },

  // --- PICK-UP ---
  {
    orderId: "PIC-001",
    status: "COOKING",
    type: "PICK-UP",
    totalAmount: 199,
    raw: {
      slipAttached: true,
      pickupTime: "14:30",
      customer: { name: "Minnie", phone: "081-111-1111" },
    },
  },
  {
    orderId: "PIC-002",
    status: "READY",
    type: "PICK-UP",
    totalAmount: 120,
    raw: {
      slipAttached: true,
      pickupTime: "15:30",
      customer: { name: "Aom", phone: "083-333-3333" },
    },
  },

  // --- DINE-IN ---
  {
    orderId: "DIN-001",
    status: "PENDING",
    type: "DINE-IN",
    table: "T-01",
    totalAmount: 850,
    raw: {},
  },
  {
    orderId: "DIN-002",
    status: "COOKING",
    type: "DINE-IN",
    table: "T-02",
    totalAmount: 420,
    raw: {},
  },
  {
    orderId: "DIN-003",
    status: "READY",
    type: "DINE-IN",
    table: "T-03",
    totalAmount: 950,
    raw: {},
  },
  {
    orderId: "DIN-004",
    status: "PENDING",
    type: "DINE-IN",
    table: "T-06",
    totalAmount: 1000,
    isFromReservation: true,
    raw: {},
  },

  // --- RESERVATION (5 สถานะโฟลว์จอง) ---
  {
    orderId: "RES-001",
    status: "RESERVED", // 1. จองล่วงหน้าลอยตัว
    type: "RESERVATION",
    table: "T-05",
    totalAmount: 500,
    raw: {
      slipAttached: true,
      time: "18:00",
      pax: "4",
      customer: { name: "K. John" },
    },
  },
  {
    orderId: "RES-002",
    status: "CHECKED-IN", // 2. ลูกค้ามาถึงร้านแล้ว
    type: "RESERVATION",
    table: "T-06",
    totalAmount: 1000,
    raw: {
      slipAttached: true,
      time: "18:30",
      pax: "2",
      customer: { name: "K. Ann" },
    },
  },
  {
    orderId: "RES-003",
    status: "COOKING", // 3. จ่ายเงินสั่งอาหารส่งเข้าครัวแล้ว (ปุ่ม RECEIVED จะล็อกรออาหารเสร็จ)
    type: "RESERVATION",
    table: "T-07",
    totalAmount: 750,
    raw: {
      slipAttached: true,
      time: "19:00",
      pax: "3",
      customer: { name: "K. Somchai" },
    },
  },
  {
    orderId: "RES-004",
    status: "READY", // 4. ครัวทำอาหารจองเสร็จเรียบร้อย (ปุ่ม RECEIVED ปลดล็อกให้กดรับได้)
    type: "RESERVATION",
    table: "T-08",
    totalAmount: 1200,
    raw: {
      slipAttached: true,
      time: "19:30",
      pax: "5",
      customer: { name: "K. Bua" },
    },
  },
  {
    orderId: "RES-005",
    status: "RECEIVED", // 5. ลูกค้าได้รับอาหารแล้ว ทานเสร็จเตรียมเคลียร์โต๊ะลงประวัติ
    type: "RESERVATION",
    table: "T-09",
    totalAmount: 2500,
    raw: {
      slipAttached: true,
      time: "20:00",
      pax: "8",
      customer: { name: "K. Alice" },
    },
  },
];

const getDisplayOrderId = (order) =>
  order?._id
    ? `#${order._id.slice(-6).toUpperCase()}`
    : order.orderId
      ? `#${order.orderId}`
      : "N/A";

const getDisplayType = (order) => {
  const t = order?.type?.toLowerCase();
  if (t === "delivery") return "DELIVERY";
  if (t === "pick-up" || t === "pickup") return "PICK-UP";
  if (t === "reservation") return "RESERVATION";
  return "DINE-IN";
};

const getTableLabel = (order) => {
  if (order?.tableId) return order.tableId;
  if (order?.table) return order.table;
  const branch = order?.customer?.note
    ?.match(/Branch:\s*([^|]+)/i)?.[1]
    ?.trim();
  return branch || null;
};

const getOrderStatus = (order) => {
  if (!order?.status) return "PENDING";
  const s = order.status.toUpperCase();
  if (s === "PREPARING") return "COOKING";
  if (
    s === "DELIVERY" ||
    s === "PICK-UP" ||
    s === "DINE-IN" ||
    s === "RESERVATION"
  )
    return "PENDING";
  return s;
};

const toCashierOrder = (order) => {
  const displayType = getDisplayType(order);
  const isOnlineOrder = ["DELIVERY", "PICK-UP", "RESERVATION"].includes(
    displayType,
  );
  const forceSlip = isOnlineOrder || !!order.slipAttached;

  return {
    raw: { ...order, slipAttached: forceSlip },
    orderId: getDisplayOrderId(order),
    backendId: order._id || order.orderId,
    status: getOrderStatus(order),
    type: displayType,
    table: getTableLabel(order),
    isFromReservation: !!order.isFromReservation,
    totalAmount:
      order.payment?.amount || order.totalAmount || getOrderTotal(order),
  };
};

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders();
      const backendOrders = data
        .filter((o) => o.status !== "completed" && o.status !== "cancelled")
        .map(toCashierOrder);

      const mockCashierOrders = MOCK_ORDERS.map(toCashierOrder);

      const merged = [...backendOrders];
      mockCashierOrders.forEach((mock) => {
        if (!merged.some((b) => b.orderId === mock.orderId)) {
          merged.push(mock);
        }
      });

      setOrders(merged);
      setStatusMessage("");
    } catch (err) {
      console.error("Failed to fetch backend, using MOCK", err);
      setStatusMessage(
        "Offline Mode: Showing Mock Data (Backend Disconnected)",
      );
      setOrders(MOCK_ORDERS.map(toCashierOrder));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handlePrintBill = (orderId) =>
    navigate("/cashier/checkout", { state: { orderId } });

  const handleEditOrder = (orderId) =>
    navigate("/cashier/menu", { state: { orderId, type: "EDIT-ORDER" } });

  // จัดการการเช็คอินของ Reservation
  const handleCheckIn = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId ? { ...o, status: "CHECKED-IN" } : o,
      ),
    );
    setSelectedOrder((prev) =>
      prev && prev.orderId === orderId
        ? { ...prev, status: "CHECKED-IN" }
        : prev,
    );
  };

  // จัดการการชำระเงินของ Reservation & เปิดออเดอร์ DINE-IN ใหม่อัตโนมัติ (และสลับตัวเองเป็น COOKING)
  const handlePayReservation = (orderId) => {
    setOrders((prev) => {
      const target = prev.find((o) => o.orderId === orderId);
      if (!target) return prev;

      const newDineIn = {
        orderId: `DIN-R${Math.floor(100 + Math.random() * 900)}`,
        status: "PENDING",
        type: "DINE-IN",
        table: target.table,
        totalAmount: target.totalAmount,
        isFromReservation: true,
        raw: {
          customer: target.raw?.customer,
          slipAttached: true,
        },
      };

      return [
        ...prev.map((o) =>
          o.orderId === orderId ? { ...o, status: "COOKING" } : o,
        ),
        newDineIn,
      ];
    });

    setSelectedOrder((prev) =>
      prev && prev.orderId === orderId ? { ...prev, status: "COOKING" } : prev,
    );
    alert(
      "ระบบเปิดออเดอร์ Dine-in และปรับสถานะโต๊ะจองเป็นกำลังประกอบอาหาร (Cooking) แล้ว!",
    );
  };

  // จัดการเมื่อออเดอร์การจองได้รับอาหารเรียบร้อยแล้ว
  const handleReceiveReservation = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId ? { ...o, status: "RECEIVED" } : o,
      ),
    );
    setSelectedOrder((prev) =>
      prev && prev.orderId === orderId ? { ...prev, status: "RECEIVED" } : prev,
    );
    alert("ยืนยันลูกค้าได้รับอาหารเรียบร้อย!");
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
      } catch (err) {
        console.error("Failed to complete order:", err);
      }
    }
  };

  const handleCancelOrder = async (orderToCancel) => {
    const isAlreadyCooking = ["COOKING", "READY", "ON THE WAY"].includes(
      orderToCancel.status.toUpperCase(),
    );

    let confirmMessage = `คุณกำลังจะยกเลิกออเดอร์ ${orderToCancel.orderId}\nกรุณาระบุเหตุผล:`;

    if (isAlreadyCooking) {
      confirmMessage = `⚠️ คำเตือน: ออเดอร์ ${orderToCancel.orderId} กำลังทำหรือทำเสร็จแล้ว!\nการยกเลิกอาจทำให้เกิดของเสีย (Food Waste)\n\nกรุณาระบุเหตุผลในการยกเลิกด่วน:`;
    }

    const reason = window.prompt(confirmMessage);

    if (reason !== null) {
      try {
        if (
          orderToCancel.backendId &&
          !orderToCancel.backendId.includes("mock")
        ) {
          await orderService.updateOrder(orderToCancel.backendId, {
            status: "cancelled",
            cancelReason: reason,
            wasted: isAlreadyCooking,
          });
        }

        setOrders((prev) =>
          prev.filter((item) => item.orderId !== orderToCancel.orderId),
        );
        setSelectedOrder(null);
      } catch (err) {
        console.error("Failed to cancel order:", err);
        alert("เกิดข้อผิดพลาด ไม่สามารถยกเลิกออเดอร์ได้");
      }
    }
  };

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
            key={order.orderId}
            order={order}
            onClick={() => setSelectedOrder(order)}
            onPrintBill={handlePrintBill}
            onEditOrder={handleEditOrder}
            onMarkAsCompleted={handleMarkAsCompleted}
            onCheckIn={handleCheckIn}
            onPayReservation={handlePayReservation}
            onReceiveReservation={handleReceiveReservation}
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
        <header className="mb-6 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 md:pr-20">
          <div>
            <h1 className="font-['Bebas_Neue'] text-4xl md:text-5xl tracking-wide text-[#242424] mb-1">
              CASHIER <span className="text-[#e4002b]">ORDER-LIST</span>
            </h1>
            <p className="text-[#888888] font-medium text-sm">
              จัดการรายการออเดอร์ การจอง และชำระเงิน
            </p>
          </div>
          <button
            onClick={() =>
              navigate("/cashier/menu", { state: { type: "WALK-IN" } })
            }
            className="border-2 border-[#242424] text-[#242424] bg-white hover:bg-[#242424] hover:text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer uppercase tracking-widest text-sm"
          >
            <PlusCircle size={18} strokeWidth={2.5} /> NEW ORDER
          </button>
        </header>

        {statusMessage && (
          <div className="mb-6 shrink-0 rounded-xl border border-yellow-250 bg-yellow-50 px-4 py-3 text-sm font-bold text-yellow-700 flex justify-between items-center">
            {statusMessage}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-8 shrink-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-xs tracking-wide transition-all shrink-0 cursor-pointer ${activeTab === tab.id ? "bg-[#242424] text-white shadow-md" : "bg-white text-[#888888] border-2 border-transparent hover:border-gray-200"}`}
            >
              <tab.icon size={16} strokeWidth={activeTab === tab.id ? 3 : 2} />
              {tab.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="rounded-xl border-2 border-dashed border-[#cccccc] bg-white/60 p-10 text-center font-bold text-[#888888]">
            กำลังโหลดออเดอร์...
          </div>
        )}

        {!loading && (
          <div className="flex-1 w-full max-w-screen-2xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start pb-10">
            {(activeTab === "ALL" || activeTab === "DINE-IN") &&
              renderOrderColumn(
                "DINE-IN",
                orders.filter((o) => o.type === "DINE-IN").length,
                orders.filter((o) => o.type === "DINE-IN"),
              )}

            {(activeTab === "ALL" || activeTab === "DELI_PICKUP") &&
              renderOrderColumn(
                "DELIVERY / PICK-UP",
                orders.filter(
                  (o) => o.type === "DELIVERY" || o.type === "PICK-UP",
                ).length,
                orders.filter(
                  (o) => o.type === "DELIVERY" || o.type === "PICK-UP",
                ),
              )}

            {(activeTab === "ALL" || activeTab === "RESERVATION") &&
              renderOrderColumn(
                "RESERVATION",
                orders.filter((o) => o.type === "RESERVATION").length,
                orders.filter((o) => o.type === "RESERVATION"),
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
        onCancelOrder={handleCancelOrder}
        onMarkAsCompleted={handleMarkAsCompleted}
        onCheckIn={handleCheckIn}
        onPayReservation={handlePayReservation}
        onReceiveReservation={handleReceiveReservation}
      />
    </div>
  );
};

export default OrderList;
