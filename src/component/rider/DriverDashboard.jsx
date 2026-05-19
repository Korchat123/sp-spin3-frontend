// src/component/rider/DriverDashboard.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 1. เปลี่ยนมาใช้ orders จากไฟล์หลักที่มีข้อมูลครบ
import { orders } from '../../assets/order'; 

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('current');

  // 2. กรองเฉพาะออเดอร์ที่เป็น Delivery (ตัดพวก Onsite ออก)
  const deliveryTasks = orders.filter(order => order.type === "delivery");

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg font-sans">
      
      {/* Header */}
      <header className="py-8 px-4 text-center">
        <h1 className="text-3xl font-black uppercase tracking-tight text-black">
          Driver Dashboard
        </h1>
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
          CURRENT TASKS
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 font-bold text-sm transition-all ${
            activeTab === 'history' 
            ? 'border-b-4 border-black text-black' 
            : 'text-gray-400'
          }`}
        >
          DELIVERY HISTORY
        </button>
      </div>

      {/* Task List */}
      <div className="p-4 space-y-4 bg-gray-50/50 min-h-[70vh]">
        {deliveryTasks.map((task) => {
          // 3. เช็คสถานะ: ถ้ามีรายการใดรายการหนึ่งยังไม่ 'finished' จะยังเริ่มส่งไม่ได้
          const isReadyToStart = task.orderList.every(item => item.status === "finished");
          
          // 4. ดึงรูปภาพแรกของออเดอร์มาแสดงเป็นตัวแทน
          const displayImage = task.orderList[0]?.image;

          return (
            <div 
              key={task.id} 
              className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-5 flex items-center shadow-sm"
            >
              {/* 5. แสดงรูปภาพจาก Mock Data */}
              <img 
                src={displayImage} 
                alt={`Order ${task.id}`}
                className="w-24 h-24 bg-gray-200 rounded-3xl flex-shrink-0 object-cover shadow-sm"
              />

              {/* Content Details */}
              <div className="ml-5 flex-1">
                <h2 className="text-lg font-black uppercase text-black">
                  Order {task.id}
                </h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">
                   {task.orderList.length} Items
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-bold">Status:</span> {isReadyToStart ? "READY" : "PREPARING"}
                </p>
                
                {/* Start Delivery Button */}
                <button
                  disabled={!isReadyToStart}
                  onClick={() => navigate(`/driver/order/${task.id}`)}
                  className={`mt-3 w-full py-2 px-4 rounded-xl font-black text-white uppercase tracking-wider transition-all text-xs ${
                    isReadyToStart 
                    ? 'bg-[#D33131] hover:bg-red-700 active:scale-95 cursor-pointer' 
                    : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {isReadyToStart ? "Start Delivery" : "Waiting for Kitchen"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DriverDashboard;