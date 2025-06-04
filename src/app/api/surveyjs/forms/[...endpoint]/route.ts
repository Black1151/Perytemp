import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Handles the GET request
export async function GET(
  req: NextRequest,
  { params }: { params: { endpoint: string[] } },
) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  try {
    // Build dynamic path
    const path = params.endpoint.join("/");

    // Convert searchParams to string
    const queryString = req.nextUrl.searchParams.toString();

    // Build full backend URL with optional query string
    const backendUrl = `${process.env.BE_URL}/${path}${queryString ? `?${queryString}` : ""}`;

    // Make the POST request to the backend
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.message || "Request failed" },
        { status: response.status },
      );
    }

    // Return the successful response data
    return NextResponse.json(responseData.resource, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
