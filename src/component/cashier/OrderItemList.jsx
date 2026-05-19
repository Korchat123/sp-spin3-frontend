// ตารางรายการอาหารที่ต้องชำระ (Serious Punch Burger, Fries, ฯลฯ)

// src/components/cashier/OrderItemList.jsx
import React from "react";
import { Trash2 } from "lucide-react"; // Ensure you have lucide-react installed

const OrderItemList = ({
  items,
  onRemoveItem,
  discount,
  setDiscount,
  serviceCharge,
  setServiceCharge,
}) => {
  return (
    <div className="bg-white border-[3px] border-[#242424] rounded-lg flex flex-col overflow-hidden h-full">
      {/* Header */}
      <div className="bg-[#242424] text-white p-4 grid grid-cols-[2fr_1fr_1fr_40px] font-bold uppercase text-sm">
        <div>Item Menu</div>
        <div>Qty</div>
        <div>Price</div>
        <div></div>
      </div>

      {/* List Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[2fr_1fr_1fr_40px] py-4 px-2 border-b border-[#e0e0e0] items-center font-medium"
          >
            <div>{item.name}</div>
            <div>x{item.qty}</div>
            <div>
              ฿
              {item.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </div>
            <button
              onClick={() => onRemoveItem(index)}
              className="text-[#cccccc] hover:text-[#e4002b] transition-colors border-none bg-transparent cursor-pointer flex justify-center"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Adjustments Bottom Bar */}
      <div className="bg-[#f9f9f9] border-t-2 border-[#242424] p-4 flex gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs font-bold text-[#888888]">
            Discount (฿)
          </label>
          <input
            type="number"
            className="p-2 border border-[#ccc] rounded text-right focus:outline-none focus:border-[#e4002b]"
            value={discount}
            min="0"
            onChange={(e) => setDiscount(Number(e.target.value) || 0)}
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs font-bold text-[#888888]">
            Service Charge (%)
          </label>
          <input
            type="number"
            className="p-2 border border-[#ccc] rounded text-right focus:outline-none focus:border-[#e4002b]"
            value={serviceCharge}
            min="0"
            max="100"
            onChange={(e) => setServiceCharge(Number(e.target.value) || 0)}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderItemList;
