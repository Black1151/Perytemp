import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  // Extract searchParams from the incoming request
  const { searchParams } = req.nextUrl;

  // Construct the backend URL dynamically with query parameters
  const backendUrl = `${process.env.BE_URL}/userGroup/allBy`;
  const urlWithParams = new URL(backendUrl);

  // Append all searchParams to the backend URL
  searchParams.forEach((value, key) => {
    urlWithParams.searchParams.append(key, value);
  });

  try {
    const response = await fetch(urlWithParams.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    });

    const data = await response.json();
    const resource = data.resource;
    return NextResponse.json({ resource });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
