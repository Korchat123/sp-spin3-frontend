import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrdersContext } from '../../context/ordersContext/OrdersContext';

const DeliveryHistory = () => {
  const navigate = useNavigate();
  const { orderList } = useContext(OrdersContext);

  // Filter only delivered delivery orders
  const historyTasks = orderList.filter(order => 
    order.type === "delivery" && order.status === "delivered"
  );

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg font-sans">
      {/* Header */}
      <header className="py-8 px-4 flex items-center">
        <button 
          onClick={() => navigate('/driver')}
          className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-black hover:bg-gray-200 transition-all"
        >
          ←
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tight text-black ml-4">
          Delivery History
        </h1>
      </header>

      {/* Stats Summary */}
      <div className="px-6 mb-6">
        <div className="bg-black text-white rounded-[2rem] p-6 shadow-xl flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black uppercase opacity-60 mb-1 tracking-widest">Total Deliveries</p>
            <p className="text-4xl font-black">{historyTasks.length}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase opacity-60 mb-1 tracking-widest">Total Earnings</p>
            <p className="text-2xl font-black">
              ฿{historyTasks.reduce((total, task) => 
                total + task.orderList.reduce((acc, item) => acc + (item.price * item.quantity), 0), 0
              ).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="p-4 space-y-4 bg-gray-50/50 min-h-[70vh] rounded-t-[3rem]">
        <div className="flex justify-between items-center px-4 pt-2">
          <h2 className="text-sm font-black uppercase text-gray-400">Past Orders</h2>
          <span className="text-[10px] font-bold text-gray-400">{historyTasks.length} Completed</span>
        </div>

        {historyTasks.length > 0 ? (
          historyTasks.map((task) => {
            const displayImage = task.orderList[0]?.image || "/images/placeholder.png";
            const totalPrice = task.orderList.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            
            // Format date if available
            const orderDate = task.orderList[0]?.orderTime;
            const formattedDate = orderDate instanceof Date 
              ? orderDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
              : "Recent";

            return (
              <div 
                key={task.id} 
                className="bg-white border-2 border-gray-100 rounded-[2.5rem] p-5 shadow-sm transition-all hover:border-black group"
                onClick={() => navigate(`/driver/order/${task.id}`)}
              >
                <div className="flex items-center">
                  {/* Image */}
                  <img 
                    src={displayImage} 
                    alt={`Order ${task.id}`}
                    className="w-16 h-16 bg-gray-100 rounded-2xl flex-shrink-0 object-cover group-hover:scale-105 transition-transform"
                  />

                  {/* Details */}
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-black uppercase text-black">
                        #{task.id}
                      </h3>
                      <span className="text-[9px] font-black text-gray-400">
                        {formattedDate}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-gray-700 mt-0.5">
                      {task.customer?.name}
                    </p>
                    <div className="flex justify-between items-end mt-2">
                      <p className="text-[9px] text-gray-400 font-bold uppercase">
                        {task.orderList.length} Items
                      </p>
                      <p className="text-sm font-black text-[#D33131]">
                        ฿{totalPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <span className="text-5xl mb-4">🏁</span>
            <p className="font-bold uppercase text-xs tracking-widest">No history yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryHistory;
