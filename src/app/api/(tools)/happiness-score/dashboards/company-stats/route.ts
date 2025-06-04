import { NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";

interface UserApiResponse {
  resource: UserApiResponseItem[];
}

interface UserApiResponseItem {
  userId: number;
  fullName: string;
  deptName: string;
  teamName: string | null;
  siteName: string;
  avgHappinessScore: string;
  stddevHappinessScore: string;
  minHappinessScore: number;
  maxHappinessScore: number;
  totalEntries: number;
  lastMonthHappinessScore: string;
  currentRagStatus: string;
  scoreDistribution: ScoreDistribution[];
  companyScores: Scores[];
}

interface CompanyApiResponse {
  resource: CompanyApiResponseItem;
}

interface ScoreDistribution {
  count: number;
  score: number;
}

interface Scores {
  score: number;
  countOfScore: number;
  dayOfSubmission: string;
}

interface CompanyApiResponseItem {
  avgHappinessScore: string;
  stddevHappinessScore: string;
  minHappinessScore: number;
  maxHappinessScore: number;
  totalEntries: number;
  lastMonthHappinessScore: string;
  currentRagStatus: string;
  scoreDistribution: ScoreDistribution[];
  companyScores: Scores[];
}

export async function POST(request: Request) {
  const cookieStore = cookies();
  const apiToken = cookieStore.get("auth_token")?.value;

  const body = await request.json();

  const { toolId, workflowId, customerId } = body;

  if (!toolId || !workflowId || !customerId) {
    return NextResponse.json(
      { error: "Missing required fields: toolId, workflowId, or customerId." },
      { status: 400 },
    );
  }

  try {
    // Make the POST request to the external API
    const [userResponse, companyResponse] = await Promise.all([
      apiClient("/getHappinessScoreRag", {
        method: "POST",
        body: JSON.stringify({
          toolId: toolId,
          workflowId: workflowId,
          customerId: customerId,
        }),
      }),
      apiClient("/getCompanyHappinessStats", {
        method: "POST",
        body: JSON.stringify({
          toolId: toolId,
          workflowId: workflowId,
          customerId: customerId,
        }),
      }),
    ]);

    // Check responses
    if (!userResponse.ok) {
      throw new Error("Failed to fetch happiness score RAG data");
    }
    if (!companyResponse.ok) {
      throw new Error("Failed to fetch company happiness stats");
    }

    const userApiResponse: UserApiResponse = await userResponse.json();
    const companyApiResponse: CompanyApiResponse = await companyResponse.json();

    return NextResponse.json({
      userResource: userApiResponse.resource,
      companyResource: companyApiResponse.resource,
    });
  } catch (error) {
    console.error("Error fetching happiness score RAG data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from the API." },
      { status: 500 },
    );
  }
}
