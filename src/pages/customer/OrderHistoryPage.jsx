// src/pages/customer/OrderHistoryPage.jsx
import React, { useState, useEffect } from "react";
import {
  History,
  Clock,
  Bike,
  Store,
  RefreshCw,
  XCircle,
  Star,
  MapPin,
  Phone,
  MessageSquare,
  Eye,
  CalendarCheck,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

import PickupConfirmation from "../../component/customer/PickupConfirmation";
import DeliveryConfirmation from "../../component/customer/DeliveryConfirmation";
import ReserveConfirmation from "../../component/customer/ReserveConfirmation";
import { orderService } from "../../services/orderService";

const MOCK_HISTORY_DATA = [
  {
    id: "SFC-8821",
    date: "2026-05-28 12:15",
    type: "delivery",
    status: "cooking",
    items: [
      { id: "m1", name: "Serious Bucket", qty: 1, price: 399 },
      { id: "m5", name: "Coke", qty: 2, price: 25 },
    ],
    total: 449,
    deliveryTime: "13:00",
  },
  {
    id: "SFC-8822",
    date: "2026-05-28 11:30",
    type: "pickup",
    status: "pending",
    items: [{ id: "m2", name: "Spicy Chicken Burger", qty: 1, price: 120 }],
    total: 120,
    deliveryTime: "12:00",
  },
];

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderHistory = async () => {
      setLoading(true);
      try {
        const data = await orderService.getOrders();
        // ถ้า API พังหรือไม่มีข้อมูล ให้ลองใช้ MOCK ไปก่อน
        if (!data || data.length === 0) {
          setOrders(MOCK_HISTORY_DATA);
        } else {
          // แปลงข้อมูลจาก API ให้เข้ากับ UI ของเรา
          const formattedData = data.map((d) => ({
            id: d._id ? `#${d._id.slice(-6).toUpperCase()}` : "N/A",
            date: new Date(d.createdAt).toLocaleString(),
            type: d.type || "delivery",
            status: d.status || "pending",
            items: d.orderList || [],
            total: d.totalPrice || 0,
            deliveryTime: "As soon as possible", // หรือดึงจาก d.customer.note
          }));
          setOrders(formattedData);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setOrders(MOCK_HISTORY_DATA); // ใช้ MOCK ถ้า Error
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const ongoingOrders = orders.filter(
    (o) =>
      !["delivered", "picked_up", "cancelled"].includes(o.status.toLowerCase()),
  );
  const pastOrders = orders.filter((o) =>
    ["delivered", "picked_up", "cancelled"].includes(o.status.toLowerCase()),
  );

  const handleOrderAgain = (oldItems) => {
    const currentCartRaw = localStorage.getItem("crispyCart");
    let currentCart = currentCartRaw ? JSON.parse(currentCartRaw) : [];
    oldItems.forEach((oldItem) => {
      const existing = currentCart.find((item) => item.id === oldItem.id);
      if (existing) {
        existing.qty += oldItem.qty || oldItem.quantity || 1;
      } else {
        currentCart.push({
          id: oldItem.id || oldItem._id,
          qty: oldItem.qty || oldItem.quantity || 1,
        });
      }
    });
    localStorage.setItem("crispyCart", JSON.stringify(currentCart));
    alert("เพิ่มรายการอาหารเข้าตะกร้าแล้ว!");
    window.dispatchEvent(new Event("storage"));
  };

  const handleCancelOrder = (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการยกเลิกออเดอร์นี้?")) {
      setOrders(
        orders.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o)),
      );
    }
  };

  const handleReview = (id) => {
    alert(
      "ขอบคุณที่รีวิวร้าน Serious Fried Chicken ของเรา! (ระบบจะตามมาในอนาคต)",
    );
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, isReviewed: true } : o)),
    );
  };

  const getIconByType = (type) => {
    if (type === "delivery") return <Bike size={14} />;
    if (type === "reservation") return <CalendarCheck size={14} />;
    return <Store size={14} />;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#eeeeee]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#242424] border-t-[#e4002b]"></div>
        <p className="mt-4 font-black uppercase tracking-widest text-gray-500">
          Loading your feast history...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eeeeee] font-['IBM_Plex_Sans_Thai'] text-[#242424] p-4 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* หัวข้อหน้า */}
        <div className="mb-6 flex items-center gap-3 border-b-4 border-[#242424] pb-4">
          <History size={36} className="text-[#e4002b]" />
          <h1 className="text-5xl font-black font-['Bebas_Neue'] tracking-wider">
            ORDER HISTORY
          </h1>
        </div>

        {/* Contact & Support Section */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 p-4 md:p-5 rounded-2xl mb-12 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm transition-all hover:bg-white hover:border-gray-300">
          <div className="flex flex-col gap-1 w-full md:w-auto text-center md:text-left">
            <h2 className="font-bold text-gray-800 flex items-center justify-center md:justify-start gap-2">
              <MessageSquare size={18} className="text-[#e4002b]" />
              Need help with your order?
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-5 text-sm text-gray-500 font-medium mt-1">
              <span className="flex items-center gap-1">
                <MapPin size={14} /> SFC Asok (HQ)
              </span>
              <span className="flex items-center gap-1">
                <Phone size={14} /> 02-XXX-XXXX
              </span>
            </div>
          </div>
          <button
            disabled
            className="w-full md:w-auto flex justify-center items-center gap-2 bg-gray-100 text-gray-400 font-bold py-2 px-5 rounded-xl border border-gray-200 cursor-not-allowed text-sm"
          >
            Chatbot (Coming Soon)
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-4xl border-4 border-[#242424] bg-white p-12 text-center shadow-[12px_12px_0_#242424]">
            <ShoppingBag size={80} className="mx-auto mb-6 text-gray-300" />
            <h2 className="font-['Bebas_Neue'] text-4xl tracking-wider">
              NO ORDERS YET
            </h2>
            <p className="mt-2 font-bold text-gray-500 uppercase tracking-wide">
              Time to start your Serious Fried Chicken adventure!
            </p>
            <a
              href="/menu"
              className="mt-8 inline-block rounded-full border-2 border-[#242424] bg-[#e4002b] px-10 py-4 font-['Bebas_Neue'] text-2xl tracking-widest text-white shadow-[6px_6px_0_#242424] transition-all hover:translate-y-1 hover:shadow-[2px_2px_0_#242424]"
            >
              ORDER NOW
            </a>
          </div>
        ) : (
          <>
            {/* 1. ON GOING ORDERS */}
            <section className="mb-14">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-2 text-[#e4002b]">
                <Clock size={20} /> ON GOING ORDERS ({ongoingOrders.length})
              </h2>

              <div className="flex flex-col gap-4">
                {ongoingOrders.length === 0 ? (
                  <div className="bg-white border-2 border-dashed border-gray-300 p-8 text-center rounded-2xl text-gray-400 font-bold">
                    No on-going orders.
                  </div>
                ) : (
                  ongoingOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white border-4 border-[#242424] rounded-2xl p-6 shadow-[6px_6px_0_#242424]"
                    >
                      <div className="flex justify-between items-start border-b border-gray-100 pb-3 mb-3">
                        <div>
                          <span className="text-xs font-black text-gray-400">
                            {order.date}
                          </span>
                          <h3 className="text-xl font-black text-[#e4002b]">
                            {order.id}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1 bg-[#242424] text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                          {getIconByType(order.type)}
                          {order.type} :{" "}
                          <span className="text-[#e4002b] ml-1">
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            {order.items
                              .map(
                                (i) =>
                                  `${i.name || "Menu item"} (x${i.qty || i.quantity || 1})`,
                              )
                              .join(", ")}
                          </p>
                          <div className="mt-2 font-black text-lg">
                            Total:{" "}
                            <span className="text-[#242424]">
                              ฿{order.total}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="flex-1 md:flex-none bg-[#eeeeee] hover:bg-[#242424] hover:text-white border-2 border-[#242424] px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                          >
                            <Eye size={16} /> DETAILS
                          </button>
                          {(order.status === "pending" ||
                            order.status === "cooking") && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="flex-1 md:flex-none bg-white hover:bg-red-50 text-red-600 border-2 border-red-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                            >
                              <XCircle size={16} /> CANCEL
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* 2. ALL PAST HISTORY */}
            <section>
              <h2 className="text-2xl font-black mb-4 flex items-center gap-2 text-[#242424]">
                <History size={20} /> PAST ORDERS ({pastOrders.length})
              </h2>

              <div className="flex flex-col gap-3">
                {pastOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-gray-300 hover:shadow-sm transition-all group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-[#242424]">
                          {order.id}
                        </span>
                        <span className="text-xs text-gray-400">
                          {order.date}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${order.status === "cancelled" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium truncate max-w-xs md:max-w-md">
                        {order.items
                          .map(
                            (i) =>
                              `${i.name || "Menu item"} x${i.qty || i.quantity || 1}`,
                          )
                          .join(", ")}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="text-sm font-bold text-[#242424]">
                          ฿{order.total}
                        </div>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-xs font-bold text-gray-400 hover:text-[#e4002b] flex items-center gap-0.5 transition-colors cursor-pointer"
                        >
                          View Details <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap gap-2 items-center">
                      {(order.status === "delivered" ||
                        order.status === "picked_up") &&
                        !order.isReviewed && (
                          <button
                            onClick={() => handleReview(order.id)}
                            className="text-yellow-600 hover:bg-yellow-50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer border border-transparent hover:border-yellow-200"
                          >
                            <Star size={14} /> REVIEW
                          </button>
                        )}
                      <button
                        onClick={() => handleOrderAgain(order.items)}
                        className="bg-white border-2 border-gray-200 hover:border-[#242424] hover:bg-[#242424] hover:text-white text-[#242424] px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <RefreshCw size={14} /> RE-ORDER
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      {/* ======================= MODALS ======================= */}
      {selectedOrder?.type === "pickup" && (
        <PickupConfirmation
          isOpen={true}
          onClose={() => setSelectedOrder(null)}
          orderNo={selectedOrder.id}
          menuList={selectedOrder.items.map(
            (i) => `${i.name || "Menu item"} (x${i.qty || i.quantity || 1})`,
          )}
          totalPrice={selectedOrder.total}
          deliveryTime={selectedOrder.deliveryTime}
          status={selectedOrder.status}
        />
      )}
      {selectedOrder?.type === "delivery" && (
        <DeliveryConfirmation
          isOpen={true}
          onClose={() => setSelectedOrder(null)}
          orderNo={selectedOrder.id}
          menuList={selectedOrder.items.map(
            (i) => `${i.name || "Menu item"} (x${i.qty || i.quantity || 1})`,
          )}
          totalPrice={selectedOrder.total}
          deliveryTime={selectedOrder.deliveryTime}
          address="SFC Asok (HQ)"
          status={selectedOrder.status}
        />
      )}
      {selectedOrder?.type === "reservation" && (
        <ReserveConfirmation
          isOpen={true}
          onClose={() => setSelectedOrder(null)}
          tableNo={selectedOrder.id}
          date={selectedOrder.reserveDate}
          time={selectedOrder.reserveTime}
          person={selectedOrder.person}
          menuList={selectedOrder.items.map(
            (i) => `${i.name || "Menu item"} (x${i.qty || i.quantity || 1})`,
          )}
          status={selectedOrder.status}
        />
      )}
    </div>
  );
}
