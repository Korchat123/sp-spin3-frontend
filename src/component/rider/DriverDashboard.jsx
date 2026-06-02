// src/component/rider/DriverDashboard.jsx
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, RefreshCcw, Menu } from "lucide-react";
import { UserContext } from "../../context/userContext/UserContext";
import { OrdersContext } from "../../context/ordersContext/OrdersContext";
import { orderService } from "../../services/orderService";
import { getOrderTotal } from "../../utils/customerOrders";

const getOrderNo = (order) => (order?._id ? order._id.slice(-6).toUpperCase() : "N/A");

const getCustomerName = (order) =>
  order?.customer?.name || order?.customer?.contact || `Order ${getOrderNo(order)}`;

const getFirstImage = (order) => order?.orderList?.[0]?.image || "/images/placeholder.png";

export default function DriverDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('current');
  const { orderList, fetchAllOrders, loading } = useContext(OrdersContext);
  const { myUserInfo } = useContext(UserContext);

  useEffect(() => {
    // Initial fetch
    fetchAllOrders();
    
    // Set up polling every 5 seconds
    const interval = setInterval(() => {
      fetchAllOrders();
    }, 5000);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [fetchAllOrders]);

  const deliveryTasks = Array.isArray(orderList) ? orderList.filter(order => order.type?.toLowerCase() === "delivery") : [];
  const currentTasks = deliveryTasks.filter(task => task.status !== "delivered" && task.status !== "cancelled");
  const historyTasks = deliveryTasks.filter(task => task.status === "delivered" || task.status === "cancelled");

  // Get latest date from all delivery orders for default view
  const latestDayHistoryTasks = useMemo(() => {
    if (historyTasks.length === 0) return [];
    
    const ordersWithDates = historyTasks.map(order => ({
      ...order,
      orderDate: order.orderList?.[0]?.orderTime instanceof Date 
        ? order.orderList[0].orderTime 
        : new Date(order.orderList?.[0]?.orderTime)
    }));
    
    // Find latest date from history
    const latestDate = new Date(Math.max(...ordersWithDates.map(o => o.orderDate.getTime())));
    const latestDateString = latestDate.toDateString();
    
    // Filter orders from latest date only
    return historyTasks.filter(order => {
      const orderDate = order.orderList?.[0]?.orderTime;
      if (!orderDate) return false;
      const dateObj = orderDate instanceof Date ? orderDate : new Date(orderDate);
      return dateObj.toDateString() === latestDateString;
    });
  }, [historyTasks]);

  // Get latest day completed tasks for stats
  const latestDayCompleted = latestDayHistoryTasks.filter(task => task.status === "delivered");

  // Calculate latest day total earnings
  const latestDayEarnings = latestDayHistoryTasks.reduce((acc, task) => {
    const total = (task.orderList || []).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return acc + total; 
  }, 0);

  // Granular counts for active tasks
  const readyToPickTasks = currentTasks.filter(task => 
    (task.orderList || []).every(item => item.status === "finished")
  );
  const inKitchenTasks = currentTasks.filter(task => 
    !(task.orderList || []).every(item => item.status === "finished")
  );

  return (
    <div className="max-w-md mx-auto bg-[#F8F9FA] min-h-screen font-sans pb-24 relative shadow-2xl">
      
      {/* Modern Header - Bold & Clean Centered with Profile Button */}
      <div className="px-6 pt-12 sm:pt-16 pb-4 flex justify-center items-center relative">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter text-center">Driver Dashboard</h1>
        
        <button 
          onClick={() => navigate('/driver/profile')}
          className="absolute right-6 top-[3.2rem] sm:top-[4.2rem] w-10 h-10 bg-white border-2 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="px-4 sm:px-6 mt-4 sm:mt-6">
        {/* Earnings Card */}
        <div className="bg-gray-900 rounded-4xl p-5 sm:p-6 text-white relative overflow-hidden shadow-xl mb-6">
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[9px] sm:text-[10px] font-bold opacity-60 uppercase tracking-widest">Latest Day Earnings</p>
              <span className="bg-green-500/20 text-green-400 text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full font-bold">ONLINE</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold">฿</span>
              <span className="text-3xl sm:text-4xl font-black">{latestDayEarnings.toLocaleString()}</span>
            </div>
            
            <div className="mt-5 sm:mt-6 grid grid-cols-3 gap-1 sm:gap-2 border-t border-white/10 pt-4">
              <div className="flex flex-col">
                <p className="text-[7px] sm:text-[8px] font-bold text-gray-400 uppercase tracking-tighter mb-1">In Kitchen</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></span>
                  <span className="text-xs sm:text-sm font-black">{inKitchenTasks.length}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-[7px] sm:text-[8px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Ready to Pick</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                  <span className="text-xs sm:text-sm font-black">{readyToPickTasks.length}</span>
                </div>
              </div>
              <div className="flex flex-col border-l border-white/10 pl-2">
                <p className="text-[7px] sm:text-[8px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Completed</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                  <span className="text-xs sm:text-sm font-black">{latestDayCompleted.length}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-8 w-32 h-32 bg-white/5 rounded-full"></div>
        </div>

        {/* Modern Tabs */}
        <div className="bg-white p-1.5 rounded-2xl shadow-md flex gap-1 mb-6">
          <button
            onClick={() => setActiveTab('current')}
            className={`flex-1 py-3 rounded-xl font-black text-[9px] sm:text-[10px] tracking-wider transition-all ${
              activeTab === 'current' 
              ? 'bg-[#E4002B] text-white shadow-lg shadow-red-100' 
              : 'text-gray-400 hover:bg-gray-50'
            }`}
          >
            ACTIVE TASKS ({currentTasks.length})
          </button>
          <button
            onClick={() => navigate('/driver/history')}
            className="flex-1 py-3 rounded-xl font-black text-[9px] sm:text-[10px] tracking-wider transition-all text-gray-400 hover:bg-gray-50"
          >
            HISTORY
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="px-4 sm:px-6 space-y-4">
        {loading && currentTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#E4002B] mb-4"></div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Updating Tasks...</p>
          </div>
        ) : currentTasks.length > 0 ? (
          currentTasks.map((task) => {
            const orderItems = Array.isArray(task.orderList) ? task.orderList : [];
            const isReady = orderItems.every(item => item.status === "finished");
            const totalPrice = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            
            return (
              <div 
                key={task.id} 
                className="bg-white rounded-4xl sm:rounded-[2.5rem] p-1 shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
                onClick={() => navigate(`/driver/order/${task.id}`)}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-gray-900">
                        #{String(task.id).substring(String(task.id).length - 6).toUpperCase()}
                      </h2>
                      <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {orderItems.length} Items • ฿{totalPrice.toLocaleString()}
                      </p>
                    </div>
                    <div className={`px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase ${
                      isReady ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {isReady ? "Ready to Pick" : "In Kitchen"}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 mb-5">
                    <img 
                      src={orderItems[0]?.image || "/images/placeholder.png"} 
                      alt="Product"
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-cover bg-gray-50 border border-gray-100"
                    />
                    <div className="flex-1">
                      <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase mb-0.5 sm:mb-1">Customer</p>
                      <p className="text-xs sm:text-sm font-black text-gray-800">{task.customer?.name || 'Guest'}</p>
                      <div className="flex items-center gap-1 mt-0.5 text-[10px] sm:text-[11px] text-gray-500 font-medium">
                        <span className="text-blue-500 text-[10px]">📍</span>
                        <span className="line-clamp-1">{task.customer?.address || 'No address'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className={`flex-1 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-[11px] uppercase tracking-widest transition-all ${
                      isReady 
                        ? 'bg-[#E4002B] text-white shadow-lg shadow-red-100' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}>
                      {isReady ? "Start Delivery" : "Waiting for kitchen"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl sm:text-4xl mb-4">
              📭
            </div>
            <p className="font-black uppercase text-[9px] sm:text-[10px] tracking-[0.2em]">No tasks available</p>
          </div>
        )}
      </div>
    </div>
  );
}
