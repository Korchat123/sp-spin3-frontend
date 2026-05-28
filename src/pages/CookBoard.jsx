import { useState, useEffect, useContext } from "react";
import { api } from "../utils/api";
import { UserContext } from "../context/userContext/UserContext";
import { LogOut, Clock, Utensils, CheckCircle, AlertCircle, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CookBoard() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("cooking"); // 'all', 'cooking', 'finished'
  const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState({}); // Track countdown timers
  const { setMyUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const data = await api.get("/orders");
      // Ensure data is an array
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };
  
  ///pooling every 5 seconds to get real-time updates without needing WebSockets
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); 
    return () => clearInterval(interval);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => {
        const newTimers = { ...prevTimers };
        Object.keys(newTimers).forEach(key => {
          if (newTimers[key] > 0) {
            newTimers[key] -= 1;
          }
        });
        return newTimers;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Initialize timers when item status changes to Cook
  useEffect(() => {
    orders.forEach(order => {
      if (order && Array.isArray(order.orderList)) {
        order.orderList.forEach(item => {
          const timerId = `${order._id}-${item._id}`;
          if (item.status === 'Cook' && !timers[timerId]) {
            setTimers(prev => ({
              ...prev,
              [timerId]: item.cookingTime || 300 // Default 5 min if not set
            }));
          }
        });
      }
    });
  }, [orders]);

  const handleLogout = () => {
    setMyUserInfo(null);
    navigate("/login");
  };

  const getTableStatus = (orderList = []) => {
    if (!Array.isArray(orderList) || orderList.length === 0) return "inkitchen";
    
    if (orderList.every(item => item && (item.status === "finished" || item.status === "cancel"))) {
      return "finished";
    }
    if (orderList.some(item => item && item.status === "Cook")) {
      return "cooking";
    }
    return "inkitchen";
  };

  const filteredOrders = orders.filter((order) => {
    if (!order) return false;
    const status = getTableStatus(order.orderList);
    if (filter === "all") return true;
    if (filter === "cooking") return status === "cooking" || status === "inkitchen";
    if (filter === "finished") return status === "finished";
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "finished": return "border-green-500 bg-green-50/50";
      case "cooking": return "border-orange-500 bg-orange-50/50";
      case "inkitchen": return "border-blue-500 bg-blue-50/50";
      default: return "border-gray-500 bg-gray-50/50";
    }
  };

  const getCountdownColor = (remaining, total) => {
    const percentage = (remaining / total) * 100;
    if (percentage > 50) return "text-blue-600";
    if (percentage > 25) return "text-yellow-600";
    return "text-red-600";
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUpdateStatus = async (orderId, itemId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/item/${itemId}`, { status: newStatus });
      fetchOrders(); // Refresh data
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const formatOrderTime = (createdAt) => {
    const date = new Date(createdAt);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-['IBM_Plex_Sans_Thai']">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="bg-[#e4002b] p-3 rounded-xl text-white shadow-lg shadow-red-100">
            <Utensils size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">KITCHEN DISPLAY</h1>
            <p className="text-slate-500 font-medium">Real-time Order Management</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            {["all", "cooking", "finished"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-lg capitalize font-bold text-lg transition-all duration-200 ${
                  filter === f 
                  ? "bg-white text-[#e4002b] shadow-sm scale-105" 
                  : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {f === "cooking" ? "In Preparation" : f}
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-[#e4002b] transition-all shadow-lg shadow-slate-200"
          >
            <LogOut size={20} />
            <span>EXIT</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-96 gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-[#e4002b]"></div>
          <p className="text-slate-400 font-bold animate-pulse">SYNCING ORDERS...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
          {filteredOrders.map((order) => {
            if (!order || !Array.isArray(order.orderList)) return null;
            const tableStatus = getTableStatus(order.orderList);
            return (
              <div 
                key={order._id} 
                className={`flex flex-col border-2 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden transition-all duration-300 hover:translate-y-[-4px] bg-white ${getStatusColor(tableStatus)}`}
              >
                {/* Card Header */}
                <div className="p-5 border-b-2 border-slate-100 flex justify-between items-start bg-white/80 backdrop-blur-sm">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 leading-tight">
                      {order.type === "Onsite" ? (order.customer?.name || "Guest") : `🚚 ${order.customer?.name || "Customer"}`}
                    </h2>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-sm font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">#{order._id.substring(order._id.length - 6).toUpperCase()}</span>
                      <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                        <Clock size={12} />
                        Order: {formatOrderTime(order.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-widest shadow-sm ${
                    tableStatus === 'cooking' ? 'bg-orange-500 text-white' : 
                    tableStatus === 'finished' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    {tableStatus === 'inkitchen' ? 'NEW' : tableStatus}
                  </div>
                </div>
                
                {/* Items List */}
                <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[500px]">
                  {order.orderList.map((item) => {
                    if (!item) return null;
                    const timerId = `${order._id}-${item._id}`;
                    const remainingTime = timers[timerId] !== undefined ? timers[timerId] : (item.cookingTime || 300);
                    const totalTime = item.cookingTime || 300;
                    const countdownColor = getCountdownColor(remainingTime, totalTime);
                    
                    return (
                      <div key={item._id} className="flex flex-col p-4 rounded-xl bg-white border-2 border-slate-100 shadow-sm transition-colors hover:border-slate-200">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex flex-col">
                            <span className="text-xl font-black text-slate-800 leading-tight">{item.name}</span>
                            <span className="text-2xl font-black text-[#e4002b]">x{item.quantity}</span>
                          </div>
                          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-black ${
                            item.status === 'Cook' ? 'bg-orange-100 text-orange-600' : 
                            item.status === 'finished' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {item.status === 'Cook' && <Utensils size={14} />}
                            {item.status === 'finished' && <CheckCircle size={14} />}
                            {item.status === 'InKitchen' && <Clock size={14} />}
                            {(item.status || "UNKNOWN").toUpperCase()}
                          </div>
                        </div>

                        {/* Countdown Timer */}
                        {item.status === 'Cook' && (
                          <div className="mb-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Cooking Time</p>
                            <div className={`text-3xl font-black font-mono ${countdownColor} transition-colors`}>
                              {formatTime(remainingTime)}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all ${
                                  remainingTime / totalTime > 0.5 ? 'bg-green-500' :
                                  remainingTime / totalTime > 0.25 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${(remainingTime / totalTime) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {item.status === 'InKitchen' && item.cookingTime && (
                          <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Est. Cooking Time</p>
                            <p className="text-xl font-black text-blue-700 font-mono mt-1">
                              {formatTime(item.cookingTime)}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          {item.status === 'InKitchen' && (
                            <button 
                              onClick={() => handleUpdateStatus(order._id, item._id, 'Cook')}
                              className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-xl font-black text-sm hover:bg-orange-600 transition-colors shadow-lg shadow-orange-100"
                            >
                              <Utensils size={16} /> START
                            </button>
                          )}
                          {item.status === 'Cook' && (
                            <button 
                              onClick={() => handleUpdateStatus(order._id, item._id, 'finished')}
                              className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-black text-sm hover:bg-green-600 transition-colors shadow-lg shadow-green-100"
                            >
                              <CheckCircle size={16} /> DONE
                            </button>
                          )}
                          
                          <div className="flex gap-2">
                            {item.status !== 'finished' && item.status !== 'cancel' && (
                              <button 
                                onClick={() => handleUpdateStatus(order._id, item._id, 'cancel')}
                                className="w-12 flex items-center justify-center bg-slate-100 text-slate-400 py-3 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                                title="Cancel Item"
                              >
                                <AlertCircle size={18} />
                              </button>
                            )}
                            {item.status === 'finished' && (
                              <button 
                                onClick={() => handleUpdateStatus(order._id, item._id, 'InKitchen')}
                                className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-500 py-3 rounded-xl font-black text-sm hover:bg-slate-200 transition-colors"
                              >
                                <RefreshCcw size={16} /> REDO
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Footer Notes */}
                {order.customer?.note && (
                  <div className="p-4 bg-yellow-50/80 border-t-2 border-yellow-100">
                    <div className="flex gap-2 items-start">
                      <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black text-yellow-600 uppercase tracking-tighter">Kitchen Note</p>
                        <p className="text-sm font-bold text-yellow-800 leading-tight">{order.customer.note}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {filteredOrders.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center h-96 text-slate-300">
          <div className="bg-white p-10 rounded-full shadow-inner mb-6">
            <Utensils size={80} strokeWidth={1} />
          </div>
          <p className="text-2xl font-black tracking-tight">NO ORDERS IN QUEUE</p>
          <p className="font-medium">Everything is currently up to date!</p>
        </div>
      )}
    </div>
  );
}
