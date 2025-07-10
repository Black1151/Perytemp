// completely replace the existing file
import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

/**
 * Proxies the request to the Hospitality Hub BE and keeps the shape
 * expected by the React layer:  `{ resource: … }`
 *
 * Accepted query params coming from the browser:
 *   - startDate              yyyy‑mm‑dd
 *   - endDate                yyyy‑mm‑dd
 *   - itemId   (optional)    number   – userHospitalityItemId
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const startDate = searchParams.get("startDate") ?? "";
    const endDate = searchParams.get("endDate") ?? "";
    const itemId = searchParams.get("itemId") ?? "";
    const userId = searchParams.get("userId") ?? "";

    /* ── build upstream query string ───────────────────────── */
    const qs = new URLSearchParams({
      ...(startDate && { bookingStartDate: startDate }),
      ...(endDate && { bookingEndDate: endDate }),
      ...(itemId && { userHospitalityItemId: itemId }),
      ...(userId && { bookerUserId: userId }),
    }).toString();

    const upstreamUrl = `/userHospitalityBooking/allBy?${qs}`;
    const upstreamRes = await apiClient(upstreamUrl, { method: "GET" });
    const json = await upstreamRes.json();

    return NextResponse.json(json, { status: upstreamRes.status });
  } catch (err: any) {
    console.error("[hospitality‑hub] proxy error", err);
    return NextResponse.json(
      { error: err?.message ?? "Unable to fetch hospitality bookings." },
      { status: 500 }
    );
  }
}

/**
 * Proxies POST requests to the Hospitality Hub BE for user hospitality bookings.
 * Passes through the request body and returns the backend's response.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const upstreamUrl = `/userHospitalityBooking`;
    const upstreamRes = await apiClient(upstreamUrl, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await upstreamRes.json();
    return NextResponse.json(json, { status: upstreamRes.status });
  } catch (err: any) {
    console.error("[hospitality‑hub] proxy error", err);
    return NextResponse.json(
      { error: err?.message ?? "Unable to create hospitality booking." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[PUT] Incoming body:', body);
    const upstreamUrl = `/userHospitalityBooking/${body.id}`;
    console.log('[PUT] Upstream URL:', upstreamUrl);
    // If isConfirmed is present, set confirmationDate to now
    if (typeof body.isConfirmed !== 'undefined') {
      body.confirmationDate = new Date().toISOString();
    }
    const upstreamRes = await apiClient(upstreamUrl, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log('[PUT] Upstream response status:', upstreamRes.status);
    const json = await upstreamRes.json();
    console.log('[PUT] Backend response JSON:', json);
    return NextResponse.json(json, { status: upstreamRes.status });
  } catch (err: any) {
    console.error("[hospitality‑hub] proxy error", err);
    return NextResponse.json(
      { error: err?.message ?? "Unable to create hospitality booking." },
      { status: 500 }
    );
  }
}

