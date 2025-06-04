import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  // Extract searchParams from the incoming request
  const { searchParams } = req.nextUrl;

  // Construct the backend URL dynamically with query parameters
  const backendUrl = `${process.env.BE_URL}/customer/findBy`;
  const urlWithParams = new URL(backendUrl);

  // Append all searchParams to the backend URL
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
      const errorMessage = data?.error || "Failed to fetch customer data.";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    return NextResponse.json({ resource: data.resource });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "An error occurred." },
      { status: 500 },
    );
  }
}
