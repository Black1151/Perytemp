import {
  ApiResponseItem,
  DataPoint,
} from "@/app/api/(tools)/happiness-score/dashboards/company-happiness/types";
import { getAllWeekKeysBetween } from "../weekUtils";

import { computeWeeklyStats } from "./helpers/computeWeeklyStats";
import { fetchAndMergeNonParticipants } from "./helpers/fetchAndMergeNonParticipants";
import { buildSpeechBubbleData } from "./helpers/buildSpeechBubbleData";
import { groupByWeeks } from "./helpers/groupByWeeks";
import { findEarliestDate } from "./helpers/findEarliestDate";

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

export async function processResponseData(
  apiResponseItems: ApiResponseItem[],
  workflowId: number,
  businessProcessId: number,
  toolConfigId: number,
  preFilter: string | undefined,
  managerOfDeptIds: string[],
  managerOfTeamIds: string[]
) {
  const earliestDate = findEarliestDate(apiResponseItems);
  const currentDate = new Date();

  const weekGroups = groupByWeeks(apiResponseItems);

  const allWeekData = getAllWeekKeysBetween(earliestDate, currentDate);

  const dataPointsArray: DataPoint[] = [];
  const weeksData: any[] = [];

  for (const { weekKey, startDate, endDate } of allWeekData) {
    const entries = weekGroups.get(weekKey) || [];

    const {
      avgScore,
      masonryCounts,
      peopleList,
      departmentScores,
      siteScores,
    } = computeWeeklyStats(entries);

    await fetchAndMergeNonParticipants(
      {
        workflowId,
        businessProcessId,
        toolConfigId,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        preFilter,
        managerOfDeptIds,
        managerOfTeamIds,
      },
      peopleList,
      masonryCounts
    );

    const departmentsData = Array.from(departmentScores.entries()).map(
      ([deptName, { deptId, totalScore, count }]) => ({
        department: deptName,
        averageScore: totalScore / count,
        count,
        deptId: deptId,
      })
    );

    const sitesData = Array.from(siteScores.values()).map((s) => ({
      site: s.mostRecentSiteName,
      averageScore: s.totalScore / s.count,
      count: s.count,
      siteId: s.siteId,
    }));

    dataPointsArray.push({ title: weekKey, value: avgScore });
    weeksData.push({
      weekKey,
      avgScore,
      masonryCounts,
      peopleList,
      departmentsData,
      sitesData,
    });
  }

  const speechBubbleData = buildSpeechBubbleData(dataPointsArray);

  return {
    lineGraphData: dataPointsArray,
    speechBubbleData,
    weeksData,
  };
}
