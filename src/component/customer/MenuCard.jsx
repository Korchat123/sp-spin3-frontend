// src/component/customer/MenuCard.jsx
import React from "react";
import { Plus } from "lucide-react";

const MenuCard = ({ item, onAddToCart }) => {
  const isSoldOut = item.soldOut === true;

  return (
    <div className="bg-white rounded-xl border-2 border-transparent transition-all duration-300 overflow-hidden flex flex-col h-full hover:border-[#242424] hover:-translate-y-1 hover:shadow-[8px_8px_0px_rgba(0,0,0,0.08)]">
      <div>
        <div className="h-45 bg-[#f0f0f0] relative overflow-hidden group">
          <img
            src={item.img}
            alt={item.name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isSoldOut ? "grayscale opacity-50" : ""}`}
          />
        </div>
        <div className="p-5 pb-2">
          <h3 className="font-bold text-lg mb-1 leading-tight text-[#242424]">
            {item.name}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2">{item.desc}</p>
        </div>
      </div>

      <div className="p-5 pt-0 mt-auto flex justify-between items-end">
        <span className="text-2xl font-black text-[#e4002b] font-['Bebas_Neue'] tracking-wide">
          ฿{item.price}
        </span>

        {isSoldOut ? (
          <button
            disabled
            className="bg-[#e0e0e0] text-[#888888] px-3 py-2 rounded-md font-bold cursor-not-allowed text-sm"
          >
            SOLD OUT
          </button>
        ) : (
          <button
            onClick={() => onAddToCart(item.id, item.name)}
            className="bg-[#e4002b] text-white px-3 py-2 rounded-md font-bold transition-all hover:bg-black hover:scale-105 flex items-center gap-1 text-sm"
            aria-label={`Add ${item.name} to cart`}
          >
            <Plus size={16} /> ADD
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuCard;