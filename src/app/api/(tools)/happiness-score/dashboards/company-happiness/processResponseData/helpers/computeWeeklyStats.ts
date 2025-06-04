import {
  ApiResponseItem,
  Person,
} from "@/app/api/(tools)/happiness-score/dashboards/company-happiness/types";

export interface WeeklyStatsResult {
  avgScore: number;
  masonryCounts: number[];
  peopleList: Person[];
  departmentScores: Map<
    string,
    {
      deptId: number;
      totalScore: number;
      count: number;
    }
  >;
  siteScores: Map<
    number,
    {
      siteId: number;
      totalScore: number;
      count: number;
      mostRecentSiteName: string;
      mostRecentCreatedAt: Date;
    }
  >;
}

function classifyScore(score: number, masonryCounts: number[]) {
  if (score >= 9) masonryCounts[3]++;
  else if (score >= 6) masonryCounts[2]++;
  else if (score >= 3) masonryCounts[1]++;
  else if (score > 0) masonryCounts[0]++;
}

export function computeWeeklyStats(
  entries: { score: number; item: ApiResponseItem }[]
): WeeklyStatsResult {
  let avgScore = 0;
  const masonryCounts = [0, 0, 0, 0, 0];

  const peopleList: Person[] = [];
  const departmentScores = new Map<
    string,
    {
      deptId: number;
      totalScore: number;
      count: number;
    }
  >();
  const siteScores = new Map<
    number,
    {
      siteId: number;
      totalScore: number;
      count: number;
      mostRecentSiteName: string;
      mostRecentCreatedAt: Date;
    }
  >();

  if (entries.length > 0) {
    const totalScore = entries.reduce((sum, e) => sum + e.score, 0);
    avgScore = totalScore / entries.length;

    for (const { score, item } of entries) {
      classifyScore(score, masonryCounts);

      peopleList.push({
        userId: item.userId,
        imageUrl: item.userImageUrl,
        fullName: item.fullName,
        firstName: item.firstName,
        lastName: item.lastName,
        jobTitle: item.jobTitle,
        department: item.deptName,
        site: item.siteName,
        score,
      });

      const deptName = item.deptName;
      const deptId = item.deptId;
      if (deptName) {
        if (!departmentScores.has(deptName)) {
          departmentScores.set(deptName, {
            deptId: deptId,
            totalScore: 0,
            count: 0,
          });
        }
        const deptData = departmentScores.get(deptName)!;
        deptData.totalScore += score;
        deptData.count += 1;
      }

      const siteId = item.siteId;
      if (siteId !== undefined && siteId !== null) {
        if (!siteScores.has(siteId)) {
          siteScores.set(siteId, {
            siteId: siteId,
            totalScore: 0,
            count: 0,
            mostRecentSiteName: item.siteName,
            mostRecentCreatedAt: new Date(item.createdAt),
          });
        }
        const siteData = siteScores.get(siteId)!;
        siteData.totalScore += score;
        siteData.count += 1;

        const itemCreatedAt = new Date(item.createdAt);
        if (itemCreatedAt > siteData.mostRecentCreatedAt) {
          siteData.mostRecentCreatedAt = itemCreatedAt;
          siteData.mostRecentSiteName = item.siteName;
        }
      }
    }
  }

  return {
    avgScore,
    masonryCounts,
    peopleList,
    departmentScores,
    siteScores,
  };
}
