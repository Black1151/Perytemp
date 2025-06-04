import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function POST(req: NextRequest) {
  try {
    const { customerUuid } = await req.json();

    const response = await apiClient("/GetThemesForCustomer", {
      method: "POST",
      body: JSON.stringify({
        customerUuid: customerUuid,
      }),
    });

    const data = await response.json();

    return NextResponse.json({ success: true, resource: data.resource });
  } catch (error) {
    console.error("Error fetching themes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
