import { NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");

    if (!customerId) {
      return NextResponse.json(
        { error: "`customerId` query parameter is required." },
        { status: 400 }
      );
    }

    const response = await apiClient(
      `/user/findTeamMemberAutoCompleteData/${customerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    const errorMessage =
      error.message ||
      "An error occurred while fetching user-team-member data.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
