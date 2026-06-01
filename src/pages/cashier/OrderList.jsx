// src/pages/cashier/OrderList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderCard from "../../component/cashier/OrderCard";
import Sidebar from "../../component/shared/SideBar";
import { orderService } from "../../services/orderService";
import { getOrderTotal } from "../../utils/customerOrders";

const getDisplayOrderId = (order) =>
  order?._id ? `#${order._id.slice(-6).toUpperCase()}` : "N/A";

const getDisplayType = (order) => {
  if (order?.type === "delivery") return "DELIVERY";
  if (order?.type === "takeaway") return "TAKE-AWAY";
  return "DINE-IN";
};

const getTableLabel = (order) => {
  if (order?.tableId) return order.tableId;
  const branch = order?.customer?.note?.match(/Branch:\s*([^|]+)/i)?.[1]?.trim();
  return branch || null;
};

const getPaymentStatus = (order) => (order?.payment?.paidAt ? "PAID" : "PENDING");

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

  const fetchOrders = async () => {
    try {
      const data = await orderService.getOrders();
      setOrders(
        data
          .filter((order) => order.status !== "cancelled" && order.status !== "completed")
          .map(toCashierOrder),
      );
      setStatusMessage("");
    } catch (error) {
      console.error("Failed to fetch cashier orders:", error);
      setStatusMessage("Unable to sync orders. Check the backend connection.");
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

  // 2. ฟังก์ชันเมื่อกด Print Bill / Edit
  const handlePrintBill = (orderId) => {
    // นำทางไปหน้า Checkout พร้อมแนบ orderId ไปด้วย
    navigate("/cashier/checkout", { state: { orderId: orderId } });
  };

  // 3. ฟังก์ชันเมื่อกด PAID (ดันเข้า History & ลบออกจากหน้านี้)
  const handleMarkAsCompleted = async (orderId) => {
    if (
      window.confirm(`ยืนยันการเคลียร์โต๊ะและย้ายออเดอร์ ${orderId} ลงประวัติ?`)
    ) {
      try {
        const order = orders.find((item) => item.orderId === orderId);
        if (!order?.backendId) return;
        await orderService.updateOrder(order.backendId, { status: "completed" });
        setOrders((prevOrders) =>
          prevOrders.filter((item) => item.orderId !== orderId),
        );
      } catch (error) {
        console.error("Failed to complete order:", error);
        alert("Unable to complete this order right now.");
      }
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

        {statusMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {statusMessage}
          </div>
        )}

        {loading && (
          <div className="rounded-xl border-2 border-dashed border-[#cccccc] bg-white/60 p-8 text-center font-bold text-[#888888]">
            Loading orders...
          </div>
        )}

        {/* Order List Container */}
        {!loading && <div className="flex-1 full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
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
                  key={order.backendId || order.orderId}
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
                  key={order.backendId || order.orderId}
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
        </div>}
      </main>
    </div>
  );
};

export default OrderList;
