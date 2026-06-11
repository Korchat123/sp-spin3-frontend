// src/component/customer/ReserveConfirmation.jsx
import React from "react";

const ReserveConfirmation = ({
  isOpen,
  onClose,
  tableNo = "",
  detail = "",
  person = "",
  date = "",
  time = "",
  menuList = [],
  cancelledItems = [],
  refundAmount = 0,
  comment = "",
  status = "pending", // ✅ 1. รับค่า status เพิ่มเข้ามา
}) => {
  if (!isOpen) return null;

  // ✅ 2. เช็คสถานะเพื่อปรับธีมสี (ถ้าคอนเฟิร์มเสร็จแล้ว หรือยกเลิกไปแล้ว ให้ใช้ธีมมินิมอลสีเทา/ดำ)
  const isPastOrClosed = ["confirmed", "cancelled"].includes(status);
  const themeColor = isPastOrClosed ? "border-[#444444]" : "border-[#e4002b]";

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-1000 p-4"
      onClick={onClose}
    >
      <div
        className={`bg-[#242424] w-full max-w-105 max-h-[calc(100dvh-2rem)] overflow-y-auto p-6 md:p-10 rounded-lg text-white border-t-10 ${themeColor} transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-['Bebas_Neue'] text-3xl mb-6 text-center uppercase tracking-wider">
          THANK YOU FOR YOUR ORDER!
        </h2>

        <h2 className="font-['Bebas_Neue'] text-2xl mb-6 text-center uppercase tracking-wider">
          {isPastOrClosed ? "Reservation Receipt" : "Reserve Confirmation"}
        </h2>

        <div className="space-y-4 mb-8">
          <div className="flex flex-col">
            <span className="text-[#888888] text-sm uppercase font-bold">
              - Booking ID :
            </span>
            <span className="pl-4 text-white font-mono">
              {tableNo || "N/A"}
            </span>
          </div>

          {/* ✅ 3. แสดงสถานะการจองโต๊ะในใบตั๋วไปเลยชัดๆ */}
          <div className="flex flex-col">
            <span className="text-[#888888] text-sm uppercase font-bold">
              - Booking Status :
            </span>
            <span
              className={`pl-4 font-bold uppercase ${
                status === "cancelled"
                  ? "text-red-500"
                  : status === "confirmed"
                    ? "text-green-400"
                    : "text-yellow-400 animate-pulse"
              }`}
            >
              {status}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[#888888] text-sm uppercase font-bold">
              - List Menu (Pre-ordered) :
            </span>
            <div className="pl-4 mt-1">
              {menuList.length > 0 ? (
                <ul className="list-disc list-inside text-sm">
                  {menuList.map((item, index) => (
                    <li key={index} className="text-white">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-white text-sm">No food pre-ordered</span>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[#888888] text-sm uppercase font-bold">
              - Details :
            </span>
            <span className="pl-4 text-white text-lg font-bold">
              {detail || "SFC Standard Table"}
            </span>
          </div>

          {cancelledItems.length > 0 && (
            <div className="flex flex-col rounded-lg border border-red-500/40 bg-red-500/10 p-3">
              <span className="text-red-300 text-sm uppercase font-bold">
                - Cancelled / Refund :
              </span>
              <ul className="pl-4 mt-1 list-disc list-inside text-sm text-red-100">
                {cancelledItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <span className="pl-4 mt-2 text-red-200 text-sm font-bold">
                Refund ฿{Number(refundAmount || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}. Please contact staff or wait for payment return.
              </span>
            </div>
          )}

          <div className="flex flex-col">
            <span className="text-[#888888] text-sm uppercase font-bold">
              - Person :
            </span>
            <span className="pl-4 text-white">{person || "N/A"} People</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[#888888] text-sm uppercase font-bold">
              - Date :
            </span>
            <span className="pl-4 text-white">{date || "N/A"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[#888888] text-sm uppercase font-bold">
              - Time :
            </span>
            <span className="pl-4 text-white">{time || "N/A"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[#888888] text-sm uppercase font-bold">
              - Comment :
            </span>
            <p className="pl-4 text-white text-sm italic">
              {comment || "No comment"}
            </p>
          </div>
        </div>

        {status === "pending" && (
          <p className="text-[#e4002b] text-[15px] text-center mb-6 leading-relaxed">
            *โปรดแสดงตั๋วจองเมื่อมาถึงร้าน
            <br />
            และควรมาถึงร้านก่อนเวลา 10 นาทีครับ
          </p>
        )}

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-10 py-3 border-2 border-[#555] text-[#888] font-bold text-sm uppercase rounded hover:bg-[#333] hover:text-white transition-colors cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReserveConfirmation;
