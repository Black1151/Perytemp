// helpers/groupByWeeks.ts
import { ApiResponseItem } from "@/app/api/(tools)/happiness-score/dashboards/company-happiness/types";
import { getWeekNumber } from "../../weekUtils";

export interface WeekGroupEntry {
  score: number;
  item: ApiResponseItem;
}

/**
 * Group all items by their 'year-week' key.
 */
export function groupByWeeks(
  apiResponseItems: ApiResponseItem[]
): Map<string, WeekGroupEntry[]> {
  const weekGroups = new Map<string, WeekGroupEntry[]>();

  for (const item of apiResponseItems) {
    // parse happiness score
    const respFull = JSON.parse(item.jsonBpRespFull);
    const happinessScore = parseFloat(respFull.happinessScore);

    // get week key
    const createdAt = new Date(item.createdAt);
    const [year, weekNo] = getWeekNumber(createdAt);
    const weekKey = `${year}-W${weekNo}`;

    if (!weekGroups.has(weekKey)) {
      weekGroups.set(weekKey, []);
    }
    weekGroups.get(weekKey)?.push({ score: happinessScore, item });
  }

  return weekGroups;
}
