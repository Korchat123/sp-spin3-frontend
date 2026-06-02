import React from "react";
import { ShieldCheck, Info } from "lucide-react";
import SlipUpload from "./SlipUpload";

const CheckoutPanel = ({
  paymentMethod,
  setPaymentMethod,
  creditCard,
  setCreditCard,
  uploadedSlip,
  uploadedSlipFile,
  handleSlipChange,
  handleSlipDrop,
  onClearSlip,
  handleOrderSubmit,
  cartItemsCount,
  netTotal,
  isReserveBelowMinimum,
  eatType,
  tableState
}) => {
  return (
    <div className="bg-[#242424] text-white rounded-4xl p-6 border-4 border-[#242424] shadow-[8px_8px_0_#DC5F00] space-y-6">
      <h2 className="text-2xl font-['Bebas_Neue'] tracking-widest uppercase border-b-2 border-white/10 pb-2 text-[#FDE68A]">
        Secure Checkout
      </h2>

      <div>
        <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest block mb-2">Select Method</label>
        <div className="grid grid-cols-3 gap-1 bg-black/40 p-1.5 rounded-2xl border border-white/10">
          <button
            disabled
            type="button"
            className="py-2 rounded-xl text-xs font-black text-gray-500 bg-gray-800/20 cursor-not-allowed opacity-50 relative group"
            title="Credit Card coming soon"
          >
            Card (Soon 🔒)
          </button>
          <button
            onClick={() => setPaymentMethod("promptpay")}
            className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer
              ${paymentMethod === "promptpay" ? "bg-[#DC5F00] text-white shadow-md" : "text-gray-400 hover:text-white"}`}
          >
            QR Prompt
          </button>
          <button
            onClick={() => setPaymentMethod("cash")}
            className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer
              ${paymentMethod === "cash" ? "bg-[#DC5F00] text-white shadow-md" : "text-gray-400 hover:text-white"}`}
          >
            Cash
          </button>
        </div>
      </div>

      <div className="border-t border-dashed border-white/10 pt-4">
        {!paymentMethod && (
          <p className="text-center text-xs text-gray-400 py-6 uppercase font-bold tracking-wider">
            Please select a payment method above
          </p>
        )}

        {paymentMethod === "credit" && (
          <div className="space-y-4">
            <div className="bg-[#E9662A] rounded-2xl p-4 text-white shadow-md border border-white/20 select-none">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-7 bg-white/30 rounded-lg"></div>
                <span className="font-['Bebas_Neue'] text-lg italic tracking-wider">VISA</span>
              </div>
              <div className="text-lg font-mono tracking-widest text-center py-2">
                {creditCard.number ? creditCard.number.replace(/\d{4}(?=.)/g, '$& ') : "**** **** **** ****"}
              </div>
              <div className="flex justify-between text-[10px] opacity-80 mt-2 font-mono">
                <div>
                  <p>CARDHOLDER</p>
                  <p className="font-bold text-xs uppercase">{creditCard.name || "YOUR NAME"}</p>
                </div>
                <div className="text-right">
                  <p>EXPIRES</p>
                  <p className="font-bold text-xs">{creditCard.expiry || "MM/YY"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs font-bold">
              <input
                type="text"
                placeholder="Card Number"
                maxLength={16}
                value={creditCard.number}
                onChange={(e) => setCreditCard({ ...creditCard, number: e.target.value.replace(/\D/g, "") })}
                className="w-full bg-black/35 border border-white/20 rounded-xl p-2.5 focus:outline-none focus:border-[#DC5F00] text-white"
              />
              <input
                type="text"
                placeholder="Holder Name"
                value={creditCard.name}
                onChange={(e) => setCreditCard({ ...creditCard, name: e.target.value })}
                className="w-full bg-black/35 border border-white/20 rounded-xl p-2.5 focus:outline-none focus:border-[#DC5F00] text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={creditCard.expiry}
                  onChange={(e) => setCreditCard({ ...creditCard, expiry: e.target.value })}
                  className="w-full bg-black/35 border border-white/20 rounded-xl p-2.5 focus:outline-none focus:border-[#DC5F00] text-white"
                />
                <input
                  type="password"
                  placeholder="CVV"
                  maxLength={3}
                  value={creditCard.cvv}
                  onChange={(e) => setCreditCard({ ...creditCard, cvv: e.target.value.replace(/\D/g, "") })}
                  className="w-full bg-black/35 border border-white/20 rounded-xl p-2.5 focus:outline-none focus:border-[#DC5F00] text-white"
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === "promptpay" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-3xl border-2 border-black flex flex-col items-center justify-center">
              <div className="w-32 h-6 bg-[#002f5f] rounded-lg mb-3 flex items-center justify-center text-white text-[10px] font-black tracking-widest font-mono select-none">
                Prompt Pay
              </div>
              <div className="w-32 h-32 bg-gray-100 border-2 border-[#242424] flex items-center justify-center p-2 relative">
                <div className="w-full h-full bg-[#111] grid grid-cols-5 grid-rows-5 gap-1.5 opacity-90 p-1 rounded-sm">
                  {Array.from({ length: 25 }).map((_, index) => (
                    <div
                      key={index}
                      className={`rounded-xs ${[2, 3, 4, 5, 10, 15, 16, 17, 19, 20].includes(index) ? 'bg-[#111]' : 'bg-white'}`}
                    />
                  ))}
                </div>
                <div className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-[#e4002b] rounded-full border-2 border-white flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-black">✓</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 font-extrabold uppercase mt-2 tracking-wide text-center">
                Total Amount: <span className="text-[#e4002b] font-mono">฿{netTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </p>
            </div>

            <SlipUpload
              uploadedSlip={uploadedSlip}
              uploadedSlipFile={uploadedSlipFile}
              handleSlipChange={handleSlipChange}
              handleSlipDrop={handleSlipDrop}
              onClearSlip={onClearSlip}
            />
          </div>
        )}

        {paymentMethod === "cash" && (
          <div className="bg-black/35 rounded-2xl p-4 border border-white/10 text-center space-y-2">
            <ShieldCheck size={28} className="text-green-500 mx-auto animate-pulse" />
            <h4 className="text-xs font-black uppercase text-white tracking-widest">PAY AT COUNTER</h4>
            <p className="text-[10px] text-gray-400 leading-normal">
              Confirm order now and settle payment directly with our cashier when picking up or upon food arrival.
            </p>
          </div>
        )}
      </div>

      <button
        onClick={handleOrderSubmit}
        disabled={!paymentMethod || isReserveBelowMinimum || cartItemsCount === 0 || (eatType === "reserve" && tableState !== "free")}
        className={`w-full py-4.5 rounded-3xl font-['Bebas_Neue'] tracking-widest text-2xl uppercase border-2 border-black transition-all duration-300 relative overflow-hidden group select-none cursor-pointer
          ${(!paymentMethod || isReserveBelowMinimum || cartItemsCount === 0 || (eatType === "reserve" && tableState !== "free"))
            ? "bg-gray-500 text-gray-400 cursor-not-allowed shadow-none"
            : "bg-[#e4002b] text-white shadow-[6px_6px_0_#000] hover:translate-y-1 hover:shadow-[2px_2px_0_#000]"}`}
      >
        <span className="relative z-10">
          {cartItemsCount === 0
            ? "CART EMPTY"
            : isReserveBelowMinimum
              ? "BELOW MINIMUM"
              : (eatType === "reserve" && tableState === "checking")
                ? "CHECKING AVAILABILITY..."
                : (eatType === "reserve" && tableState === "reserve")
                  ? "TABLE FULL"
                  : !paymentMethod
                    ? "SELECT PAYMENT"
                    : "ORDER NOW"}
        </span>
        {paymentMethod && !isReserveBelowMinimum && cartItemsCount > 0 && !(eatType === "reserve" && tableState !== "free") && (
          <div className="absolute inset-0 bg-[#DC5F00] translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0"></div>
        )}
      </button>

      {isReserveBelowMinimum && (
        <div className="bg-[#FDE68A] text-[#242424] rounded-2xl p-4 border-2 border-black flex gap-3 shadow-[4px_4px_0_#000] relative select-none">
          <Info size={20} className="shrink-0 text-[#e4002b] mt-0.5" />
          <div className="text-xs font-bold leading-normal">
            <p className="font-extrabold uppercase text-[#e4002b] text-[10px] tracking-wide mb-1">
              Minimum Order Required!
            </p>
            <p className="text-[11px]">
              ยอดรวมของท่านยังไม่ครบตามที่กำหนด กรุณาเลือกออเดอร์ให้ครบด้วยครับ/ค่ะ [Your order is below the required minimum. Please select additional items to continue.]
            </p>
          </div>
        </div>
      )}

      {eatType === "reserve" && tableState === "reserve" && (
        <div className="bg-[#fee2e2] text-[#991b1b] rounded-2xl p-4 border-2 border-black flex gap-3 shadow-[4px_4px_0_#000] relative select-none">
          <Info size={20} className="shrink-0 text-[#e4002b] mt-0.5" />
          <div className="text-xs font-bold leading-normal">
            <p className="font-extrabold uppercase text-[#e4002b] text-[10px] tracking-wide mb-1">
              Table Fully Booked!
            </p>
            <p className="text-[12px] font-['IBM_Plex_Sans_Thai'] whitespace-pre-line leading-relaxed font-bold">
              🙏 ขออภัย ขณะนี้โต๊ะถูกจองเต็มแล้ว{"\n"}กรุณาเลือกบริการรูปแบบอื่น หรือเลือกช่วงเวลาใหม่อีกครั้ง 🍗
            </p>
          </div>
        </div>
      )}

      <p className="text-[9px] text-center text-gray-400 font-extrabold tracking-widest uppercase mt-4">
        🔒 Secured with SSL 256-bit encryption verification
      </p>
    </div>
  );
};

export default CheckoutPanel;
