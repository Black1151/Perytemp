/* src/app/api/hospitality-hub/getHospitalityHubAnalyticsData/route.ts */
import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import {
  HospitalityAnalyticsData,
  AnalyticsItem,
  UserEngagementSummary,
  SiteEngagementStats,
  WeeklyEngagementTrend,
} from "@/app/(site)/(apps-non-standard)/hospitality-hub/admin/components/analyticsDashboard/types";

import { parseISO, parse } from "date-fns";

interface RawEngagement {
  id: number;
  hospitalityItemId: number;
  userId: number;
  siteId: number;
  engagementType: "offerOpened" | "offerTaken";
  createdAt: string; // ISO‑8601 timestamp
  updatedAt: string;
  itemName?: string;
  categoryName?: string;
  siteName?: string;
}

/** Return `yyyy-MM-dd` (UTC) for the Monday that starts the ISO week of `dateStr`.
 *  Accepts ISO‑8601 plus the common European formats `dd/MM/yyyy`, `dd-MM-yyyy`,
 *  and `dd-MM-yyyy HH:mm`.
 */
const weekStartOf = (dateStr: string): string => {
  let d = parseISO(dateStr);
  if (isNaN(d.getTime())) d = parse(dateStr, "dd/MM/yyyy", new Date());
  if (isNaN(d.getTime())) d = parse(dateStr, "dd-MM-yyyy", new Date());
  if (isNaN(d.getTime())) d = parse(dateStr, "dd-MM-yyyy HH:mm", new Date());

  if (isNaN(d.getTime())) {
    throw new Error(`Cannot parse date "${dateStr}" from engagement API`);
  }

  const dow = d.getUTCDay() || 7; // Sunday => 7 (ISO treats Monday as 1)
  d.setUTCDate(d.getUTCDate() - (dow - 1)); // back to Monday
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString().substring(0, 10);
};

export async function GET(request: NextRequest) {
  /*───────────────────────────────
   * Build the query‑string safely
   *──────────────────────────────*/
  const url = new URL(request.url);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  const qsParams = new URLSearchParams();
  if (startDate) qsParams.append("startDate", startDate);
  if (endDate) qsParams.append("endDate", endDate);
  const qs = qsParams.toString();
  const path = `/userHospitalityEngagement/allBy${qs ? `?${qs}` : ""}`;

  /*───────────────────────────────
   * Upstream fetch
   *──────────────────────────────*/
  const res = await apiClient(path, { method: "GET" });

  if (!res.ok) {
    const body = await res.text().catch(() => "(non‑text body)");
    console.error("Upstream engagement API failed", res.status, body);
    return NextResponse.json(
      { error: "Failed to load engagement data", details: body },
      { status: res.status }
    );
  }

  /*───────────────────────────────
   * Robust JSON parse
   *──────────────────────────────*/
  let raw: unknown;
  try {
    raw = await res.json();
  } catch (err) {
    console.error("Invalid JSON from engagement API", err);
    return NextResponse.json(
      { error: "Malformed JSON from engagement API" },
      { status: 502 }
    );
  }

  const resource: RawEngagement[] = Array.isArray(raw)
    ? raw
    : // slap‑dash API variants
      ((raw as any).resource ?? (raw as any).data ?? (raw as any).items ?? []);

  if (!Array.isArray(resource)) {
    console.error("Unexpected payload shape", raw);
    return NextResponse.json(
      { error: "Unexpected engagement payload shape" },
      { status: 502 }
    );
  }

  /*───────────────────────────────
   * Early exit for empty payload
   *──────────────────────────────*/
  if (resource.length === 0) {
    const empty: HospitalityAnalyticsData = {
      tableItems: [],
      userEngagement: { highCount: 0, midCount: 0, lowCount: 0, nonCount: 0 },
      siteStats: [],
      weeklyTrends: [],
    };
    return NextResponse.json(empty, { status: 200 });
  }

  /*───────────────────────────────
   * Item‑level aggregation
   *──────────────────────────────*/
  const itemMap = new Map<number, AnalyticsItem>();
  resource.forEach((ev) => {
    const cur = itemMap.get(ev.hospitalityItemId) ?? {
      itemId: ev.hospitalityItemId,
      itemName: ev.itemName ?? "Unknown Item",
      categoryName: ev.categoryName ?? "Uncategorised",
      offersOpened: 0,
      offersTaken: 0,
    };
    if (ev.engagementType === "offerOpened") cur.offersOpened += 1;
    if (ev.engagementType === "offerTaken") cur.offersTaken += 1;
    itemMap.set(ev.hospitalityItemId, cur);
  });

  const tableItems = Array.from(itemMap.values()).sort(
    (a, b) => b.offersOpened - a.offersOpened
  );

  /*───────────────────────────────
   * User‑engagement tiers
   *──────────────────────────────*/
  const userOpenCounts = new Map<number, number>();
  resource.forEach((ev) => {
    if (ev.engagementType === "offerOpened") {
      userOpenCounts.set(ev.userId, (userOpenCounts.get(ev.userId) ?? 0) + 1);
    }
  });

  let highCount = 0,
    midCount = 0,
    lowCount = 0;

  userOpenCounts.forEach((opens) => {
    if (opens >= 15) highCount += 1;
    else if (opens >= 8) midCount += 1;
    else lowCount += 1;
  });

  const allUserIds = new Set(resource.map((ev) => ev.userId));
  const nonCount = allUserIds.size - highCount - midCount - lowCount;

  const userEngagement: UserEngagementSummary = {
    highCount,
    midCount,
    lowCount,
    nonCount,
  };

  /*───────────────────────────────
   * Site‑level aggregation
   *──────────────────────────────*/
  const siteMap = new Map<number, SiteEngagementStats>();
  resource.forEach((ev) => {
    console.log("ev", ev);
    const cur = siteMap.get(ev.siteId) ?? {
      siteId: ev.siteId,
      siteName: ev.siteName ?? `Site #${ev.siteId}`,
      offersOpened: 0,
      offersTaken: 0,
    };
    if (ev.engagementType === "offerOpened") cur.offersOpened += 1;
    if (ev.engagementType === "offerTaken") cur.offersTaken += 1;
    siteMap.set(ev.siteId, cur);
  });

  const siteStats = Array.from(siteMap.values()).sort(
    (a, b) => b.offersOpened - a.offersOpened
  );

  /*───────────────────────────────
   * Weekly trends
   *──────────────────────────────*/
  const weekMap = new Map<string, WeeklyEngagementTrend>();
  resource.forEach((ev) => {
    let monday: string;
    try {
      // FIX: use ev.createdAt, not ev.date
      monday = weekStartOf(ev.createdAt);
    } catch (err) {
      console.error("Skipping record with bad date:", ev.createdAt);
      return; // skip this one line
    }
    const cur = weekMap.get(monday) ?? {
      weekStart: monday,
      offersOpened: 0,
      offersTaken: 0,
    };
    if (ev.engagementType === "offerOpened") cur.offersOpened += 1;
    if (ev.engagementType === "offerTaken") cur.offersTaken += 1;
    weekMap.set(monday, cur);
  });

  const weeklyTrends = Array.from(weekMap.values()).sort((a, b) =>
    a.weekStart < b.weekStart ? -1 : 1
  );

  /*───────────────────────────────
   * Final payload
   *──────────────────────────────*/
  const payload: HospitalityAnalyticsData = {
    tableItems,
    userEngagement,
    siteStats,
    weeklyTrends,
  };
  return NextResponse.json(payload, { status: 200 });
}
