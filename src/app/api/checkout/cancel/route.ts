import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  const backendUrl = `${process.env.BE_URL}/payment/subscription`;

  try {
    const body = await req.json();
    const response = await fetch(`${backendUrl}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[CANCEL] Backend error:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Failed to create basket." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[CANCEL] Exception caught:", error);
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
