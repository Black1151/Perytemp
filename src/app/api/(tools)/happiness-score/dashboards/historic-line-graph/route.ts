import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

interface RawEntry {
  createdAt: string;
  score: number;
}

interface DataPoint {
  value: number;
  title: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = searchParams.toString();

    const response = await apiClient(
      `/getAllView?view=vwDashboardDataFromReportJson&toolConfigId=1&workflowId=1&businessProcessId=1&${queryParams}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    const jsonResponse = await response.json();

    if (!jsonResponse.resource || !Array.isArray(jsonResponse.resource)) {
      throw new Error(
        "Response JSON did not contain a valid 'resource' array."
      );
    }

    const rawData: RawEntry[] = jsonResponse.resource.map((item: any) => {
      let parsedScore = 0;
      try {
        const parsedJson = JSON.parse(item.jsonBpRespFull);
        parsedScore = Number(parsedJson.happinessScore) || 0;
      } catch (err) {
        console.warn("Could not parse jsonBpRespFull:", item.jsonBpRespFull);
      }
      return {
        createdAt: item.createdAt,
        score: parsedScore,
      };
    });

    const currentWeekStart = getStartOfWeek(new Date());
    const dataPoints: DataPoint[] = [];

    for (let i = 0; i < 8; i++) {
      const weekStart = new Date(currentWeekStart);
      weekStart.setDate(weekStart.getDate() - i * 7);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const weeklyEntries = rawData.filter((entry) => {
        const entryDate = new Date(entry.createdAt);
        return entryDate >= weekStart && entryDate < weekEnd;
      });

      let averageScore = 0;
      if (weeklyEntries.length > 0) {
        const totalScore = weeklyEntries.reduce(
          (sum, curr) => sum + curr.score,
          0
        );
        averageScore = totalScore / weeklyEntries.length;
      }

      const year = weekStart.getFullYear();
      const weekNumber = Math.ceil(
        ((weekStart.getTime() - new Date(year, 0, 1).getTime()) / 86400000 +
          1) /
          7
      );
      const weekLabel = `${year}-W${weekNumber.toString().padStart(2, "0")}`;

      dataPoints.push({
        value: averageScore,
        title: weekLabel,
      });
    }

    dataPoints.reverse();

    return NextResponse.json(
      { success: true, data: dataPoints },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching department history:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
