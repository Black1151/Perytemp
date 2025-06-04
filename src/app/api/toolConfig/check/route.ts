import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function POST(req: NextRequest) {
  try {
    const { toolId } = await req.json();

    const response = await apiClient(`/toolConfig/${toolId}/check`, {
      method: "GET",
    });

    const responseData = await response.json();

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("Error:", error);

    // Handling JSON parsing errors or other unexpected issues
    return NextResponse.json(
      { error: error.message || "An error occurred during the save process." },
      { status: 500 },
    );
  }
}
