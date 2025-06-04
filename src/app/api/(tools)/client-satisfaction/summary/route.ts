import {NextRequest, NextResponse} from "next/server";
import apiClient from "@/lib/apiClient";
import { 
    clientSatisfactionDashboardResponse,
    kpiData,
    npsScore,
    staffRating,
    staffComment,
    serviceRating,
    serviceComment,
    npsData,
    companyComment, 
} from "@/app/(site)/(apps)/client-satisfaction/dashboard/primary/types";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const response = await apiClient(
            '/dashboards/clientSatisfaction/getSummary',
            {
                method: 'POST',
                body: JSON.stringify(body),
            })

        if (!response.ok) {
            throw new Error("Failed to fetch client satisfaction summary data");
        }

        const allData: clientSatisfactionDashboardResponse = await response.json();

        return NextResponse.json({
            ...allData,
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            {error: error.message || "An error occurred."},
            {status: 500},
        );
    }
}
