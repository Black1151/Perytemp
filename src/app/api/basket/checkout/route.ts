import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  console.log("[BASKET POST CHECKOUT] Incoming request to checkout basket");

  const backendUrl = `${process.env.BE_URL}/payment/create`;

  console.log("[BASKET POST CHECKOUT] Backend URL:", backendUrl);

  try {
    const body = await req.json();

    console.log("[BASKET POST CHECKOUT] Request body:", body);

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("[BASKET POST CHECKOUT] Backend response:", data);

    if (!response.ok) {
      console.error("[BASKET POST CHECKOUT] Backend error:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Failed to create basket." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[BASKET POST CHECKOUT] Exception caught:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while creating basket." },
      { status: 500 }
    );
  }
}