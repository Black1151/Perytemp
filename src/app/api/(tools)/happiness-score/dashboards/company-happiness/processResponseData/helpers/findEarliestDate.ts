// helpers/findEarliestDate.ts
import { ApiResponseItem } from "@/app/api/(tools)/happiness-score/dashboards/company-happiness/types";

export function findEarliestDate(apiResponseItems: ApiResponseItem[]): Date {
  if (apiResponseItems.length === 0) {
    return new Date(); // fallback
  }

  let earliest = new Date(apiResponseItems[0].createdAt);
  for (const item of apiResponseItems) {
    const createdAt = new Date(item.createdAt);
    if (createdAt < earliest) earliest = createdAt;
  }
  return earliest;
}
