import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";


/**
 * GET /api/basket/subscription
 * - Fetches the current subscription
 */
export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  const backendUrl = `${process.env.BE_URL}/basket?statusId=3`;

  try {
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[BASKET GET] Backend error:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Failed to fetch basket." },
        { status: response.status }
      );
    }

    return NextResponse.json({ resource: data.resource });
  } catch (error: any) {
    console.error("[BASKET GET] Exception caught:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while fetching basket." },
      { status: 500 }
    );
  }
}