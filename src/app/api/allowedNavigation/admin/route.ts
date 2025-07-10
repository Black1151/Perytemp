import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  const backendUrl = `${process.env.BE_URL}/getAllowedAdminNavigationUser`;

  try {
    // Parse the incoming request body
    const { userMetadata, toolId } = await req.json();

    // Prepare the body for the backend request
    const body = {
      toolId,
      userMetadata,
    };

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
