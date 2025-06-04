export const dateValueFormatter = (
  value: string | number | Date,
  format: string = "DD MMM YYYY",
): string => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    // Return a fallback value for invalid dates
    return "Invalid Date";
  }

  const formatMap: { [key: string]: string } = {
    DD: ("0" + date.getDate()).slice(-2), // Day with leading zero
    D: date.getDate().toString(), // Day without leading zero
    MMMM: date.toLocaleString("default", { month: "long" }), // Full month name
    MMM: date.toLocaleString("default", { month: "short" }), // Short month name
    MM: ("0" + (date.getMonth() + 1)).slice(-2), // Month with leading zero
    M: (date.getMonth() + 1).toString(), // Month without leading zero
    YYYY: date.getFullYear().toString(), // Full year
    YY: date.getFullYear().toString().slice(-2), // Last two digits of year
  };

  return format.replace(
    /DD|D|MMMM|MMM|MM|M|YYYY|YY/g,
    (match) => formatMap[match],
  );
};
