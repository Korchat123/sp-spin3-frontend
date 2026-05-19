import React, { useState } from "react";

export default function OrderSummary({ cartItems }) {
  const [promoCode, setPromoCode] = useState("");
  
  // คำนวณยอดเงินรวม
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = 0; // จำลองส่วนลด
  const deliveryFee = 0; // ฟรีค่าจัดส่ง
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="sticky top-24 bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4">สรุปคำสั่งซื้อ</h2>
      
      {/* Item List */}
      <div className="space-y-3 mb-6">
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between text-sm text-gray-300">
            <span>{item.name} × {item.qty}</span>
            <span>฿{item.price * item.qty}</span>
          </div>
        ))}
      </div>

      {/* Promo Code Input */}
      <div className="flex items-center bg-[#1a1a1a] border border-gray-600 rounded-lg p-1 mb-6">
        <span className="px-3 text-[#DC5F00]">🏷️</span>
        <input 
          type="text" 
          placeholder="โค้ดส่วนลด" 
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          className="w-full bg-transparent text-white focus:outline-none text-sm p-2" 
        />
        <button className="text-[#DC5F00] font-bold px-4 hover:underline">ใช้</button>
      </div>

      {/* Totals */}
      <div className="space-y-3 border-b border-gray-600 pb-4 mb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">ราคาอาหาร</span>
          <span>฿{subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">ค่าจัดส่ง</span>
          <span className="text-green-500">ฟรี</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">ส่วนลด</span>
          <span className="text-red-500">-฿{discount}</span>
        </div>
      </div>

      <div className="flex justify-between font-bold text-lg mb-6">
        <span>ยอดรวม</span>
        <span className="text-[#DC5F00]">฿{total}</span>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-gray-400 mb-6">
        <div>🔒 ปลอดภัย SSL</div>
        <div>⏱️ จัดส่งด่วน</div>
        <div>📞 ซัพพอร์ต 24/7</div>
      </div>

      <button className="w-full bg-[#DC5F00] hover:bg-[#c25400] text-white font-bold py-4 rounded-lg transition duration-300">
        สั่งซื้อและชำระเงิน - ฿{total}
      </button>

      <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center">
        🔒 ชำระเงินปลอดภัย - เข้ารหัส 256-bit
      </p>
    </div>
  );
}