import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderCard from "../../component/cashier/OrderCard";
import Sidebar from "../../component/shared/SideBar";
import OrderDetailModal from "../../component/cashier/OrderDetailModal";
import { orderService } from "../../services/orderService";
import { CASHIER_ACTIVE_STATUSES, toCashierOrder } from "../../utils/cashierOrders";
import {
  LayoutGrid,
  Utensils,
  ShoppingBag,
  CalendarDays,
  PlusCircle,
} from "lucide-react";

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
        .filter((order) =>
          CASHIER_ACTIVE_STATUSES.has(
            String(order?.status || "").trim().toLowerCase(),
          ),
        )
        .map(toCashierOrder);
      setOrders(backendOrders);
      setStatusMessage("");
    } catch (err) {
      console.error("Failed to fetch cashier orders:", err);
      setStatusMessage("Unable to load orders from the database.");
      setOrders([]);
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

  const updateOrderStatus = async (orderId, status, extraData = {}) => {
    const order = orders.find((item) => item.orderId === orderId);
    if (!order?.backendId) return;

    try {
      await orderService.updateOrder(order.backendId, {
        status,
        ...extraData,
      });
      await fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error(`Failed to update order ${orderId}:`, error);
      setStatusMessage("Unable to update this order in the database.");
    }
  };

  const handleCheckIn = (orderId) => updateOrderStatus(orderId, "checked-in");

  const handlePayReservation = (orderId) =>
    updateOrderStatus(orderId, "preparing");

  const handleReceiveReservation = (orderId) =>
    updateOrderStatus(orderId, "received");

  const handleMarkAsCompleted = async (orderId) => {
    if (window.confirm(`Confirm moving ${orderId} to order history?`)) {
      try {
        const order = orders.find((item) => item.orderId === orderId);
        if (order?.backendId) {
          await orderService.updateOrder(order.backendId, {
            status: "completed",
          });
        }
        setOrders((prevOrders) =>
          prevOrders.filter((item) => item.orderId !== orderId),
        );
        setSelectedOrder(null);
      } catch (err) {
        console.error("Failed to complete order:", err);
        setStatusMessage("Unable to complete this order in the database.");
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
        if (orderToCancel.backendId) {
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



