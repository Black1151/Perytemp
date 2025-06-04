import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  const { searchParams } = req.nextUrl;
  const backendUrl = `${process.env.BE_URL}/hospitality-hub/hotels`;
  const urlWithParams = new URL(backendUrl);
  searchParams.forEach((value, key) => {
    urlWithParams.searchParams.append(key, value);
  });

  try {
    const response = await fetch(urlWithParams.toString(), {
      method: "GET",
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    });

    const data = await response.json();

    if (!response.ok || response.status !== 200) {
      const errorMessage = data?.error || "Failed to fetch hotels.";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    return NextResponse.json({ resource: data.resource });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  try {
    const hotels = await req.json();
    const response = await fetch(
      `${process.env.BE_URL}/hospitality-hub/hotels`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken ? `Bearer ${authToken}` : "",
        },
        body: JSON.stringify(hotels),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || "Failed to create hotels." },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred while creating hotels." },
      { status: 500 },
    );
  }
}
