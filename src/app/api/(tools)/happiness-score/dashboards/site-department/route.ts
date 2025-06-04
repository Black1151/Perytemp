import {NextResponse} from "next/server";
import apiClient from "@/lib/apiClient";

interface ManagingPartnersResponse {
    resource: UserStatsResponse;
}

interface UserStatsResponse {
    totalAvg: number;
    gridData: any;
    weeklyLineChartComparisonData: any;
    monthlyLineChartComparisonData: any;
    officeLeaderboardData: any;
    departmentLeaderboardData: any;
}

/**
 * Transforms raw data of shape:
 * [ { week or monthEnd, siteScores: { siteName: number, ... } }, ...]
 * into an array of objects with top-level site fields, e.g.:
 * [
 *   { week: '2024-01-07', 'Site A': 7.11, 'Site B': 8.0 },
 *   { week: '2024-01-14', 'Site A': 7.48, 'Site B': 7.71 },
 * ]
 */
function flattenSiteScores(rawData: any[] | undefined, xKey: string): any[] {
    if (!Array.isArray(rawData)) return [];

    return rawData.map((item) => {
        const transformed: Record<string, any> = {
            [xKey]: item[xKey],
        };

        if (item.siteScores && typeof item.siteScores === "object") {
            for (const [siteName, score] of Object.entries(item.siteScores)) {
                transformed[siteName] = score;
            }
        }

        return transformed;
    });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const userResponse = await apiClient(
            "/dashboards/happiness/getSiteDepartmentDashboard",
            {
                method: "POST",
                body: JSON.stringify(body),
            },
        );

        if (!userResponse.ok) {
            throw new Error("Failed to fetch happiness score data");
        }

        const managingPartnersResponse: ManagingPartnersResponse =
            await userResponse.json();

        // Flatten weekly and monthly data
        const flattenedWeekly = flattenSiteScores(
            managingPartnersResponse.resource.weeklyLineChartComparisonData,
            "week",
        );
        const flattenedMonthly = flattenSiteScores(
            managingPartnersResponse.resource.monthlyLineChartComparisonData,
            "month",
        );

        // Overwrite original string fields with the new arrays
        const transformedResource = {
            ...managingPartnersResponse.resource,
            weeklyLineChartComparisonData: flattenedWeekly,
            monthlyLineChartComparisonData: flattenedMonthly,
        };

        // Return the final JSON
        return NextResponse.json({
            resource: transformedResource,
        });
    } catch (error) {
        console.error(
            "Error fetching happiness score Managing Partners data:",
            error,
        );
        return NextResponse.json(
            {error: "Failed to fetch data from the API."},
            {status: 500},
        );
    }
}
