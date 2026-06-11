// src/component/customer/CartSidebar.jsx

import React, { useContext } from "react";
import { UserContext } from "../../context/userContext/UserContext";
// 💡 เพิ่ม Trash2 เข้ามาตรงนี้
import {
  X,
  Minus,
  Plus,
  ShoppingBag,
  MapPin,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem, // 💡 รับ prop เผื่อกรณีไฟล์หลักมีฟังก์ชันลบแยกต่างหาก
  onOpenLoginModal,
}) {
  const navigate = useNavigate();

  const { myUserInfo } = useContext(UserContext);
  const isLoggedIn = !!myUserInfo;

  const selectedBranch = localStorage.getItem("selectedBranch");

  if (!isOpen) return null;

  const subTotal = cartItems.reduce((sum, item) => {
    return sum + (item.price || 0) * (item.qty || item.quantity || 1);
  }, 0);

  const total = subTotal;

  const handleCheckoutClick = () => {
    if (!isLoggedIn) {
      onOpenLoginModal?.();
    } else {
      onClose();
      navigate("/order");
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9998 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed top-0 right-0 h-full w-full max-w-112.5 bg-[#eeeeee] z-9999 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] transform transition-transform duration-300 ease-in-out translate-x-0 flex flex-col font-['IBM_Plex_Sans_Thai']">
        {/* --- Header --- */}
        <div className="bg-[#242424] text-white p-4 sm:p-6 flex flex-col relative shrink-0">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-['Bebas_Neue'] text-3xl sm:text-4xl tracking-widest flex items-center gap-2">
              <ShoppingBag size={28} className="text-[#e4002b]" />
              YOUR ORDER
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full hover:bg-[#e4002b] transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {selectedBranch && (
            <div className="flex items-center gap-1 text-sm font-bold text-gray-300">
              <MapPin size={14} className="text-[#e4002b]" />
              Store:{" "}
              {selectedBranch === "branch1" ? "Asok (HQ)" : selectedBranch}
            </div>
          )}
        </div>

        {/* --- Cart Items List --- */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 custom-scrollbar">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4 opacity-50">
              <ShoppingBag size={64} />
              <p className="font-bold uppercase tracking-wider">
                Your cart is empty.
              </p>
            </div>
          ) : (
            cartItems.map((cartItem) => {
              const itemQty = cartItem.qty || cartItem.quantity || 1;
              return (
                // 💡 เติม relative เข้าไปเพื่อให้าวางปุ่มถังขยะมุมขวาบนได้
                <div
                  key={cartItem.id}
                  className="relative flex gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-2xl border-2 border-[#242424]"
                >
                  {/* 💡 ปุ่มถังขยะ (Trash Button) */}
                  <button
                    onClick={() => {
                      if (onRemoveItem) {
                        onRemoveItem(cartItem.id); // ถ้ามีฟังก์ชันลบโดยตรงให้เรียกใช้
                      } else {
                        onUpdateQty(cartItem.id, -itemQty); // ถ้าไม่มี ก็สั่งลดจำนวนออกให้หมดตะกร้า
                      }
                    }}
                    className="absolute top-3 right-3 text-gray-300 hover:text-[#e4002b] transition-colors cursor-pointer bg-white rounded-full p-1"
                    title="Remove item"
                  >
                    <Trash2 size={18} strokeWidth={2.5} />
                  </button>

                  {cartItem.img && (
                    <img
                      src={cartItem.img}
                      alt={cartItem.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain bg-[#f0f0f0] rounded-xl"
                    />
                  )}

                  <div className="flex-1 flex flex-col justify-between pr-6">
                    <div>
                      <h3 className="font-bold text-[#242424] leading-tight mb-1 pr-2 line-clamp-2">
                        {cartItem.name}
                      </h3>
                      <p className="font-['Bebas_Neue'] text-[#e4002b] text-xl tracking-wide">
                        ฿{cartItem.price}
                      </p>
                    </div>

                    <div className="flex items-center bg-[#eeeeee] border border-[#242424] rounded-full w-max mt-2">
                      <button
                        onClick={() => onUpdateQty(cartItem.id, -1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-[#242424] hover:text-white rounded-l-full transition-colors cursor-pointer"
                      >
                        <Minus size={14} strokeWidth={3} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">
                        {itemQty}
                      </span>
                      <button
                        onClick={() => onUpdateQty(cartItem.id, 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-[#242424] hover:text-white rounded-r-full transition-colors cursor-pointer"
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

        {/* --- Footer / Checkout --- */}
        {cartItems.length > 0 && (
          <div className="bg-white p-4 sm:p-6 border-t-4 border-[#242424] shrink-0">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-gray-500 uppercase tracking-widest text-sm">
                Total
              </span>
              <span className="font-['Bebas_Neue'] text-4xl text-[#242424]">
                ฿{total.toLocaleString()}
              </span>
            </div>

            {isLoggedIn ? (
              <button
                onClick={handleCheckoutClick}
                className="w-full bg-[#e4002b] text-white py-4 rounded-full font-['Bebas_Neue'] text-2xl tracking-widest border-2 border-[#242424] shadow-[6px_6px_0_#242424] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_#242424] transition-all cursor-pointer"
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
                  className="w-full bg-[#242424] text-white py-4 rounded-full font-['Bebas_Neue'] text-2xl tracking-widest hover:bg-[#e4002b] transition-colors shadow-md cursor-pointer"
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
