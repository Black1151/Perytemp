import { NextRequest, NextResponse } from "next/server";
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

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const workflowId = searchParams.get("workflowId") || 1;
  const businessProcessId = searchParams.get("businessProcessId") || 1;
  const toolConfigId = searchParams.get("toolConfigId") || 1;
  const customerId = searchParams.get("customerId");

  try {
    let endpoint = `/getAllView?view=vwHappinessScoreCurrentWeek&toolConfigId=${toolConfigId}&workflowId=${workflowId}&businessProcessId=${businessProcessId}&customerId=${customerId}`;
    const response = await apiClient(endpoint, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch final data");
    }

    const allData: ApiResponse = await response.json();
    return NextResponse.json({
      data: allData.resource,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "An error occurred." },
      { status: 500 },
    );
  }
}
