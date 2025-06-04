import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uuid = searchParams.get("uuid");

    if (!uuid) {
      return NextResponse.json(
        { error: "Missing required parameter: uuid" },
        { status: 400 }
      );
    }

    const response = await apiClient(`/dashboards/bigUp/user/${uuid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    const errorMessage =
      error.message || "An error occurred while fetching BigUp dashboard data.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
