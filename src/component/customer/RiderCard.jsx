// ---------------------------------------------------------
// 4. Component: การ์ดไรเดอร์ (RiderCard)
// ---------------------------------------------------------
const RiderCard = ({ riderName, rating, vehicle, licensePlate }) => {
  return (
    <div className="px-6 py-4">
      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex justify-center items-center text-3xl shadow-sm">🧑‍🚀</div>
          <div>
            <h3 className="font-bold text-gray-900">{riderName} <span className="text-yellow-500 text-sm">⭐ {rating}</span></h3>
            <p className="text-sm text-gray-500">{vehicle}</p>
            <p className="text-sm font-semibold text-gray-700">{licensePlate}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button className="w-10 h-10 bg-green-500 text-white rounded-full flex justify-center items-center text-lg shadow hover:bg-green-600 transition">📞</button>
          <button className="w-10 h-10 bg-white border border-gray-200 text-gray-700 rounded-full flex justify-center items-center text-lg shadow hover:bg-gray-100 transition">💬</button>
        </div>
      </div>
    </div>
  );
};