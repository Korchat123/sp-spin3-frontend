import { useContext, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, TrendingUp, Package, CheckCircle2, Clock, MapPin, ChevronRight, User } from "lucide-react";
import { OrdersContext } from "../../context/ordersContext/OrdersContext";
import { UserContext } from "../../context/userContext/UserContext";
import { getOrderNo } from "../../utils/riderOrders";

export default function DriverDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderList, fetchAllOrders, loading } = useContext(OrdersContext);
  const { myUserInfo } = useContext(UserContext);

  const activeTab = location.pathname === '/driver/history' ? 'history' : 'current';

  useEffect(() => {
    fetchAllOrders();
    const interval = setInterval(() => {
      fetchAllOrders();
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchAllOrders]);

  const deliveryTasks = useMemo(() => 
    Array.isArray(orderList) ? orderList.filter(order => order.type?.toLowerCase() === "delivery") : []
  , [orderList]);

  const currentTasks = useMemo(() => 
    deliveryTasks.filter(task => task.status === "delivery" || task.status === "shipping")
  , [deliveryTasks]);

  const historyTasks = useMemo(() => 
    deliveryTasks.filter(task => task.status === "delivered" || task.status === "cancelled")
  , [deliveryTasks]);

  const latestDayHistoryTasks = useMemo(() => {
    if (historyTasks.length === 0) return [];
    const ordersWithDates = historyTasks.map(order => {
      const orderTime = order.deliveredAt || order.orderList?.[0]?.orderTime || order.createdAt;
      return { ...order, orderDate: orderTime instanceof Date ? orderTime : new Date(orderTime) };
    }).filter(o => !isNaN(o.orderDate.getTime()));
    if (ordersWithDates.length === 0) return [];
    const latestDate = new Date(Math.max(...ordersWithDates.map(o => o.orderDate.getTime())));
    return ordersWithDates.filter(o => o.orderDate.toDateString() === latestDate.toDateString());
  }, [historyTasks]);

  const readyToPickTasks = currentTasks;

  return (
    <div className="w-full max-w-[430px] mx-auto bg-[#FAFAFA] min-h-screen font-sans pb-28 relative shadow-2xl overflow-x-hidden border-x border-gray-100">
      
      {/* --- Premium Personalised Header --- */}
      <div className="bg-white px-6 pt-12 pb-6 sticky top-0 z-50 border-b border-gray-50/80 shadow-sm backdrop-blur-xl bg-white/90">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter leading-[1.1]">
              Welcome back, <br/>
              <span className="text-[#D33131] uppercase">{myUserInfo?.name} {myUserInfo?.surname || ''}</span>
            </h1>
          </div>
          
          <button 
            onClick={() => navigate('/driver/profile')}
            className="group relative"
          >
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-black transition-all duration-300">
              {myUserInfo?.profileImage ? (
                <img src={myUserInfo.profileImage} alt="profile" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <User size={20} className="text-gray-400 group-hover:text-white transition-colors" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
            </div>
          </button>
        </div>
      </div>

      <div className="px-5 mt-6">
        {/* --- Redesigned Stats Grid --- */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center justify-center text-center group hover:border-orange-100 transition-all">
            <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-3 group-hover:scale-110 transition-transform">
              <Clock size={20} />
            </div>
            <span className="text-[20px] font-black text-gray-900 tracking-tighter mb-1">
              {currentTasks.length - readyToPickTasks.length}
            </span>
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">In Kitchen</span>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center justify-center text-center group hover:border-green-100 transition-all">
            <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 mb-3 group-hover:scale-110 transition-transform">
              <Package size={20} />
            </div>
            <span className="text-[20px] font-black text-gray-900 tracking-tighter mb-1">
              {readyToPickTasks.length}
            </span>
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">To Pick</span>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center justify-center text-center group hover:border-blue-100 transition-all">
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-3 group-hover:scale-110 transition-transform">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-[20px] font-black text-gray-900 tracking-tighter mb-1">
              {latestDayHistoryTasks.length}
            </span>
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Finished</span>
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
            Tasks ({currentTasks.length})
          </button>
          <button
            onClick={() => navigate('/driver/history')}
            className={`flex-1 py-3.5 z-10 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${activeTab === 'history' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
          >
            History
          </button>
        </div>
      </div>

      {/* --- Task Cards List --- */}
      <div className="px-5 space-y-5">
        {loading && currentTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-100 rounded-full"></div>
              <div className="absolute top-0 w-12 h-12 border-4 border-[#D33131] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Refreshing Live Data</p>
          </div>
        ) : currentTasks.length > 0 ? (
          currentTasks.map((task) => {
            const orderItems = task.orderList || [];
            const isReady = task.status === "delivery";
            const isInTransit = task.status === "shipping";

            return (
              <div
                key={task._id}
                onClick={() => navigate(`/driver/order/${task._id}`)}
                className="group relative bg-white rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:border-red-100 hover:shadow-[0_8px_30px_rgba(211,49,49,0.08)] transition-all cursor-pointer active:scale-[0.98]"
              >
                <div className="flex justify-between items-start mb-5">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Order ID</span>
                    <h2 className="text-base font-black text-gray-900 tracking-tight">#{getOrderNo(task)}</h2>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm transition-colors ${
                    isReady ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-orange-50 text-orange-600 border border-orange-100'
                  }`}>
                    {isInTransit ? "In Transit" : isReady ? "Ready to Pick" : "In Kitchen"}
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-2xl mb-5">
                  <div className="relative">
                    <img
                      src={orderItems[0]?.image || "/images/placeholder.png"}
                      alt="food"
                      className="w-14 h-14 rounded-xl object-cover shadow-sm bg-white"
                    />
                    <div className="absolute -top-1.5 -right-1.5 bg-black text-white text-[8px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                      {orderItems.length}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5 tracking-tighter">Customer Name</p>
                    <p className="text-xs font-black text-gray-800 truncate uppercase">{task.customer?.name || 'GUEST CUSTOMER'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-gray-500 mb-5">
                  <MapPin size={14} className="mt-0.5 text-[#D33131] shrink-0" />
                  <p className="text-[11px] font-bold leading-relaxed line-clamp-1">{task.customer?.address || 'No specific address provided'}</p>
                </div>

                <div className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                  isReady || isInTransit ? 'bg-[#D33131] text-white shadow-lg shadow-red-100 group-hover:bg-red-700' : 'bg-gray-100 text-gray-400'
                }`}>
                  {isInTransit ? "Continue Delivery" : isReady ? "View Order" : "Awaiting Kitchen"}
                  {(isReady || isInTransit) && <ChevronRight size={14} />}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5 grayscale opacity-50">      
              <Package size={40} className="text-gray-300" />
            </div>
            <p className="font-black uppercase text-[10px] tracking-[0.3em] text-gray-300">No active tasks</p>
            <p className="text-[9px] font-bold text-gray-300 mt-2">Check back in a few minutes</p>
          </div>
        )}
      </div>

    </div>
  );
}
