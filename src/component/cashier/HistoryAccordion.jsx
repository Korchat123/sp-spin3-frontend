// การ์ดออเดอร์แต่ละใบที่พับเก็บได้ (Dropdown)
// ข้างในโชว์รายการอาหารและปุ่ม Reprint

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Printer } from "lucide-react";

const HistoryAccordion = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`bg-white border-[3px] rounded-lg transition-all mb-3 ${
        isOpen
          ? "border-[#242424] shadow-[0_4px_0_rgba(0,0,0,0.1)]"
          : "border-[#cccccc] hover:border-[#888888]"
      }`}
    >
      {/* Header (ส่วนที่โชว์ตลอดเวลา) */}
      <div
        className="flex flex-wrap md:flex-nowrap items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center w-full">
          <span className="font-['Bebas_Neue'] text-3xl text-[#242424] leading-none">
            {order.orderId}
          </span>
          <span className="font-bold text-[#242424] text-sm">{order.type}</span>
          <span className="text-[#888888] text-sm">
            Staff:{" "}
            <span className="text-[#242424] font-medium">{order.staff}</span>
          </span>
          <span className="text-[#888888] text-sm">
            Time:{" "}
            <span className="text-[#242424] font-medium">{order.time}</span>
          </span>
        </div>
        <div className="flex items-center gap-4 mt-2 md:mt-0 pl-4 border-l-2 border-[#eeeeee]">
          <span className="font-bold text-lg text-[#242424]">
            ฿{order.totalAmount.toLocaleString()}
          </span>
          {isOpen ? (
            <ChevronUp size={24} className="text-[#888888]" />
          ) : (
            <ChevronDown size={24} className="text-[#888888]" />
          )}
        </div>
      </div>

      {/* Body (ส่วนที่ซ่อนอยู่ กางออกเมื่อกด) */}
      {isOpen && (
        <div className="p-4 border-t-[3px] border-[#eeeeee] bg-[#fafafa] rounded-b-lg flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h4 className="text-xs font-bold text-[#888888] uppercase mb-3 tracking-wider">
              Order Items
            </h4>
            <ul className="flex flex-col gap-2">
              {order.items.map((item, index) => (
                <li key={index} className="flex justify-between text-sm">
                  <span className="text-[#242424]">
                    <span className="font-bold mr-2 text-[#888888]">
                      {item.qty}x
                    </span>
                    {item.name}
                  </span>
                  <span className="font-medium text-[#888888]">
                    ฿{item.price * item.qty}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-end border-t-2 border-[#eeeeee] md:border-t-0 md:border-l-2 pt-4 md:pt-0 md:pl-6 min-w-[150px]">
            <button className="flex items-center justify-center gap-2 w-full p-2 border-2 border-[#242424] rounded text-[#242424] hover:bg-[#242424] hover:text-white transition-colors font-bold text-sm">
              <Printer size={16} />
              REPRINT BILL
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryAccordion;
