import { useContext, useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Calendar, Filter, Award, CheckCircle2, XCircle, TrendingUp, ChevronRight, Package } from 'lucide-react';
import { OrdersContext } from '../../context/ordersContext/OrdersContext';
import { getOrderNo } from '../../utils/riderOrders';
const normalizeValue = (value) => String(value || '').trim().toLowerCase();

export default function DeliveryHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderList, fetchAllOrders } = useContext(OrdersContext);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const activeTab = location.pathname === '/driver/history' ? 'history' : 'current';

  useEffect(() => {
    fetchAllOrders?.();
  }, [fetchAllOrders]);

  const currentTasksCount = useMemo(() => 
    orderList ? orderList.filter(order => 
      normalizeValue(order.type) === "delivery" && 
      (normalizeValue(order.status) === "delivery" || normalizeValue(order.status) === "shipping")
    ).length : 0
  , [orderList]);

  const allHistoryTasks = useMemo(() => 
    orderList ? orderList.filter(order =>
      normalizeValue(order.type) === "delivery" && (normalizeValue(order.status) === "delivered" || normalizeValue(order.status) === "cancelled")
    ) : []
  , [orderList]);

  const successfulDeliveries = allHistoryTasks.filter(order => normalizeValue(order.status) === "delivered");
  const failedDeliveries = allHistoryTasks.filter(order => normalizeValue(order.status) === "cancelled");

  const filteredOrders = useMemo(() => {
    let filtered = allHistoryTasks;
    if (startDate || endDate) {
      filtered = filtered.filter(order => {
        const orderTime = order.deliveredAt || order.orderList?.[0]?.orderTime || order.createdAt;
        if (!orderTime) return false;
        const orderDate = orderTime instanceof Date ? orderTime : new Date(orderTime);
        if (isNaN(orderDate.getTime())) return false;
        if (startDate && orderDate < new Date(startDate)) return false;
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (orderDate > end) return false;
        }
        return true;
      });
    }
    return [...filtered].sort((a, b) => new Date(b.deliveredAt || b.createdAt) - new Date(a.deliveredAt || a.createdAt));
  }, [allHistoryTasks, startDate, endDate]);

  const totalDelivered = successfulDeliveries.length;
  const totalFailed = failedDeliveries.length;
  
  // Calculate total earnings from filtered successful deliveries
  const totalRevenue = useMemo(() => {
    return filteredOrders
      .filter(order => normalizeValue(order.status) === "delivered")
      .reduce((acc, order) => {
        const orderTotal = (order.orderList || []).reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return acc + orderTotal;
      }, 0);
  }, [filteredOrders]);

  const successRate = totalDelivered + totalFailed > 0
    ? ((totalDelivered / (totalDelivered + totalFailed)) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="w-full max-w-[430px] mx-auto bg-[#FAFAFA] min-h-screen font-sans pb-24 shadow-2xl overflow-x-hidden border-x border-gray-100 relative">
      
      {/* --- Header --- */}
      <div className="bg-white/80 backdrop-blur-md px-6 pt-14 pb-6 flex justify-between items-center sticky top-0 z-40 border-b border-gray-100">
        <button onClick={() => navigate('/driver')} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-black text-gray-900 uppercase tracking-[0.2em]">HISTORY</h1>
        <button 
          onClick={() => setIsFilterModalOpen(true)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors relative ${
            startDate || endDate ? 'bg-[#D33131] text-white' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Filter size={18} />
          {(startDate || endDate) && <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>}
        </button>
      </div>

      <div className="px-5 mt-8">
        {/* Achievement Card remains same */}
        <div className="bg-white rounded-[2.5rem] p-7 mb-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Award size={120} className="text-black" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Success Rate</p>
                  <p className="text-xl font-black text-gray-900">{successRate}%</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-green-50/50 rounded-2xl border border-green-100/50">
                  <p className="text-[9px] font-black text-green-700 uppercase tracking-widest mb-1">Delivered</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-600" />
                    <span className="text-lg font-black text-green-900">{totalDelivered}</span>
                  </div>
               </div>
               <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100/50">
                  <p className="text-[9px] font-black text-red-700 uppercase tracking-widest mb-1">Failed</p>
                  <div className="flex items-center gap-2">
                    <XCircle size={16} className="text-red-600" />
                    <span className="text-lg font-black text-red-900">{totalFailed}</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* --- Premium Navigation --- */}
        <div className="flex mt-8 mb-6 p-1.5 bg-gray-100/80 backdrop-blur-sm rounded-[1.5rem] relative">
          <div 
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-2xl shadow-sm transition-all duration-300 ease-out ${activeTab === 'history' ? 'translate-x-[100%]' : 'translate-x-0'}`}
          />
          <button
            onClick={() => navigate('/driver')}
            className={`flex-1 py-3.5 z-10 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${activeTab === 'current' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Tasks ({currentTasksCount})
          </button>
          <button
            onClick={() => navigate('/driver/history')}
            className={`flex-1 py-3.5 z-10 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${activeTab === 'history' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
          >
            History
          </button>
        </div>

        {/* --- History Timeline --- */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2 mb-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Order Timeline</h2>
            <div className="flex items-center gap-2">
              {(startDate || endDate) && (
                <button 
                  onClick={() => { setStartDate(''); setEndDate(''); }}
                  className="text-[9px] font-black text-[#D33131] uppercase underline"
                >
                  Clear Filter
                </button>
              )}
              <span className="text-[10px] font-black text-gray-300">{filteredOrders.length} Records</span>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
              <Package size={40} className="text-gray-200 mb-4" />
              <p className="font-black uppercase text-[10px] tracking-[0.3em] text-gray-300">No records found</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const total = (order.orderList || []).reduce((sum, item) => sum + (item.price * item.quantity), 0);
              const isSuccess = normalizeValue(order.status) === "delivered";
              const date = new Date(order.deliveredAt || order.createdAt);
              const firstItem = order.orderList?.[0] || {};

              return (
                <div
                  key={order._id}
                  onClick={() => navigate(`/driver/order/${order._id}`)}
                  className="group bg-white rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100 hover:border-black/5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all cursor-pointer flex items-center gap-4"     
                >
                  <div className="relative shrink-0">
                    <img 
                      src={firstItem.image || "/images/placeholder.png"} 
                      alt="food" 
                      className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-gray-50 bg-gray-50"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${
                      isSuccess ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {isSuccess ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-black text-gray-900 tracking-tight">#{getOrderNo(order)}</h3>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase truncate">{order.customer?.name || 'Guest User'}</p>
                      <p className="text-[9px] font-black text-gray-300">{date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-black group-hover:text-white transition-all">
                    <ChevronRight size={16} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* --- Filter Modal --- */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-end justify-center">
          <div className="w-full max-w-[430px] bg-white rounded-t-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 border-x border-t border-gray-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-white pt-2 pb-4 z-10">
              <h3 className="font-black text-base uppercase tracking-tight">Filter by Date</h3>
              <button onClick={() => setIsFilterModalOpen(false)} className="text-gray-300 hover:text-black transition-colors">
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-6 mb-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Start Date</label>
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3 border border-gray-100 focus-within:border-black transition-colors">
                  <Calendar size={18} className="text-gray-400" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs font-black uppercase outline-none bg-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">End Date</label>
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3 border border-gray-100 focus-within:border-black transition-colors">
                  <Calendar size={18} className="text-gray-400" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs font-black uppercase outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="flex-1 py-4 rounded-2xl bg-gray-100 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-200 transition-all"
              >
                Reset
              </button>
              <button 
                onClick={() => setIsFilterModalOpen(false)}
                className="flex-[2] py-4 rounded-2xl bg-black text-white text-[11px] font-black uppercase tracking-widest hover:bg-gray-900 transition-all shadow-xl shadow-gray-200"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
