import { useState, useEffect } from "react";
import {
  BigUpCategory,
  BigUpLeaderboardEntry,
  BigUpStats,
  BigUpTeamMember,
  BigUpWallEntry,
} from "../types";

interface DashboardData {
  bigUpLeaderboard: BigUpLeaderboardEntry[];
  bigUpWall: BigUpWallEntry[];
  bigUpToMe: BigUpWallEntry[];
  bigUpFromMe: BigUpWallEntry[];
  totalBigUp: number;
  averageBigUpMonthly: number;
  totalCurrentMonthBigUp: number;
  yourBigUpStats: BigUpStats;
  teamMembers: BigUpTeamMember[];
  bigUpCategories: BigUpCategory[];
  bigUpUnread: BigUpWallEntry[];
}

const initialDashboardData: DashboardData = {
  bigUpLeaderboard: [],
  bigUpWall: [],
  bigUpToMe: [],
  bigUpFromMe: [],
  totalBigUp: 0,
  averageBigUpMonthly: 0,
  totalCurrentMonthBigUp: 0,
  yourBigUpStats: {
    bigUpGivenPoints: 0,
    bigUpReceivedPoints: 0,
    bigUpTotal: 0,
    bigUpRanking: 0,
    userName: "",
    userLocation: "",
    userImage: "",
    userUniqueId: "",
  },
  teamMembers: [],
  bigUpCategories: [],
  bigUpUnread: [],
};

export default function useBigUpDashboard() {
  const [dashboardData, setDashboardData] =
    useState<DashboardData>(initialDashboardData);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/auth/big-up/fetchBigUpDashboardData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowId: 1, businessProcessId: 1 }),
      });
      const result = await response.json();
      if (response.ok) {
        setDashboardData({
          bigUpLeaderboard: result.resource.bigUpLeaderboard || [],
          bigUpWall: result.resource.bigUpWall || [],
          bigUpToMe: result.resource.bigUpToMe || [],
          bigUpFromMe: result.resource.bigUpFromMe || [],
          totalBigUp: result.resource.totalBigUp || 0,
          averageBigUpMonthly: result.resource.averageBigUpMonthly || 0,
          totalCurrentMonthBigUp: result.resource.totalCurrentMonthBigUp || 0,
          yourBigUpStats:
            result.resource.yourBigUpStats ||
            initialDashboardData.yourBigUpStats,
          teamMembers: result.resource.users || [],
          bigUpCategories: result.resource.bigUpTypes || [],
          bigUpUnread: result.resource.bigUpUnread || [],
        });
      } else {
        console.error("Error from server response:", result);
      }
    } catch (error) {
      console.error("An error occurred while fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return { dashboardData, fetchDashboardData, loading };
}
