import React from 'react'
import { X, Plus, Trash2, Save } from 'lucide-react'
import { useWasteForm } from '../../providers/WasteFormProvider'
import { useWaste } from '../../hooks/useWaste'
import { formatTHB } from '../../utils/format'

export default function RecordWasteModal({ onClose }) {
  const { state, dispatch } = useWasteForm();
  const { recordWaste } = useWaste();

  const handleSave = () => {
    const entries = state.rows
      .filter(row => row.itemName && row.estimatedCost !== '')
      .map(row => ({
        itemName: row.itemName,
        reason: row.reason,
        quantity: Number(row.quantity) || 0,
        unit: row.unit,
        estimatedCost: Number(row.estimatedCost) || 0,
        recordedBy: 'Thanachot S.', // Mock user
        date: new Date().toISOString()
      }));

    if (entries.length === 0) {
      alert('Please fill in at least one item with a name and cost.');
      return;
    }

    recordWaste(entries, {
      onSuccess: () => {
        dispatch({ type: 'CLEAR_FORM' });
        onClose();
      }
    });
  };

  const totalCost = state.rows.reduce((sum, row) => sum + (Number(row.estimatedCost) || 0), 0);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1A2333]/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-brand-border-inner flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-[16px] font-bold text-brand-text-primary">Record New Waste</h2>
            <p className="text-[11px] text-brand-text-secondary">Log expired or damaged items to track operational loss</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-brand-sidebar rounded-lg text-brand-text-secondary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-bold text-brand-text-tertiary uppercase tracking-widest border-b border-brand-border-inner">
                <th className="pb-3 pr-4 w-1/3">Item Name</th>
                <th className="pb-3 px-4">Reason</th>
                <th className="pb-3 px-4 w-24">Qty</th>
                <th className="pb-3 px-4 w-32">Est. Cost</th>
                <th className="pb-3 pl-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {state.rows.map((row) => (
                <tr key={row.id} className="border-b border-brand-border-inner last:border-0 group">
                  <td className="py-3 pr-4">
                    <input 
                      type="text"
                      placeholder="e.g. Pork Belly"
                      value={row.itemName}
                      onChange={(e) => dispatch({ type: 'UPDATE_ROW', id: row.id, updates: { itemName: e.target.value } })}
                      className="w-full bg-brand-page border border-transparent focus:border-brand-border-active focus:bg-white rounded-lg px-3 py-2 text-[13px] outline-none transition-all"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <select 
                      value={row.reason}
                      onChange={(e) => dispatch({ type: 'UPDATE_ROW', id: row.id, updates: { reason: e.target.value } })}
                      className="w-full bg-brand-page border border-transparent focus:border-brand-border-active focus:bg-white rounded-lg px-2 py-2 text-[13px] outline-none transition-all cursor-pointer"
                    >
                      <option value="Expired">Expired</option>
                      <option value="Wrong Order">Wrong Order</option>
                      <option value="Accident/Spill">Accident/Spill</option>
                      <option value="Quality Control">Quality Control</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <div className="relative">
                      <input 
                        type="number"
                        value={row.quantity}
                        onChange={(e) => dispatch({ type: 'UPDATE_ROW', id: row.id, updates: { quantity: e.target.value === '' ? '' : Number(e.target.value) } })}
                        className="w-full bg-brand-page border border-transparent focus:border-brand-border-active focus:bg-white rounded-lg pl-3 pr-8 py-2 text-[13px] outline-none transition-all"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-brand-text-tertiary">kg</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px] text-brand-text-secondary">฿</span>
                      <input 
                        type="number"
                        placeholder="0.00"
                        value={row.estimatedCost}
                        onChange={(e) => dispatch({ type: 'UPDATE_ROW', id: row.id, updates: { estimatedCost: e.target.value === '' ? '' : Number(e.target.value) } })}
                        className="w-full bg-brand-page border border-transparent focus:border-brand-border-active focus:bg-white rounded-lg pl-6 pr-3 py-2 text-[13px] outline-none transition-all font-medium"
                      />
                    </div>
                  </td>
                  <td className="py-3 pl-4">
                    {state.rows.length > 1 && (
                      <button 
                        onClick={() => dispatch({ type: 'REMOVE_ROW', id: row.id })}
                        className="p-2 text-brand-text-tertiary hover:text-brand-danger transition-colors rounded-lg hover:bg-brand-danger-bg"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button 
            onClick={() => dispatch({ type: 'ADD_ROW' })}
            className="mt-4 flex items-center gap-2 text-[13px] font-bold text-brand-text-dark-neutral hover:text-brand-text-primary transition-colors px-2 py-1 rounded-lg hover:bg-brand-sidebar"
          >
            <Plus size={16} /> Add another item
          </button>
        </div>

        <div className="px-6 py-5 border-t border-brand-border-inner bg-brand-subheader flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-text-tertiary uppercase tracking-widest font-bold">Total Estimated Loss</span>
            <span className="text-[18px] font-bold text-brand-danger">{formatTHB(totalCost)}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-brand-border-outer bg-white text-brand-text-secondary text-[14px] font-bold hover:bg-brand-hover-row transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-brand-text-dark text-white text-[14px] font-bold shadow-lg hover:bg-brand-text-dark/90 flex items-center gap-2 transition-all active:scale-95"
            >
              <Save size={18} />
              Confirm Recording
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
