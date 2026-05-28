import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext/UserContext";
import { PaymentContext } from "../../context/paymentContext";
import { ShopContext } from "../../context/ShopProvider";
import { orderService } from "../../services/orderService";
import { paymentService } from "../../services/paymentService";

export default function OrderSummary({ cartItems, bookingData }) {
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { myUserInfo } = useContext(UserContext);
  const { paymentState } = useContext(PaymentContext);
  const { setCart } = useContext(ShopContext);

  // คำนวณยอดเงินรวม (ใช้ item.quantity แทน item.qty)
  const subtotal = cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
  const tax = subtotal * 0.07; // 7% VAT
  const discount = 0; // จำลองส่วนลด
  const deliveryFee = 0; // ฟรีค่าจัดส่ง
  const total = subtotal + tax - discount + deliveryFee;

  const handleOrderAndPay = async () => {
    if (cartItems.length === 0) {
      alert("กรุณาเลือกสินค้าก่อนชำระเงิน");
      return;
    }

    if (!myUserInfo) {
      alert("กรุณาเข้าสู่ระบบก่อนสั่งซื้อ");
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Create order in backend
      const orderData = {
        type: "delivery", // Default to delivery for now
        customer: {
          name: myUserInfo.name,
          contact: myUserInfo.phone || "081-234-5678",
          address: "123 Street, Bangkok", // Should be from addresses state
          note: "None"
        },
        orderList: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image || ""
        }))
      };

      const newOrder = await orderService.createOrder(orderData);

      // 2. Process payment (mock)
      const paymentDetails = {
        paymentMethod: paymentState.selectedPaymentMethod || "cash",
        amount: total
      };

      await paymentService.processPayment(newOrder._id, paymentDetails);

      // 3. Clear cart and redirect
      setCart([]);
      localStorage.removeItem("crispyCart");

      alert("สั่งซื้อสำเร็จ! กำลังนำคุณไปยังหน้าติดตามสถานะ");
      navigate("/order-tracking", { state: { orderId: newOrder._id } });

    } catch (error) {
      console.error("Payment failed:", error);
      alert("เกิดข้อผิดพลาดในการชำระเงิน: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="sticky top-24 bg-[#262626] rounded-xl p-6 shadow-lg border border-gray-700 text-white">
      <h2 className="text-xl font-bold mb-4">สรุปคำสั่งซื้อ</h2>

      {/* Item List */}
      <div className="space-y-3 mb-6">
        {cartItems.length === 0 ? (
          <p className="text-sm text-gray-400">ไม่มีรายการอาหาร</p>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="flex justify-between text-sm text-gray-300">
              <span>{item.name} × {item.quantity}</span>
              <span>฿{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))
        )}
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
          <span>฿{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">ภาษี (7%)</span>
          <span>฿{tax.toLocaleString()}</span>
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
        <span className="text-[#DC5F00]">฿{total.toLocaleString()}</span>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-gray-400 mb-6">
        <div>🔒 ปลอดภัย SSL</div>
        <div>⏱️ จัดส่งด่วน</div>
        <div>📞 ซัพพอร์ต 24/7</div>
      </div>

      <button 
        onClick={handleOrderAndPay}
        disabled={isProcessing}
        className={`w-full bg-[#DC5F00] hover:bg-[#c25400] text-white font-bold py-4 rounded-lg transition duration-300 flex items-center justify-center gap-2 ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            กำลังดำเนินการ...
          </>
        ) : (
          `สั่งซื้อและชำระเงิน - ฿${total.toLocaleString()}`
        )}
      </button>

      <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center">
        🔒 ชำระเงินปลอดภัย - เข้ารหัส 256-bit
      </p>
    </div>
  );
}