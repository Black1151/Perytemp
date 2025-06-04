export interface BigUpType {
  id: number;
  name: string;
}

export interface BigUpStats {
  bigUpGivenPoints: number;
  bigUpReceivedPoints: number;
  bigUpTotal: number;
  bigUpRanking: number;
  userName: string;
  userLocation: string;
  userImage: string;
  userUniqueId: string;
}

export interface BigUpLeaderboardEntry {
  userId: number;
  userName: string;
  userUniqueId: string;
  userImageUrl: string;
  officeName: string;
  departmentName: string;
  bigUpReceived: number;
  bigUpGiven: number;
  bigUpTotal: number;
  bigUpRanking: number;
}

export interface BigUpWallEntry {
  userNameTo: string;
  userImageUrlTo: string;
  userIdUrlTo: number;
  userUniqueIdUrlTo: string;
  userNameFrom: string;
  userImageUrlFrom: string;
  userIdUrlFrom: string;
  userUniqueIdUrlFrom: string;
  createdAt: string;
  bigUpMessage: string;
  bigUpCategory: string;
  bigUpDescription: string;
}

export interface BigUpData {
  users: BigUpTeamMember[];
  bigUpTypes: BigUpType[];
  totalBigUp: number;
  averageBigUpMonthly: number;
  totalCurrentMonthBigUp: number;
  yourBigUpStats: BigUpStats;
  bigUpLeaderboard: BigUpLeaderboardEntry[];
  bigUpWall: BigUpWallEntry[];
  bigUpToMe: BigUpWallEntry[];
  bigUpFromMe: BigUpWallEntry[];
}

export interface BigUpTeamMember {
  id: number;
  imageUrl: string;
  fullName: string;
}

export interface BigUpCategory {
  id: number;
  name: string;
}
