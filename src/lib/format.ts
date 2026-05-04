/**
 * Formats a number with commas for pricing display.
 * Example: 50000 -> 50,000
 */
export function formatPrice(price: number | string): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(num)) return "0";
  return num.toLocaleString("en-NG");
}
