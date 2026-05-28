import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OrdersContext } from '../../context/ordersContext/OrdersContext';
import DeliveryStatusView from './DeliveryStatusView';

const StageButton = ({ active, stage, text, icon }) => (
  <div className={`flex-1 border-2 py-2 px-1 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm transition-all duration-300 ${
    active ? 'border-cyan-400 bg-white scale-105' : 'border-gray-200 bg-gray-50 opacity-60'
  }`}>
    <div className="flex items-center space-x-1">
      <span className="text-lg">{icon}</span>
      <div className="flex flex-col leading-none text-left">
        <span className={`text-[8px] font-black uppercase ${active ? 'text-cyan-500' : 'text-gray-400'}`}>STAGE {stage}:</span>
        <span className={`text-[7px] font-bold ${active ? 'text-cyan-400' : 'text-gray-400'}`}>{text}</span>
      </div>
    </div>
  </div>
);

const OrderDetail = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { orderList, setOrderList } = useContext(OrdersContext);

  // ดึงข้อมูลออเดอร์จากพารามิเตอร์ URL โดยตรวจสอบทั้ง id และ orderId และรองรับทั้ง string/number
  const currentOrder = orderList?.find(o => 
    String(o.id) === String(orderId) || 
    String(o.orderId) === String(orderId)
  );

  const isReadyToDeliver = currentOrder?.orderList?.every(item => item.status === "finished");

  const [viewMode, setViewMode] = useState('normal'); // 'normal' | 'reason' | 'failed_camera' | 'failed_summary'
  const [currentStage, setCurrentStage] = useState(1);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [failedCapturedImage, setFailedCapturedImage] = useState(null);
  const [riderNote, setRiderNote] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (currentOrder?.status === 'delivered') {
      setCurrentStage(3);
    } else if (currentOrder?.status === 'cancelled') {
      setViewMode('failed_summary');
    }
  }, [currentOrder]);

  const cancellationReasons = [
    "Cannot Contact Customer",
    "Incorrect Address",
    "Customer Refused Delivery",
    "Vehicle Breakdown / Accident",
    "Severe Weather",
    "Other"
  ];

  // ป้องกัน App พังถ้าหาข้อมูลไม่เจอ
  if (!currentOrder) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl font-sans p-8 text-center flex flex-col items-center justify-center">
        <h1 className="text-2xl font-black uppercase mb-4 text-red-600">Order Not Found</h1>
        <p className="text-sm text-gray-600 mb-6">ไม่พบข้อมูลออเดอร์ ID: {orderId}</p>
        <button
          onClick={() => navigate('/driver')}
          className="px-6 py-3 bg-[#D33131] text-white font-black uppercase rounded-3xl shadow-lg"
        >
          กลับหน้ารายการจัดส่ง
        </button>
      </div>
    );
  }

  // If already delivered or failed, show the summary view
  if (currentOrder.status === 'delivered' || currentStage === 3) {
    return (
      <DeliveryStatusView 
        order={currentOrder} 
        isSuccess={true} 
        customReason={riderNote || "Delivered successfully"} 
        capturedImage={capturedImage || "/images/placeholder.png"}
        onBackToTasks={() => navigate('/driver')}
      />
    );
  }

  if (currentOrder.status === 'cancelled' || viewMode === 'failed_summary') {
    return (
      <DeliveryStatusView 
        order={currentOrder} 
        isSuccess={false} 
        reason={selectedReason || "Cancelled"} 
        customReason={customReason}
        capturedImage={failedCapturedImage || "/images/placeholder.png"}
        onBackToTasks={() => navigate('/driver')}
      />
    );
  }

  if (!isReadyToDeliver) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl font-sans p-8 text-center flex flex-col items-center justify-center">
        <h1 className="text-2xl font-black uppercase mb-4">Order {currentOrder.id} is not ready</h1>
        <p className="text-sm text-gray-600 mb-6">ออเดอร์นี้ยังมีสถานะไม่ครบทั้งหมดจึงไม่สามารถเริ่มการจัดส่งได้</p>
        <button
          onClick={() => navigate('/driver')}
          className="px-6 py-3 bg-[#D33131] text-white font-black uppercase rounded-3xl shadow-lg"
        >
          กลับหน้ารายการจัดส่ง
        </button>
      </div>
    );
  }

  // คำนวณราคาทั้งหมดจาก orderList
  const totalPrice = currentOrder.orderList.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const startCamera = async (isFailureProof = false) => {
    setShowCamera(true);
    window._isFailureProof = isFailureProof; 
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("เข้าถึงกล้องไม่ได้: " + err.message);
      setShowCamera(false);
    }
  };

  const takePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    const imgData = canvasRef.current.toDataURL('image/png');
    
    if (window._isFailureProof) {
      setFailedCapturedImage(imgData);
      updateOrderStatus('cancelled');
      setViewMode('failed_summary');
    } else {
      setCapturedImage(imgData);
    }

    if (videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const updateOrderStatus = (newStatus) => {
    if (setOrderList) {
      setOrderList(prevList => prevList.map(order => 
        String(order.id) === String(currentOrder.id) ? { ...order, status: newStatus } : order
      ));
    }
  };

  const handleMainButton = () => {
    if (currentStage === 1) setCurrentStage(2);
    else if (currentStage === 2 && !capturedImage) startCamera(false);
    else if (currentStage === 2 && capturedImage) {
        updateOrderStatus('delivered');
        setCurrentStage(3);
        alert("Delivery Confirmed!");
    }
  };

  const handleSelectReason = (reason) => {
    setSelectedReason(reason);
    setViewMode('failed_camera');
  };

  if (viewMode === 'reason') {
    return (
      <div className="max-w-md mx-auto bg-gray-500/50 min-h-screen shadow-2xl font-sans relative flex flex-col justify-center items-center p-4">
        <div className="w-full bg-black text-white border border-gray-800 rounded-[2rem] p-6 shadow-2xl relative">
          <button onClick={() => setViewMode('normal')} className="absolute top-4 right-5 text-gray-400 font-black text-xl hover:text-white">✕</button>
          <h2 className="text-center font-black text-lg mb-6 tracking-wide uppercase mt-2">
            -ORDER {currentOrder.id}<br/>CANCELLATION
          </h2>
          <div className="space-y-2">
            {cancellationReasons.map((reason, idx) => (
              <button key={idx} onClick={() => handleSelectReason(reason)} className="w-full text-center py-3 bg-neutral-900 border border-neutral-800 rounded-xl font-black text-sm hover:bg-neutral-800 transition-colors">
                {reason}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'failed_camera') {
    return (
      <div className="max-w-md mx-auto bg-black min-h-screen font-sans flex flex-col justify-between text-white overflow-hidden relative">
        <div className="relative w-full h-[65%] bg-zinc-950 flex flex-col justify-center items-center">
          <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center opacity-60">
             <span className="text-zinc-700 font-black italic">CAMERA FEED ACTIVE</span>
          </div>
          <div className="absolute w-28 h-28 border border-white/40 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 border-t-2 border-l-2 border-white absolute top-0 left-0"></div>
            <div className="w-3 h-3 border-t-2 border-r-2 border-white absolute top-0 right-0"></div>
            <div className="w-3 h-3 border-b-2 border-l-2 border-white absolute bottom-0 left-0"></div>
            <div className="w-3 h-3 border-b-2 border-r-2 border-white absolute bottom-0 right-0"></div>
            <span className="text-white font-light text-2xl">+</span>
          </div>
        </div>

        <div className="bg-black p-5 flex flex-col items-center space-y-5 border-t border-zinc-900 z-10">
          <div className="w-full bg-black border border-zinc-800 p-4 rounded-2xl">
            <label className="block text-xs font-black mb-1.5 text-zinc-400 uppercase tracking-wider">
              Selected: {selectedReason}
            </label>
            <input 
              type="text" 
              placeholder="Note reason to cancel..." 
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="w-full bg-white text-black font-semibold text-xs px-4 py-2.5 rounded-full outline-none"
            />
          </div>

          <div className="w-full flex justify-between items-center px-4 py-2">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-zinc-700 bg-zinc-800"></div>
            <button 
              onClick={() => startCamera(true)}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-1 border-4 border-black ring-4 ring-white active:scale-90 transition-transform cursor-pointer"
            >
              <div className="w-full h-full bg-white rounded-full"></div>
            </button>
            <button onClick={() => setViewMode('reason')} className="text-xs bg-zinc-800/80 font-black px-4 py-2 rounded-full text-red-500 hover:bg-zinc-800">
              CANCEL
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'failed_summary') {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl font-sans pb-8 border-x-4 border-gray-100 flex flex-col">
        <div className="pt-8 pb-4 text-center">
          <h1 className="text-2xl font-black uppercase tracking-wide text-[#D33131]">DELIVERY FAILED!</h1>
        </div>
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#D33131] rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-4xl font-black">✕</span>
          </div>
        </div>
        <div className="mx-4 bg-white border-2 border-gray-200 rounded-[2.5rem] p-6 shadow-sm mb-auto">
          <div className="flex items-start space-x-3 pb-4 border-b border-gray-100">
            <span className="text-2xl mt-1">📦</span>
            <div>
              <h2 className="font-black text-base text-black uppercase tracking-tight">ORDER {currentOrder.id}-DETAILS</h2>
              <p className="text-[#D33131] font-black text-base mt-0.5">Delivery Cancelled</p>
            </div>
          </div>
          <div className="py-4 space-y-3 text-sm border-b border-gray-100">
            <div className="flex justify-between"><span className="font-black">Time:</span><span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
            <div className="flex justify-between"><span className="font-black">Price:</span><span>฿{totalPrice.toLocaleString()}.00</span></div>
            <div className="flex justify-between items-start">
              <span className="font-black flex-shrink-0 w-24">Delivery to:</span>
              <span className="text-right leading-tight max-w-[200px] font-bold text-gray-600">{currentOrder.customer.address}</span>
            </div>
          </div>
          <div className="py-4 space-y-3 text-sm border-b border-gray-100 bg-red-50/50 p-3 rounded-2xl mt-2">
            <p><span className="font-black text-[#D33131]">Reason:</span> <span className="font-bold text-gray-700">{selectedReason}</span></p>
            {customReason && <p><span className="font-black text-zinc-500">Note:</span> <span className="font-bold text-gray-600">"{customReason}"</span></p>}
            <p><span className="font-black text-black">Action:</span> <span className="font-bold text-orange-600">Return items to kitchen depot</span></p>
          </div>
          <div className="pt-4 flex flex-col space-y-2 text-sm">
            <span className="font-black">Failure Evidence Photo:</span>
            <div className="w-full h-40 bg-zinc-900 rounded-2xl overflow-hidden relative">
              {failedCapturedImage ? (
                <img src={failedCapturedImage} alt="Evidence" className="w-full h-full object-cover grayscale" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600 font-bold italic">NO IMAGE CAPTURED</div>
              )}
            </div>
          </div>
        </div>
        <div className="flex px-4 space-x-3 items-center mt-6">
          <button onClick={() => setViewMode('normal')} className="flex-1 bg-[#E0E0E0] text-black py-4 rounded-3xl font-black text-xs shadow-md border border-gray-300">CURRENT TASK</button>
          <button onClick={() => navigate('/driver')} className="flex-1 bg-[#E0E0E0] text-black py-4 rounded-3xl font-black text-xs shadow-md border border-gray-300">DELIVERY HISTORY</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl font-sans pb-10 border-x-4 border-blue-400 relative">
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => setViewMode('reason')} 
          className="flex space-x-1 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
        </button>
      </div>

      <div className="py-6 text-center">
        <h1 className="text-2xl font-black uppercase leading-tight">-ORDER {currentOrder.id}<br/>DETAILS</h1>
      </div>

      <div className="mx-4 bg-white border-2 border-gray-200 rounded-[2rem] p-4 shadow-inner mb-4">
        <div className="flex justify-between items-center mb-4 px-2 border-l-4 border-black">
          <span className="font-black text-lg">ORDER {currentOrder.id}</span>
          <span className="text-gray-500 font-bold text-xs">
            {currentOrder.orderList?.[0]?.orderTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '--:--'}
          </span>
        </div>

        <div className="h-[180px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
          {currentOrder.orderList?.map((item) => (
            <div key={item.id} className="flex bg-white border-2 border-gray-100 rounded-3xl p-3 shadow-sm items-center">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-14 h-14 rounded-2xl flex-shrink-0 object-cover bg-gray-100 shadow-sm" 
              />
              <div className="ml-4 flex-1">
                <p className="font-black text-xs leading-tight">{item.name?.replace('_', ' ')?.toUpperCase()}</p>
                <p className="text-[10px] font-bold text-gray-500">Qty: {item.quantity}</p>
                <p className="font-black text-sm">฿{item.price?.toLocaleString()}.00</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-right pt-3 border-t-2 border-gray-50 mt-2">
          <span className="text-lg font-black uppercase">Total: ฿{totalPrice.toLocaleString()}.00</span>
        </div>
      </div>

      <div className="mx-4 bg-white border-2 border-gray-200 rounded-[2.5rem] p-5 shadow-md space-y-2 mb-4 text-[11px]">
        <p><span className="font-black">👤 Customer:</span> {currentOrder.customer?.name}</p>
        <p><span className="font-black">📞 Contact:</span> {currentOrder.customer?.contact}</p>
        <p><span className="font-black">📍 Delivery to:</span> {currentOrder.customer?.address}</p>
      </div>

      {!capturedImage && (
        <div className="mx-4 bg-white border-2 border-gray-200 rounded-[1.5rem] p-4 shadow-sm mb-4 text-[10px]">
          <p className="font-black italic underline mb-1">🗒️ Note from Customer :</p>
          <p className="font-bold text-gray-600 ml-4 leading-tight">{currentOrder.customer?.note}</p>
        </div>
      )}

      <div className="flex justify-between px-4 mb-4 space-x-2">
        <StageButton active={currentStage === 1} stage="1" text="Ready" icon="📦" />
        <StageButton active={currentStage === 2} stage="2" text="IN Transit" icon="🚚" />
        <StageButton active={currentStage === 3} stage="3" text="Delivered" icon="📍" />
      </div>

      {currentStage === 2 && capturedImage && (
        <div className="px-4 space-y-4 mb-6">
          <div className="w-full h-28 bg-blue-50 border-2 border-gray-200 rounded-3xl overflow-hidden relative shadow-inner flex items-center justify-center">
             <div className="text-gray-400 text-[10px] font-bold italic">📍 GOOGLE MAPS PREVIEW</div>
          </div>

          <div className="flex flex-col items-center">
            <img src={capturedImage} alt="proof" className="w-full h-52 object-cover rounded-[2rem] border-4 border-white shadow-xl" />
            <button onClick={() => startCamera(false)} className="mt-2 bg-gray-100 text-[10px] font-black px-4 py-1 rounded-full text-gray-500 border border-gray-200">
               Take the photo again
            </button>
          </div>

          <textarea 
            placeholder="Note something to customer..."
            value={riderNote}
            onChange={(e) => setRiderNote(e.target.value)}
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-3xl p-4 text-xs font-bold min-h-[100px] outline-none focus:border-cyan-400 shadow-inner"
          />
        </div>
      )}

      <div className="flex px-4 space-x-2 items-center">
        <button 
          onClick={handleMainButton}
          className={`flex-1 py-4 rounded-2xl font-black text-xl shadow-lg active:scale-95 transition-all ${
            currentStage === 2 && capturedImage ? 'bg-[#D33131]' : 
            currentStage === 3 ? 'bg-green-500' : 'bg-[#D33131]'
          } text-white`}
        >
          {currentStage === 1 && "START DELIVERY"}
          {currentStage === 2 && !capturedImage && "ARRIVED"}
          {currentStage === 2 && capturedImage && "CONFIRM DELIVERY"}
          {currentStage === 3 && "COMPLETED ✅"}
        </button>
        
        <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center shadow-md relative shrink-0">
           <span className="text-3xl">💬</span>
           <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-white shadow-sm">1</span>
        </div>
      </div>

      {showCamera && (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <div className="absolute bottom-10 flex space-x-12 items-center">
             <button onClick={() => {
               if(videoRef.current.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop());
               setShowCamera(false);
             }} className="text-white font-bold underline">Cancel</button>
             <button onClick={takePhoto} className="w-20 h-20 bg-white rounded-full border-8 border-gray-300 active:scale-90" />
             <div className="w-10" />
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default OrderDetail;