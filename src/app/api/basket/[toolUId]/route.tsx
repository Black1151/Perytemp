import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * DELETE /api/basket/uid
 * - Removes an item from the basket
*/
export async function DELETE(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  console.log("[BASKET DELETE ITEM] Incoming request to remove item from basket");
  const backendUrl = `${process.env.BE_URL}/basket/${req.nextUrl.pathname.split("/").pop()}`;
  console.log("[BASKET DELETE] Backend URL:", backendUrl);

  try {
    const response = await fetch(backendUrl, {
      method: "DELETE",
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    });

    const data = await response.json();
    console.log("[BASKET DELETE] Backend response:", data);

    if (!response.ok) {
      console.error("[BASKET DELETE] Backend error:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Failed to clear basket." },
        { status: response.status }
      );
    }

    return NextResponse.json({ resource: data.resource });
  } catch (error: any) {
    console.error("[BASKET DELETE] Exception caught:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while clear basket." },
      { status: 500 }
    );
  }
}