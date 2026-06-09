import React from "react";
import { X } from "lucide-react";
import SlipUpload from "./SlipUpload";

const QrPaymentModal = ({
  isOpen,
  amount,
  uploadedSlip,
  uploadedSlipFile,
  handleSlipChange,
  handleSlipDrop,
  onClearSlip,
  onSubmit,
  onClose,
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-4">
      <div className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-md flex-col overflow-hidden rounded-3xl border-4 border-[#242424] bg-white font-['IBM_Plex_Sans_Thai'] shadow-[8px_8px_0_#e4002b]">
        <div className="flex items-start justify-between gap-4 bg-[#242424] px-5 py-4 text-white">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#ffb4b4]">PromptPay</p>
            <h2 className="font-['Bebas_Neue'] text-3xl leading-none tracking-widest">Scan To Pay</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#e4002b] text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close QR payment"
          >
            <X size={22} strokeWidth={3} />
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto bg-[#eeeeee] p-5">
          <div className="mb-4 rounded-3xl border-2 border-[#242424] bg-white p-4 text-center shadow-[4px_4px_0_#242424]">
            <div className="mx-auto mb-3 flex h-7 w-36 items-center justify-center rounded-lg bg-[#002f5f] text-[10px] font-black tracking-widest text-white">
              Prompt Pay
            </div>
            <div className="relative mx-auto flex h-44 w-44 items-center justify-center border-2 border-[#242424] bg-gray-100 p-3">
              <div className="grid h-full w-full grid-cols-5 grid-rows-5 gap-1.5 rounded-sm bg-[#111] p-1 opacity-90">
                {Array.from({ length: 25 }).map((_, index) => (
                  <div
                    key={index}
                    className={`rounded-xs ${[2, 3, 4, 5, 10, 15, 16, 17, 19, 20].includes(index) ? "bg-[#111]" : "bg-white"}`}
                  />
                ))}
              </div>
              <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#e4002b] text-lg font-black text-white shadow-md">
                ✓
              </div>
            </div>
            <p className="mt-3 text-[10px] font-extrabold uppercase tracking-wide text-gray-500">
              Total Amount:{" "}
              <span className="font-mono text-[#e4002b]">
                ฿{Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
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

        <div className="border-t-4 border-[#242424] bg-white p-4">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || !uploadedSlipFile}
            className="w-full rounded-2xl border-2 border-[#242424] bg-[#e4002b] px-5 py-3 text-sm font-black uppercase text-white shadow-[4px_4px_0_#242424] transition-transform hover:translate-y-0.5 hover:shadow-[2px_2px_0_#242424] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
          >
            {isSubmitting ? "Uploading Slip..." : "Submit Slip"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrPaymentModal;
