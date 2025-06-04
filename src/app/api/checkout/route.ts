import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  console.log(
    "[BASKET POST FINAL CHECKOUT] Incoming request to checkout basket - post payment"
  );

  const backendUrl = `${process.env.BE_URL}/basket/checkout/`;

  console.log("[BASKET POST FINAL CHECKOUT] Backend URL:", backendUrl);

  try {
    const body = await req.json();

    console.log("[BASKET POST FINAL CHECKOUT] Request body:", body);

    const response = await fetch(`${backendUrl}${body.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    });

    const data = await response.json();
    console.log("[BASKET POST FINAL CHECKOUT] Backend response:", data);

    if (!response.ok) {
      console.error("[BASKET POST FINAL CHECKOUT] Backend error:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Failed to create basket." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[BASKET POST FINAL CHECKOUT] Exception caught:", error);
    return NextResponse.json(
      {
        error:
          error.message ||
          "An error occurred while checking out basket post payment.",
      },
      { status: 500 }
    );
  }
}
