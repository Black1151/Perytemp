import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { hotels } from "../mockData/hotels";

export async function GET(req: NextRequest) {
  /*
  const query = req.nextUrl.searchParams.toString();
  const endpoint = `/hospitality-hub/hotels${query ? `?${query}` : ""}`;

  try {
    const response = await apiClient(endpoint, { method: "GET" });

    const data = await response.json();

    if (!response.ok || response.status !== 200) {
      const errorMessage = data?.error || "Failed to fetch hotels.";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    return NextResponse.json({ resource: data.resource });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }
  */

  // Until the backend is available return mock data for FE development
  return NextResponse.json({ resource: hotels });
}

export async function POST(req: NextRequest) {
  try {
    const hotels = await req.json();
    const response = await apiClient(`/hospitality-hub/hotels`, {
      method: "POST",
      body: JSON.stringify(hotels),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || "Failed to create hotels." },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred while creating hotels." },
      { status: 500 },
    );
  }
}
