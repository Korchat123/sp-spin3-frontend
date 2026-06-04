import React, { useState, useEffect } from "react";
import {
  X,
  PlusCircle,
  Receipt,
  CreditCard,
  Trash2,
  CheckCircle2,
  CalendarPlus,
  UserCheck,
  XCircle,
  Link as LinkIcon,
  ChevronLeft,
} from "lucide-react";

export default function TableActionModal({ isOpen, onClose, table, onAction }) {
  const [reserveStep, setReserveStep] = useState("HOME");
  const [selectedResId, setSelectedResId] = useState("");

  useEffect(() => {
    if (isOpen) {
      setReserveStep("HOME");
      setSelectedResId("");
    }
  }, [isOpen]);

  if (!isOpen || !table) return null;

  const isFree = table.status === "FREE";
  const isOccupied = table.status === "OCCUPIED";
  const isReserved = table.status === "RESERVED";

  // Mock Data: รายการจองออนไลน์
  const pendingReservations = [
    { id: "RES-0092", name: "คุณสมชาย", pax: 4, time: "13:30" },
    { id: "RES-0105", name: "คุณแอน", pax: 2, time: "18:00" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-9999 p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-[slideUp_0.15s_ease-out]">
        <div
          className={`p-6 text-center relative border-b-4 ${
            isFree
              ? "bg-[#242424] border-[#e4002b]"
              : isReserved
                ? "bg-[#fafafa] border-gray-200"
                : "bg-[#242424] border-gray-600"
          }`}
        >
          {reserveStep === "RESERVE_OPTIONS" ? (
            <button
              onClick={() => setReserveStep("HOME")}
              className="absolute top-4 left-4 text-[#242424]/50 hover:text-[#242424] transition-colors cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>
          ) : null}

          <button
            onClick={onClose}
            className={`absolute top-4 right-4 transition-colors cursor-pointer ${isReserved ? "text-[#242424]/50 hover:text-[#242424]" : "text-white/50 hover:text-white"}`}
          >
            <X size={20} />
          </button>

          <h2
            className={`font-['Bebas_Neue'] text-5xl tracking-widest mt-2 ${isReserved ? "text-[#242424]" : "text-white"}`}
          >
            {table.id}
          </h2>

          <span
            className={`inline-block px-3 py-1 rounded text-xs font-bold mt-2 border-2 ${
              isFree
                ? "bg-white text-[#242424] border-transparent"
                : isReserved
                  ? "bg-yellow-400 text-[#242424] border-[#242424] shadow-[2px_2px_0_#242424] transform -rotate-2"
                  : "bg-[#e4002b] text-white border-transparent"
            }`}
          >
            {table.status}
          </span>
        </div>

        <div className="p-6 flex flex-col gap-3 bg-[#fafafa]">
          {isFree && reserveStep === "HOME" && (
            <>
              <button
                // 💡 เปลี่ยนมาใช้ onAction ส่งคำสั่ง NEW_ORDER แทน alert
                onClick={() => onAction(table.id, "NEW_ORDER")}
                className="w-full bg-[#242424] hover:bg-[#333] text-white font-bold py-4 rounded-xl uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <CheckCircle2 size={18} /> OPEN NEW ORDER
              </button>
              <button
                onClick={() => setReserveStep("RESERVE_OPTIONS")}
                className="w-full bg-white border-2 border-gray-200 hover:border-[#242424] text-gray-600 hover:text-[#242424] font-bold py-3.5 rounded-xl uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CalendarPlus size={18} /> RESERVE TABLE
              </button>
            </>
          )}

          {isFree && reserveStep === "RESERVE_OPTIONS" && (
            <div className="animate-[slideInRight_0.15s_ease-out]">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                ผูกโต๊ะกับรายการจองออนไลน์
              </h3>

              <select
                value={selectedResId}
                onChange={(e) => setSelectedResId(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm font-bold text-[#242424] bg-white outline-none focus:border-[#242424] mb-2 cursor-pointer"
              >
                <option value="">-- เลือกรหัสจอง (Order ID) --</option>
                {pendingReservations.map((res) => (
                  <option key={res.id} value={res.id}>
                    {res.id} - {res.name} ({res.pax} pax, {res.time})
                  </option>
                ))}
              </select>

              <button
                disabled={!selectedResId}
                onClick={() =>
                  onAction(table.id, "LINK_RESERVE", selectedResId)
                }
                className={`w-full font-bold py-3.5 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-2 mb-6 ${
                  selectedResId
                    ? "bg-[#242424] text-white active:scale-95 cursor-pointer shadow-md"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <LinkIcon size={18} /> LINK BOOKING
              </button>

              <div className="border-t border-dashed border-gray-300 pt-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  ล็อกโต๊ะเอง (Manual)
                </h3>
                <button
                  onClick={() => onAction(table.id, "MANUAL_RESERVE")}
                  className="w-full bg-white border-2 border-gray-200 hover:border-[#242424] text-gray-600 hover:text-[#242424] font-bold py-3.5 rounded-xl uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CalendarPlus size={18} /> STAFF RESERVE
                </button>
                <p className="text-[10px] text-gray-400 text-center mt-2 font-medium">
                  สำหรับลูกค้า 11+ PAX เป็นต้นไป
                </p>
              </div>
            </div>
          )}

          {isReserved && (
            <>
              <button
                onClick={() => onAction(table.id, "CHECK_IN")}
                className="w-full bg-[#242424] hover:bg-[#333] text-white font-bold py-4 rounded-xl uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <UserCheck size={18} /> CUSTOMER CHECK-IN
              </button>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `ต้องการยกเลิกการจองโต๊ะ ${table.id} ใช่หรือไม่? โต๊ะจะกลับไปเป็นสถานะว่าง`,
                    )
                  ) {
                    onAction(table.id, "CLEAR");
                  }
                }}
                className="w-full bg-white border-2 border-dashed border-gray-300 hover:border-[#e4002b] hover:bg-red-50 text-gray-500 hover:text-[#e4002b] font-bold py-3.5 rounded-xl uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <XCircle size={18} /> CANCEL RESERVATION
              </button>
            </>
          )}

          {isOccupied && (
            <div className="grid grid-cols-2 gap-3">
              <button
                // 💡 เปลี่ยนเป็นสั่ง ADD_ORDER
                onClick={() => onAction(table.id, "ADD_ORDER")}
                className="col-span-2 bg-[#242424] hover:bg-[#333] text-white font-bold py-3.5 rounded-xl uppercase transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <PlusCircle size={18} /> ADD ORDER
              </button>

              <button
                onClick={() => onAction(table.id, "VIEW_BILL")}
                className="bg-white hover:bg-gray-50 text-[#242424] border-2 border-gray-200 font-bold py-3 rounded-xl transition-all active:scale-95 flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <Receipt size={20} />{" "}
                <span className="text-[10px] uppercase tracking-wider">
                  VIEW BILL
                </span>
              </button>

              <button
                // 💡 เปลี่ยนเป็นสั่ง CHECKOUT
                onClick={() => onAction(table.id, "CHECKOUT")}
                className="bg-[#e4002b] hover:bg-[#c90025] text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-95 flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <CreditCard size={20} />{" "}
                <span className="text-[10px] uppercase tracking-wider">
                  CHECKOUT
                </span>
              </button>

              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `ยืนยันการเคลียร์โต๊ะ ${table.id} เพื่อรับลูกค้าใหม่?`,
                    )
                  ) {
                    onAction(table.id, "CLEAR");
                  }
                }}
                className="col-span-2 mt-2 bg-white border-2 border-dashed border-gray-300 hover:border-[#e4002b] hover:bg-red-50 text-gray-500 hover:text-[#e4002b] font-bold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Trash2 size={16} /> VOID / CLEAR TABLE
              </button>
            </div>
          )}

          {reserveStep === "HOME" && (
            <button
              onClick={onClose}
              className="w-full bg-transparent text-gray-400 font-bold py-2 rounded-xl uppercase text-xs hover:bg-gray-100 transition-colors mt-2 cursor-pointer"
            >
              CLOSE
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
