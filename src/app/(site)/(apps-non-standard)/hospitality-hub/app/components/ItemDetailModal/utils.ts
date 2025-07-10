import { HospitalityItem } from "@/types/hospitalityHub";

export function getCtaText(item: HospitalityItem | null | undefined): string {
  if (!item) return "";
  switch (item.itemType) {
    case "info":
      return "";
    case "singleDayBookable":
      return "Book Now";
    case "singleDayBookableWithStartEnd":
      return "Book Slot";
    case "multiDayBookable":
      return "Book Now";
    default:
      return "";
  }
} 