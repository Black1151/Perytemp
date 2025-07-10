export const toISODate = (d: Date): string => d.toISOString().slice(0, 10);
export const formatISODate = (value?: string) =>
  value ? value.slice(0, 10) : "";
