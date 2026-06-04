import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Printer,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react";

const HistoryAccordion = ({ order, onViewDetails }) => {
  const [isOpen, setIsOpen] = useState(false);

  // 💡 ปรับปรุงเช็คสถานะแบบ Case-insensitive เพื่อกันกรณีระบบเก็บแบบตัวพิมพ์ใหญ่
  const isCancelled = order.status?.toLowerCase() === "cancelled";

  // 💡 ป้องกัน array เป็น undefined เพื่อไม่ให้แอป crash
  const items = order.items || [];
  const previewItems = items.slice(0, 2);
  const remainingCount = items.length - 2;

  return (
    <div
      className={`bg-white border-[3px] rounded-lg transition-all mb-3 overflow-hidden ${
        isOpen
          ? "border-[#242424] shadow-md"
          : "border-[#cccccc] hover:border-[#888888]"
      } ${isCancelled ? "opacity-70 grayscale-30" : ""}`}
    >
      <div
        className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 cursor-pointer gap-4 md:gap-0"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 flex flex-wrap items-center gap-x-6 gap-y-2 w-full">
          <div className="flex items-center gap-2 min-w-30">
            <span
              className={`font-['Bebas_Neue'] text-3xl leading-none ${isCancelled ? "text-[#888888] line-through" : "text-[#242424]"}`}
            >
              {order.orderId}
            </span>
          </div>
          <span className="font-bold text-[#e4002b] bg-red-50 border border-red-100 px-2 py-0.5 rounded text-[0.65rem] tracking-wider uppercase">
            {order.type}
          </span>
          <span className="text-[#888888] text-sm">
            Customer:{" "}
            <span className="text-[#242424] font-bold">{order.customer}</span>
          </span>
          <span className="text-[#888888] text-sm flex items-center gap-1">
            Time:{" "}
            <span className="text-[#242424] font-medium bg-gray-100 px-1.5 py-0.5 rounded">
              {order.time}
            </span>
          </span>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto mt-2 md:mt-0 md:pl-4 md:border-l-2 border-[#eeeeee]">
          <div className="flex items-center gap-2">
            <span
              className={`font-bold text-xl ${isCancelled ? "text-[#888888]" : "text-[#242424]"}`}
            >
              ฿{(order.totalAmount || 0).toLocaleString()}
            </span>
            {isCancelled ? (
              <XCircle size={16} className="text-[#888888]" />
            ) : (
              <CheckCircle2 size={16} className="text-[#28a745]" />
            )}
          </div>
          <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            {isOpen ? (
              <ChevronUp size={24} className="text-[#242424]" />
            ) : (
              <ChevronDown size={24} className="text-[#888888]" />
            )}
          </button>
        </div>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="p-5 border-t-[3px] border-[#eeeeee] bg-[#fafafa] flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex justify-between items-center border-b-2 border-gray-200 pb-1 mb-3">
              <h4 className="text-xs font-bold text-[#888888] uppercase tracking-widest">
                Order Preview
              </h4>

              <button
                onClick={(e) => {
                  e.stopPropagation(); // 💡 หยุดการทำงานไม่ให้ accordion ยุบเมื่อคลิกที่รายละเอียดเต็ม
                  onViewDetails && onViewDetails();
                }}
                className="text-xs font-bold text-[#0284c7] hover:text-[#0369a1] flex items-center gap-1 cursor-pointer transition-colors"
              >
                View Full Details <ExternalLink size={12} />
              </button>
            </div>

            <ul className="flex flex-col gap-2">
              {previewItems.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-sm p-2 bg-white rounded border border-gray-100"
                >
                  <span
                    className={`flex items-center gap-3 ${isCancelled ? "text-[#888888]" : "text-[#242424]"}`}
                  >
                    <span className="font-bold text-white bg-[#888888] px-1.5 py-0.5 rounded text-xs min-w-6 text-center">
                      {item.qty}
                    </span>
                    <span className="font-medium">{item.name}</span>
                  </span>
                </li>
              ))}

              {remainingCount > 0 && (
                <li className="text-center text-xs font-bold text-[#888888] pt-2">
                  ... and {remainingCount} more item(s)
                </li>
              )}
            </ul>
          </div>

          <div className="flex flex-col justify-end border-t-2 border-[#eeeeee] md:border-t-0 md:border-l-2 pt-4 md:pt-0 md:pl-6 min-w-40">
            {isCancelled ? (
              <div className="w-full py-2 text-center font-bold text-[#888888] border-2 border-dashed border-[#cccccc] rounded-lg">
                CANCELLED
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert("Printing Bill...");
                }}
                className="flex items-center justify-center gap-2 w-full p-3 bg-white border-2 border-[#242424] rounded-lg text-[#242424] hover:bg-[#242424] hover:text-white transition-all font-bold text-sm shadow-[0_4px_0_#242424] active:translate-y-1 active:shadow-none"
              >
                <Printer size={16} /> REPRINT BILL
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryAccordion;
