// src/component/customer/ProductModal.jsx
import React, { useState, useEffect } from "react";
import { X, Minus, Plus, AlertTriangle } from "lucide-react";

export default function ProductModal({ isOpen, onClose, item, onAddToCart }) {
  const [qty, setQty] = useState(1);

  // ป้องกันหน้าเว็บด้านหลังเลื่อนตอนเปิด Modal และรีเซ็ตจำนวนเมื่อเปิดใหม่
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setQty(1);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const handleAdd = () => {
    onAddToCart(item.id, item.name, qty);
    onClose();
  };

  return (
    // Backdrop (พื้นหลังเบลอๆ)
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container (กล่องหลัก) */}
      <div className="relative bg-[#eeeeee] w-full max-w-4xl rounded-4xl border-4 border-[#242424] shadow-[12px_12px_0_#242424] flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
        {/* ปุ่มปิด (X) กวนๆ อยู่มุมขวาบน */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white border-2 border-[#242424] text-[#242424] w-10 h-10 rounded-full flex items-center justify-center shadow-[4px_4px_0_#242424] hover:bg-[#e4002b] hover:text-white transition-colors"
        >
          <X strokeWidth={3} size={20} />
        </button>

        {/* --- ฝั่งซ้าย: รูปภาพ --- */}
        <div className="w-full md:w-2/5 bg-white p-8 flex items-center justify-center relative border-b-4 md:border-b-0 md:border-r-4 border-[#242424]">
          {/* พื้นหลังวงกลมพาสเทลเพื่อความคิวท์ */}
          <div className="absolute w-48 h-48 md:w-64 md:h-64 bg-[#FDE68A]/40 rounded-full blur-xl" />
          <img
            src={item.img}
            alt={item.name}
            className="w-48 h-48 md:w-full md:h-auto object-contain relative z-10 drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* --- ฝั่งขวา: ข้อมูล (เลื่อน Scroll ได้ถ้าเนื้อหายาว) --- */}
        <div className="w-full md:w-3/5 flex flex-col bg-[#eeeeee] overflow-y-auto">
          <div className="p-6 md:p-8 flex-1 font-['IBM_Plex_Sans_Thai']">
            {/* Tag หมวดหมู่ */}
            <span className="inline-block bg-[#242424] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3">
              {item.cat}
            </span>

            {/* ชื่อและราคา */}
            <div className="flex justify-between items-start gap-4 mb-4">
              <h2 className="font-['Bebas_Neue'] text-4xl md:text-5xl text-[#242424] leading-[0.9]">
                {item.name}
              </h2>
              <span className="font-['Bebas_Neue'] text-3xl md:text-4xl text-[#e4002b] shrink-0">
                ฿{item.price}
              </span>
            </div>

            {/* คำบรรยายเต็ม (อ่านสบายตา) */}
            <p className="text-[#242424]/80 text-base md:text-lg leading-relaxed mb-6">
              {item.fullDesc || item.desc}
            </p>

            <div className="space-y-6">
              {/* ส่วนผสม (Ingredients) - ทำเป็น Pill tags น่ารักๆ */}
              {item.ingredients && item.ingredients.length > 0 && (
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider mb-2 text-[#242424]">
                    What's inside:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {item.ingredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="bg-white border-2 border-[#242424]/20 text-[#242424] text-sm px-3 py-1 rounded-full"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ข้อมูลการแพ้อาหาร (Allergens) - กรอบเตือนสีแดง */}
              {item.allergens &&
                item.allergens.length > 0 &&
                item.allergens[0] !== "None" && (
                  <div className="bg-[#e4002b]/10 border-2 border-[#e4002b] border-dashed rounded-xl p-3 flex items-start gap-3">
                    <AlertTriangle
                      className="text-[#e4002b] shrink-0 mt-0.5"
                      size={20}
                    />
                    <div>
                      <h4 className="font-bold text-[#e4002b] text-sm uppercase tracking-wider mb-1">
                        Allergy Advice:
                      </h4>
                      <p className="text-[#242424] text-sm">
                        Contains:{" "}
                        <span className="font-bold">
                          {item.allergens.join(", ")}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* --- ส่วนก้น: Action Area ซื้อของ (ติดหนึบด้านล่าง) --- */}
          <div className="p-6 md:p-8 bg-white border-t-4 border-[#242424] flex flex-col sm:flex-row gap-4 items-center justify-between mt-auto">
            {/* ตัวปรับจำนวน (Quantity Selector) แบบ Brutalist */}
            <div className="flex items-center bg-[#eeeeee] border-2 border-[#242424] rounded-full p-1 shadow-[4px_4px_0_#242424]">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition-colors text-[#242424]"
              >
                <Minus size={18} strokeWidth={3} />
              </button>
              <span className="w-12 text-center font-bold text-lg font-['IBM_Plex_Sans_Thai']">
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition-colors text-[#242424]"
              >
                <Plus size={18} strokeWidth={3} />
              </button>
            </div>

            {/* ปุ่ม Add to Cart */}
            <button
              onClick={handleAdd}
              disabled={item.soldOut}
              className={`flex-1 w-full sm:w-auto px-8 py-4 rounded-full font-['Bebas_Neue'] text-2xl tracking-widest border-2 border-[#242424] transition-all
                ${
                  item.soldOut
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#e4002b] text-white shadow-[6px_6px_0_#242424] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_#242424] active:shadow-none active:translate-x-1.5 active:translate-y-1.5"
                }
              `}
            >
              {item.soldOut
                ? "SOLD OUT"
                : `ADD TO CART • ฿${(item.price * qty).toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
