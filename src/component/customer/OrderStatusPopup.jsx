// src/component/customer/OrderStatusPopup.jsx
import { Clock, Bike, Store, XCircle } from "lucide-react";
import {
  getOrderNumber,
  getOrderSummaryText,
  getTrackerStatus,
} from "../../utils/customerOrders";

export default function OrderStatusPopup({
  isOpen,
  statusRef,
  orders,
  navigate,
  onClose,
}) {
  if (!isOpen) return null;

  const renderStatusTracker = (order) => {
    const isDelivery = order.type === "delivery";
    const currentStatus = getTrackerStatus(order.status);
    const steps = isDelivery
      ? ["pending", "cooking", "on_the_way", "delivered"]
      : ["pending", "cooking", "ready", "picked_up"];

    const stepLabels = isDelivery
      ? ["Pending", "Cooking", "On The Way", "Delivered"]
      : ["Pending", "Cooking", "Ready", "Picked Up"];

    if (currentStatus === "cancelled") {
      return (
        <div className="flex items-center gap-2 text-red-500 font-bold mt-3 bg-red-50 p-2 rounded-lg border border-red-200">
          <XCircle size={18} /> Order Cancelled
        </div>
      );
    }

    const currentStepIndex = Math.max(steps.indexOf(currentStatus), 0);

    return (
      <div className="mt-4 relative">
        {/* เส้นพื้นหลัง */}
        <div className="absolute top-3 left-0 w-full h-1 bg-gray-200 rounded-full z-0"></div>
        {/* เส้นความคืบหน้า */}
        <div
          className="absolute top-3 left-0 h-1 bg-[#e4002b] rounded-full z-0 transition-all duration-500"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        ></div>

        <div className="flex justify-between relative z-10">
          {steps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            return (
              <div key={step} className="flex flex-col items-center gap-1">
                {/* ✅ แก้ไขจุดนี้: เอาตัวเครื่องหมาย ✓ ออก และลบอนิเมชันกระพริบ/เงาออกทั้งหมด เหลือแค่วงกลมสีนิ่งๆ */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 text-[10px] transition-all ${
                    isCurrent
                      ? "bg-[#e4002b] border-[#e4002b] text-white scale-110"
                      : isCompleted
                        ? "bg-[#242424] border-[#242424] text-white"
                        : "bg-white border-gray-300"
                  }`}
                >
                  {/* จงใจปล่อยให้ว่างไว้ตามบรีฟเพื่อความมินิมอล ไม่สับสน */}
                </div>
                <span
                  className={`text-[9px] font-bold uppercase ${isCompleted ? "text-[#242424]" : "text-gray-400"}`}
                >
                  {stepLabels[index]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    // ✅ เอาเงาออกเรียบร้อย กรอบเหลี่ยม Brutalist คลีนๆ
    <div
      ref={statusRef}
      className="absolute right-0 mt-3 w-80 bg-white border-4 border-[#242424] rounded-xl flex flex-col font-['IBM_Plex_Sans_Thai'] overflow-hidden animate-in fade-in zoom-in duration-200 z-50"
    >
      <div className="bg-[#242424] text-white px-4 py-3 flex justify-between items-center">
        <h3 className="font-['Bebas_Neue'] text-xl tracking-widest flex items-center gap-2">
          <Clock size={18} className="text-[#e4002b]" /> ONGOING ORDERS
        </h3>
      </div>

      <div className="max-h-87.5 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50">
        {orders.length === 0 ? (
          <p className="text-center text-gray-400 font-bold text-sm py-4">
            No ongoing orders right now.
          </p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id || order.id}
              className="bg-white border-2 border-[#242424] p-4 rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-black text-gray-400 uppercase">
                    {getOrderNumber(order)}
                  </span>
                  <p className="font-bold text-[#242424] text-sm leading-tight mt-0.5 line-clamp-1">
                    {getOrderSummaryText(order)}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-[#eeeeee] px-2 py-1 rounded text-[10px] font-bold uppercase text-[#242424] border border-gray-300">
                  {order.type === "delivery" ? (
                    <Bike size={12} />
                  ) : (
                    <Store size={12} />
                  )}
                  {order.type}
                </div>
              </div>
              {renderStatusTracker(order)}
              <button
                onClick={() => {
                  onClose();
                  navigate("/order-tracking", {
                    state: { orderId: order._id || order.id, order },
                  });
                }}
                className="mt-3 w-full rounded-md border-2 border-[#242424] bg-white px-3 py-2 text-xs font-black uppercase text-[#242424] transition-colors hover:bg-[#242424] hover:text-white"
              >
                Track Order
              </button>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => {
          onClose();
          navigate("/order-history");
        }}
        className="bg-[#eeeeee] hover:bg-[#e4002b] hover:text-white text-[#242424] font-bold text-sm py-3 transition-colors border-t-2 border-[#242424] cursor-pointer"
      >
        VIEW ALL HISTORY
      </button>
    </div>
  );
}
