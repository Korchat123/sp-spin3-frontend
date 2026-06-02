import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../services/orderService";
import {
  getCustomerName,
  getOrderCreatedAt,
  getOrderId,
  getOrderNo,
  getOrderTotal,
  isHistoryDeliveryOrder,
  sortOrdersNewestFirst,
} from "../../utils/riderOrders";

export default function DeliveryHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(sortOrdersNewestFirst(data.filter(isHistoryDeliveryOrder)));
      setError("");
    } catch (fetchError) {
      console.error("Failed to fetch delivery history:", fetchError);
      setError("Unable to load delivery history from the server.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = order.deliveredAt ? new Date(order.deliveredAt) : getOrderCreatedAt(order);
      if (!orderDate) return false;

      if (startDate && orderDate < new Date(startDate)) return false;

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (orderDate > end) return false;
      }

      return true;
    });
  }, [orders, startDate, endDate]);

  const successfulDeliveries = orders.filter((order) => order.status === "delivered");
  const failedDeliveries = orders.filter((order) => order.status === "cancelled");
  const totalDelivered = successfulDeliveries.length;
  const totalFailed = failedDeliveries.length;
  const successRate =
    totalDelivered + totalFailed > 0
      ? ((totalDelivered / (totalDelivered + totalFailed)) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="max-w-md mx-auto bg-[#F8F9FA] min-h-screen font-sans pb-24 shadow-2xl">
      <div className="px-6 pt-12 sm:pt-16 pb-4 flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter">
          Delivery History
        </h1>
        <button
          onClick={() => navigate("/driver")}
          className="w-10 h-10 bg-white border-2 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          BACK
        </button>
      </div>

      {error && (
        <div className="mx-4 sm:mx-6 mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-center text-xs font-black text-red-700">
          {error}
        </div>
      )}

      <div className="px-4 sm:px-6 mt-6 grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-200 shadow-sm text-center">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Delivered
          </p>
          <p className="text-2xl font-black text-green-600">{totalDelivered}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-200 shadow-sm text-center">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Failed
          </p>
          <p className="text-2xl font-black text-red-600">{totalFailed}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-200 shadow-sm text-center">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Rate
          </p>
          <p className="text-2xl font-black text-blue-600">{successRate}%</p>
        </div>
      </div>

      <div className="px-4 sm:px-6 mb-6 flex gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 text-sm font-bold focus:border-[#E4002B] outline-none"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 text-sm font-bold focus:border-[#E4002B] outline-none"
        />
      </div>

      <div className="px-4 sm:px-6 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#E4002B] mb-4"></div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Loading history...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl sm:text-4xl mb-4">
              -
            </div>
            <p className="font-black uppercase text-[9px] sm:text-[10px] tracking-[0.2em]">
              No delivery history
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const totalPrice = getOrderTotal(order);
            const isSuccess = order.status === "delivered";
            const date = order.deliveredAt ? new Date(order.deliveredAt) : getOrderCreatedAt(order);

            return (
              <div
                key={getOrderId(order)}
                onClick={() => navigate(`/driver/order/${getOrderId(order)}`)}
                className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-gray-900">
                      #{getOrderNo(order)}
                    </h3>
                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {getCustomerName(order)}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase ${
                      isSuccess ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {isSuccess ? "Delivered" : "Failed"}
                  </div>
                </div>

                <div className="flex justify-between items-end pt-2 border-t border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    THB {totalPrice.toLocaleString()}
                  </p>
                  <p className="text-[9px] font-bold text-gray-300">
                    {date ? date.toLocaleDateString() : "--"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
