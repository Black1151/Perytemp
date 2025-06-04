import { ValueFormatterParams } from "ag-grid-community";

// Date formatter function for DD/MM/YYYY format
export const dateFormatter = (params: ValueFormatterParams): string => {
  if (!params.value) return ""; // Handle empty values
  const date = new Date(params.value);

  // Format to DD/MM/YYYY
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Date comparator function for agDateColumnFilter
export const dateComparator = (
  filterLocalDateAtMidnight: Date,
  cellValue: string | null,
): number => {
  if (!cellValue) return -1;

  // Parse the cell value to remove the time component
  const cellDate = new Date(cellValue.split("T")[0]);

  // Compare the dates
  if (cellDate.getTime() === filterLocalDateAtMidnight.getTime()) {
    return 0; // Dates are equal
  }
  return cellDate.getTime() < filterLocalDateAtMidnight.getTime() ? -1 : 1;
};
