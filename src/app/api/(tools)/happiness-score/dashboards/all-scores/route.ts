import {NextRequest, NextResponse} from "next/server";
import apiClient from "@/lib/apiClient";

interface ApiResponse {
    resource: ApiResponseItem[];
}

interface ApiResponseItem {
    role: string;
    userId: number;
    fullName: string;
    userImageUrl: string;
    userIsActive: boolean;
    userUniqueId: string;
    customerId: number;
    customerIsActive: boolean;
    siteName: string;
    siteId: number;
    teamName: string;
    teamId: number;
    deptName: string;
    deptId: number;
    happinessScore: number;
    comments: string;
    createdAt: string;
    createdBy: number;
    toolConfigId: number;
    workflowId: number;
    businessProcessId: number;
    workflowInstanceId: number;
    businessProcessInstanceId: number;
}

export async function POST(req: NextRequest) {

    try {
        const body = await req.json();

        const response = await apiClient(
            '/dashboards/happiness/getScoresCommentsDashboard',
            {
                method: 'POST',
                body: JSON.stringify(body),
            })

        if (!response.ok) {
            throw new Error("Failed to fetch happiness score data");
        }

        const allData: ApiResponse = await response.json();

        return NextResponse.json({
            data: allData.resource,
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            {error: error.message || "An error occurred."},
            {status: 500},
        );
    }
}
