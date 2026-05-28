// src/component/customer/ProductCard.jsx
import React from "react";
import { Flame, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductCard({ item }) {
  const renderSticker = (badge) => {
    if (!badge) return null;
    switch (badge.toLowerCase()) {
      case "promo":
        return (
          <div className="absolute top-3 left-3 z-20 bg-[#DC5F00] text-white text-[10px] md:text-xs font-bold px-3 py-1 shadow-md border border-white">
            HOT DEAL
          </div>
        );
      case "top-sale":
        return (
          <div className="absolute top-3 left-3 z-20 bg-[#242424] text-white text-[10px] md:text-xs font-bold px-3 py-1 shadow-md border border-[#242424] flex items-center gap-1 rounded-m">
            POPULAR <Flame size={12} className="text-[#e4002b]" />
          </div>
        );
      case "new":
        return (
          <div className="absolute top-3 right-3 z-20 bg-[#e4002b] text-white text-[10px] md:text-xs font-black w-10 h-10 flex items-center justify-center rounded-full rotate-12 shadow-md border-2 border-white leading-none">
            NEW!
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Link
      to={item?.link || "/menu"}
      className="w-60 md:w-70 flex flex-col group cursor-pointer shrink-0"
    >
      <div className="relative w-full h-80 md:h-95 mb-4 overflow-hidden rounded-md bg-[#242424]">
        {renderSticker(item?.badge)}
        <img
          src={item?.img}
          alt={item?.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10 opacity-90 group-hover:opacity-100"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-15 pointer-events-none" />

        <h3 className="absolute bottom-6 left-6 z-20 font-['Bebas_Neue'] text-4xl text-white tracking-widest drop-shadow-lg group-hover:-translate-y-2 transition-transform duration-300">
          {item?.title}
        </h3>
      </div>

      <div className="flex flex-col items-start font-['IBM_Plex_Sans_Thai'] w-full mt-2 px-1">
        <p className="text-base text-[#242424] font-medium leading-relaxed group-hover:text-[#e4002b] transition-colors line-clamp-2">
          {item?.desc}
        </p>

        {/* Changed from Add button to Explore link style */}
        <div className="w-full flex justify-end mt-3">
          <span className="flex items-center gap-1 text-sm font-bold text-[#e4002b] border-b-2 border-transparent group-hover:border-[#e4002b] transition-all">
            Explore <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}
