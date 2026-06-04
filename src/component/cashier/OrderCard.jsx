// src/component/cashier/OrderCard.jsx
import { Pencil, ArrowRight, CheckCircle2, FileImage } from "lucide-react";

const OrderCard = ({ order, onClick, onPrintBill, onEditOrder, onMarkAsCompleted }) => {
  const isPaid = order.status === "PAID";
  const hasSlipWaiting = order.status === "PENDING" && order.raw?.slipAttached;

  const getContextInfo = () => {
    switch (order.type) {
      case "RESERVATION":
        return `Time: ${order.raw?.time || "18:00"} | Pax: ${order.raw?.pax || "4"}`;
      case "DELIVERY":
        return `Address: ${order.raw?.address || order.raw?.customer?.note || "Waiting for Rider"}`;
      case "PICK-UP":
        return `Pickup Time: ${order.raw?.pickupTime || "ASAP"}`;
      default:
        return order.table ? `Table: ${order.table}` : "Walk-in";
    }
  };

  return (
    <div 
      onClick={() => onClick && onClick(order)}
      className="bg-white border-2 border-gray-200 rounded-xl p-4 flex flex-col gap-3 cursor-pointer transition-all hover:border-[#242424] hover:shadow-md group"
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-['Bebas_Neue'] text-3xl leading-none text-[#242424]">
              {order.orderId}
            </h3>
            <span
              className={`px-2 py-0.5 text-[0.65rem] font-bold uppercase rounded-md tracking-wider ${
                isPaid ? "bg-[#28a745]/10 text-[#28a745]" : "bg-[#facc15]/20 text-[#d97706]"
              }`}
            >
              {order.status}
            </span>
          </div>
          <p className="text-xs font-bold text-[#e4002b] uppercase tracking-wide">
            {order.type}
          </p>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="font-['Bebas_Neue'] text-2xl text-[#242424]">
            ฿{order.totalAmount?.toLocaleString()}
          </span>
          
          {hasSlipWaiting && (
            <span className="mt-1 flex items-center gap-1 text-[0.65rem] font-bold text-[#0284c7] bg-[#e0f2fe] px-1.5 py-0.5 rounded tracking-wide border border-[#bae6fd]">
              <FileImage size={10} strokeWidth={2.5} /> VERIFY SLIP
            </span>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-2.5 text-sm text-[#555555] font-medium border border-gray-100">
        {getContextInfo()}
      </div>

      <div className="flex items-center justify-end gap-2 mt-1">
        {!isPaid ? (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onEditOrder(order.orderId); }}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-[#242424] transition-colors"
              title="Edit Order"
            >
              <Pencil size={18} strokeWidth={2.5} />
            </button>
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                // 💡 ถ้ามีสลิปให้เปิด Modal / ถ้าไม่มีสลิปพาไปหน้าคิดเงิน (Checkout)
                if (hasSlipWaiting) {
                  onClick && onClick(order); 
                } else {
                  onPrintBill(order.backendId || order.orderId);
                }
              }}
              className={`flex items-center gap-1.5 text-white text-xs font-bold uppercase px-4 py-2 rounded-lg transition-colors ${
                hasSlipWaiting ? "bg-[#0284c7] hover:bg-[#0369a1]" : "bg-[#242424] hover:bg-[#333333]"
              }`}
            >
              {hasSlipWaiting ? "CHECK SLIP" : "CHECKOUT"} <ArrowRight size={14} />
            </button>
          </>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onMarkAsCompleted(order.orderId); }}
            className="flex items-center gap-1.5 bg-[#28a745] text-white text-xs font-bold uppercase px-4 py-2 rounded-lg hover:bg-[#218838] transition-colors w-full justify-center"
          >
            <CheckCircle2 size={16} /> COMPLETE (TO HISTORY)
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;