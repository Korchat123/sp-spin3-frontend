import React from 'react';
import { useNavigate } from 'react-router-dom';

const DeliveryStatusView = ({ order, isSuccess, reason, customReason, capturedImage, onBackToTasks }) => {
  const navigate = useNavigate();
  
  const totalPrice = order.orderList.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const orderTime = order.orderList?.[0]?.orderTime;
  const displayTime = orderTime instanceof Date 
    ? orderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`max-w-md mx-auto bg-white min-h-screen shadow-2xl font-sans pb-8 border-x-4 ${isSuccess ? 'border-gray-100' : 'border-gray-100'} flex flex-col`}>
      
      {/* Header */}
      <div className="pt-8 pb-4 text-center">
        <h1 className={`text-2xl font-black uppercase tracking-wide ${isSuccess ? 'text-black' : 'text-[#D33131]'}`}>
          {isSuccess ? 'DELIVERY COMPLETE!' : 'DELIVERY FAILED!'}
        </h1>
      </div>

      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className={`w-20 h-20 ${isSuccess ? 'bg-[#4CD964]' : 'bg-[#D33131]'} rounded-full flex items-center justify-center shadow-lg ${!isSuccess ? 'animate-pulse' : ''}`}>
          <span className="text-white text-4xl font-black">
            {isSuccess ? '✓' : '✕'}
          </span>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="mx-4 bg-white border-2 border-gray-200 rounded-[2.5rem] p-6 shadow-sm mb-auto">
        
        {/* Card Header */}
        <div className="flex items-start space-x-3 pb-4 border-b border-gray-100">
          <span className="text-2xl mt-1">📦</span>
          <div>
            <h2 className="font-black text-base text-black uppercase tracking-tight">
              ORDER {order.id}-DETAILS
            </h2>
            <p className={`${isSuccess ? 'text-[#24B24B]' : 'text-[#D33131]'} font-black text-base mt-0.5`}>
              {isSuccess ? 'Delivered to Customer' : 'Delivery Failed'}
            </p>
          </div>
        </div>

        {/* General Details */}
        <div className="py-4 space-y-3 text-sm border-b border-gray-100">
          <div className="flex justify-between items-start">
            <span className="font-black text-black w-24 flex-shrink-0">Time:</span>
            <span className="font-bold text-gray-700 text-right">{displayTime}</span>
          </div>
          
          <div className="flex justify-between items-start">
            <span className="font-black text-black w-24 flex-shrink-0">Price:</span>
            <span className="font-bold text-gray-700 text-right">฿{totalPrice.toLocaleString()}.00</span>
          </div>

          {isSuccess && (
            <div className="flex justify-between items-start">
              <span className="font-black text-black w-24 flex-shrink-0">Status:</span>
              <span className="font-bold text-gray-700 text-right flex items-center">
                Delivered <span className="ml-1 text-xs">✅</span>
              </span>
            </div>
          )}

          <div className="flex justify-between items-start">
            <span className="font-black text-black w-24 flex-shrink-0">Delivery to:</span>
            <span className="font-bold text-gray-700 text-right leading-normal max-w-[200px]">
              {order.customer?.address}
            </span>
          </div>
        </div>

        {/* Success/Failure Specific Section */}
        <div className="py-4 space-y-3 text-sm border-b border-gray-100">
          {isSuccess ? (
            <div className="flex justify-between items-start">
              <span className="font-black text-black w-28 flex-shrink-0">Drop-off Note:</span>
              <span className="font-bold text-gray-700 text-right">{customReason || "Left at front door"}</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <span className="font-black text-[#D33131] w-28 flex-shrink-0">Reason:</span>
                <span className="font-black text-gray-700 text-right italic bg-red-50 px-2 py-0.5 rounded-lg">
                  {reason || "Unknown"}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="font-black text-black w-28 flex-shrink-0">Next Action:</span>
                <span className="font-bold text-orange-600 text-right">Return items to kitchen depot</span>
              </div>
            </>
          )}
        </div>

        {/* Photo Evidence */}
        <div className="pt-4 flex flex-col space-y-2 text-sm">
          <span className="font-black text-black">{isSuccess ? 'Delivery photo:' : 'Failure Evidence Photo:'}</span>
          <div className="w-full h-44 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
            {capturedImage ? (
              <img 
                src={capturedImage} 
                alt="Evidence" 
                className={`w-full h-full object-cover ${!isSuccess ? 'grayscale-[30%]' : ''}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold italic">
                NO IMAGE CAPTURED
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex px-4 space-x-3 items-center mt-6">
        <button 
          onClick={onBackToTasks || (() => navigate('/driver'))}
          className="flex-1 bg-[#E0E0E0] text-black py-4 rounded-3xl font-black text-xs shadow-md active:scale-95 transition-transform uppercase tracking-wider border border-gray-300"
        >
          CURRENT TASK
        </button>
        <button 
          onClick={() => navigate('/driver/history')}
          className="flex-1 bg-[#E0E0E0] text-black py-4 rounded-3xl font-black text-xs shadow-md active:scale-95 transition-transform uppercase tracking-wider border border-gray-300"
        >
          DELIVERY HISTORY
        </button>
      </div>

    </div>
  );
};

export default DeliveryStatusView;
