import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  // Extract searchParams from the incoming request
  const { searchParams } = req.nextUrl;

  // Construct the backend URL dynamically with query parameters
  const backendUrl = `${process.env.BE_URL}/toolConfig/allBy`;
  const urlWithParams = new URL(backendUrl);

  // Append all searchParams to the backend URL
  searchParams.forEach((value, key) => {
    urlWithParams.searchParams.append(key, value);
  });

  try {
    // Make the GET request to the backend with dynamic query params
    const response = await fetch(urlWithParams.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    });

    console.log("[TOOL CONFIG GET] Backend response:", response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || "Something went wrong");
    }

    const data = await response.json();

    // Return the response data
    return NextResponse.json({ resource: data.resource });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
