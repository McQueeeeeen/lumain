export interface PriceableItem {
  price: number;
  quantity: number;
  discountPercent?: number;
}

export interface PricingResult {
  baseTotal: number;
  discountTotal: number;
  finalTotal: number;
}

/**
 * Calculates the total price for a set of items, including individual discounts.
 */
export function calculateProjectTotal(items: PriceableItem[], globalDiscountPercent: number = 0): PricingResult {
  let baseTotal = 0;
  let finalTotal = 0;

  items.forEach((item) => {
    const itemBase = item.price * item.quantity;
    const itemDiscount = item.discountPercent ? (itemBase * item.discountPercent) / 100 : 0;
    
    baseTotal += itemBase;
    finalTotal += (itemBase - itemDiscount);
  });

  // Apply global discount if any
  if (globalDiscountPercent > 0) {
    finalTotal = finalTotal * (1 - globalDiscountPercent / 100);
  }

  return {
    baseTotal,
    discountTotal: baseTotal - finalTotal,
    finalTotal,
  };
}

/**
 * Formats a number as a currency string (₸).
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + " ₸";
}
