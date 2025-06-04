import { useState } from "react";
import { BigUpStats } from "../types";

export default function useBigUpUserStats() {
  const [userStats, setUserStats] = useState<BigUpStats>({
    userUniqueId: "",
    bigUpGivenPoints: 0,
    bigUpReceivedPoints: 0,
    bigUpTotal: 0,
    bigUpRanking: 0,
    userName: "",
    userLocation: "",
    userImage: ""
  });

  const fetchUserStats = async (uuid: string) => {
    try {
      const response = await fetch(
        `/api/auth/big-up/fetchBigUpUserData?uuid=${uuid}`
      );
      const data = await response.json();
      setUserStats(data.resource);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  return { userStats, fetchUserStats };
}
