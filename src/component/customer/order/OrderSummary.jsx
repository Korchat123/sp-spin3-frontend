import React from "react";
import { PlusCircle, ShoppingCart } from "lucide-react";
import OrderItem from "./OrderItem";

const OrderSummary = ({ cartItems, customizingItem, handleUpdateQty, handleRemove, handleUpdateNote, setCustomizingItem, onAddMore }) => {
  return (
    <div className="lg:col-span-5 bg-white rounded-3xl sm:rounded-4xl p-4 sm:p-6 border-4 border-[#242424] shadow-[5px_5px_0_#242424] sm:shadow-[8px_8px_0_#242424] space-y-5 sm:space-y-6 min-w-0">
      <h2 className="text-xl sm:text-2xl font-['Bebas_Neue'] tracking-widest uppercase border-b-2 border-[#eeeeee] pb-2 flex items-center justify-between gap-3">
        <span>2. Order Summary</span>
        <span className="bg-[#242424] text-white text-xs px-3 py-1 rounded-full font-['IBM_Plex_Sans_Thai'] tracking-normal font-black">
          {cartItems.length} รายการ
        </span>
      </h2>

      <div className="space-y-1 max-h-[32rem] lg:max-h-[30rem] overflow-y-auto pr-1">
        {cartItems.length === 0 ? (
          <div className="text-center py-20 text-[#242424]/40 font-bold uppercase">
            <ShoppingCart size={36} className="mx-auto mb-2 opacity-30" />
            ตะกร้าว่างอยู่
          </div>
        ) : (
          cartItems.map((item) => (
            <OrderItem
              key={item.id}
              item={item}
              onUpdateQty={handleUpdateQty}
              onRemove={handleRemove}
              onEdit={setCustomizingItem}
              isSelected={customizingItem?.id === item.id}
              onUpdateNote={handleUpdateNote}
            />
          ))
        )}
      </div>

      <button
        onClick={onAddMore}
        className="w-full py-3.5 px-3 border-2 border-dashed border-[#242424] text-[#242424] bg-[#eeeeee] rounded-3xl font-bold flex items-center justify-center gap-2 text-sm sm:text-base hover:bg-[#242424] hover:text-white transition-all duration-300 shadow-[4px_4px_0_#e5e7eb] cursor-pointer"
      >
        <PlusCircle size={18} /> เพิ่มเมนูอื่นต่อ (Add Items)
      </button>
    </div>
  );
};

export default OrderSummary;
