/**
 * Get current date in Europe/Berlin timezone
 */
export function getCurrentDateBerlin(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Berlin" }));
}

/**
 * Check if a recurring item is upcoming this month
 * @param dayOfMonth The day of the month (1-31)
 * @param today Current date
 * @returns true if the item is still upcoming this month
 */
export function isUpcomingThisMonth(dayOfMonth: number, today: Date): boolean {
  const currentDay = today.getDate();
  return dayOfMonth >= currentDay;
}

/**
 * Get the current month and year
 */
export function getCurrentMonthYear(today: Date = getCurrentDateBerlin()) {
  return {
    month: today.getMonth() + 1, // 1-12
    year: today.getFullYear()
  };
}