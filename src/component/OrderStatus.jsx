
const PickupConfirmation = ({ 
  isOpen, 
  onClose,
  status = "", 
  orderNo = "",
  timeDelivery = "",
  menuList = [],
  cancelledItems = [],
  refundAmount = 0,
  totalPrice = "",
  contact = "08x-xxxxxxx" 
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-1000 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#242424] w-full max-w-105 max-h-[calc(100dvh-2rem)] overflow-y-auto p-6 md:p-10 rounded-lg text-white border-t-10 border-[#e4002b]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-['Bebas_Neue'] text-3xl mb-6 text-center uppercase tracking-wider">
          THANK YOU FOR YOUR ORDER!
        </h2>

        <h2 className="font-['Bebas_Neue'] text-2xl mb-6 text-center uppercase tracking-wider">
          Order Status.
        </h2>

        <div className="space-y-4 mb-8">
          <div className="flex flex-col">
            <span className="text-[#888888] text-sm uppercase font-bold">- Status :</span>
            <span className="pl-4 text-white font-mono">{status || "N/A"}</span>
          </div>

           <div className="flex flex-col">
            <span className="text-[#888888] text-sm uppercase font-bold">- Time Delivery :</span>
            <span className="pl-4 text-white font-mono">{timeDelivery || "N/A"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[#888888] text-sm uppercase font-bold">- Order no :</span>
            <span className="pl-4 text-white font-mono">{orderNo || "N/A"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[#888888] text-sm uppercase font-bold">- List Menu :</span>
            <div className="pl-4 mt-1">
              {menuList.length > 0 ? (
                <ul className="list-disc list-inside text-sm">
                  {menuList.map((item, index) => (
                    <li key={index} className="text-white">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-white text-sm">No items</span>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[#888888] text-sm uppercase font-bold">- Total Price :</span>
            <span className="pl-4 text-white text-lg font-bold">฿{totalPrice}</span>
          </div>

          {cancelledItems.length > 0 && (
            <div className="flex flex-col rounded-lg border border-red-500/40 bg-red-500/10 p-3">
              <span className="text-red-300 text-sm uppercase font-bold">- Cancelled / Refund :</span>
              <ul className="pl-4 mt-1 list-disc list-inside text-sm text-red-100">
                {cancelledItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <span className="pl-4 mt-2 text-red-200 text-sm font-bold">
                Refund ฿{Number(refundAmount || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}. Please contact staff or wait for payment return.
              </span>
            </div>
          )}

          <div className="flex flex-col">
            <span className="text-[#888888] text-sm uppercase font-bold">- Contact :</span>
            <span className="pl-4 text-white text-lg font-bold">{contact}</span>
          </div>

        </div>

        <p className="text-[#e4002b] text-[15px] text-center mb-6 leading-relaxed">
          กรุณาชำระค่าอาหารที่เคานเตอร์ หรือ กรุณารอพนักงานชำระที่โต๊ะ
        </p>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-10 py-3 border-2 border-[#555] text-[#888] font-bold text-sm uppercase rounded hover:bg-[#333] hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PickupConfirmation;
