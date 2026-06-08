import React, { useState } from "react";
import { AlertOctagon, X, FileText } from "lucide-react";

const DeclineModal = ({ isOpen, onClose, onConfirm, orderId, order }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  if (!isOpen) return null;

  // Read the "Note for Staff" that the customer wrote — from note_global via toCashierOrder
  const noteForStaff = order?.raw?.noteForStaff || order?.noteForStaff || "";

  const reasons = [
    "วัตถุดิบหมด (Out of Stock)",
    "คิวเต็ม/ทำไม่ทัน (Too Busy)",
    "ร้านกำลังจะปิด (Closing Soon)",
    "สลิปมีปัญหา/ยอดไม่ตรง (Invalid Payment)",
  ];

  const handleConfirm = () => {
    const finalReason =
      selectedReason === "อื่นๆ" ? customReason : selectedReason;
    if (!finalReason) return alert("กรุณาระบุเหตุผล");

    onConfirm(orderId, finalReason);
    setSelectedReason("");
    setCustomReason("");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-120 p-4">
      <div className="bg-white w-full max-w-100 rounded-2xl shadow-2xl animate-[slideUp_0.2s_ease-out] overflow-hidden">
        {/* Header สีแดง High-contrast แจ้งเตือน */}
        <div className="bg-[#e4002b] p-5 flex items-start gap-4 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
          <div className="bg-white/20 p-2 rounded-full text-white">
            <AlertOctagon size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-white font-['Bebas_Neue'] text-3xl tracking-wide leading-none">
              DECLINE ORDER
            </h3>
            <p className="text-white/80 text-sm font-medium mt-1">
              ยกเลิกออเดอร์{" "}
              <span className="font-bold text-white">#{orderId}</span>
            </p>
          </div>
        </div>

        {/* Body เลือกเหตุผล */}
        <div className="p-6">
          {/* แสดง Note for Staff จากลูกค้า (note_global จาก DB) */}
          {noteForStaff && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-start gap-2">
              <FileText size={16} className="text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-black text-yellow-700 uppercase tracking-wider mb-0.5">Note from Customer</p>
                <p className="text-sm font-medium text-yellow-900 italic leading-relaxed">"{noteForStaff}"</p>
              </div>
            </div>
          )}
          <p className="text-[#242424] font-bold text-sm mb-3">
            โปรดระบุเหตุผลในการยกเลิก:
          </p>
          <div className="flex flex-col gap-2 mb-4">
            {reasons.map((reason) => (
              <button
                key={reason}
                onClick={() => setSelectedReason(reason)}
                className={`p-3 text-sm font-bold rounded-lg border-2 text-left transition-all ${
                  selectedReason === reason
                    ? "border-[#242424] bg-[#242424] text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {reason}
              </button>
            ))}

            {/* ตัวเลือก อื่นๆ */}
            <button
              onClick={() => setSelectedReason("อื่นๆ")}
              className={`p-3 text-sm font-bold rounded-lg border-2 text-left transition-all ${
                selectedReason === "อื่นๆ"
                  ? "border-[#242424] bg-[#242424] text-white"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              อื่นๆ (โปรดระบุ)
            </button>
          </div>

          {/* ช่องพิมพ์เหตุผลเพิ่มเติม จะโชว์เมื่อเลือก "อื่นๆ" */}
          {selectedReason === "อื่นๆ" && (
            <textarea
              autoFocus
              placeholder="พิมพ์เหตุผลที่นี่..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#242424] focus:outline-none resize-none h-24 mb-4"
            />
          )}

          {/* ปุ่ม Confirm */}
          <button
            onClick={handleConfirm}
            className="w-full bg-[#242424] text-white py-3.5 rounded-xl font-bold uppercase tracking-wider hover:bg-[#e4002b] active:scale-95 shadow-[0_4px_0_#000000] hover:shadow-[0_4px_0_#a0001e] active:shadow-none active:translate-y-1 transition-all"
          >
            Confirm Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeclineModal;
