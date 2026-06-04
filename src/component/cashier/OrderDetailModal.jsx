// src/component/cashier/OrderDetailModal.jsx
import React from "react";
import {
  X,
  Pencil,
  CheckCircle2,
  CreditCard,
  Image as ImageIcon,
  Check,
  Printer,
} from "lucide-react";

const OrderDetailModal = ({
  isOpen,
  onClose,
  order,
  onPrintBill,
  onEditOrder,
  onMarkAsCompleted,
  isHistoryMode = false, // เพิ่ม Prop isHistoryMode (ตั้งค่าเริ่มต้นเป็น false)
}) => {
  if (!isOpen || !order) return null;

  const isPaid = order.status === "PAID";
  const hasSlipWaiting = order.status === "PENDING" && order.raw?.slipAttached;

  // เช็กว่าเป็นออเดอร์ที่ถูกยกเลิกหรือไม่
  const isCancelled =
    order.status === "cancelled" || order.raw?.status === "cancelled";

  // Mock data สำรองไว้กรณีไม่ได้ส่งข้อมูลรายการอาหารมา
  const mockItems = [
    {
      id: 1,
      name: "Serious Fried Chicken Set (L)",
      qty: 1,
      price: 299,
      note: "เผ็ดมาก ไม่เอาปีก",
    },
    { id: 2, name: "French Fries", qty: 2, price: 79, note: "" },
    { id: 3, name: "Coke (Refill)", qty: 2, price: 49, note: "" },
  ];

  // ใช้รายการอาหารจริงจาก order.items ก่อน ถ้าไม่มีค่อยใช้ mockItems
  const displayItems =
    order.items && order.items.length > 0 ? order.items : mockItems;

  const getContextInfo = () => {
    switch (order.type) {
      case "RESERVATION":
        return {
          label: "Time & Pax",
          value: `Time: ${order.raw?.time || "18:00"} | Pax: ${order.raw?.pax || "4"} Pax`,
        };
      case "DELIVERY":
        return {
          label: "Address",
          value: order.raw?.address || "Waiting for Rider",
        };
      case "PICK-UP":
        return { label: "Pickup Time", value: order.raw?.pickupTime || "ASAP" };
      default:
        return { label: "Table", value: order.table || "Walk-in" };
    }
  };

  const contextData = getContextInfo();

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-1000 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-125 max-h-[90vh] flex flex-col rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-[slideUp_0.2s_ease-out] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ลายน้ำ CANCELLED จะแสดงทับด้านหลังเนื้อหาเฉพาะตอนที่โดนยกเลิก */}
        {isCancelled && (
          <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
            <span className="text-6xl md:text-8xl font-['Bebas_Neue'] text-red-500/10 -rotate-45 tracking-widest border-8 border-red-500/10 p-6 rounded-3xl select-none">
              CANCELLED
            </span>
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-[#242424] transition-colors bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full z-20"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="p-8 pb-6 border-b border-gray-100 relative z-10">
          <div className="flex gap-2 mb-3">
            <span className="bg-[#e4002b] text-white px-2.5 py-0.5 text-[0.65rem] font-bold uppercase rounded tracking-wider">
              {order.type}
            </span>
            <span
              className={`px-2.5 py-0.5 text-[0.65rem] font-bold uppercase rounded tracking-wider ${
                isCancelled
                  ? "bg-gray-200 text-gray-600"
                  : isPaid || order.status === "completed"
                    ? "bg-[#28a745]/10 text-[#28a745]"
                    : "bg-[#facc15]/20 text-[#d97706]"
              }`}
            >
              {isCancelled ? "CANCELLED" : order.status}
            </span>
          </div>
          <h2
            className={`font-['Bebas_Neue'] text-5xl tracking-wide leading-none mb-4 ${isCancelled ? "text-gray-400 line-through" : "text-[#242424]"}`}
          >
            {order.orderId}
          </h2>

          <div className="bg-gray-50/80 backdrop-blur p-4 rounded-xl border border-gray-200">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
              {contextData.label}
            </p>
            <p className="text-[#242424] font-medium">{contextData.value}</p>
            <div className="h-px w-full bg-gray-200 my-3"></div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
              Customer
            </p>
            <p className="text-[#242424] font-medium">
              {order.raw?.customer?.name || order.customer || "Customer"}{" "}
              {order.raw?.customer?.phone && `(${order.raw.customer.phone})`}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 py-2 custom-scrollbar relative z-10">
          <div className="flex flex-col gap-5 my-4">
            {displayItems.map((item, index) => (
              <div
                key={item.id || index}
                className="flex justify-between items-start"
              >
                <div className="flex gap-4">
                  <span
                    className={`font-bold w-4 ${isCancelled ? "text-gray-400" : "text-[#e4002b]"}`}
                  >
                    {item.qty}x
                  </span>
                  <div>
                    <p
                      className={`font-bold text-base leading-tight ${isCancelled ? "text-gray-500" : "text-[#242424]"}`}
                    >
                      {item.name}
                    </p>
                    {item.note && (
                      <p className="text-sm text-gray-500 mt-0.5">
                        Note: {item.note}
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={`font-bold tracking-wide ${isCancelled ? "text-gray-400" : "text-[#242424]"}`}
                >
                  ฿{(item.price * item.qty).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {!isHistoryMode && hasSlipWaiting && (
            <div className="mt-8 border border-gray-200 rounded-xl p-4 bg-gray-50">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">
                Attached Payment Slip
              </p>
              <div className="w-full h-48 bg-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-300 transition-colors">
                <ImageIcon size={32} className="mb-2" />
                <span className="text-sm font-medium text-[#242424]">
                  slip_transfer_{order.orderId}.jpg
                </span>
                <span className="text-xs mt-1">Click to view full size</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 pt-6 border-t border-gray-100 bg-gray-50 relative z-10">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500 font-bold uppercase tracking-widest text-sm">
              Total Amount
            </span>
            <span
              className={`font-['Bebas_Neue'] text-4xl ${isCancelled ? "text-gray-400" : "text-[#e4002b]"}`}
            >
              ฿{order.totalAmount?.toLocaleString() || "0"}
            </span>
          </div>

          {/* 💡 เงื่อนไขการแสดงปุ่ม: ถ้าเป็นโหมด History ให้แสดงแค่ Reprint หรือปุ่มปิด */}
          {isHistoryMode ? (
            <div className="flex gap-3">
              {isCancelled ? (
                <button
                  onClick={onClose}
                  className="w-full bg-gray-200 text-gray-500 p-4 font-bold text-sm uppercase rounded-xl hover:bg-gray-300 transition-all flex items-center justify-center"
                >
                  Close
                </button>
              ) : (
                <button
                  onClick={() => alert("Printing Bill...")}
                  className="w-full bg-[#242424] text-white p-4 font-bold text-sm uppercase rounded-xl hover:bg-[#333333] transition-all flex items-center justify-center gap-2 shadow-[0_4px_0_#000000] active:shadow-none active:translate-y-1"
                >
                  <Printer size={18} /> Reprint Bill
                </button>
              )}
            </div>
          ) : /* 💡 เงื่อนไขเดิมสำหรับหน้า OrderList */
          !isPaid ? (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onClose();
                  if (onEditOrder) onEditOrder(order.orderId);
                }}
                className="flex-1 bg-white text-[#242424] p-4 font-bold text-sm uppercase rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 border-2 border-gray-200"
              >
                <Pencil size={18} /> Edit
              </button>

              {hasSlipWaiting ? (
                <button
                  onClick={() => {
                    onClose();
                    if (onMarkAsCompleted) onMarkAsCompleted(order.orderId);
                  }}
                  className="flex-[1.5] bg-[#0284c7] text-white p-4 font-bold text-sm uppercase rounded-xl hover:bg-[#0369a1] transition-all flex items-center justify-center gap-2 shadow-[0_4px_0_#005c8a] active:shadow-none active:translate-y-1"
                >
                  <Check size={18} /> Confirm Payment
                </button>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    if (onPrintBill)
                      onPrintBill(order.backendId || order.orderId);
                  }}
                  className="flex-1 bg-[#242424] text-white p-4 font-bold text-sm uppercase rounded-xl hover:bg-[#333333] transition-all flex items-center justify-center gap-2 shadow-[0_4px_0_#000000] active:shadow-none active:translate-y-1"
                >
                  <CreditCard size={18} /> Checkout
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                if (onMarkAsCompleted) onMarkAsCompleted(order.orderId);
              }}
              className="w-full bg-[#28a745] text-white p-4 font-bold text-sm uppercase rounded-xl hover:bg-[#218838] transition-all flex items-center justify-center gap-2 shadow-[0_4px_0_#1e7e34] active:shadow-none active:translate-y-1"
            >
              <CheckCircle2 size={18} /> Complete Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
