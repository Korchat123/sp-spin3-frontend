import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, TrendingUp, Package, CheckCircle2, Clock, MapPin, ChevronRight } from "lucide-react";
import { OrdersContext } from "../../context/ordersContext/OrdersContext";

const getOrderNo = (order) => (order?._id ? order._id.slice(-6).toUpperCase() : "N/A");

export default function DriverDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('current');
  const { orderList, fetchAllOrders, loading } = useContext(OrdersContext);

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
    deliveryTasks.filter(task => task.status !== "delivered" && task.status !== "cancelled")
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

  const latestDayEarnings = latestDayHistoryTasks.reduce((acc, task) => {
    const total = (task.orderList || []).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return acc + total;
  }, 0);

  const readyToPickTasks = currentTasks.filter(task =>
    (task.orderList || []).every(item => item.status === "finished")
  );

  return (
    <div className="w-full max-w-[430px] mx-auto bg-[#FAFAFA] min-h-screen font-sans pb-28 relative shadow-2xl overflow-x-hidden border-x border-gray-100">
      
      {/* --- Premium Header --- */}
      <div className="bg-white/80 backdrop-blur-md px-6 pt-14 pb-6 flex justify-between items-center sticky top-0 z-40 border-b border-gray-100 shadow-sm">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">DRIVER DASHBOARD</h1>
        </div>
        <div className="flex gap-3">
          <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button 
            onClick={() => navigate('/driver/profile')}
            className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      <div className="px-5 mt-6">
        {/* --- Dynamic Earnings Card --- */}
        <div className="relative group overflow-hidden bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#000000] rounded-[2.5rem] p-7 text-white shadow-2xl">
          {/* Decorative shapes */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_#4ade80]"></span>
                <span className="text-[9px] font-black uppercase tracking-widest text-white/80">ACTIVE NOW</span>
              </div>
              <TrendingUp size={20} className="text-white/40" />
            </div>

            <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-1">Today's Earnings</p>
            <div className="flex items-baseline gap-1.5 mb-8">
              <span className="text-xl font-bold text-white/40">฿</span>
              <span className="text-5xl font-black tracking-tighter">{latestDayEarnings.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
              <div className="space-y-1">
                <p className="text-[8px] font-bold text-white/30 uppercase">In Kitchen</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white/5 rounded-lg flex items-center justify-center text-orange-400"><Clock size={12} /></div>
                  <span className="text-sm font-black">{currentTasks.length - readyToPickTasks.length}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] font-bold text-white/30 uppercase">To Pick</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white/5 rounded-lg flex items-center justify-center text-green-400"><Package size={12} /></div>
                  <span className="text-sm font-black">{readyToPickTasks.length}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] font-bold text-white/30 uppercase">Finished</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white/5 rounded-lg flex items-center justify-center text-blue-400"><CheckCircle2 size={12} /></div>
                  <span className="text-sm font-black">{latestDayHistoryTasks.length}</span>
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
            onClick={() => setActiveTab('current')}
            className={`flex-1 py-3.5 z-10 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${activeTab === 'current' ? 'text-black' : 'text-gray-400'}`}
          >
            Tasks ({currentTasks.length})
          </button>
          <button
            onClick={() => navigate('/driver/history')}
            className={`flex-1 py-3.5 z-10 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 text-gray-400 hover:text-gray-600`}
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
            const isReady = orderItems.every(item => item.status === "finished");
            const total = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

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
                    {isReady ? "Ready to Pick" : "In Kitchen"}
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
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5 tracking-tighter">Total</p>
                    <p className="text-xs font-black text-[#D33131]">฿{total.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-gray-500 mb-5">
                  <MapPin size={14} className="mt-0.5 text-[#D33131] shrink-0" />
                  <p className="text-[11px] font-bold leading-relaxed line-clamp-1">{task.customer?.address || 'No specific address provided'}</p>
                </div>

                <div className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                  isReady || task.status === 'delivery' ? 'bg-[#D33131] text-white shadow-lg shadow-red-100 group-hover:bg-red-700' : 'bg-gray-100 text-gray-400'
                }`}>
                  {task.status === 'delivery' ? "View Order" : isReady ? "Start Delivery" : "Awaiting Kitchen"}
                  {(isReady || task.status === 'delivery') && <ChevronRight size={14} />}
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
