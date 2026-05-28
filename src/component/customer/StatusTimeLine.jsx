
// ---------------------------------------------------------
// 3. Component: แถบสถานะ (StatusTimeline)
// ---------------------------------------------------------
const StatusTimeline = ({ currentStep }) => {
  const steps = [
    { id: 1, title: 'ร้านกำลังเตรียมอาหาร', time: '10:15 น.', isActive: currentStep >= 1 },
    { id: 2, title: 'ไรเดอร์รับอาหารแล้ว', time: '10:25 น.', isActive: currentStep >= 2 },
    { id: 3, title: 'กำลังเดินทางไปส่ง', desc: 'ไรเดอร์อยู่ห่างจากคุณ 2.5 กม.', isActive: currentStep >= 3, isCurrent: currentStep === 3 },
    { id: 4, title: 'ถึงที่หมาย', isActive: currentStep >= 4 }
  ];

  return (
    <div className="p-8 pb-4">
      <div className="relative border-l-2 border-gray-200 ml-3">
        {steps.map((step) => (
          <div key={step.id} className="mb-8 flex items-center relative">
            {step.isCurrent ? (
              <div className="absolute -left-3.25 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow flex justify-center items-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            ) : (
              <div className={`absolute -left-2.25 w-4 h-4 rounded-full border-2 border-white ${step.isActive ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            )}
            
            <div className="ml-6">
              <h4 className={`text-sm font-bold ${step.isCurrent ? 'text-green-600 text-lg' : step.isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                {step.title}
              </h4>
              {step.time && <p className="text-xs text-gray-500 mt-0.5">{step.time}</p>}
              {step.desc && <p className="text-sm text-gray-500 mt-0.5">{step.desc}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};