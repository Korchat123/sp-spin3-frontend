export const TAX_RATE = 0.07;
export const SERVICE_CHARGE = 0.10;
export const VIP_POINT_THRESHOLD = 1000;

export const ROLE_PERMISSIONS = {
  owner: { pages: ['*'], actions: ['*'] },
  manager: { pages: ['dashboard', 'tables', 'orders', 'menu', 'stock', 'waste', 'promotions', 'customers'], actions: ['*'] },
  cashier: { pages: ['dashboard', 'tables', 'orders'], actions: ['view', 'create_order', 'accept_order'] },
  server: { pages: ['dashboard', 'tables', 'orders'], actions: ['view', 'create_order'] },
  kitchen: { pages: ['dashboard', 'orders', 'stock'], actions: ['view', 'update_order_status'] },
};
