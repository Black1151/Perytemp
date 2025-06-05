import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.toString();
  const endpoint = `/hospitality-hub/medical${query ? `?${query}` : ""}`;

  try {
    const response = await apiClient(endpoint, { method: "GET" });

    const data = await response.json();

    if (!response.ok || response.status !== 200) {
      const errorMessage = data?.error || "Failed to fetch medical records.";
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
    const medical = await req.json();
    const response = await apiClient(`/hospitality-hub/medical`, {
      method: "POST",
      body: JSON.stringify(medical),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || "Failed to create medical record." },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.message || "An error occurred while creating medical record.",
      },
      { status: 500 },
    );
  }
}
