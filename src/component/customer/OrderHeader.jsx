
// ---------------------------------------------------------
// 2. Component: ส่วนหัวและ ETA (OrderHeader)
// ---------------------------------------------------------
const OrderHeader = ({ orderId, etaMinutes }) => {
  return (
    <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="font-bold text-gray-800 text-lg">Order #{orderId}</div>
        <button className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-red-100 transition-colors">
          🆘 แจ้งปัญหา
        </button>
      </div>
      <div>
        <p className="text-gray-500 text-sm mb-1">คาดว่าจะถึงใน</p>
        <div className="flex items-center gap-3">
          <h1 className="text-5xl font-extrabold text-gray-900">{etaMinutes} นาที</h1>
          {/* สัญญาณไฟกระพริบ */}
          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
