// ทำหน้าที่เป็น "การ์ด 1 ใบ" สำหรับออเดอร์ 1 ออเดอร์
// src/components/cashier/OrderCard.jsx

import React from "react";
import { Pencil } from "lucide-react";

const OrderCard = ({ order, onPrintBill, onMarkAsCompleted }) => {
  const isPaid = order.status === "PAID";

  return (
    <div className="bg-white border-[3px] border-[#242424] rounded-lg p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-[0_8px_0_rgba(0,0,0,0.1)]">
      {/* ข้อมูลด้านซ้าย */}
      <div className="flex flex-col">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="font-['Bebas_Neue'] text-4xl leading-none m-0 text-[#242424]">
            {order.orderId}
          </h3>
          <span
            className={`px-3 py-1 text-[0.75rem] font-bold uppercase rounded-full ${
              isPaid ? "bg-[#28a745] text-white" : "bg-[#eeeeee] text-[#888888]"
            }`}
          >
            {order.status}
          </span>
        </div>

        <p className="text-[#888888] text-sm font-medium">
          <span className="text-[#242424] font-bold">{order.type}</span>
          {order.table && ` • TABLE: ${order.table}`}
          <span className="mx-2">|</span>
          <span className="text-[#242424] font-bold">
            ฿{order.totalAmount.toLocaleString()}
          </span>
        </p>
      </div>

      {/* ปุ่ม Action ด้านขวา */}
      <div className="flex items-center gap-3">
        {/* ปุ่ม Edit (ไปหน้า Checkout แบบไม่ล็อกสถานะ) */}
        <button
          onClick={() => onPrintBill(order.orderId)}
          className="p-2 border-2 border-none rounded bg-[#cccccc] text-[#242424] hover:bg-[#242424] hover:text-white transition-all"
          title="Edit Order"
        >
          <Pencil size={20} strokeWidth={2.5} />
        </button>

        {/* ปุ่มหลัก (Print Bill หรือ Paid) */}
        {isPaid ? (
          <button
            onClick={() => onMarkAsCompleted(order.orderId)}
            className="bg-[#28a745] text-white font-['IBM_Plex_Sans_Thai'] font-bold uppercase px-8 py-3 rounded border-[3px] border-[#28a745] hover:bg-[#218838] transition-all shadow-[0_4px_0_#1e7e34] active:translate-y-1 active:shadow-none"
          >
            PAID
            <br />
            (CLEAR TABLE)
          </button>
        ) : (
          <button
            onClick={() => onPrintBill(order.orderId)}
            className="bg-white text-[#242424] font-['IBM_Plex_Sans_Thai'] font-bold uppercase px-8 py-3 rounded border-[3px] border-[#242424] hover:bg-[#242424] hover:text-white transition-all shadow-[0_4px_0_#242424] active:translate-y-1 active:shadow-none"
          >
            PRINT BILL
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
