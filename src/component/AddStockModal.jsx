import React, { useState } from "react";
import { X, Plus, Calendar, MessageSquare, Save } from "lucide-react";
import { api } from "../utils/api";

const toTwoDecimalNumber = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.round(numeric * 100) / 100 : 0;
};

const AddStockModal = ({ isOpen, onClose, ingredient, onStockAdded }) => {
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !ingredient) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post(`/ingredients/${ingredient._id}/stock`, {
        quantity: toTwoDecimalNumber(quantity),
        expiryDate: expiryDate || null,
        reason: reason || "Manual lot add",
      });
      
      setQuantity("");
      setExpiryDate("");
      setReason("");
      onStockAdded();
      onClose();
    } catch (err) {
      setError(err.message || "Unable to add lot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-3xl border-4 border-[#242424] shadow-[12px_12px_0_#242424] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#242424] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#e4002b] p-2 rounded-lg">
              <Plus size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight leading-none uppercase">Receive Stock</h2>
              <p className="text-xs font-bold text-gray-400 mt-1">{ingredient.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 cursor-pointer bg-[#e4002b] rounded-full flex items-center justify-center border-2 border-white shadow-[4px_4px_0_rgba(0,0,0,0.3)] hover:scale-110 transition-transform"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 font-bold text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-1.5 ml-1">Quantity</label>
            <div className="relative">
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 text-lg font-black outline-none focus:border-[#e4002b] focus:bg-white transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-black uppercase text-xs">
                {ingredient.unit}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-1.5 ml-1">Expiry Date</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Calendar size={18} />
              </div>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold outline-none focus:border-[#e4002b] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-1.5 ml-1">Note (Optional)</label>
            <div className="relative">
              <div className="absolute left-4 top-4 text-slate-400">
                <MessageSquare size={18} />
              </div>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Supplier info, storage location, etc."
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold outline-none focus:border-[#e4002b] focus:bg-white transition-all min-h-[100px] resize-none"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer px-6 py-3 border-2 border-slate-200 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading || !quantity}
              className="flex-[2] cursor-pointer px-6 py-3 bg-[#e4002b] text-white rounded-2xl font-black shadow-[4px_4px_0_#242424] hover:translate-y-0.5 hover:shadow-[2px_2px_0_#242424] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {loading ? "SAVING..." : "SAVE LOT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStockModal;
