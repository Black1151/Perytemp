import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";

export async function PUT(req: NextRequest) {
  const cookieStore = cookies();
  const uniqueId = cookieStore.get("user_uuid")?.value;

  if (!uniqueId) {
    return NextResponse.json(
      { error: "User UUID not found in cookies." },
      { status: 400 },
    );
  }

  const requestData = await req.json();

  try {
    const response = await apiClient(`/user/${uniqueId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();

    if (!response.ok || response.status !== 200) {
      const errorMessage = data?.error || "Failed to update user data.";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    return NextResponse.json({ userData: data });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
