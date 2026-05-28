import React, { useState, useContext, useCallback } from "react";
import { OrdersContext } from "../../context/ordersContext/OrdersContext";
import { PaymentContext } from "../../context/paymentContext";

export default function CheckoutSteps({ bookingData }) {
  const { orderList } = useContext(OrdersContext);
  const { paymentState, setPaymentMethod: setPaymentMethodContext } = useContext(PaymentContext);

  // Address management
  const [addresses, setAddresses] = useState([
    {
      id: "home",
      type: "บ้าน",
      name: "สมชาย ใจดี",
      detail: "123/45 ถ.สุขุมวิท แขวงคลองเตย\nเขตคลองเตย กรุงเทพฯ 10110",
      phone: "081-234-5678",
      labelBg: "bg-orange-200 text-orange-800",
    },
    {
      id: "work",
      type: "ที่ทำงาน",
      name: "สมชาย ใจดี",
      detail: "88 อาคาร FYI Center ชั้น 12\nถ.รัชดาภิเษก กรุงเทพฯ 10120",
      phone: "081-234-5678",
      labelBg: "bg-blue-200 text-blue-800",
    },
  ]);

  const [selectedAddress, setSelectedAddress] = useState("home");
  const [selectedTime, setSelectedTime] = useState("fastest");

  const paymentMethod = paymentState.selectedPaymentMethod || "บัตรเครดิต";

  // Add address form state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: "อื่นๆ",
    name: "",
    detail: "",
    phone: "",
  });

  const times = [
    { id: "fastest", label: "เร็วที่สุด\n~30 นาที" },
    { id: "1300", label: "13:00 - 13:30" },
    { id: "1330", label: "13:30 - 14:00" },
    { id: "1400", label: "14:00 - 14:30" },
    { id: "1430", label: "14:30 - 15:00" },
    { id: "1500", label: "15:00 - 15:30" },
  ];

  // Save new address
  const handleSaveAddress = useCallback(() => {
    if (!newAddress.name || !newAddress.detail || !newAddress.phone) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    const newId = "addr_" + Date.now();
    setAddresses((prev) => [
      ...prev,
      {
        id: newId,
        ...newAddress,
        labelBg: "bg-gray-200 text-gray-800",
      },
    ]);
    setSelectedAddress(newId);
    setIsAddingAddress(false);
    setNewAddress({ type: "อื่นๆ", name: "", detail: "", phone: "" });
  }, [newAddress]);

  // Update payment method in context
  const handlePaymentMethodChange = useCallback((method) => {
    setPaymentMethodContext(method);
  }, [setPaymentMethodContext]);

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
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl text-black">
                          {item.emoji || "🍔"}
                        </div>
                        <div>
                          <h3 className="font-bold">{item.name}</h3>
                          <p className="text-sm text-gray-400">
                            {item.desc || ""}
                          </p>
                          <div className="text-sm text-gray-300 mt-1">
                            จำนวน:{" "}
                            <span className="font-bold text-white">
                              {item.quantity}
                            </span>{" "}
                            รายการ
                          </div>
                        </div>
                      </div>
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
      </div>

      {/* Step 2: ที่อยู่จัดส่ง */}
      <div className="bg-[#262626] rounded-xl p-6 border border-gray-700 text-white">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <span className="bg-[#DC5F00] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">
            2
          </span>
          ที่อยู่จัดส่ง
        </h2>

        <div className="space-y-3">
          {addresses.map((addr) => (
            <label
              key={addr.id}
              className={`block border p-4 rounded-lg cursor-pointer transition ${
                selectedAddress === addr.id
                  ? "border-[#DC5F00] bg-[#333]"
                  : "border-gray-600"
              }`}
            >
              <div className="flex items-start space-x-3">
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddress === addr.id}
                  onChange={() => setSelectedAddress(addr.id)}
                  className="mt-1 accent-[#DC5F00]"
                />
                <div className="flex-1">
                  <span
                    className={`${addr.labelBg} text-xs px-2 py-1 rounded font-bold`}
                  >
                    {addr.type}
                  </span>
                  <p className="font-bold mt-1">{addr.name}</p>
                  <p className="text-sm text-gray-400 whitespace-pre-line">
                    {addr.detail}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    โทร: {addr.phone}
                  </p>
                </div>
              </div>
            </label>
          ))}
        </div>

        {isAddingAddress ? (
          <div className="mt-4 bg-[#1a1a1a] p-4 rounded-lg border border-gray-600 space-y-3">
            <input
              type="text"
              placeholder="ชื่อ-นามสกุล"
              value={newAddress.name}
              onChange={(e) =>
                setNewAddress({ ...newAddress, name: e.target.value })
              }
              className="w-full bg-[#333] border border-gray-600 rounded p-2 text-white"
            />
            <input
              type="text"
              placeholder="เบอร์โทรศัพท์"
              value={newAddress.phone}
              onChange={(e) =>
                setNewAddress({ ...newAddress, phone: e.target.value })
              }
              className="w-full bg-[#333] border border-gray-600 rounded p-2 text-white"
            />
            <textarea
              placeholder="ที่อยู่จัดส่งโดยละเอียด"
              value={newAddress.detail}
              onChange={(e) =>
                setNewAddress({ ...newAddress, detail: e.target.value })
              }
              className="w-full bg-[#333] border border-gray-600 rounded p-2 text-white h-20"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveAddress}
                className="bg-[#DC5F00] text-white px-4 py-2 rounded font-bold hover:bg-orange-600"
              >
                บันทึกที่อยู่
              </button>
              <button
                onClick={() => setIsAddingAddress(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingAddress(true)}
            className="text-[#DC5F00] font-bold mt-4 flex items-center hover:underline"
          >
            + เพิ่มที่อยู่ใหม่
          </button>
        )}
      </div>

      {/* Step 3: เวลาจัดส่ง */}
      <div className="bg-[#262626] rounded-xl p-6 border border-gray-700 text-white">
        <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="bg-[#DC5F00] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">
              3
            </span>
            เวลาจัดส่ง
          </div>
          <div className="text-sm font-normal text-gray-400 bg-[#333] px-3 py-1 rounded-full">
            วันที่:{" "}
            <span className="text-orange-400 font-bold">{bookingData?.bookingDate || "2024-05-27"}</span>
          </div>
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
      <div className="bg-[#262626] rounded-xl p-6 border border-gray-700 text-white">
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
                onClick={() => handlePaymentMethodChange(method)}
                className={`px-4 py-2 whitespace-nowrap text-sm ${paymentMethod === method ? "text-[#DC5F00] border-b-2 border-[#DC5F00] font-bold" : "text-gray-400 hover:text-white"}`}
              >
                {method}
              </button>
            ),
          )}
        </div>

        {paymentMethod === "บัตรเครดิต" && (
          <>
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
                  <label className="block text-sm text-gray-400 mb-1">
                    CVV
                  </label>
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
          </>
        )}
      </div>
    </div>
  );
}
