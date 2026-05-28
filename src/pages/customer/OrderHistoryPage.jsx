// src/pages/customer/OrderHistoryPage.jsx
import React, { useState } from "react";
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
  ChevronRight, // เพิ่ม Icon นี้เข้ามา
} from "lucide-react";

import PickupConfirmation from "../../component/customer/PickupConfirmation";
import DeliveryConfirmation from "../../component/customer/DeliveryConfirmation";
import ReserveConfirmation from "../../component/customer/ReserveConfirmation";

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
  {
    id: "RES-9901",
    date: "2026-05-28 10:00",
    type: "reservation",
    status: "pending",
    person: "4",
    reserveDate: "2026-05-29",
    reserveTime: "18:30",
    items: [{ id: "m1", name: "Serious Bucket", qty: 1, price: 399 }],
    total: 399,
  },
  {
    id: "SFC-7712",
    date: "2026-05-20 18:40",
    type: "delivery",
    status: "delivered",
    items: [
      { id: "m1", name: "Serious Bucket", qty: 1, price: 399 },
      { id: "m3", name: "Crispy Tenders", qty: 1, price: 99 },
    ],
    total: 498,
    deliveryTime: "19:10",
    isReviewed: false,
  },
];

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState(MOCK_HISTORY_DATA);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const ongoingOrders = orders.filter(
    (o) => !["delivered", "picked_up", "cancelled"].includes(o.status),
  );
  const pastOrders = orders.filter((o) =>
    ["delivered", "picked_up", "cancelled"].includes(o.status),
  );

  const handleOrderAgain = (oldItems) => {
    const currentCartRaw = localStorage.getItem("crispyCart");
    let currentCart = currentCartRaw ? JSON.parse(currentCartRaw) : [];
    oldItems.forEach((oldItem) => {
      const existing = currentCart.find((item) => item.id === oldItem.id);
      if (existing) {
        existing.qty += oldItem.qty;
      } else {
        currentCart.push({ id: oldItem.id, qty: oldItem.qty });
      }
    });
    localStorage.setItem("crispyCart", JSON.stringify(currentCart));
    alert("เพิ่มรายการอาหารเข้าตะกร้าแล้ว!");
    window.dispatchEvent(new Event("storage"));
  };

  const handleCancelOrder = (id) => {
    if (
      window.confirm(
        "คุณแน่ใจหรือไม่ว่าต้องการยกเลิกออเดอร์นี้? (Are you sure?)",
      )
    ) {
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

        {/* Contact & Support Section (Minimal & Approachable) */}
        {/* ใช้สีขาว ขอบเทาอ่อน เพื่อลดการแย่งซีน แต่ยังเข้าถึงง่ายถอดแบบจิตวิทยาการออกแบบ */}
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

        {/* 1. ส่วนบน: ON GOING ORDERS (ชิ้นนี้ยังคงความ Brutalist เด่นสุด) */}
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
                          .map((i) => `${i.name} (x${i.qty})`)
                          .join(", ")}
                      </p>
                      <div className="mt-2 font-black text-lg">
                        Total:{" "}
                        <span className="text-[#242424]">฿{order.total}</span>
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

        {/* 2. ส่วนล่าง: ALL PAST HISTORY */}
        <section>
          <h2 className="text-2xl font-black mb-4 flex items-center gap-2 text-[#242424]">
            <History size={20} /> PAST ORDERS ({pastOrders.length})
          </h2>

          <div className="flex flex-col gap-3">
            {pastOrders.map((order) => (
              // ลดทอนความหนักของเส้นขอบลง ให้เหลือแค่ border-gray-200 เพื่อลด Visual Noise
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-gray-300 hover:shadow-sm transition-all group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-black text-[#242424]">
                      {order.id}
                    </span>
                    <span className="text-xs text-gray-400">{order.date}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${order.status === "cancelled" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* แสดงรายการอาหารแบบย่อ */}
                  <p className="text-xs text-gray-500 font-medium truncate max-w-xs md:max-w-md">
                    {order.items.map((i) => `${i.name} x${i.qty}`).join(", ")}
                  </p>

                  <div className="flex items-center gap-4 mt-2">
                    <div className="text-sm font-bold text-[#242424]">
                      ฿{order.total}
                    </div>
                    {/* เปลี่ยนปุ่ม Details เป็น Text Link เล็กๆ (Progressive Disclosure) */}
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
                  {/* ปุ่ม Re-order ปรับให้คลีนขึ้น ไม่สู้กับปุ่ม On Going */}
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
      </div>

      {/* ======================= MODALS ======================= */}
      {selectedOrder?.type === "pickup" && (
        <PickupConfirmation
          isOpen={true}
          onClose={() => setSelectedOrder(null)}
          orderNo={selectedOrder.id}
          menuList={selectedOrder.items.map((i) => `${i.name} (x${i.qty})`)}
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
          menuList={selectedOrder.items.map((i) => `${i.name} (x${i.qty})`)}
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
          menuList={selectedOrder.items.map((i) => `${i.name} (x${i.qty})`)}
          status={selectedOrder.status}
        />
      )}
    </div>
  );
}
