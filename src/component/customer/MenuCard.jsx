import { Plus, Minus } from "lucide-react";

// 💡 เพิ่ม Prop isCashierMode สำหรับแยก UI
const MenuCard = ({
  item,
  onAddToCart,
  onOpenModal,
  qtyInCart = 0,
  onIncrease,
  onDecrease,
  isCashierMode = false,
}) => {
  const isSoldOut = item.soldOut === true;

  return (
    <div className="bg-white rounded-xl border-2 border-transparent transition-all duration-300 overflow-hidden flex flex-col h-full min-w-0 hover:border-[#242424] hover:-translate-y-1 hover:shadow-[8px_8px_0px_rgba(0,0,0,0.08)]">
      <div
        className="cursor-pointer flex flex-col flex-1"
        onClick={() => !isSoldOut && onOpenModal()}
      >
        <div className="h-32 md:h-45 bg-[#f0f0f0] relative overflow-hidden group flex items-center justify-center">
          <img
            src={item.img}
            alt={item.name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isSoldOut ? "grayscale opacity-50" : ""}`}
            onError={(e) => {
              e.target.src =
                "https://placehold.co/400x400/eeeeee/242424?text=FOOD";
            }}
          />
        </div>

        <div className="p-3 md:p-5 pb-1 md:pb-2 flex-1">
          <h3 className="font-bold text-sm md:text-lg mb-1 leading-tight text-[#242424] group-hover:text-[#e4002b] transition-colors">
            {item.name}
          </h3>
          <p className="text-[10px] md:text-xs text-gray-500 line-clamp-2">
            {item.desc}
          </p>
        </div>
      </div>

      <div className="p-3 md:p-5 pt-0 mt-auto flex justify-between items-end gap-2">
        <span className="text-xl md:text-2xl font-black text-[#e4002b] font-['Bebas_Neue'] tracking-wide">
          ฿{item.price}
        </span>

        {isSoldOut ? (
          <button
            disabled
            className="bg-[#e0e0e0] text-[#888888] px-2 py-1 md:px-3 md:py-2 rounded-md font-bold cursor-not-allowed text-[10px] md:text-sm"
          >
            SOLD OUT
          </button>
        ) : isCashierMode ? (
          // 💡 โหมดแคชเชียร์: โชว์ตัวนับ - 0 + ตั้งแต่ต้น คุมธีมดุดัน!
          <div className="flex items-center border-2 border-[#242424] rounded-lg overflow-hidden bg-white shadow-sm h-8 md:h-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDecrease();
              }}
              disabled={qtyInCart === 0}
              className={`w-8 md:w-10 h-full flex items-center justify-center transition-colors ${
                qtyInCart === 0
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed" // เป็น 0 กดลบไม่ได้
                  : "bg-white text-[#242424] hover:bg-[#e4002b] hover:text-white cursor-pointer"
              }`}
            >
              <Minus size={16} strokeWidth={3} />
            </button>

            {/* 💡 ตัวเลขตรงกลาง ถ้ามีการสั่งจะพลิกเป็นสีดำ ให้สะดุดตาแคชเชียร์ */}
            <div
              className={`w-6 md:w-8 text-center font-['Bebas_Neue'] text-lg md:text-xl flex items-center justify-center h-full border-x-2 border-[#242424] transition-colors ${
                qtyInCart > 0
                  ? "bg-[#242424] text-white"
                  : "bg-white text-gray-400"
              }`}
            >
              {qtyInCart}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onIncrease();
              }}
              className="w-8 md:w-10 h-full flex items-center justify-center bg-white text-[#242424] hover:bg-[#e4002b] hover:text-white transition-colors cursor-pointer"
            >
              <Plus size={16} strokeWidth={3} />
            </button>
          </div>
        ) : (
          // 💡 โหมดลูกค้า: โชว์ปุ่ม ADD ตามปกติ
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item.id, item.name);
            }}
            className="bg-transparent border-2 border-[#e4002b] text-[#e4002b] px-2 py-1.5 md:px-3 md:py-2 rounded-md font-bold transition-all hover:bg-[#e4002b] hover:text-white hover:scale-105 flex shrink-0 items-center gap-1 text-[10px] md:text-sm cursor-pointer"
          >
            <Plus size={14} className="md:w-4 md:h-4" />{" "}
            <span className="hidden sm:inline">ADD</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuCard;
