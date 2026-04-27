/**
 * Capitalizes the first letter of a name.
 * Example: айман -> Айман
 */
export function formatName(name: string): string {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

/**
 * Formats a date to DD/MM/YYYY.
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

/**
 * Formats money with spaces.
 * Example: 143400 -> 143 400 ₸
 */
export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + " ₸";
}
