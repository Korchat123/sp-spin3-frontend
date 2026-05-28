// src/component/customer/MenuCard.jsx
import React from "react";
import { Plus } from "lucide-react";

const MenuCard = ({ item, onAddToCart, onOpenModal }) => {
  const isSoldOut = item.soldOut === true;

  return (
    <div className="bg-white rounded-xl border-2 border-transparent transition-all duration-300 overflow-hidden flex flex-col h-full hover:border-[#242424] hover:-translate-y-1 hover:shadow-[8px_8px_0px_rgba(0,0,0,0.08)]">
      <div
        className="cursor-pointer flex flex-col flex-1"
        onClick={() => !isSoldOut && onOpenModal()}
      >
        {/* ปรับความสูงรูป: มือถือ h-32 (128px), จอใหญ่ h-45 (180px) */}
        <div className="h-32 md:h-45 bg-[#f0f0f0] relative overflow-hidden group flex items-center justify-center">
          <img
            src={item.img} // ✅ แก้ตรงนี้จาก item.image เป็น item.img
            alt={item.name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isSoldOut ? "grayscale opacity-50" : ""}`}
            onError={(e) => {
              e.target.src =
                "https://placehold.co/400x400/eeeeee/242424?text=FOOD";
            }}
          />
        </div>

        {/* ปรับ Padding ข้อความให้พอดีจอมือถือ */}
        <div className="p-3 md:p-5 pb-1 md:pb-2 flex-1">
          <h3 className="font-bold text-sm md:text-lg mb-1 leading-tight text-[#242424] group-hover:text-[#e4002b] transition-colors">
            {item.name}
          </h3>
          <p className="text-[10px] md:text-xs text-gray-500 line-clamp-2">
            {item.desc}
          </p>
        </div>
      </div>

      <div className="p-3 md:p-5 pt-0 mt-auto flex justify-between items-end gap-1">
        {/* ปรับขนาดตัวอักษรราคา */}
        <span className="text-xl md:text-2xl font-black text-[#e4002b] font-['Bebas_Neue'] tracking-wide">
          ฿{item.price}
        </span>

        {isSoldOut ? (
          <button
            disabled
            className="bg-[#e0e0e0] text-[#888888] px-2 py-1 md:px-3 md:py-2 rounded-md font-bold cursor-not-allowed text-[10px] md:text-sm"
          >
            SOLD OUT
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item.id, item.name);
            }}
            // ปรับปุ่ม Add ให้เล็กลงในมือถือ จะได้ไม่ล้น
            className="bg-transparent border-2 border-[#e4002b] text-[#e4002b] px-2 py-1.5 md:px-3 md:py-2 rounded-md font-bold transition-all hover:bg-[#e4002b] hover:text-white hover:scale-105 flex items-center gap-1 text-[10px] md:text-sm"
            aria-label={`Add ${item.name} to cart`}
          >
            <Plus size={14} className="md:w-4 md:h-4" />{" "}
            <span className="hidden sm:inline">ADD</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuCard;
