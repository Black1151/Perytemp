import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  const hospitalityCatId = req.nextUrl.searchParams.get("hospitalityCatId");
  if (!hospitalityCatId) {
    return NextResponse.json(
      { error: "Missing hospitalityCatId" },
      { status: 400 },
    );
  }

  const url = `${process.env.BE_URL}/userHospitalityItem/allBy?hospitalityCatId=${hospitalityCatId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || "Failed to fetch items." },
        { status: response.status },
      );
    }

    return NextResponse.json({ resource: data.resource });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred." },
      { status: 500 },
    );
  }
}
