import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  try {
    // Access the query parameters from the URL
    const { searchParams } = req.nextUrl;

    // Grab the "type" parameter from the query string
    const type = searchParams.get("type");

    // Fetch more fun data
    const response = await fetch(`${process.env.BE_URL}/selectItem/allBy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
      body: JSON.stringify({
        type: type,
      }),
    });

    const data = await response.json();
    const resource = data.resource;
    return NextResponse.json(resource);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
