// ---------------------------------------------------------
// 5. Component: สรุปออเดอร์ (OrderSummary)
// ---------------------------------------------------------
const OrderSummary = ({ address, items, total }) => {
  return (
    <div className="p-6 border-t border-gray-100 mt-auto bg-gray-50">
      <h3 className="font-bold text-gray-800 mb-3">รายละเอียดการจัดส่ง</h3>
      <div className="flex items-start gap-3 mb-4">
        <div className="text-xl">📍</div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{address.title}</p>
          <p className="text-xs text-gray-500">{address.detail}</p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-xl border border-gray-100">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">รายการอาหาร</h4>
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm mb-2 text-gray-800">
            <span>{item.qty}x {item.name}</span>
            <span className="font-semibold">฿{item.price}</span>
          </div>
        ))}
        <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between font-bold text-gray-900">
          <span>รวมยอดสุทธิ</span>
          <span>฿{total}</span>
        </div>
      </div>
    </div>
  );
};