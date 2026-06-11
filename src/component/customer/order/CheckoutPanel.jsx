import React from "react";
import { Info } from "lucide-react";

const CheckoutPanel = ({
  paymentMethod,
  setPaymentMethod,
  handleOrderSubmit,
  checkoutError,
  cartItemsCount,
  isReserveBelowMinimum,
  eatType,
  tableState,
  isProcessing = false,
}) => {
  const isCheckoutDisabled =
    isProcessing ||
    !paymentMethod ||
    isReserveBelowMinimum ||
    cartItemsCount === 0 ||
    (eatType === "reserve" && tableState !== "free");

  return (
    <div className="min-w-0 space-y-5 rounded-3xl border-4 border-[#242424] bg-white p-4 text-white shadow-[5px_5px_0_#DC5F00] sm:rounded-4xl sm:p-6 sm:shadow-[8px_8px_0_#DC5F00]">
      <h2 className="border-b-2 border-white/10 pb-2 font-['Bebas_Neue'] text-xl uppercase tracking-widest text-orange-600 sm:text-2xl">
        Secure Checkout
      </h2>

      <div>
        <label className="mb-2 block text-[15px] font-bold uppercase tracking-widest text-gray-800">
          Select Method
        </label>
        <div className="grid grid-cols-1 gap-1 rounded-2xl border border-white/10 bg-black/80 p-1.5 min-[380px]:grid-cols-3">
          <button
            disabled
            type="button"
            className="cursor-not-allowed rounded-xl bg-gray-800/20 py-2 text-xs font-black text-white opacity-50"
            title="Credit Card coming soon"
          >
            Card <br />
            (Soon)
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("promptpay")}
            className={`cursor-pointer rounded-xl py-2 text-xs font-black transition-all ${
              paymentMethod === "promptpay" ? "bg-[#DC5F00] text-white shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            QR Prompt
          </button>

          <button
            disabled
            type="button"
            className="cursor-not-allowed rounded-xl bg-gray-800/20 py-2 text-xs font-black opacity-50"
          >
            Cash <br />
            (Soon)
          </button>
        </div>
      </div>

      <div className="border-t border-dashed border-white/10 pt-4">
        {!paymentMethod ? (
          <p className="py-6 text-center text-xs font-bold uppercase tracking-wider text-gray-400">
            Please select a payment method above
          </p>
        ) : (
          <div className="rounded-2xl border-2 border-black bg-[#FDE68A] p-4 text-[#242424] shadow-[4px_4px_0_#000]">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#e4002b]">
              QR opens after order check
            </p>
            <p className="mt-1 text-xs font-bold leading-relaxed">
              Press Order Now first. If stock and table checks pass, the PromptPay QR and slip upload will open.
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleOrderSubmit}
        disabled={isCheckoutDisabled}
        className={`group relative w-full select-none overflow-hidden rounded-3xl border-2 border-black py-4 font-['Bebas_Neue'] text-xl uppercase tracking-widest transition-all duration-300 sm:text-2xl ${
          isCheckoutDisabled
            ? "cursor-not-allowed bg-black/80 text-gray-400 shadow-none"
            : "cursor-pointer bg-[#e4002b] text-white shadow-[6px_6px_0_#000] hover:translate-y-1 hover:shadow-[2px_2px_0_#000]"
        }`}
      >
        <span className="relative z-10">
          {isProcessing
            ? "PROCESSING..."
            : cartItemsCount === 0
              ? "CART EMPTY"
              : isReserveBelowMinimum
                ? "BELOW MINIMUM"
                : eatType === "reserve" && tableState === "checking"
                  ? "CHECKING AVAILABILITY..."
                  : eatType === "reserve" && tableState === "reserve"
                    ? "TABLE FULL"
                    : !paymentMethod
                      ? "SELECT PAYMENT"
                      : "ORDER NOW"}
        </span>
        {!isCheckoutDisabled && (
          <div className="absolute inset-0 z-0 translate-x-full bg-[#DC5F00] transition-transform duration-300 ease-in-out group-hover:translate-x-0" />
        )}
      </button>

      {checkoutError && (
        <div className="whitespace-pre-line rounded-2xl border-2 border-red-500 bg-red-50 p-3 text-xs font-black leading-relaxed text-red-700 shadow-[3px_3px_0_#991b1b]">
          {checkoutError}
        </div>
      )}

      {isReserveBelowMinimum && (
        <div className="relative flex gap-3 rounded-2xl border-2 border-black bg-[#FDE68A] p-4 text-[#242424] shadow-[4px_4px_0_#000]">
          <Info size={20} className="mt-0.5 shrink-0 text-[#e4002b]" />
          <div className="text-xs font-bold leading-normal">
            <p className="mb-1 text-[10px] font-extrabold uppercase tracking-wide text-[#e4002b]">
              Minimum Order Required
            </p>
            <p>Your order is below the required minimum. Please select additional items to continue.</p>
          </div>
        </div>
      )}

      {eatType === "reserve" && tableState === "reserve" && (
        <div className="relative flex gap-3 rounded-2xl border-2 border-black bg-[#fee2e2] p-4 text-[#991b1b] shadow-[4px_4px_0_#000]">
          <Info size={20} className="mt-0.5 shrink-0 text-[#e4002b]" />
          <div className="text-xs font-bold leading-normal">
            <p className="mb-1 text-[10px] font-extrabold uppercase tracking-wide text-[#e4002b]">
              Table Fully Booked
            </p>
            <p>Please choose another service type or select a new time slot.</p>
          </div>
        </div>
      )}

      <p className="mt-4 text-center text-[9px] font-extrabold uppercase tracking-widest text-gray-400">
        Secured with SSL 256-bit encryption verification
      </p>
    </div>
  );
};

export default CheckoutPanel;
