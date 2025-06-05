import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.toString();
  const endpoint = `/hospitality-hub/events${query ? `?${query}` : ""}`;

  try {
    const response = await apiClient(endpoint, { method: "GET" });

    const data = await response.json();

    if (!response.ok || response.status !== 200) {
      const errorMessage = data?.error || "Failed to fetch events.";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    return NextResponse.json({ resource: data.resource });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const events = await req.json();
    const response = await apiClient(`/hospitality-hub/events`, {
      method: "POST",
      body: JSON.stringify(events),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || "Failed to create events." },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred while creating events." },
      { status: 500 },
    );
  }
}
