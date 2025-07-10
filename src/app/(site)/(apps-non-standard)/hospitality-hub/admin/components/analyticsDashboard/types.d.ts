export type AnalyticsItem = {
  itemId: number;
  itemName: string;
  categoryName: string;
  offersOpened: number;
  offersTaken: number;
};

export type UserEngagementSummary = {
  highCount: number; // 15+ opens
  midCount: number; // 8‑14 opens
  lowCount: number; // 1‑7  opens
  nonCount: number; // 0    opens (if known)
};

export type SiteEngagementStats = {
  siteId: number;
  siteName: string;
  offersOpened: number;
  offersTaken: number;
};

export type WeeklyEngagementTrend = {
  weekStart: string; // yyyy‑mm‑dd (Monday)
  offersOpened: number;
  offersTaken: number;
};

export type HospitalityAnalyticsData = {
  tableItems: AnalyticsItem[];
  userEngagement: UserEngagementSummary;
  siteStats: SiteEngagementStats[];
  weeklyTrends: WeeklyEngagementTrend[];
};
