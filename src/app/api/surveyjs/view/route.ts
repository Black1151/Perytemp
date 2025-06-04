import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  try {
    // Access the query parameters from the URL
    const { searchParams } = req.nextUrl;

    const backendUrl = `${process.env.BE_URL}/getAllView`;
    // Grab the "type" parameter from the query string
    const urlWithParams = new URL(backendUrl);

    // Append all searchParams to the backend URL
    searchParams.forEach((value, key) => {
      urlWithParams.searchParams.append(key, value);
    });

    // Fetch more fun data
    const response = await fetch(urlWithParams, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    });

    const data = await response.json();
    const resource = data.resource;
    return NextResponse.json(resource);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
