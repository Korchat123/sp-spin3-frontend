// src/component/customer/PickupConfirmation.jsx
import React from "react";

const PickupConfirmation = ({
  isOpen,
  onClose,
  orderNo = "",
  menuList = [],
  cancelledItems = [],
  refundAmount = 0,
  totalPrice = "0.00",
  deliveryTime = "",
  status = "pending", // 1. รับ status เพิ่มเข้ามา
}) => {
  if (!isOpen) return null;

  // 2. เช็คว่าเป็นออเดอร์เก่าที่จบไปแล้วหรือยัง (ถ้าจบแล้วให้ใช้สีเทา/ดำ ถ้ายังไม่เสร็จให้ใช้สีแดง)
  const isPastOrder = ["delivered", "picked_up", "cancelled"].includes(status);
  const themeColor = isPastOrder ? "border-[#444444]" : "border-[#e4002b]";

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-1000"
      onClick={onClose}
    >
      <div
        className={`bg-[#242424] w-full max-w-105 p-8 md:p-10 rounded-lg text-white border-t-10 ${themeColor} transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-['Bebas_Neue'] text-3xl mb-6 text-center uppercase tracking-wider">
          THANK YOU FOR YOUR ORDER!
        </h2>
        
        <h2 className="font-['Bebas_Neue'] text-4xl mb-6 text-center uppercase tracking-wider">
          {isPastOrder ? "Store Pick-up Receipt" : "Pick-up Confirmation"}
        </h2>

        <div className="space-y-4 mb-8">
          <div className="flex flex-col">
            <span className="text-[#888888] text-sm uppercase font-bold">
              - Order no :
            </span>
            <span className="pl-4 text-white font-mono">
              {orderNo || "N/A"}
            </span>
          </div>

          {/* 3. เพิ่มการแสดงผล Status ในใบเสร็จไปเลยชัดๆ */}
          <div className="flex flex-col">
            <span className="text-[#888888] text-sm uppercase font-bold">
              - Order Status :
            </span>
            <span
              className={`pl-4 font-bold uppercase ${status === "cancelled" ? "text-red-500" : "text-green-400"}`}
            >
              {status}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[#888888] text-sm uppercase font-bold">
              - List Menu :
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
                <span className="text-white text-sm">No items</span>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[#888888] text-sm uppercase font-bold">
              - Total Price :
            </span>
            <span className="pl-4 text-white text-lg font-bold">
              ฿{totalPrice}
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
              - Pick-up time :
            </span>
            <span className="pl-4 text-white">{deliveryTime || "N/A"}</span>
          </div>
        </div>

        {!isPastOrder && (
          <p className="text-[#e4002b] text-[15px] text-center mb-6 leading-relaxed">
            *เพื่อความอร่อยของอาหาร
            <br />
            กรุณามารับสินค้าไม่เกิน 30 นาทีจากเวลานัดหมาย
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

export default PickupConfirmation;
