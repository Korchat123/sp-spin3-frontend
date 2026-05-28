import React, { useContext, useCallback } from "react";
import { OrdersContext } from "../../context/ordersContext/OrdersContext";
import { useNavigate } from "react-router-dom";
import { Trash2, PlusCircle, MessageSquare, ShoppingCart } from "lucide-react";

// --- ส่วนแสดงรายการสินค้าในตะกร้า (Middle Panel) ---
const OrderItem = ({ item, orderId, onUpdateQty, onRemove, onEdit, isSelected }) => {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-4xl transition-all duration-300 ease-in-out cursor-pointer mb-3
        ${isSelected 
          ? 'bg-[#FDE68A] border-2 border-[#242424] shadow-[4px_4px_0_#242424]' // เน้นด้วย Sprinkle Yellow
          : 'bg-[#ffffff] border-2 border-[#e5e7eb] hover:border-[#242424] hover:shadow-[4px_4px_0_#242424]'}`}
      onClick={() => onEdit(item)}
    >
      {/* Thumbnail Placeholder */}
      <div className="w-16 h-16 rounded-3xl overflow-hidden bg-[#eeeeee] border-2 border-[#242424] shrink-0 flex items-center justify-center text-3xl shadow-[2px_2px_0_#242424]">
        <div className="animate-[bounce_3s_infinite]">{item.emoji || "🍗"}</div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-[#242424] text-base truncate font-['IBM_Plex_Sans_Thai']">{item.name}</h3>
        <p className="text-base text-[#e4002b] font-['Bebas_Neue'] tracking-widest">
          {item.price ? `${(item.price * item.quantity).toLocaleString()} THB` : "TBA"}
        </p>
        <div className="flex items-center gap-2 mt-1 text-[11px] text-[#DC5F00] uppercase font-bold tracking-wide">
          <MessageSquare size={12} /> {item.note || 'No Note'} | {item.size || 'Regular'}
        </div>
      </div>
      
      {/* Qty Control สไตล์ Brutalist */}
      <div className="flex items-center bg-[#ffffff] rounded-xl border-2 border-[#242424] overflow-hidden shadow-[2px_2px_0_#242424]" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={() => onUpdateQty(orderId, item.id, -1)} 
          className="w-8 h-8 flex items-center justify-center hover:bg-[#eeeeee] text-[#242424] font-bold border-r-2 border-[#242424]"
          disabled={item.quantity <= 1}
        > - </button>
        <span className="w-8 text-center font-bold text-[#242424] text-sm font-['Bebas_Neue']">{item.quantity}</span>
        <button 
          onClick={() => onUpdateQty(orderId, item.id, 1)} 
          className="w-8 h-8 flex items-center justify-center hover:bg-[#eeeeee] text-[#242424] font-bold border-l-2 border-[#242424]"
        > + </button>
      </div>

      <button 
        onClick={(e) => { e.stopPropagation(); onRemove(orderId, item.id); }} 
        className="p-3 bg-[#ffffff] border-2 border-[#e5e7eb] rounded-xl text-[#242424] hover:bg-[#e4002b] hover:text-white hover:border-[#242424] hover:shadow-[4px_4px_0_#242424] transition-all duration-300"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

const OrderPage = () => {
  const { orderList, updateItemQty, removeItem } = useContext(OrdersContext);
  const navigate = useNavigate();
  
  const [customizingItem, setCustomizingItem] = React.useState(null);

  // Handle update quantity using context
  const handleUpdateQty = useCallback((orderId, itemId, change) => {
    const items = orderList.find(o => o.orderId === orderId);
    const key = items?.List ? "List" : "orderList";
    const item = items?.[key]?.find(i => i.id === itemId);
    if (item) {
      updateItemQty(orderId, itemId, item.quantity + change);
    }
  }, [orderList, updateItemQty]);

  // Handle remove using context
  const handleRemove = useCallback((orderId, itemId) => {
    if (window.confirm("ลบรายการนี้ออกจากตะกร้า?")) {
      removeItem(orderId, itemId);
      if (customizingItem?.id === itemId) setCustomizingItem(null);
    }
  }, [customizingItem, removeItem]);

  const calculateTotal = () => {
    return orderList?.reduce((total, order) => {
      const items = order.List || order.orderList || [];
      return total + items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    }, 0) || 0;
  };

  const subTotal = calculateTotal();
  const tax = subTotal * 0.07;
  const netTotal = subTotal + tax;

  return (
    <div className="pt-10 pb-20 bg-[#eeeeee] min-h-screen text-[#242424] font-['IBM_Plex_Sans_Thai'] relative overflow-hidden">
      
      {/* Background Sprinkles (Random Decorative) */}
      <div className="absolute top-10 left-10 w-16 h-4 bg-[#FBCFE8] rounded-full rotate-45 -z-10"></div>
      <div className="absolute top-40 right-20 w-12 h-4 bg-[#A7F3D0] rounded-full -rotate-12 -z-10"></div>
      <div className="absolute bottom-40 left-1/4 w-20 h-5 bg-[#FFDAB9] rounded-full rotate-60 -z-10"></div>

      <main className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Page Title with Dancing Letters & Bebas Neue */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex gap-1 text-5xl font-['Bebas_Neue'] tracking-widest uppercase font-black drop-shadow-[4px_4px_0_#242424] text-[#e4002b]">
            <span className="rotate-[-4deg]">M</span>
            <span className="rotate-[4deg]">Y</span>
            <span className="ml-3 rotate-[-4deg]">C</span>
            <span className="rotate-[4deg]">A</span>
            <span className="rotate-[-4deg]">R</span>
            <span className="rotate-[4deg]">T</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ── LEFT PANEL: Product Preview & Customize ── */}
          <div className="lg:col-span-3 bg-[#ffffff] rounded-4xl overflow-hidden border border-[#e5e7eb] shadow-[8px_8px_0_#242424]">
            <div className="h-64 bg-[#eeeeee] border-b-2 border-[#242424] flex flex-col items-center justify-center relative overflow-hidden">
              {customizingItem ? (
                <>
                  {/* Starburst Sticker (Approximated with Brutalist tag) */}
                  <div className="absolute top-4 right-4 bg-[#DC5F00] text-white text-[10px] px-3 py-1 font-black uppercase tracking-widest border-2 border-[#242424] shadow-[2px_2px_0_#242424] rotate-12 animate-pulse">
                    EDITING
                  </div>
                  <div className="text-8xl mb-4 animate-[bounce_3s_ease-in-out_infinite]">{customizingItem.emoji || "🍗"}</div>
                  <div className="text-lg font-bold text-[#242424] font-['IBM_Plex_Sans_Thai'] text-center px-4">{customizingItem.name}</div>
                </>
              ) : (
                <div className="text-center text-[#242424]/40 p-6">
                  <ShoppingCart size={48} className="mx-auto mb-4" />
                  <p className="text-sm font-bold uppercase font-['IBM_Plex_Sans_Thai']">Select Item<br/>to Customize</p>
                </div>
              )}
            </div>

            {customizingItem ? (
              <div className="p-6 space-y-6">
                <h3 className="text-2xl font-['Bebas_Neue'] tracking-widest uppercase">Customize Menu</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#DC5F00] uppercase font-bold tracking-wider block mb-1">ระดับความเผ็ด</label>
                    <select className="w-full bg-[#ffffff] border-2 border-[#242424] rounded-xl p-3 text-sm font-bold focus:shadow-[4px_4px_0_#DC5F00] outline-none transition-all cursor-pointer">
                      <option>ไม่เผ็ด</option><option>เผ็ดน้อย</option><option selected>เผ็ดกลาง</option><option>เผ็ดมาก</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#DC5F00] uppercase font-bold tracking-wider block mb-1">ขนาด</label>
                    <select className="w-full bg-[#ffffff] border-2 border-[#242424] rounded-xl p-3 text-sm font-bold focus:shadow-[4px_4px_0_#DC5F00] outline-none transition-all cursor-pointer">
                      <option>Regular</option><option>Large</option><option>Family Bucket</option>
                    </select>
                  </div>
                </div>
                
                {/* The "Street" Button - Secondary */}
                <button 
                  onClick={() => setCustomizingItem(null)}
                  className="w-full py-4 bg-[#DC5F00] text-white rounded-4xl text-xl font-['Bebas_Neue'] tracking-widest uppercase border-2 border-[#242424] shadow-[8px_8px_0_#242424] hover:translate-y-1 hover:shadow-[4px_4px_0_#242424] transition-all duration-300 ease-in-out mt-4 relative overflow-hidden group"
                >
                  <span className="relative z-10">Save Customization</span>
                  <div className="absolute inset-0 bg-[#e4002b] translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0"></div>
                </button>
              </div>
            ) : (
              <div className="p-10 text-center text-[#242424] text-sm font-bold">
                คลิกที่รายการในตะกร้าเพื่อปรับแต่งรสชาติ
              </div>
            )}
          </div>

          {/* ── MIDDLE PANEL: Order List ── */}
          <div className="lg:col-span-5 bg-[#ffffff] rounded-4xl p-6 border border-[#e5e7eb] shadow-[8px_8px_0_#242424]">
            <h2 className="text-2xl font-['Bebas_Neue'] tracking-widest uppercase mb-6 flex items-center justify-between">
              Order Summary 
              <span className="bg-[#242424] text-white text-xs px-3 py-1.5 rounded-full font-['IBM_Plex_Sans_Thai'] tracking-normal">
                {orderList.length} รายการ
              </span>
            </h2>
            
            <div className="space-y-1 max-h-150 overflow-y-auto pr-2">
              {orderList.length === 0 ? (
                <div className="text-center py-20 text-[#242424]/50 font-bold">ตะกร้าของคุณยังว่างอยู่</div>
              ) : (
                orderList.map((order) => (
                  <div key={order.orderId}>
                    {(order.List || order.orderList || []).map((item) => (
                      <OrderItem 
                        key={item.id} 
                        item={item} 
                        orderId={order.orderId} 
                        onUpdateQty={handleUpdateQty} 
                        onRemove={handleRemove} 
                        onEdit={setCustomizingItem}
                        isSelected={customizingItem?.id === item.id}
                      />
                    ))}
                  </div>
                ))
              )}
            </div>

            <button 
              onClick={() => navigate("/menu")}
              className="mt-6 w-full py-4 border-2 border-dashed border-[#242424] text-[#242424] bg-[#eeeeee] rounded-4xl font-bold flex items-center justify-center gap-2 hover:bg-[#242424] hover:text-white transition-all duration-300 shadow-[4px_4px_0_#e5e7eb]"
            >
              <PlusCircle size={20} /> เพิ่มเมนูอื่นต่อ
            </button>
          </div>

          {/* ── RIGHT PANEL: Totals ── */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#ffffff] rounded-4xl p-8 border border-[#e5e7eb] shadow-[8px_8px_0_#242424]">
              <h2 className="text-center font-['Bebas_Neue'] tracking-widest text-[#242424] uppercase text-2xl mb-8 border-b-2 border-[#eeeeee] pb-4">
                Payment Details
              </h2>
              
              <div className="space-y-4 text-base font-bold text-[#242424]">
                <div className="flex justify-between">
                  <span className="text-[#242424]/70">ราคารวม</span>
                  <span>{subTotal.toLocaleString()} THB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#242424]/70">ภาษี (7%)</span>
                  <span>{tax.toLocaleString()} THB</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#242424]/70">ค่าจัดส่ง</span>
                  <span className="text-[#DC5F00] font-black bg-[#DC5F00]/10 px-3 py-1 rounded-xl border border-[#DC5F00]">FREE</span>
                </div>
                
                <div className="pt-6 mt-6 border-t-2 border-[#242424] flex justify-between items-end">
                  <span className="font-black text-xl">สุทธิ</span>
                  <div className="text-right">
                    <span className="block text-xs text-[#242424] font-['Bebas_Neue'] tracking-widest uppercase">Total Amount</span>
                    <span className="text-4xl font-black text-[#e4002b] leading-none font-['Bebas_Neue'] tracking-wider">
                      {netTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* The "Street" Button - Primary CTA */}
              <button 
                onClick={() => navigate("/booking", { state: { subTotal, tax, netTotal, orderData: orderList } })}
                className="w-full mt-8 py-5 bg-[#e4002b] text-white rounded-4xl font-['Bebas_Neue'] tracking-widest text-2xl uppercase border-2 border-[#242424] shadow-[8px_8px_0_#242424] hover:translate-y-1 hover:shadow-[4px_4px_0_#242424] transition-all duration-300 ease-in-out relative overflow-hidden group"
              >
                <span className="relative z-10">Order Now</span>
                {/* Hover effect - Overlay วิ่งจากซ้ายไปขวา */}
                <div className="absolute inset-0 bg-[#DC5F00] translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0"></div>
              </button>
              
              <p className="text-[10px] text-center text-[#242424]/60 mt-6 tracking-widest uppercase font-bold">
                Serious Fried Chicken - 100% Quality Guaranteed
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Black Bottom Bar ปิดท้ายหน้าเว็บ */}
      <div className="fixed bottom-0 left-0 w-full h-3 bg-[#1a1a1a] z-50"></div>
    </div>
  );
};

export default OrderPage;