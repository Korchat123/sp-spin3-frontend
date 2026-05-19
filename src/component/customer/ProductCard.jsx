// src/component/customer/ProductCard.jsx
import React from "react";
import { Flame } from "lucide-react";

export default function ProductCard({ item }) {
  //  ลบ getCustomImage function ทิ้งไปเลย เพราะเราจะไม่ใช้รูป hardcode แล้ว

  const renderSticker = (badge) => {
    if (!badge) return null;
    switch (badge.toLowerCase()) {
      case "promo":
        return (
          // ขยับเข้าจากขอบ (top-3 left-3)
          <div className="absolute top-3 left-3 z-20 bg-[#DC5F00] text-white text-[10px] md:text-xs font-bold px-3 py-1 shadow-md border border-white">
            PROMO
          </div>
        );
      case "top-sale":
        return (
          <div className="absolute top-3 left-3 z-20 bg-[#242424] text-white text-[10px] md:text-xs font-bold px-3 py-1 shadow-md border border-[#242424] flex items-center gap-1">
            MOST FAV <Flame size={12} className="text-[#e4002b]" />
          </div>
        );
      case "new":
        return (
          // ป้าย NEW วงกลมเอียงๆ กลับมาแล้ว! (top-3 right-3)
          <div className="absolute top-3 right-3 z-20 bg-[#e4002b] text-white text-[10px] md:text-xs font-black w-10 h-10 flex items-center justify-center rounded-full rotate-12 shadow-md border-2 border-white leading-none">
            NEW!
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-60 md:w-70 flex flex-col group cursor-pointer shrink-0">
      {/* ─── Image Area: บังคับความสูงและตัดส่วนเกินทิ้ง (object-cover) ─── */}
      <div className="relative w-full h-80 md:h-95 mb-4 overflow-hidden rounded-md bg-gray-100">
        {renderSticker(item?.badge)}
        <img
          // 🚨 แก้ไขตรงนี้: ดึงรูปจาก item.image มาใส่ตรงๆ เลย (รูปจาก DB)
          src={item?.image}
          alt={item?.name}
          // กรอบเดิมเป๊ะๆ: object-cover เพื่อให้รูปเต็มกรอบพอดี (ตัดขอบที่ล้นออก)
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10"
          onError={(e) => {
            // เผื่อรูปจาก DB โหลดไม่ได้ ให้ซ่อนไว้เหมือนเดิม
            e.target.style.display = "none";
          }}
        />
      </div>

      {/* ─── Text Area ─── */}
      <div className="flex flex-col items-start font-['IBM_Plex_Sans_Thai'] w-full mt-2">
        <h3 className="text-xl font-bold text-[#242424] leading-tight mb-1 group-hover:text-[#e4002b] transition-colors line-clamp-2">
          {item?.name}
        </h3>
        <p className="text-sm text-gray-500 mb-3">{item?.cal}</p>

        <div className="w-full flex justify-between items-center mt-auto">
          <span className="text-lg font-bold text-[#242424]">
            {item?.price}
          </span>
          <button className="border-2 border-[#e4002b] text-[#e4002b] font-bold text-sm px-6 py-1 rounded-sm hover:bg-[#e4002b] hover:text-white transition-colors duration-200">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
