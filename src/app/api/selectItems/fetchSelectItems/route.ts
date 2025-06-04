import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { type } = await req.json();

  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  try {
    const response = await apiClient(`/selectItem/allBy`, {
      method: "POST",
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type }),
    });

    const data = await response.json();

    if (!response.ok || response.status !== 200) {
      const errorMessage = data?.error || "Failed to fetch select items.";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error during fetch request:", error);
    const errorMessage = error.message || "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
