import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;
    const body = await req.json();
    const { hospitalityCatId, centreLatitude, centreLongitude, radiusM } = body;

    const payload = {
      hospitalityCatId,
      centreLatitude,
      centreLongitude,
      radiusM,
    };

    const baseUrl = process.env.BE_URL;
    if (!baseUrl) throw new Error("BE_URL environment variable is not set");
    const url = `${baseUrl}/dashboards/hhub/itemsNearby`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch items nearby", details: error instanceof Error ? error.message : error }, { status: 500 });
  }
} 