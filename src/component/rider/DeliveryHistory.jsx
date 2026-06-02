import { useContext, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrdersContext } from '../../context/ordersContext/OrdersContext';
import { getOrderTotal } from '../../utils/customerOrders';

const getOrderNo = (order) => (order?._id ? order._id.slice(-6).toUpperCase() : "N/A");

export default function DeliveryHistory() {
  const navigate = useNavigate();
  const { orderList } = useContext(OrdersContext);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter only delivery orders (both delivered and cancelled for history)
  const allHistoryTasks = orderList ? orderList.filter(order => 
    order.type?.toLowerCase() === "delivery" && (order.status === "delivered" || order.status === "cancelled")
  ) : [];

  // Separate successful and failed deliveries
  const successfulDeliveries = allHistoryTasks.filter(order => order.status === "delivered");
  const failedDeliveries = allHistoryTasks.filter(order => order.status === "cancelled");

  // Filter by date range if selected
  const filteredOrders = useMemo(() => {
    let filtered = allHistoryTasks;
    
    if (startDate || endDate) {
      filtered = filtered.filter(order => {
        const orderTime = order.orderList?.[0]?.orderTime;
        const orderDate = orderTime instanceof Date ? orderTime : new Date(orderTime);
        
        if (startDate) {
          const start = new Date(startDate);
          if (orderDate < start) return false;
        }
        
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (orderDate > end) return false;
        }
        
        return true;
      });
    }
    
    return filtered;
  }, [allHistoryTasks, startDate, endDate]);

  const totalDelivered = successfulDeliveries.length;
  const totalFailed = failedDeliveries.length;
  const successRate = totalDelivered + totalFailed > 0 
    ? ((totalDelivered / (totalDelivered + totalFailed)) * 100).toFixed(1) 
    : 0;

  return (
    <div className="max-w-md mx-auto bg-[#F8F9FA] min-h-screen font-sans pb-24 shadow-2xl">
      {/* Header */}
      <div className="px-6 pt-12 sm:pt-16 pb-4 flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter">Delivery History</h1>
        <button 
          onClick={() => navigate('/driver')}
          className="w-10 h-10 bg-white border-2 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          ←
        </button>
      </div>

      {/* Stats Cards */}
      <div className="px-4 sm:px-6 mt-6 grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-200 shadow-sm text-center">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Delivered</p>
          <p className="text-2xl font-black text-green-600">{totalDelivered}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-200 shadow-sm text-center">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Failed</p>
          <p className="text-2xl font-black text-red-600">{totalFailed}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-200 shadow-sm text-center">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Success Rate</p>
          <p className="text-2xl font-black text-blue-600">{successRate}%</p>
        </div>
      </div>

      {/* Date Filter */}
      <div className="px-4 sm:px-6 mb-6 flex gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 text-sm font-bold focus:border-[#E4002B] outline-none"
          placeholder="Start Date"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 text-sm font-bold focus:border-[#E4002B] outline-none"
          placeholder="End Date"
        />
      </div>

      {/* Orders List */}
      <div className="px-4 sm:px-6 space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl sm:text-4xl mb-4">
              📭
            </div>
            <p className="font-black uppercase text-[9px] sm:text-[10px] tracking-[0.2em]">No delivery history</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const totalPrice = getOrderTotal(order);
            const isSuccess = order.status === "delivered";
            
            return (
              <div 
                key={order._id || order.id}
                onClick={() => navigate(`/driver/order/${order._id || order.id}`)}
                className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-gray-900">
                      #{getOrderNo(order)}
                    </h3>
                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {order.customer?.name || 'Guest'}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase ${
                    isSuccess 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {isSuccess ? "Delivered" : "Failed"}
                  </div>
                </div>

                <div className="flex justify-between items-end pt-2 border-t border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">฿{totalPrice.toLocaleString()}</p>
                  <p className="text-[9px] font-bold text-gray-300">
                    {order.orderList?.[0]?.orderTime ? new Date(order.orderList[0].orderTime).toLocaleDateString() : '--'}
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
