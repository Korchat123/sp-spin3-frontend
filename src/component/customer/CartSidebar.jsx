// src/component/customer/CartSidebar.jsx
import React from "react";
import { X, ShoppingBag, Minus, Plus } from "lucide-react";
// 1. นำเข้าข้อมูลเมนู (ชื่อเดียวพอ)
import { MENU } from "../../assets/menuData";

const CartSidebar = ({ isOpen, onClose, cartItems, onUpdateQty }) => {
  // 2. ปรับปรุงลอจิกการหาข้อมูลสินค้าในตะกร้า
  const cartDetails = cartItems.map((cartItem) => {
    // หาข้อมูลดิบจาก MENU
    const itemInfo = MENU.find((m) => m.id === cartItem.id);

    // ทริค: แปลงราคาจาก "฿199.-" ให้เป็นตัวเลข 199 เพื่อเอาไปคำนวณ
    const rawPrice =
      typeof itemInfo?.price === "string"
        ? parseInt(itemInfo.price.replace(/[^\d]/g, ""))
        : itemInfo?.price || 0;

    return {
      ...itemInfo,
      qty: cartItem.qty,
      itemPriceNum: rawPrice,
      itemTotal: rawPrice * cartItem.qty,
    };
  });

  // 3. รวมราคาทั้งหมด
  const totalPrice = cartDetails.reduce((sum, item) => sum + item.itemTotal, 0);

  return (
    <>
      {/* Overlay สีดำจางๆ ด้านหลัง */}
      <div
        className={`fixed inset-0 bg-black/60 z-60 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* ตัว Sidebar ตะกร้า */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-100 bg-white z-70 transform transition-transform duration-300 flex flex-col shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header: ส่วนหัวสีดำสไตล์ Serious Punch */}
        <div className="p-5 bg-[#242424] text-white flex justify-between items-center">
          <h2 className="text-2xl font-bold font-['Bebas_Neue'] tracking-widest flex items-center gap-2">
            <ShoppingBag className="text-[#e4002b]" /> YOUR CART
          </h2>
          <button onClick={onClose} className="hover:text-[#e4002b] transition">
            <X size={24} />
          </button>
        </div>

        {/* รายการอาหารในตะกร้า */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {cartDetails.length === 0 ? (
            <div className="text-center text-gray-400 mt-16 flex flex-col items-center">
              <ShoppingBag size={64} className="mb-4 opacity-30" />
              <p className="font-['IBM_Plex_Sans_Thai']">
                ตะกร้าของคุณยังว่างเปล่า
              </p>
            </div>
          ) : (
            cartDetails.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm"
              >
                {/* รูปสินค้า */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-contain rounded-md bg-gray-50"
                />

                {/* ชื่อและราคารวมของชิ้นนั้น */}
                <div className="flex-1">
                  <h4 className="font-bold text-[#242424] text-sm leading-tight font-['IBM_Plex_Sans_Thai']">
                    {item.name}
                  </h4>
                  <div className="text-[#e4002b] font-black font-['Bebas_Neue'] text-lg">
                    ฿{item.itemTotal.toLocaleString()}
                  </div>
                </div>

                {/* ปุ่มบวก-ลบ จำนวน */}
                <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-2 py-1 bg-gray-50">
                  <button
                    onClick={() => onUpdateQty(item.id, -1)}
                    className="text-gray-500 hover:text-[#e4002b] transition"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-4 text-center font-bold text-[#242424] text-sm">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => onUpdateQty(item.id, 1)}
                    className="text-gray-500 hover:text-[#e4002b] transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ส่วนสรุปเงินด้านล่าง */}
        <div className="p-6 border-t border-gray-100 bg-white">
          <div className="flex justify-between items-end mb-6">
            <span className="text-gray-500 font-medium">Subtotal</span>
            <span className="text-4xl text-[#e4002b] font-['Bebas_Neue'] tracking-wide">
              ฿{totalPrice.toLocaleString()}.-
            </span>
          </div>

          {/* ปุ่ม Checkout สไตล์ Neo-Brutalism (มีเงาหนา) */}
          <button
            className="w-full bg-[#e4002b] text-white font-black font-['Bebas_Neue'] text-2xl py-4 rounded-xl shadow-[0_6px_0_#800018] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:grayscale"
            disabled={cartItems.length === 0}
            onClick={() => alert("Proceeding to payment...")}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
