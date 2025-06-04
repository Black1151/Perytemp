export const currencyFormatter = (
  value: number | null | undefined,
  currencySymbol: string = "£",
): string => {
  // Check if the value is a valid number
  if (typeof value !== "number" || isNaN(value)) {
    return "£0.00";
  }

  // Format the value with the currency symbol and commas for thousands
  return `${currencySymbol}${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};
