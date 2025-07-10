import { NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0];

    const qs = new URLSearchParams({
      startDate: today,
    }).toString();

    const upstreamUrl = `/userHospitalityBooking/allBy?${qs}`;
    const upstreamRes = await apiClient(upstreamUrl, { method: "GET" });
    const json = await upstreamRes.json();

    return NextResponse.json(json, { status: upstreamRes.status });
  } catch (err: any) {
    console.error("[hospitality‑hub] proxy error", err);
    return NextResponse.json(
      {
        error: err?.message ?? "Unable to fetch upcoming hospitality bookings.",
      },
      { status: 500 }
    );
  }
}
