import React from "react";

const PickupConfirmation = ({
  isOpen,
  onClose,
  orderNo = "",
  menuList = [],
  totalPrice = "0.00",
  deliveryTime = "",
  comment = "",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-1000"
      onClick={onClose}
    >
      <div
        className="bg-[#242424] w-full max-w-105 p-8 md:p-10 rounded-lg text-white border-t-10 border-[#e4002b]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-['Bebas_Neue'] text-4xl mb-6 text-center uppercase tracking-wider">
          Thank you for your Order.
        </h2>

        <div className="space-y-4 mb-8">
          <div className="flex flex-col">
            <span className="text-[#888888] text-sm uppercase font-bold">
              - Order no :
            </span>
            <span className="pl-4 text-white font-mono">
              {orderNo || "N/A"}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[#888888] text-sm uppercase font-bold">
              - List Menu :
            </span>
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
            <span className="text-[#888888] text-sm uppercase font-bold">
              - Total Price :
            </span>
            <span className="pl-4 text-white text-lg font-bold">
              ฿{totalPrice}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[#888888] text-sm uppercase font-bold">
              - Delivery time :
            </span>
            <span className="pl-4 text-white">{deliveryTime || "N/A"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[#888888] text-sm uppercase font-bold">
              - Comment :
            </span>
            <p className="pl-4 text-white text-sm italic">
              {comment || "No comment"}
            </p>
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
            เพิ่มเติม /แก้ไขรายการสินค้า
          </button>
        </div>
      </div>
    </div>
  );
};

export default PickupConfirmation;
