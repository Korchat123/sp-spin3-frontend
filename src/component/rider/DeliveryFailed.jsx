import React from 'react';

// ข้อมูลจำลองกรณีจัดส่งไม่สำเร็จ (Failed Order Data)
const failedOrderData = {
  orderId: "CK-212227",
  status: "Delivery Failed",
  time: "02:45 PM",
  price: "499 bath",
  deliveryTo: "34 G Tower, Rama 9 Soi 11 Rama 9 Road, Din Daeng, Din Daeng, Bangkok 10220",
  // เพิ่มข้อมูลเหตุผลที่ส่งไม่สำเร็จ
  failReason: "Cannot contact customer (Tried calling 3 times).", 
  returnLocation: "Return to central kitchen / Hub",
  photoUrl: "https://images.unsplash.com/photo-1557425955-df376b5903c8?auto=format&fit=crop&w=500&q=80" // รูปจำลองหน้าประตูบ้านหรือพัสดุที่ส่งไม่ได้
};

const DeliveryFailed = () => {
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl font-sans pb-8 border-x-4 border-gray-100 flex flex-col">
      
      {/* ส่วนหัวข้อหลัก - ใช้สีแดงเพื่อเน้นความสำคัญ */}
      <div className="pt-8 pb-4 text-center">
        <h1 className="text-2xl font-black uppercase tracking-wide text-[#D33131]">
          DELIVERY FAILED!
        </h1>
      </div>

      {/* ไอคอนเครื่องหมายกากบาทวงกลมสีแดง (Failed Icon) */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-[#D33131] rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <span className="text-white text-4xl font-black">✕</span>
        </div>
      </div>

      {/* การ์ดรายละเอียด (Main Info Card) */}
      <div className="mx-4 bg-white border-2 border-gray-200 rounded-[2.5rem] p-6 shadow-sm mb-auto">
        
        {/* หัวการ์ด: รหัสออเดอร์ และ สถานะพัง */}
        <div className="flex items-start space-x-3 pb-4 border-b border-gray-100">
          <span className="text-2xl mt-1">📦</span>
          <div>
            <h2 className="font-black text-base text-black uppercase tracking-tight">
              ORDER {failedOrderData.orderId}-DETAILS
            </h2>
            <p className="text-[#D33131] font-black text-base mt-0.5">
              {failedOrderData.status}
            </p>
          </div>
        </div>

        {/* รายละเอียดทั่วไป */}
        <div className="py-4 space-y-3 text-sm border-b border-gray-100">
          <div className="flex justify-between items-start">
            <span className="font-black text-black w-24 flex-shrink-0">Time:</span>
            <span className="font-bold text-gray-700 text-right">{failedOrderData.time}</span>
          </div>
          
          <div className="flex justify-between items-start">
            <span className="font-black text-black w-24 flex-shrink-0">Price:</span>
            <span className="font-bold text-gray-700 text-right">{failedOrderData.price}</span>
          </div>

          <div className="flex justify-between items-start">
            <span className="font-black text-black w-24 flex-shrink-0">Delivery to:</span>
            <span className="font-bold text-gray-700 text-right leading-normal max-w-[200px]">
              {failedOrderData.deliveryTo}
            </span>
          </div>
        </div>

        {/* ส่วนเหตุผลที่ส่งไม่สำเร็จ และ Action ถัดไป (จุดแตกต่างสำคัญของหน้านี้) */}
        <div className="py-4 space-y-3 text-sm border-b border-gray-100">
          <div className="flex justify-between items-start">
            <span className="font-black text-[#D33131] w-28 flex-shrink-0">Reason:</span>
            <span className="font-black text-gray-700 text-right italic bg-red-50 px-2 py-0.5 rounded-lg">
              {failedOrderData.failReason}
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="font-black text-black w-28 flex-shrink-0">Next Action:</span>
            <span className="font-bold text-orange-600 text-right">{failedOrderData.returnLocation}</span>
          </div>
        </div>

        {/* รูปถ่ายหลักฐาน เช่น ถ่ายหน้าบ้านปิด หรือโทรศัพท์ที่ไม่มีคนรับ */}
        <div className="pt-4 flex flex-col space-y-2 text-sm">
          <span className="font-black text-black">Failure Evidence Photo:</span>
          <div className="w-full h-40 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
            <img 
              src={failedOrderData.photoUrl} 
              alt="Failure Evidence" 
              className="w-full h-full object-cover grayscale-[30%]"
            />
          </div>
        </div>

      </div>

      {/* ปุ่มนำทางด้านล่าง (Action Buttons) คงดีไซน์เดิมไว้เพื่อความต่อเนื่อง */}
      <div className="flex px-4 space-x-3 items-center mt-6">
        <button className="flex-1 bg-[#E0E0E0] text-black py-4 rounded-3xl font-black text-xs shadow-md active:scale-95 transition-transform uppercase tracking-wider border border-gray-300">
          CURRENT TASK
        </button>
        <button className="flex-1 bg-[#E0E0E0] text-black py-4 rounded-3xl font-black text-xs shadow-md active:scale-95 transition-transform uppercase tracking-wider border border-gray-300">
          DELIVERY HISTORY
        </button>
      </div>

    </div>
  );
};

export default DeliveryFailed;