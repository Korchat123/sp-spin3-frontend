<<<<<<< HEAD
import React, { useContext, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrdersContext } from '../../context/ordersContext/OrdersContext';
=======
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../services/orderService";
import { getOrderTotal } from "../../utils/customerOrders";
>>>>>>> ecc62aaa2c802633258e34dea301186ee93b82f9

const getOrderNo = (order) => (order?._id ? order._id.slice(-6).toUpperCase() : "N/A");

export default function DeliveryHistory() {
  const navigate = useNavigate();
<<<<<<< HEAD
  const { orderList } = useContext(OrdersContext);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter only delivery orders (both delivered and cancelled for history)
  const allHistoryTasks = orderList.filter(order => 
    order.type?.toLowerCase() === "delivery" && (order.status === "delivered" || order.status === "cancelled")
  );

  // Separate successful and failed deliveries
  const successfulDeliveries = allHistoryTasks.filter(order => order.status === "delivered");
  const failedDeliveries = allHistoryTasks.filter(order => order.status === "cancelled");

  // Get latest date from all delivery orders for default view
  const getLatestDayOrders = useMemo(() => {
    if (allHistoryTasks.length === 0) return [];
    
    const ordersWithDates = allHistoryTasks.map(order => ({
      ...order,
      orderDate: order.orderList?.[0]?.orderTime instanceof Date 
        ? order.orderList[0].orderTime 
        : new Date(order.orderList?.[0]?.orderTime)
    }));
    
    // Find latest date
    const latestDate = new Date(Math.max(...ordersWithDates.map(o => o.orderDate.getTime())));
    const latestDateString = latestDate.toDateString();
    
    // Filter orders from latest date only
    return allHistoryTasks.filter(order => {
      const orderDate = order.orderList?.[0]?.orderTime;
      if (!orderDate) return false;
      const dateObj = orderDate instanceof Date ? orderDate : new Date(orderDate);
      return dateObj.toDateString() === latestDateString;
    });
  }, [allHistoryTasks]);

  // Filter by date range if selected, otherwise show only latest day's orders
  const filteredTasks = useMemo(() => {
    if (startDate || endDate) {
      // User has applied a filter - show filtered orders
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      end.setHours(23, 59, 59, 999); // Include entire end day

      return allHistoryTasks.filter(order => {
        const orderDate = order.orderList?.[0]?.orderTime;
        if (!orderDate) return false;
        const dateObj = orderDate instanceof Date ? orderDate : new Date(orderDate);
        return dateObj >= start && dateObj <= end;
      });
    } else {
      // No filter applied - show only latest day's orders
      return getLatestDayOrders;
    }
  }, [allHistoryTasks, startDate, endDate, getLatestDayOrders]);

  // Calculate stats for filtered data
  const successfulInRange = filteredTasks.filter(order => order.status === "delivered");
  const failedInRange = filteredTasks.filter(order => order.status === "cancelled");
  const totalRevenueInRange = filteredTasks.reduce((total, task) => 
    total + task.orderList.reduce((acc, item) => acc + (item.price * item.quantity), 0), 0
=======
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await orderService.getOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch delivery history:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const historyTasks = useMemo(
    () => orders.filter((order) => order.type === "delivery" && ["delivered", "cancelled"].includes(order.status)),
    [orders],
>>>>>>> ecc62aaa2c802633258e34dea301186ee93b82f9
  );
  const deliveredTasks = historyTasks.filter((order) => order.status === "delivered");

  return (
<<<<<<< HEAD
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl font-sans pb-10">
      {/* Header */}
      <header className="py-6 sm:py-8 px-4 flex items-center">
        <button 
          onClick={() => navigate('/driver')}
          className="w-10 h-10 bg-white border-2 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
=======
    <div className="mx-auto min-h-screen max-w-md bg-white font-sans shadow-lg">
      <header className="flex items-center px-4 py-8">
        <button
          onClick={() => navigate("/driver")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-black transition-all hover:bg-gray-200"
>>>>>>> ecc62aaa2c802633258e34dea301186ee93b82f9
        >
          BACK
        </button>
<<<<<<< HEAD
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black ml-4">
          Delivery History
        </h1>
      </header>

      {/* Overall Stats Summary - Linked to Filter */}
      <div className="px-4 sm:px-6 mb-6">
        <div className="bg-black text-white rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-6 shadow-xl mb-4">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[8px] sm:text-[10px] font-black uppercase opacity-60 mb-1 tracking-widest">Total Deliveries</p>
                <p className="text-2xl sm:text-3xl font-black">{filteredTasks.length}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] sm:text-[10px] font-black uppercase opacity-60 mb-1 tracking-widest">Total Revenue</p>
                <p className="text-xl sm:text-2xl font-black">
                  ฿{totalRevenueInRange.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="border-t border-white/20 pt-3 flex justify-between text-[9px] sm:text-[11px] font-bold">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Success: {successfulInRange.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                <span>Failed: {failedInRange.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="px-4 sm:px-6 mb-6">
        <p className="text-[9px] sm:text-[11px] font-black uppercase opacity-60 mb-3 tracking-widest">Filter by Date Range</p>
        <div className="flex gap-2 sm:gap-3">
          <div className="flex-1">
            <label className="text-[8px] font-bold text-gray-600 block mb-1">From Date</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-sm font-semibold text-gray-700 focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <div className="flex-1">
            <label className="text-[8px] font-bold text-gray-600 block mb-1">To Date</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-sm font-semibold text-gray-700 focus:outline-none focus:border-black transition-colors"
            />
=======
        <h1 className="ml-4 text-2xl font-black uppercase tracking-tight text-black">Delivery History</h1>
      </header>

      <div className="mb-6 px-6">
        <div className="flex items-center justify-between rounded-[2rem] bg-black p-6 text-white shadow-xl">
          <div>
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest opacity-60">Completed</p>
            <p className="text-4xl font-black">{deliveredTasks.length}</p>
          </div>
          <div className="text-right">
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest opacity-60">Delivered Value</p>
            <p className="text-2xl font-black">
              THB {deliveredTasks.reduce((total, order) => total + getOrderTotal(order), 0).toLocaleString()}
            </p>
>>>>>>> ecc62aaa2c802633258e34dea301186ee93b82f9
          </div>
          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              className="self-end px-2 py-1.5 sm:py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-[10px] sm:text-xs font-bold transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

<<<<<<< HEAD
      {/* History List */}
      <div className="p-4 sm:p-5 space-y-4 bg-gray-50/50 min-h-[70vh] rounded-t-[2rem] sm:rounded-t-[3rem]">
        <div className="flex justify-between items-center px-2 sm:px-4 pt-2">
          <h2 className="text-[11px] sm:text-sm font-black uppercase text-gray-400">
            {startDate || endDate ? 'Filtered Orders' : 'All Orders'}
          </h2>
          <span className="text-[9px] sm:text-[10px] font-bold text-gray-400">
            {filteredTasks.length} {startDate || endDate ? 'Found' : 'Total'}
          </span>
        </div>

        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const displayImage = task.orderList[0]?.image || "/images/placeholder.png";
            const totalPrice = task.orderList.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            const isSuccessful = task.status === "delivered";
            
            // Format date if available
            const orderDate = task.orderList?.[0]?.orderTime;
            let formattedDate = "Recent";
            if (orderDate) {
              const dateObj = orderDate instanceof Date ? orderDate : new Date(orderDate);
              if (!isNaN(dateObj.getTime())) {
                formattedDate = dateObj.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
              }
            }

            return (
              <div 
                key={task.id} 
                className={`border-2 rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-5 shadow-sm transition-all active:scale-[0.98] group relative cursor-pointer ${
                  isSuccessful 
                    ? 'bg-white border-green-100 hover:border-green-500' 
                    : 'bg-white border-red-100 hover:border-red-500'
                }`}
                onClick={() => navigate(`/driver/order/${task.id}`)}
              >
                {/* Status Indicator Badge */}
                <div className={`absolute -top-1.5 -right-1.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs sm:text-sm ${
                  isSuccessful
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}>
                  {isSuccessful ? '✓' : '✕'}
                </div>

                <div className="flex items-center">
                  {/* Image */}
                  <img 
                    src={displayImage} 
                    alt={`Order ${task.id}`}
                    className={`w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-xl sm:rounded-2xl flex-shrink-0 object-cover group-hover:scale-105 transition-transform border-2 ${
                      isSuccessful ? 'border-green-500' : 'border-red-500'
                    }`}
                  />

                  {/* Details */}
                  <div className="ml-3 sm:ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-[11px] sm:text-sm font-black uppercase text-black">
                        #{String(task.id).substring(String(task.id).length - 6).toUpperCase()}
                      </h3>
                      <div className="flex flex-col items-end gap-0.5 sm:gap-1">
                        <span className="text-[8px] sm:text-[9px] font-black text-gray-400">
                          {formattedDate}
                        </span>
                        <span className={`text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full ${
                          isSuccessful
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {isSuccessful ? 'Success' : 'Failed'}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] sm:text-xs font-bold text-gray-700 mt-0.5">
                      {task.customer?.name || "Customer"}
                    </p>
                    <div className="flex justify-between items-end mt-1.5 sm:mt-2">
                      <p className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase">
                        {(task.orderList || []).length} Items
                      </p>
                      <p className="text-xs sm:text-sm font-black text-[#D33131]">
                        ฿{totalPrice.toLocaleString()}
                      </p>
                    </div>
=======
      <div className="min-h-[70vh] space-y-4 rounded-t-[3rem] bg-gray-50/50 p-4">
        <div className="flex items-center justify-between px-4 pt-2">
          <h2 className="text-sm font-black uppercase text-gray-400">Past Orders</h2>
          <span className="text-[10px] font-bold text-gray-400">{historyTasks.length} Records</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs font-black uppercase tracking-widest text-gray-300">Loading history...</div>
        ) : historyTasks.length > 0 ? (
          historyTasks.map((task) => (
            <button
              key={task._id}
              type="button"
              className="w-full rounded-[2rem] border-2 border-gray-100 bg-white p-5 text-left shadow-sm transition-all hover:border-black"
              onClick={() => navigate(`/driver/order/${task._id}`)}
            >
              <div className="flex items-center">
                <img
                  src={task.orderList?.[0]?.image || "/images/placeholder.png"}
                  alt={`Order ${getOrderNo(task)}`}
                  className="h-16 w-16 flex-shrink-0 rounded-2xl bg-gray-100 object-cover"
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-black uppercase text-black">#{getOrderNo(task)}</h3>
                    <span className="text-[9px] font-black uppercase text-gray-400">{task.status}</span>
                  </div>
                  <p className="mt-0.5 text-xs font-bold text-gray-700">
                    {task.customer?.name || task.customer?.contact || "Customer not provided"}
                  </p>
                  <div className="mt-2 flex items-end justify-between">
                    <p className="text-[9px] font-bold uppercase text-gray-400">{task.orderList?.length || 0} Items</p>
                    <p className="text-sm font-black text-[#D33131]">THB {getOrderTotal(task).toLocaleString()}</p>
>>>>>>> ecc62aaa2c802633258e34dea301186ee93b82f9
                  </div>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
<<<<<<< HEAD
            <span className="text-4xl sm:text-5xl mb-4">📭</span>
            <p className="font-bold uppercase text-[10px] sm:text-xs tracking-widest">
              {startDate || endDate ? 'No orders in this period' : 'No history yet'}
            </p>
=======
            <span className="mb-4 text-5xl">DONE</span>
            <p className="text-xs font-bold uppercase tracking-widest">No history yet</p>
>>>>>>> ecc62aaa2c802633258e34dea301186ee93b82f9
          </div>
        )}
      </div>
    </div>
  );
}
