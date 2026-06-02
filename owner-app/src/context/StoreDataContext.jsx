import React, { createContext, useContext } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useMenu } from '../hooks/useMenu';
import { useStock } from '../hooks/useStock';
import { useStaff } from '../hooks/useStaff';
import { useCustomers } from '../hooks/useCustomers';
import { useTables } from '../hooks/useTables';
import { usePromotions } from '../hooks/usePromotions';
import { useWaste } from '../hooks/useWaste';
import { useDashboard } from '../hooks/useDashboard';

// eslint-disable-next-line react-refresh/only-export-components
export const StoreDataContext = createContext();

export const StoreDataProvider = ({ children }) => {
  const orders = useOrders();
  const menu = useMenu();
  const stock = useStock();
  const staff = useStaff();
  const customers = useCustomers();
  const tables = useTables();
  const promotions = usePromotions();
  const waste = useWaste();
  const dashboard = useDashboard();

  const value = {
    orders,
    menu,
    stock,
    staff,
    customers,
    tables,
    promotions,
    waste,
    dashboard
  };

  return (
    <StoreDataContext.Provider value={value}>
      {children}
    </StoreDataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStoreData = () => {
  const context = useContext(StoreDataContext);
  if (!context) {
    throw new Error('useStoreData must be used within a StoreDataProvider');
  }
  return context;
};
