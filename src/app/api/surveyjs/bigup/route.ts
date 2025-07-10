import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import apiClient from "@/lib/apiClient";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    const body = await req.json();

    const { name, description, points, isActive, giverPoints } = body;

    const response = await apiClient(`/userBigupType`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          Authorization: authToken ? `${authToken}` : "",
      },
      body: JSON.stringify({
          name,
          description,
          points,
          giverPoints,
          isActive
      }),
  });

    // Propagate the status and data from the actual API response
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    const body = await req.json();
    const { uniqueId, data: payload } = body;

    if (!uniqueId) {
      return NextResponse.json(
        { error: "Missing uniqueId for PUT request" },
        { status: 400 }
      );
    }

    const response = await apiClient(`/userBigupType/${uniqueId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken ? `${authToken}` : "",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 