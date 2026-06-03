import { useNavigate } from 'react-router-dom';
import { getOrderCreatedAt, getOrderNo, getOrderTotal } from '../../utils/riderOrders';

const DeliveryStatusView = ({ order, isSuccess, reason, customReason, capturedImage, onBackToTasks }) => {
  const navigate = useNavigate();
  
  const totalPrice = getOrderTotal(order);
  const orderNo = getOrderNo(order);
  const orderTime = order.deliveredAt || getOrderCreatedAt(order);
  
  let displayTime = '--:--';
  if (orderTime) {
    const dateObj = orderTime instanceof Date ? orderTime : new Date(orderTime);
    if (!isNaN(dateObj.getTime())) {
      displayTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }
  
  if (displayTime === '--:--') {
    displayTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className={`w-full max-w-[430px] mx-auto bg-white min-h-screen shadow-2xl font-sans pb-8 border-x border-gray-100 flex flex-col`}>
      
      {/* Header */}
      <div className="pt-6 sm:pt-8 pb-3 sm:pb-4 text-center">
        <h1 className={`text-xl sm:text-2xl font-black uppercase tracking-wide ${isSuccess ? 'text-black' : 'text-[#D33131]'}`}>
          {isSuccess ? 'DELIVERY COMPLETE!' : 'DELIVERY FAILED!'}
        </h1>
      </div>

      {/* Icon */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <div className={`w-16 h-16 sm:w-20 sm:h-20 ${isSuccess ? 'bg-[#4CD964]' : 'bg-[#D33131]'} rounded-full flex items-center justify-center shadow-lg ${!isSuccess ? 'animate-pulse' : ''}`}>
          <span className="text-white text-3xl sm:text-4xl font-black">
            {isSuccess ? '✓' : '✕'}
          </span>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="mx-3 sm:mx-4 bg-white border-2 border-gray-100 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-6 shadow-sm mb-auto">
        
        {/* Card Header */}
        <div className="flex items-start space-x-3 pb-3 sm:pb-4 border-b border-gray-50">
          <span className="text-xl sm:text-2xl mt-1">📦</span>
          <div>
            <h2 className="font-black text-sm sm:text-base text-black uppercase tracking-tight">
              ORDER {orderNo}-DETAILS
            </h2>
            <p className={`${isSuccess ? 'text-[#24B24B]' : 'text-[#D33131]'} font-black text-sm sm:text-base mt-0.5`}>
              {isSuccess ? 'Delivered to Customer' : 'Delivery Failed'}
            </p>
          </div>
        </div>

        {/* General Details */}
        <div className="py-3 sm:py-4 space-y-2.5 sm:space-y-3 text-[13px] sm:text-sm border-b border-gray-50">
          <div className="flex justify-between items-start gap-2">
            <span className="font-black text-black w-20 sm:w-24 flex-shrink-0">Time:</span>
            <span className="font-bold text-gray-700 text-right">{displayTime}</span>
          </div>
          
          <div className="flex justify-between items-start gap-2">
            <span className="font-black text-black w-20 sm:w-24 flex-shrink-0">Price:</span>
            <span className="font-bold text-gray-700 text-right">฿{totalPrice.toLocaleString()}.00</span>
          </div>

          {isSuccess && (
            <div className="flex justify-between items-start gap-2">
              <span className="font-black text-black w-20 sm:w-24 flex-shrink-0">Status:</span>
              <span className="font-bold text-gray-700 text-right flex items-center">
                Delivered <span className="ml-1 text-xs">✅</span>
              </span>
            </div>
          )}

          <div className="flex justify-between items-start gap-2">
            <span className="font-black text-black w-20 sm:w-24 flex-shrink-0">Delivery to:</span>
            <span className="font-bold text-gray-700 text-right leading-normal line-clamp-2">
              {order.customer?.address}
            </span>
          </div>
        </div>

        {/* Success/Failure Specific Section */}
        <div className="py-3 sm:py-4 space-y-2.5 sm:space-y-3 text-[13px] sm:text-sm border-b border-gray-50">
          {isSuccess ? (
            <div className="flex justify-between items-start gap-2">
              <span className="font-black text-black w-24 sm:w-28 flex-shrink-0">Drop-off Note:</span>
              <span className="font-bold text-gray-700 text-right">{customReason || "Left at front door"}</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start gap-2">
                <span className="font-black text-[#D33131] w-24 sm:w-28 flex-shrink-0">Reason:</span>
                <span className="font-black text-gray-700 text-right italic bg-red-50 px-2 py-0.5 rounded-lg">
                  {reason || "Unknown"}
                </span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="font-black text-black w-24 sm:w-28 flex-shrink-0">Next Action:</span>
                <span className="font-bold text-orange-600 text-right">Return to kitchen</span>
              </div>
            </>
          )}
        </div>

        {/* Photo Evidence */}
        <div className="pt-3 sm:pt-4 flex flex-col space-y-2 text-[13px] sm:text-sm">
          <span className="font-black text-black">{isSuccess ? 'Delivery photo:' : 'Failure Evidence Photo:'}</span>
          <div className="w-full h-36 sm:h-44 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
            {capturedImage ? (
              <img 
                src={capturedImage} 
                alt="Evidence" 
                className={`w-full h-full object-cover ${!isSuccess ? 'grayscale-[30%]' : ''}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold italic text-xs">
                NO IMAGE CAPTURED
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex px-3 sm:px-4 space-x-2 sm:space-x-3 items-center mt-6">
        <button 
          onClick={onBackToTasks || (() => navigate('/driver'))}
          className="flex-1 bg-gray-100 text-black py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl font-black text-[10px] sm:text-xs shadow-md active:scale-95 transition-transform uppercase tracking-wider border border-gray-200"
        >
          TASKS
        </button>
        <button 
          onClick={() => navigate('/driver/history')}
          className="flex-1 bg-gray-100 text-black py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl font-black text-[10px] sm:text-xs shadow-md active:scale-95 transition-transform uppercase tracking-wider border border-gray-200"
        >
          HISTORY
        </button>
      </div>

    </div>
  );
};

export default DeliveryStatusView;
