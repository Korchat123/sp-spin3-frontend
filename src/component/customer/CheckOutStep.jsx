import React, { useState, useContext } from "react";
import { OrdersContext } from "../../context/ordersContext/OrdersContext";

// รับ Props 'cartItems' เข้ามา
export default function CheckoutSteps({ cartItems, updateQty }) {
  const { orderList, setOrderList } = useContext(OrdersContext);
  const [selectedAddress, setSelectedAddress] = useState("home");
  const [selectedTime, setSelectedTime] = useState("fastest");
  const [paymentMethod, setPaymentMethod] = useState("credit");

  const times = [
    { id: "fastest", label: "เร็วที่สุด\n~30 นาที" },
    { id: "1300", label: "13:00 - 13:30" },
    { id: "1330", label: "13:30 - 14:00" },
    { id: "1400", label: "14:00 - 14:30" },
    { id: "1430", label: "14:30 - 15:00" },
    { id: "1500", label: "15:00 - 15:30" },
  ];
  // 3. ฟังก์ชันสำหรับอัปเดตจำนวน (ก๊อปมาจาก OrderPage)
  const handleUpdateQty = (orderId, itemId, change) => {
    const updated = orderList.map((order) => {
      if (order.orderId === orderId) {
        const key = order.List ? "List" : "orderList";
        return {
          ...order,
          [key]: order[key].map((item) =>
            item.id === itemId
              ? { ...item, quantity: Math.max(1, item.quantity + change) } // ห้ามลดต่ำกว่า 1
              : item,
          ),
        };
      }
      return order;
    });
    // พอ set ปุ๊บ ราคาหน้า OrderSummary (PaymentPage) จะเปลี่ยนตามทันที
    setOrderList(updated);
  };

  return (
    <div className="space-y-6">
      {/* Step 1: รายการอาหาร */}
      <div className="bg-[#262626] rounded-xl p-6 text-white border border-gray-700">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">
            1
          </span>
          รายการอาหาร
        </h2>

        <div className="space-y-4">
          {/* 4. แสดงข้อมูลจาก Context อย่างปลอดภัย */}
          {!orderList || !Array.isArray(orderList) || orderList.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              ไม่มีสินค้าที่รอชำระเงิน
            </div>
          ) : (
            orderList.map((order) => {
              const itemsList = Array.isArray(order.List)
                ? order.List
                : Array.isArray(order.orderList)
                  ? order.orderList
                  : [];

              return (
                <div key={order.orderId}>
                  {itemsList.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-[#333] p-4 rounded-lg mt-2"
                    >
                      {/* รายละเอียดฝั่งซ้าย */}
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl text-black">
                          🍔
                        </div>
                        <div>
                          <h3 className="font-bold">{item.name}</h3>
                          <p className="text-sm text-gray-400">
                            {item.desc || ""}
                          </p>

                          {/* 5. ปุ่มเพิ่ม-ลดจำนวน */}
                          <div className="flex items-center space-x-3 mt-2">
                            <button
                              onClick={() =>
                                handleUpdateQty(order.orderId, item.id, -1)
                              }
                              disabled={item.quantity <= 1}
                              className={`w-6 h-6 rounded-full border flex items-center justify-center ${item.quantity <= 1 ? "border-gray-600 text-gray-600 cursor-not-allowed" : "border-gray-400 text-white hover:bg-gray-600"}`}
                            >
                              -
                            </button>
                            <span className="font-bold text-white w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQty(order.orderId, item.id, 1)
                              }
                              className="w-6 h-6 rounded-full border border-gray-400 text-white flex items-center justify-center hover:bg-gray-600"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* ราคาฝั่งขวา */}
                      <div className="font-bold text-lg text-orange-500">
                        {item.price
                          ? `฿${(item.price * item.quantity).toLocaleString()}`
                          : "รอระบุราคา"}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-400 mb-2">หมายเหตุพิเศษ</p>
          <input
            type="text"
            placeholder="เช่น ไม่เอาผัก, เผ็ดน้อย, แพ้อาหาร..."
            className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Step 2: ที่อยู่จัดส่ง */}
      <div className="bg-[#262626] rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <span className="bg-[#DC5F00] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">
            2
          </span>
          ที่อยู่จัดส่ง
        </h2>
        <div className="space-y-3">
          {/* Address 1 */}
          <label
            className={`block border p-4 rounded-lg cursor-pointer transition ${selectedAddress === "home" ? "border-[#DC5F00] bg-[#333]" : "border-gray-600"}`}
          >
            <div className="flex items-start space-x-3">
              <input
                type="radio"
                name="address"
                checked={selectedAddress === "home"}
                onChange={() => setSelectedAddress("home")}
                className="mt-1 accent-[#DC5F00]"
              />
              <div>
                <span className="bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded font-bold">
                  บ้าน
                </span>
                <p className="font-bold mt-1">สมชาย ใจดี</p>
                <p className="text-sm text-gray-400">
                  123/45 ถ.สุขุมวิท แขวงคลองเตย
                  <br />
                  เขตคลองเตย กรุงเทพฯ 10110
                </p>
                <p className="text-sm text-gray-400 mt-1">โทร: 081-234-5678</p>
              </div>
            </div>
          </label>

          {/* Address 2 */}
          <label
            className={`block border p-4 rounded-lg cursor-pointer transition ${selectedAddress === "work" ? "border-[#DC5F00] bg-[#333]" : "border-gray-600"}`}
          >
            <div className="flex items-start space-x-3">
              <input
                type="radio"
                name="address"
                checked={selectedAddress === "work"}
                onChange={() => setSelectedAddress("work")}
                className="mt-1 accent-[#DC5F00]"
              />
              <div>
                <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded font-bold">
                  ที่ทำงาน
                </span>
                <p className="font-bold mt-1">สมชาย ใจดี</p>
                <p className="text-sm text-gray-400">
                  88 อาคาร FYI Center ชั้น 12
                  <br />
                  ถ.รัชดาภิเษก กรุงเทพฯ 10120
                </p>
              </div>
            </div>
          </label>
        </div>
        <button className="text-[#DC5F00] font-bold mt-4 flex items-center hover:underline">
          + เพิ่มที่อยู่ใหม่
        </button>
      </div>

      {/* Step 3: เวลาจัดส่ง */}
      <div className="bg-[#262626] rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <span className="bg-[#DC5F00] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">
            3
          </span>
          เวลาจัดส่ง
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {times.map((time) => (
            <button
              key={time.id}
              onClick={() => setSelectedTime(time.id)}
              className={`p-3 rounded-lg border text-center whitespace-pre-line text-sm transition ${
                selectedTime === time.id
                  ? "border-[#DC5F00] text-[#DC5F00] font-bold bg-[#333]"
                  : "border-gray-600 text-gray-300 hover:border-gray-400"
              }`}
            >
              {time.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 4: วิธีชำระเงิน */}
      <div className="bg-[#262626] rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <span className="bg-[#DC5F00] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">
            4
          </span>
          วิธีชำระเงิน
        </h2>
        <div className="flex space-x-2 mb-6 border-b border-gray-600 pb-2 overflow-x-auto">
          {["บัตรเครดิต", "พร้อมเพย์", "e-Wallet", "เงินสด"].map(
            (method, idx) => (
              <button
                key={idx}
                className={`px-4 py-2 whitespace-nowrap text-sm ${idx === 0 ? "text-[#DC5F00] border-b-2 border-[#DC5F00] font-bold" : "text-gray-400"}`}
              >
                {method}
              </button>
            ),
          )}
        </div>

        {/* Credit Card Mockup Form */}
        <div className="bg-[#E9662A] rounded-xl p-6 text-white w-full max-w-sm mb-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <div className="w-12 h-8 bg-white/30 rounded"></div>
            <div className="font-bold italic">VISA</div>
          </div>
          <div className="text-2xl tracking-widest mb-6">
            **** **** **** ****
          </div>
          <div className="flex justify-between text-xs">
            <div>
              <p className="opacity-70">ชื่อบนบัตร</p>
              <p className="font-bold text-sm">YOUR NAME</p>
            </div>
            <div>
              <p className="opacity-70">หมดอายุ</p>
              <p className="font-bold text-sm">MM/YY</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              หมายเลขบัตร
            </label>
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-[#DC5F00]"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              ชื่อผู้ถือบัตร
            </label>
            <input
              type="text"
              placeholder="ชื่อ นามสกุล (ภาษาอังกฤษ)"
              className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-[#DC5F00]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                วันหมดอายุ
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-[#DC5F00]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">CVV</label>
              <input
                type="password"
                placeholder="***"
                className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-[#DC5F00]"
              />
            </div>
          </div>
          <label className="flex items-center space-x-2 cursor-pointer mt-4">
            <input type="checkbox" className="accent-[#DC5F00]" />
            <span className="text-sm text-gray-300">
              บันทึกบัตรสำหรับครั้งถัดไป
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}