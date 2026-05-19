import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// ตรวจสอบ Path ให้ตรงกับโครงสร้างโฟลเดอร์ของคุณ (src/component/rider/OrderDetail.jsx)
import { orders } from '../../assets/order'; 

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

  // ดึงข้อมูลออเดอร์จากพารามิเตอร์ URL
  const currentOrder = orders.find(o => o.id === orderId);
  const isReadyToDeliver = currentOrder?.orderList?.every(item => item.status === "finished");

  // ป้องกัน App พังถ้าหาข้อมูลไม่เจอ
  if (!currentOrder) {
    return (
      <div className="p-10 text-center font-bold">
        Order Not Found
      </div>
    );
  }

  if (!isReadyToDeliver) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl font-sans p-8 text-center">
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

  const [currentStage, setCurrentStage] = useState(1);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [riderNote, setRiderNote] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    setShowCamera(true);
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
    setCapturedImage(canvasRef.current.toDataURL('image/png'));
    if (videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const handleMainButton = () => {
    if (currentStage === 1) setCurrentStage(2);
    else if (currentStage === 2 && !capturedImage) startCamera();
    else if (currentStage === 2 && capturedImage) {
        setCurrentStage(3);
        alert("Delivery Confirmed!");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl font-sans pb-10 border-x-4 border-blue-400 relative">
      <div className="py-6 text-center">
        <h1 className="text-2xl font-black uppercase leading-tight">-ORDER {currentOrder.id}<br/>DETAILS</h1>
      </div>

      {/* --- ส่วน Order Card --- */}
      <div className="mx-4 bg-white border-2 border-gray-200 rounded-[2rem] p-4 shadow-inner mb-4">
        <div className="flex justify-between items-center mb-4 px-2 border-l-4 border-black">
          <span className="font-black text-lg">ORDER {currentOrder.id}</span>
          <span className="text-gray-500 font-bold text-xs">
            {currentOrder.orderList[0].orderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="h-[180px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
          {currentOrder.orderList.map((item) => (
            <div key={item.id} className="flex bg-white border-2 border-gray-100 rounded-3xl p-3 shadow-sm items-center">
              {/* แก้ไขตรงนี้: เปลี่ยนจาก DIV เทาๆ เป็น IMG ของจริง */}
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-14 h-14 rounded-2xl flex-shrink-0 object-cover bg-gray-100 shadow-sm" 
              />
              <div className="ml-4 flex-1">
                <p className="font-black text-xs leading-tight">{item.name.replace('_', ' ').toUpperCase()}</p>
                <p className="text-[10px] font-bold text-gray-500">Qty: {item.quantity}</p>
                <p className="font-black text-sm">฿{item.price.toLocaleString()}.00</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-right pt-3 border-t-2 border-gray-50 mt-2">
          <span className="text-lg font-black uppercase">Total: ฿{totalPrice.toLocaleString()}.00</span>
        </div>
      </div>

      {/* ข้อมูลลูกค้า ดึงจาก currentOrder.customer ตรงๆ */}
      <div className="mx-4 bg-white border-2 border-gray-200 rounded-[2.5rem] p-5 shadow-md space-y-2 mb-4 text-[11px]">
        <p><span className="font-black">👤 Customer:</span> {currentOrder.customer.name}</p>
        <p><span className="font-black">📞 Contact:</span> {currentOrder.customer.contact}</p>
        <p><span className="font-black">📍 Delivery to:</span> {currentOrder.customer.address}</p>
      </div>

      {/* Note จากลูกค้า */}
      {!capturedImage && (
        <div className="mx-4 bg-white border-2 border-gray-200 rounded-[1.5rem] p-4 shadow-sm mb-4 text-[10px]">
          <p className="font-black italic underline mb-1">🗒️ Note from Customer :</p>
          <p className="font-bold text-gray-600 ml-4 leading-tight">{currentOrder.customer.note}</p>
        </div>
      )}

      {/* ส่วนเลือก Stage การทำงาน */}
      <div className="flex justify-between px-4 mb-4 space-x-2">
        <StageButton active={currentStage === 1} stage="1" text="Ready" icon="📦" />
        <StageButton active={currentStage === 2} stage="2" text="IN Transit" icon="🚚" />
        <StageButton active={currentStage === 3} stage="3" text="Delivered" icon="📍" />
      </div>

      {/* แสดงแผนที่ปลอมและรูปถ่ายหลังจาก Arrived แล้ว */}
      {currentStage === 2 && capturedImage && (
        <div className="px-4 space-y-4 mb-6">
          <div className="w-full h-28 bg-blue-50 border-2 border-gray-200 rounded-3xl overflow-hidden relative shadow-inner flex items-center justify-center">
             <div className="text-gray-400 text-[10px] font-bold italic">📍 GOOGLE MAPS PREVIEW</div>
          </div>

          <div className="flex flex-col items-center">
            <img src={capturedImage} alt="proof" className="w-full h-52 object-cover rounded-[2rem] border-4 border-white shadow-xl" />
            <button onClick={startCamera} className="mt-2 bg-gray-100 text-[10px] font-black px-4 py-1 rounded-full text-gray-500 border border-gray-200">
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

      {/* ปุ่มกดดำเนินการหลัก */}
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

      {/* ส่วน Camera Modal (ทับหน้าจอ) */}
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