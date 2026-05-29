// src/component/rider/DriverDashboard.jsx

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrdersContext } from '../../context/ordersContext/OrdersContext';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('current');
  const { orderList } = useContext(OrdersContext);

  // Filter delivery orders
  const deliveryTasks = orderList.filter(order => order.type === "delivery");

  // For simulation, let's say "history" are those where all items are "finished" AND we've completed them.
  // Since we don't have a top-level status yet, we'll just split them for demo purposes.
  // In a real app, you'd have a 'status' field like 'delivered' or 'cancelled'.
  const currentTasks = deliveryTasks.filter(task => task.status !== "delivered" && task.status !== "cancelled");
  const historyTasks = deliveryTasks.filter(task => task.status === "delivered" || task.status === "cancelled");

  const displayTasks = activeTab === 'current' ? currentTasks : historyTasks;

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg font-sans">
      
      {/* Header */}
      <header className="py-8 px-4 flex justify-between items-center">
        <div className="w-10"></div> {/* Spacer */}
        <h1 className="text-3xl font-black uppercase tracking-tight text-black">
          Driver Dashboard
        </h1>
        <button 
          onClick={() => navigate('/driver/history')}
          className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
          title="Delivery History"
        >
          📜
        </button>
      </header>

      {/* Tabs Selection */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('current')}
          className={`flex-1 py-3 font-bold text-sm transition-all ${
            activeTab === 'current' 
            ? 'border-b-4 border-black text-black' 
            : 'text-gray-400'
          }`}
        >
          CURRENT TASKS ({currentTasks.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 font-bold text-sm transition-all ${
            activeTab === 'history' 
            ? 'border-b-4 border-black text-black' 
            : 'text-gray-400'
          }`}
        >
          DELIVERY HISTORY ({historyTasks.length})
        </button>
      </div>

      {/* Task List */}
      <div className="p-4 space-y-4 bg-gray-50/50 min-h-[70vh]">
        {displayTasks.length > 0 ? (
          displayTasks.map((task) => {
            const isReadyToStart = task.orderList.every(item => item.status === "finished");
            const displayImage = task.orderList[0]?.image || "/images/placeholder.png";
            const totalPrice = task.orderList.reduce((acc, item) => acc + (item.price * item.quantity), 0);

            return (
              <div 
                key={task.id} 
                className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-5 shadow-sm transition-all hover:border-black"
              >
                <div className="flex items-center mb-4">
                  {/* Image */}
                  <img 
                    src={displayImage} 
                    alt={`Order ${task.id}`}
                    className="w-20 h-20 bg-gray-200 rounded-3xl flex-shrink-0 object-cover shadow-sm"
                  />

                  {/* Basic Details */}
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <h2 className="text-lg font-black uppercase text-black">
                        Order #{task.id}
                      </h2>
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full ${
                        isReadyToStart ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {isReadyToStart ? "READY" : "PREPARING"}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-gray-800 mt-1">
                      {task.customer?.name || "Customer"}
                    </p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">
                      {task.orderList.length} Items • ฿{totalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Address Snippet */}
                <div className="bg-gray-50 rounded-2xl p-3 mb-4 border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Delivery Address:</p>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-tight">
                    {task.customer?.address || "No address provided"}
                  </p>
                </div>
                
                {/* Action Button */}
                <button
                  disabled={!isReadyToStart && activeTab === 'current'}
                  onClick={() => navigate(`/driver/order/${task.id}`)}
                  className={`w-full py-3 rounded-2xl font-black text-white uppercase tracking-wider transition-all text-sm shadow-md ${
                    activeTab === 'history' 
                    ? 'bg-black hover:bg-gray-800'
                    : isReadyToStart 
                      ? 'bg-[#D33131] hover:bg-red-700 active:scale-95 cursor-pointer shadow-red-200' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {activeTab === 'history' 
                    ? "View Details" 
                    : isReadyToStart ? "Start Delivery" : "Waiting for Kitchen"}
                </button>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="text-5xl mb-4">📦</span>
            <p className="font-bold uppercase text-sm">No {activeTab} tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;