import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function GET(req: NextRequest) {
  try {
    const response = await apiClient(
      "/getAllView?view=vwUserGroupsPlatformList",
    );

    const data = await response.json();
    const resource = data.resource;
    return NextResponse.json({ resource });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
