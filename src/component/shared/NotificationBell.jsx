import React, { useState } from "react";
// 💡 1. เพิ่ม CheckCircle2 เข้ามาใน Import แล้วครับ
import {
  Bell,
  Check,
  X,
  Clock,
  Bike,
  CalendarDays,
  ShoppingBag,
  FileImage,
  Search,
  Wallet,
  QrCode,
  CheckCircle2,
} from "lucide-react";
import OrderDetailModal from "../cashier/OrderDetailModal";
import DeclineModal from "../cashier/DeclineModal";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [declineOrderId, setDeclineOrderId] = useState(null);

  const [verifiedSlips, setVerifiedSlips] = useState([]);

  const [orders, setOrders] = useState([
    {
      orderId: "DEL-1045",
      type: "DELIVERY",
      status: "NEW",
      time: "12:45",
      paymentMethod: "QR",
      details: "เซ็ตไก่ทอด L + โค้ก",
      icon: Bike,
      totalAmount: 348,
      items: [
        { name: "Serious Fried Chicken Set (L)", qty: 1, price: 299 },
        { name: "Coke (Refill)", qty: 1, price: 49 },
      ],
      raw: { slipAttached: true, address: "คอนโด A ชั้น 5" },
    },
    {
      orderId: "RES-0092",
      type: "RESERVATION",
      status: "NEW",
      time: "13:30",
      paymentMethod: "NONE",
      details: "จองโต๊ะ 4 ท่าน (K. Anan)",
      icon: CalendarDays,
      totalAmount: 0,
      items: [],
      raw: { time: "13:30", pax: "4" },
    },
    {
      orderId: "PICK-088",
      type: "PICK-UP",
      status: "NEW",
      time: "14:00",
      paymentMethod: "QR",
      details: "ไก่ป๊อปไซส์ M",
      icon: ShoppingBag,
      totalAmount: 89,
      items: [{ name: "Chicken Pop (M)", qty: 1, price: 89 }],
      raw: { pickupTime: "14:00", slipAttached: true },
    },
  ]);

  const handleAction = (orderId, action) => {
    if (action === "Accept" || action === "Acknowledge") {
      setOrders((prev) => prev.filter((order) => order.orderId !== orderId));
    } else if (action === "Decline") {
      setDeclineOrderId(orderId);
    }
  };

  const submitDecline = (orderId, reason) => {
    // 💡 2. ใช้งานตัวแปร reason แล้ว (ใส่ console.log ไว้จำลองการยิง API)
    console.log(`[API] ยกเลิกออเดอร์ ${orderId} ด้วยเหตุผล: ${reason}`);
    setOrders((prev) => prev.filter((order) => order.orderId !== orderId));
    setDeclineOrderId(null);
  };

  return (
    // 💡 3. แก้ไขคลาส Tailwind ตามที่ Linter แนะนำ (z-110)
    <div className="relative font-['IBM_Plex_Sans_Thai'] z-110">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-white rounded-xl shadow-sm border-2 border-gray-100 hover:bg-red-50 hover:border-red-100 active:scale-95 cursor-pointer transition-all duration-200 group"
      >
        <Bell
          size={24}
          className="text-[#242424] group-hover:text-[#e4002b] transition-colors"
        />
        {orders.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#e4002b] border-2 border-white text-[0.7rem] font-bold text-white shadow-sm animate-bounce">
            {orders.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden origin-top-right animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 bg-[#242424] text-white flex justify-between items-center border-b-4 border-[#e4002b]">
            <span className="font-bold tracking-wide">
              NEW NOTIFICATIONS ({orders.length})
            </span>
          </div>

          {/* 💡 3. แก้ไขคลาส Tailwind ตามที่ Linter แนะนำ (max-h-104) */}
          <div className="max-h-104 overflow-y-auto p-3 bg-gray-50 custom-scrollbar">
            {orders.length === 0 ? (
              <div className="text-center text-gray-400 py-10 flex flex-col items-center gap-2">
                <Check size={32} className="text-gray-300" />
                <span className="font-bold">ไม่มีรายการค้างคาครับ!</span>
              </div>
            ) : (
              orders.map((order) => {
                const needsVerification =
                  order.raw?.slipAttached &&
                  !verifiedSlips.includes(order.orderId);

                return (
                  <div
                    key={order.orderId}
                    className="p-3.5 bg-white border border-gray-100 shadow-sm rounded-xl mb-3 last:mb-0 hover:border-gray-300 transition-all flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1.5 items-start">
                        <div className="flex items-center gap-1.5 text-[0.65rem] font-bold text-[#e4002b] bg-red-50 px-2 py-1 rounded w-fit border border-red-100 uppercase tracking-wider">
                          <order.icon size={12} strokeWidth={2.5} />{" "}
                          {order.type}
                        </div>
                        <p className="font-['Bebas_Neue'] text-[#242424] text-2xl leading-none mt-0.5">
                          {order.orderId}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[0.65rem] font-bold text-gray-500 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                          <Clock size={10} /> {order.time}
                        </span>

                        <div className="flex gap-1.5">
                          {order.paymentMethod === "CASH" && (
                            <span className="flex items-center gap-1 text-[0.6rem] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                              <Wallet size={10} /> CASH
                            </span>
                          )}
                          {order.paymentMethod === "QR" && (
                            <span className="flex items-center gap-1 text-[0.6rem] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                              <QrCode size={10} /> QR ORDER
                            </span>
                          )}

                          {order.raw?.slipAttached && (
                            <span
                              className={`flex items-center gap-1 text-[0.6rem] font-bold px-2 py-0.5 rounded border transition-colors
                              ${needsVerification ? "text-[#0284c7] bg-[#e0f2fe] border-[#bae6fd] animate-pulse" : "text-[#166534] bg-[#dcfce3] border-[#bbf7d0]"}`}
                            >
                              {needsVerification ? (
                                <>
                                  <FileImage size={10} /> VERIFY SLIP
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 size={10} /> SLIP VERIFIED
                                </>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 font-medium line-clamp-1 border-b border-dashed border-gray-100 pb-2">
                      {order.details}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex-1 bg-white border-2 border-gray-200 text-gray-600 py-2 rounded-lg text-xs font-bold hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Search size={14} strokeWidth={2.5} /> View
                      </button>

                      {order.type === "RESERVATION" ? (
                        <button
                          onClick={() =>
                            handleAction(order.orderId, "Acknowledge")
                          }
                          className="flex-[2.2] bg-gray-100 text-gray-700 hover:bg-[#242424] hover:text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer border border-transparent"
                        >
                          <Check size={14} strokeWidth={2.5} /> ACKNOWLEDGE
                        </button>
                      ) : (
                        <>
                          <button
                            disabled={needsVerification}
                            onClick={() =>
                              handleAction(order.orderId, "Accept")
                            }
                            className={`flex-[1.2] py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200
                              ${
                                needsVerification
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200"
                                  : "bg-[#242424] text-white hover:bg-[#e4002b] active:scale-95 shadow-[0_3px_0_#000000] hover:shadow-[0_3px_0_#a0001e] active:shadow-none active:translate-y-0.75 cursor-pointer"
                              }
                            `}
                          >
                            <Check size={16} strokeWidth={3} /> ACCEPT
                          </button>

                          <button
                            onClick={() =>
                              handleAction(order.orderId, "Decline")
                            }
                            className="px-3 py-2 bg-white border-2 border-gray-200 text-gray-400 rounded-lg text-xs font-bold hover:bg-red-50 hover:border-red-200 hover:text-[#e4002b] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                          >
                            <X size={16} strokeWidth={3} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      <OrderDetailModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        isFromBell={true}
        isSlipVerified={verifiedSlips.includes(selectedOrder?.orderId)}
        onConfirmPayment={(orderId) => {
          setVerifiedSlips((prev) => [...prev, orderId]);
        }}
      />

      <DeclineModal
        isOpen={!!declineOrderId}
        onClose={() => setDeclineOrderId(null)}
        orderId={declineOrderId}
        onConfirm={submitDecline}
      />
    </div>
  );
};

export default NotificationBell;
