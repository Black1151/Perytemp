import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * PUT /api/basket/voucher/remove
 * - Removes the voucher
 */
export async function PUT(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  const backendUrl = `${process.env.BE_URL}/basket`;
  
  try {
    const response = await fetch(backendUrl, {
      method: "PUT",
      body: JSON.stringify({discountCode: null}),
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    });

    const data = await response.json();
    console.log(data)

    if (!response.ok) {
      console.error("[BASKET PUT VOUCHER] Backend error:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Failed to update basket." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[BASKET PUT VOUCHER] Exception caught:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while updating basket." },
      { status: 500 }
    );
  }
} 