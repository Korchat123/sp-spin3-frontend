// src/component/customer/CartSidebar.jsx

import React, { useState, useContext } from "react";
import { UserContext } from "../../context/userContext/UserContext";
import { X, Minus, Plus, ShoppingBag, MapPin, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom"; // นำเข้า useNavigate เพื่อเปลี่ยนหน้า

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onOpenLoginModal, // เพื่อรับฟังก์ชันมาจาก MenuPage
}) {
  const navigate = useNavigate();

  // เรียกใช้ข้อมูล User จาก Context แทนการดึง localStorage เอง
  const { myUserInfo } = useContext(UserContext);
  const isLoggedIn = !!myUserInfo; // ถ้ามีข้อมูล User แปลว่า Login แล้ว

  const selectedBranch = localStorage.getItem("selectedBranch");

  // ถ้าตะกร้าไม่ได้เปิดอยู่ ก็ไม่ต้องเรนเดอร์อะไร
  if (!isOpen) return null;

  // คำนวณราคารวม
  const subTotal = cartItems.reduce((sum, item) => {
    return sum + ((item.price || 0) * item.qty);
  }, 0);

  // สมมติว่ายังไม่มีค่าส่ง หรือโปรโมชั่น (คำนวณง่ายๆ ไปก่อน)
  const total = subTotal;

  // ฟังก์ชันจัดการตอนกดปุ่ม Checkout
  const handleCheckoutClick = () => {
    if (!isLoggedIn) {
      onOpenLoginModal();
    } else {
      // ถ้า login แล้ว -> (ในอนาคตจะพาไปหน้าชำระเงิน หรือสรุปออเดอร์)
      onClose();
      navigate("/order");
    }
  };

  return (
    <>
      {/* พื้นหลังเบลอๆ (Backdrop) ดักการคลิกเพื่อปิดตะกร้า */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9998 transition-opacity"
        onClick={onClose}
      />

      {/* ตัว Sidebar เลื่อนมาจากด้านขวา */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-112.5 bg-[#eeeeee] z-9999 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] transform transition-transform duration-300 ease-in-out translate-x-0 flex flex-col font-['IBM_Plex_Sans_Thai']">
        {/* --- ส่วนหัว (Header) --- */}
        <div className="bg-[#242424] text-white p-6 flex flex-col relative shrink-0">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-['Bebas_Neue'] text-4xl tracking-widest flex items-center gap-2">
              <ShoppingBag size={28} className="text-[#e4002b]" />
              YOUR ORDER
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full hover:bg-[#e4002b] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* ย้ำเตือนสาขาที่เลือก */}
          {selectedBranch && (
            <div className="flex items-center gap-1 text-sm font-bold text-gray-300">
              <MapPin size={14} className="text-[#e4002b]" />
              Store:{" "}
              {selectedBranch === "branch1" ? "Asok (HQ)" : selectedBranch}
            </div>
          )}
        </div>

        {/* --- ส่วนเนื้อหาตะกร้า (Cart Items List) --- */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {cartItems.length === 0 ? (
            // กรณีตะกร้าว่างเปล่า
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4 opacity-50">
              <ShoppingBag size={64} />
              <p className="font-bold uppercase tracking-wider">
                Your cart is empty.
              </p>
            </div>
          ) : (
            // กรณีมีสินค้า
            cartItems.map((cartItem) => {
              return (
                <div
                  key={cartItem.id}
                  className="flex gap-4 bg-white p-4 rounded-2xl border-2 border-[#242424]"
                >
                  {/* รูปสินค้า (เล็กๆ) */}
                  {cartItem.img && (
                    <img
                      src={cartItem.img}
                      alt={cartItem.name}
                      className="w-20 h-20 object-contain bg-[#f0f0f0] rounded-xl"
                    />
                  )}

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-[#242424] leading-tight mb-1">
                        {cartItem.name}
                      </h3>
                      <p className="font-['Bebas_Neue'] text-[#e4002b] text-xl tracking-wide">
                        ฿{cartItem.price}
                      </p>
                    </div>

                    {/* ปุ่มปรับจำนวน (Brutalist style) */}
                    <div className="flex items-center bg-[#eeeeee] border border-[#242424] rounded-full w-max mt-2">
                      <button
                        onClick={() => onUpdateQty(cartItem.id, -1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-[#242424] hover:text-white rounded-l-full transition-colors"
                      >
                        <Minus size={14} strokeWidth={3} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">
                        {cartItem.qty}
                      </span>
                      <button
                        onClick={() => onUpdateQty(cartItem.id, 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-[#242424] hover:text-white rounded-r-full transition-colors"
                      >
                        <Plus size={14} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* --- ส่วนสรุปยอด (Footer / Checkout) --- */}
        {cartItems.length > 0 && (
          <div className="bg-white p-6 border-t-4 border-[#242424] shrink-0">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-gray-500 uppercase tracking-widest text-sm">
                Total
              </span>
              <span className="font-['Bebas_Neue'] text-4xl text-[#242424]">
                ฿{total.toLocaleString()}
              </span>
            </div>

            {/* ปุ่ม Checkout (เช็คสถานะ Login) */}
            {isLoggedIn ? (
              <button
                onClick={handleCheckoutClick}
                className="w-full bg-[#e4002b] text-white py-4 rounded-full font-['Bebas_Neue'] text-2xl tracking-widest border-2 border-[#242424] shadow-[6px_6px_0_#242424] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_#242424] transition-all"
              >
                PROCEED TO CHECKOUT
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2 bg-yellow-100 p-3 rounded-lg border border-yellow-300">
                  <AlertCircle
                    size={18}
                    className="text-yellow-600 shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-yellow-800 font-bold leading-tight">
                    You need to sign in before completing your order. Don't
                    worry, your cart is saved!
                  </p>
                </div>
                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-[#242424] text-white py-4 rounded-full font-['Bebas_Neue'] text-2xl tracking-widest hover:bg-[#e4002b] transition-colors shadow-md"
                >
                  SIGN IN TO CHECKOUT
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
