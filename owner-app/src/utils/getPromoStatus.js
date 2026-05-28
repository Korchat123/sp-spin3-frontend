export function getPromoStatus(startDate, endDate) {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Set times to midnight for date-only comparison
  now.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (now > end) {
    return 'Expired';
  }

  if (now < start) {
    return 'Scheduled';
  }

  const sevenDaysFromNow = new Date(now);
  sevenDaysFromNow.setDate(now.getDate() + 7);

  if (end <= sevenDaysFromNow) {
    return 'ExpSoon';
  }

  return 'Active';
}
