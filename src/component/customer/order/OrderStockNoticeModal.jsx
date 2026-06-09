import React from "react";
import { AlertTriangle, PackageX, X } from "lucide-react";

const formatQuantity = (value) =>
  Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

const OrderStockNoticeModal = ({ notice, onClose, onAddMore }) => {
  if (!notice) return null;

  const hasConflicts = Array.isArray(notice.conflicts) && notice.conflicts.length > 0;
  const hasOrderedItems = Array.isArray(notice.orderedItems) && notice.orderedItems.length > 0;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-4">
      <div className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border-4 border-[#242424] bg-white font-['IBM_Plex_Sans_Thai'] shadow-[8px_8px_0_#e4002b]">
        <div className="flex items-start justify-between gap-4 bg-[#242424] px-4 py-4 text-white sm:px-6">
          <div className="flex min-w-0 gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e4002b]">
              <PackageX size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#ffb4b4]">
                Order Notice
              </p>
              <h2 className="font-['Bebas_Neue'] text-3xl leading-none tracking-widest">
                {notice.title || "Order Cannot Continue"}
              </h2>
              <p className="mt-1 text-sm font-bold text-white/80">{notice.message}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#e4002b] text-white transition-transform hover:scale-105"
            aria-label="Close notice"
          >
            <X size={22} strokeWidth={3} />
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto bg-[#eeeeee] p-4 sm:p-6">
          {hasOrderedItems && (
            <section className="mb-4 rounded-2xl border-2 border-[#242424] bg-white p-4 shadow-[4px_4px_0_#242424]">
              <div className="mb-3 flex items-center gap-2 text-[#242424]">
                <AlertTriangle size={18} className="text-[#e4002b]" />
                <h3 className="text-sm font-black uppercase tracking-widest">Order List</h3>
              </div>
              <div className="space-y-2">
                {notice.orderedItems.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-black"
                  >
                    <span className="min-w-0 truncate pr-3">{item.name}</span>
                    <span className="shrink-0 text-[#e4002b]">x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {hasConflicts ? (
            <section className="space-y-3">
              {notice.conflicts.map((conflict) => (
                <div
                  key={conflict.id || conflict.name}
                  className="rounded-2xl border-2 border-red-600 bg-white p-4 shadow-[4px_4px_0_#991b1b]"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-red-600">
                        Limiting Stock
                      </p>
                      <h3 className="text-xl font-black text-[#242424]">{conflict.name}</h3>
                    </div>
                    <div className="rounded-xl bg-red-50 px-3 py-2 text-right text-xs font-black text-red-700">
                      <p>
                        Available: {formatQuantity(conflict.availableQuantity)} {conflict.unit}
                      </p>
                      <p>
                        Needed: {formatQuantity(conflict.requiredQuantity)} {conflict.unit}
                      </p>
                    </div>
                  </div>

                  {conflict.possibleItemCount !== null && conflict.possibleItemCount !== undefined && (
                    <div className="mt-3 rounded-xl border-2 border-[#242424] bg-[#FDE68A] px-3 py-2 text-sm font-black text-[#242424]">
                      This stock can make only {conflict.possibleItemCount} item
                      {conflict.possibleItemCount === 1 ? "" : "s"} from this cart.
                    </div>
                  )}

                  {Array.isArray(conflict.affectedItems) && conflict.affectedItems.length > 0 && (
                    <div className="mt-3 text-xs font-bold text-slate-600">
                      Affected:{" "}
                      {conflict.affectedItems
                        .map((item) => `${item.name} x${item.quantity}`)
                        .join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </section>
          ) : (
            <div className="rounded-2xl border-2 border-red-600 bg-red-50 p-4 text-sm font-black text-red-700">
              Please remove the sold-out item or choose another menu item.
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t-4 border-[#242424] bg-white p-4 sm:flex-row sm:justify-end">
          {onAddMore && (
            <button
              type="button"
              onClick={onAddMore}
              className="cursor-pointer rounded-2xl border-2 border-[#242424] bg-white px-5 py-3 text-sm font-black uppercase text-[#242424] transition-colors hover:bg-[#242424] hover:text-white"
            >
              Add More
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-2xl border-2 border-[#242424] bg-[#e4002b] px-5 py-3 text-sm font-black uppercase text-white shadow-[4px_4px_0_#242424] transition-transform hover:translate-y-0.5 hover:shadow-[2px_2px_0_#242424]"
          >
            Review Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderStockNoticeModal;
