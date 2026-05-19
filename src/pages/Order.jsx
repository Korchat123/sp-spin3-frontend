
import React, { useContext } from "react";
import { OrdersContext } from "../context/ordersContext/OrdersContext";

const OrderItem = ({ item, orderId, onUpdateQty, onRemove }) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-4 last:border-0">
      <div className="flex-1">
        <h3 className="font-bold text-gray-800">{item.name}</h3>
        <p className="text-sm text-orange-600 font-semibold">
          {item.price
            ? `${(item.price * item.quantity).toLocaleString()} บาท`
            : "รอระบุราคา"}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* ส่วนเพิ่ม-ลดจำนวน */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onUpdateQty(orderId, item.id, -1)}
            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-all text-gray-600 shadow-sm"
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className="w-10 text-center font-bold text-gray-700">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQty(orderId, item.id, 1)}
            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-all text-gray-600 shadow-sm"
          >
            +
          </button>
        </div>

        {/* ปุ่มลบทิ้ง */}
        <button
          onClick={() => onRemove(orderId, item.id)}
          className="text-gray-300 hover:text-red-500 transition-colors p-2"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

const Order = () => {
  const { orderList, setOrderList } = useContext(OrdersContext);

  // ฟังก์ชันปรับจำนวน
  const handleUpdateQty = (orderId, itemId, change) => {
    const updated = orderList.map((order) => {
      if (order.orderId === orderId) {
        const key = order.List ? "List" : "orderList";
        return {
          ...order,
          [key]: order[key].map((item) =>
            item.id === itemId
              ? { ...item, quantity: Math.max(1, item.quantity + change) }
              : item,
          ),
        };
      }
      return order;
    });
    setOrderList(updated);
  };

  // ฟังก์ชันลบรายการ
  const handleRemove = (orderId, itemId) => {
    if (window.confirm("ต้องการลบรายการนี้ใช่หรือไม่?")) {
      const updated = orderList
        .map((order) => {
          if (order.orderId === orderId) {
            const key = order.List ? "List" : "orderList";
            return {
              ...order,
              [key]: order[key].filter((item) => item.id !== itemId),
            };
          }
          return order;
        })
        .filter((order) => (order.List || order.orderList).length > 0);
      setOrderList(updated);
    }
  };

  // คำนวณราคาสรุป (สมมติว่ามี field price ใน item)
  const calculateTotal = () => {
    return orderList?.reduce((total, order) => {
      const items = order.List || order.orderList || [];
      return (
        total +
        items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
      );
    }, 0);
  };

  return (
    <div className="py-10 bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-black text-gray-800 mb-8 flex items-center gap-3">
          <span className="bg-orange-500 w-2 h-8 rounded-full"></span>
          My Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* รายการอาหาร */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
              {!orderList || orderList.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  ตะกร้าสินค้าว่างเปล่า
                </div>
              ) : (
                orderList.map((order) => (
                  <div key={order.orderId}>
                    {(order.List || order.orderList || []).map((item) => (
                      <OrderItem
                        key={item.id}
                        item={item}
                        orderId={order.orderId}
                        onUpdateQty={handleUpdateQty}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* สรุปยอดและปุ่มชำระเงิน */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 sticky top-10">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                สรุปยอดเงิน
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-500">
                  <span>ราคารวม</span>
                  <span>{calculateTotal().toLocaleString()} บาท</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>ภาษี (7%)</span>
                  <span>{(calculateTotal() * 0.07).toLocaleString()} บาท</span>
                </div>
                <div className="border-t border-dashed pt-3 mt-3 flex justify-between font-black text-xl text-gray-900">
                  <span>สุทธิ</span>
                  <span className="text-orange-600">
                    {(calculateTotal() * 1.07).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => alert("เข้าสู่ระบบชำระเงิน")}
                className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-xl"
              >
                ชำระเงินตอนท้าย
              </button>

              <p className="text-[10px] text-center text-gray-400 mt-4 uppercase tracking-widest">
                Secured by Payment Gateway
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Order;
