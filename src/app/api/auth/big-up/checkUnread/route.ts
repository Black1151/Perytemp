import { NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function GET() {
  try {
    const response = await apiClient(`/dashboards/bigUp/unread`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    const errorMessage =
      error.message || "An error occurred while fetching BigUp data.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
