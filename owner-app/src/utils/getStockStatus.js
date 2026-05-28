export function getStockStatus(quantity, reorderPoint, expiryDate) {
  if (quantity <= 0) return 'Empty';

  if (expiryDate) {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const threeDaysFromNow = new Date(now);
    threeDaysFromNow.setDate(now.getDate() + 3);

    if (expiry <= threeDaysFromNow) {
      return 'Exp Soon';
    }
  }

  if (quantity <= reorderPoint) {
    return 'Low Stock';
  }

  return 'Good';
}
