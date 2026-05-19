
import React, { useContext } from "react";
// นำเข้า Context
import { OrdersContext } from "../../context/ordersContext/OrdersContext";
import CheckoutStep from "../../component/customer/CheckoutStep"; 

const PaymentPage = () => {
  // ดึง orderList มาคำนวณราคาสรุป
  const { orderList } = useContext(OrdersContext);
  
  // คำนวณราคาเรียลไทม์
  const calculateTotal = () => {
    return orderList?.reduce((total, order) => {
      const items = order.List || order.orderList || [];
      return total + items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    }, 0) || 0;
  };

  const subTotal = calculateTotal();
  const tax = subTotal * 0.07;
  const netTotal = subTotal + tax;

  return (
    <div className="bg-[#262626] min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl text-white font-bold mb-8">ชำระเงิน (Checkout)</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* เรียกใช้ Component เปล่าๆ ไม่ต้องส่ง Props แล้ว */}
            <CheckoutStep /> 
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">สรุปคำสั่งซื้อ</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>ราคารวม</span>
                  <span>{subTotal.toLocaleString()} บาท</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>ภาษี (7%)</span>
                  <span>{tax.toLocaleString()} บาท</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>ยอดสุทธิ</span>
                  <span className="text-orange-600">{netTotal.toLocaleString()} บาท</span>
                </div>
              </div>

              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-bold transition-colors">
                ยืนยันการชำระเงิน
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;