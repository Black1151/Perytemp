import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * DELETE /api/basket/uid
 * - Removes an item from the basket
*/
export async function DELETE(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  const backendUrl = `${process.env.BE_URL}/basket/${req.nextUrl.pathname.split("/").pop()}`;

  try {
    const response = await fetch(backendUrl, {
      method: "DELETE",
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || data?.message || "Failed to clear basket." },
        { status: response.status }
      );
    }

    return NextResponse.json({ resource: data.resource });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred while clear basket." },
      { status: 500 }
    );
  }
}