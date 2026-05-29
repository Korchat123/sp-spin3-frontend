import React, { createContext, useContext, useReducer } from 'react'

const initialRow = () => ({
  id: Math.random().toString(36).substr(2, 9),
  itemName: '',
  reason: 'Expired',
  quantity: '',
  unit: 'kg',
  estimatedCost: '',
});

const WasteFormContext = createContext(null);

function wasteFormReducer(state, action) {
  switch (action.type) {
    case 'ADD_ROW':
      return { rows: [...state.rows, initialRow()] };
    case 'REMOVE_ROW':
      return { rows: state.rows.filter(r => r.id !== action.id) };
    case 'UPDATE_ROW':
      return {
        rows: state.rows.map(r => r.id === action.id ? { ...r, ...action.updates } : r)
      };
    case 'CLEAR_FORM':
      return { rows: [initialRow()] };
    default:
      return state;
  }
}

export function WasteFormProvider({ children }) {
  const [state, dispatch] = useReducer(wasteFormReducer, { rows: [initialRow()] });

  return (
    <WasteFormContext.Provider value={{ state, dispatch }}>
      {children}
    </WasteFormContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useWasteForm = () => {
  const context = useContext(WasteFormContext);
  if (!context) throw new Error('useWasteForm must be used within a WasteFormProvider');
  return context;
};
