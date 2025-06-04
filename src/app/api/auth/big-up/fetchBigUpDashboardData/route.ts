import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function POST(req: NextRequest) {
  try {
    const { uuid, workflowId, businessProcessId, userId, userUniqueId } =
      await req.json();

    const response = await apiClient(`/dashboards/bigUp/all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uuid,
        workflowId,
        businessProcessId,
        userId,
        userUniqueId,
      }),
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    const errorMessage =
      error.message || "An error occurred while fetching BigUp dashboard data.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
