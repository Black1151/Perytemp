import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const { toolId, workflowId, businessProcessId } = await req.json();
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  const userUniqueId = cookieStore.get("user_uuid")?.value;

  try {
    const response = await apiClient("/happinessScoreUsersTwoMonthHistory", {
      method: "POST",
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        toolId,
        workflowId,
        businessProcessId,
        userUniqueId,
      }),
    });
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching happiness scores:", error);
    throw error;
  }
}
