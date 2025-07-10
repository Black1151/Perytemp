import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * PUT /api/basket/voucher
 * - Updates the current basket with a voucher
 */
export async function PUT(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  let value;
  try {
    value = await req.json();
    // Ensure we're working with a clean string value
    if (typeof value === 'string') {
      // Remove any surrounding quotes
      value = value.replace(/^["']|["']$/g, '');
    } else {
      return NextResponse.json({ error: "Invalid voucher code format" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const backendUrl = `${process.env.BE_URL}/basket`;
  
  console.log(backendUrl)
  try {
    const response = await fetch(backendUrl, {
      method: "PUT",
      body: JSON.stringify({ discountCode: value }),
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