import { useCallback, useEffect, useState } from "react";
import { X, Calendar, Boxes, Skull, Edit2, Trash2, Save } from "lucide-react";
import { api } from "../utils/api";

const StockLotModal = ({ isOpen, onClose, ingredient }) => {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState("active"); // 'active' or 'history'
  const [expiringId, setExpiringId] = useState("");
  const [editingId, setEditId] = useState("");
  const [editDraft, setEditDraft] = useState({});

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "-");

  const fetchLots = useCallback(async () => {
    if (!ingredient) return;

    setLoading(true);
    setError("");
    try {
      const data = await api.get(`/ingredients/${ingredient._id}/batches`);
      setLots(data);
    } catch (err) {
      setError(err.message || "Unable to load lots.");
    } finally {
      setLoading(false);
    }
  }, [ingredient]);

  useEffect(() => {
    if (isOpen && ingredient) {
      fetchLots();
    }
  }, [isOpen, ingredient, fetchLots]);

  const handleExpireLot = async (lotId) => {
    if (!window.confirm("Mark this lot as expired? It will move to waste.")) return;
    setExpiringId(lotId);
    try {
      await api.put(`/ingredients/${ingredient._id}/lots/${lotId}/expire`);
      await fetchLots();
    } catch (err) { alert(err.message); }
    finally { setExpiringId(""); }
  };

  const handleDeleteLot = async (lotId) => {
    if (!window.confirm("DELETE this lot entirely? This will remove it from stock and history.")) return;
    try {
      await api.delete(`/ingredients/${ingredient._id}/lots/${lotId}`);
      await fetchLots();
    } catch (err) { alert(err.message); }
  };

  const startEdit = (lot) => {
    setEditId(lot._id);
    setEditDraft({
      remainingQuantity: lot.remainingQuantity,
      expiryDate: lot.expiryDate ? new Date(lot.expiryDate).toISOString().split('T')[0] : "",
      reason: lot.reason
    });
  };

  const saveEdit = async (lotId) => {
    try {
      await api.put(`/ingredients/${ingredient._id}/lots/${lotId}`, editDraft);
      setEditId("");
      await fetchLots();
    } catch (err) { alert(err.message); }
  };

  if (!isOpen) return null;

  const activeLots = lots
    .filter(l => l.type === 'IN' && l.remainingQuantity > 0)
    .sort((a, b) => {
      const aExpiry = a.expiryDate ? new Date(a.expiryDate).getTime() : Number.MAX_SAFE_INTEGER;
      const bExpiry = b.expiryDate ? new Date(b.expiryDate).getTime() : Number.MAX_SAFE_INTEGER;
      if (aExpiry !== bExpiry) return aExpiry - bExpiry;
      return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
    });
  
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border-4 border-[#242424] bg-white shadow-[12px_12px_0_#242424]">
        {/* Header */}
        <div className="bg-[#242424] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#e4002b] p-2 rounded-lg"><Boxes size={20} /></div>
            <div>
              <h2 className="text-xl font-black tracking-tight leading-none uppercase">Lot Management</h2>
              <p className="text-xs font-bold text-gray-400 mt-1">{ingredient.name} Control</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 cursor-pointer bg-[#e4002b] rounded-full flex items-center justify-center border-2 border-white hover:scale-110 transition-transform">
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b-4 border-[#242424] bg-slate-100">
          <button onClick={() => setView("active")} className={`flex-1 cursor-pointer py-3 text-sm font-black ${view === 'active' ? 'bg-white text-[#e4002b]' : 'text-slate-500'}`}>
            ACTIVE LOTS ({activeLots.length})
          </button>
          <button onClick={() => setView("history")} className={`flex-1 cursor-pointer py-3 text-sm font-black ${view === 'history' ? 'bg-white text-[#e4002b]' : 'text-slate-500'}`}>
            FULL TRANSACTION LOG
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 bg-white p-4">
          {loading ? (
            <div className="py-12 text-center font-black text-slate-400 animate-pulse">LOADING...</div>
          ) : error ? (
            <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
              {error}
            </div>
          ) : view === 'active' ? (
            <div className="flex max-h-[56vh] min-h-[260px] flex-col overflow-y-auto pr-2">
              <div className="sticky top-0 z-10 mb-3 flex items-center justify-between border-b border-slate-200 bg-white pb-2">
                <div className="text-xs font-black uppercase text-slate-500">Available Lots</div>
                <div className="text-xs font-black text-slate-900">{activeLots.length} lot(s)</div>
              </div>
              <div className="space-y-3">
                {activeLots.map((lot) => {
                const isExp = lot.expiryDate && new Date(lot.expiryDate) <= new Date();
                const isEditing = editingId === lot._id;
                return (
                  <div key={lot._id} className={`p-4 rounded-2xl border-4 ${isExp ? 'border-red-100 bg-red-50' : 'border-slate-100 bg-slate-50'} transition-all`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <div className="space-y-2">
                             <div className="flex gap-2">
                               <input 
                                 type="number" 
                                 value={editDraft.remainingQuantity} 
                                 onChange={e => setEditDraft({...editDraft, remainingQuantity: Number(e.target.value)})}
                                 className="w-24 border-2 border-[#e4002b] rounded-lg px-2 py-1 font-black"
                               />
                               <input 
                                 type="date" 
                                 value={editDraft.expiryDate} 
                                 onChange={e => setEditDraft({...editDraft, expiryDate: e.target.value})}
                                 required
                                 className="border-2 border-[#e4002b] rounded-lg px-2 py-1 font-black"
                               />
                             </div>
                             <input 
                               value={editDraft.reason} 
                               onChange={e => setEditDraft({...editDraft, reason: e.target.value})}
                               className="w-full border-2 border-slate-200 rounded-lg px-2 py-1 text-xs"
                               placeholder="Edit note..."
                             />
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-black text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">LOT ID: {lot._id.slice(-6).toUpperCase()}</span>
                              {isExp && <span className="text-[10px] font-black text-white bg-red-600 px-1.5 py-0.5 rounded">EXPIRED</span>}
                            </div>
                            <div className="text-sm font-black text-slate-900 mb-1">{lot.reason || "Stock received"}</div>
                            <div className={`flex items-center gap-1 text-[10px] font-bold ${isExp ? 'text-red-600' : 'text-[#e4002b]'}`}>
                              <Calendar size={12} /> EXP: {formatDate(lot.expiryDate)}
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="text-right shrink-0">
                        {!isEditing && (
                          <div className="text-2xl font-black text-slate-900 leading-none">
                            {lot.remainingQuantity} <span className="text-xs text-slate-400 uppercase">{ingredient.unit}</span>
                          </div>
                        )}
                        <div className="flex gap-1 mt-2 justify-end">
                          {isEditing ? (
                            <button onClick={() => saveEdit(lot._id)} className="cursor-pointer p-2 bg-green-600 text-white rounded-xl shadow-[2px_2px_0_#242424]"><Save size={14}/></button>
                          ) : (
                            <>
                              <button onClick={() => startEdit(lot)} className="cursor-pointer p-2 bg-slate-900 text-white rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.3)] hover:scale-105"><Edit2 size={14}/></button>
                              <button
                                onClick={() => handleExpireLot(lot._id)}
                                disabled={expiringId === lot._id}
                                className="cursor-pointer p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-600 hover:text-white disabled:cursor-wait disabled:opacity-60"
                              >
                                <Skull size={14}/>
                              </button>
                              <button onClick={() => handleDeleteLot(lot._id)} className="cursor-pointer p-2 bg-white text-slate-300 rounded-xl hover:text-red-600 border border-slate-200"><Trash2 size={14}/></button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
                })}
              </div>
            </div>
          ) : (
            <div className="max-h-[56vh] min-h-[260px] space-y-2 overflow-y-auto pr-2">
              {lots.map((log) => (
                <div key={log._id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 text-[11px] font-bold">
                  <div className={`px-2 py-0.5 rounded text-white ${log.type==='IN'?'bg-green-500':log.type==='OUT'?'bg-blue-500':'bg-red-500'}`}>{log.type}</div>
                  <div className="flex-1 text-slate-900">{log.reason || "-"}</div>
                  <div className={log.quantity > 0 ? 'text-green-600' : 'text-red-600'}>{log.quantity > 0 ? '+':''}{log.quantity}</div>
                  <div className="text-slate-400">EXP {formatDate(log.expiryDate)}</div>
                  <div className="text-slate-400">{formatDate(log.createdAt)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t-4 border-[#242424] bg-slate-50 flex justify-between items-center">
          <div className="text-xs font-black uppercase text-slate-500">Lot-Based Control Enabled</div>
          <button onClick={onClose} className="cursor-pointer px-8 py-2 bg-[#242424] text-white rounded-xl font-black shadow-[4px_4px_0_#e4002b]">FINISH</button>
        </div>
      </div>
    </div>
  );
};

export default StockLotModal;
