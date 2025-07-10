import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * POST /api/basket
 * - Creates a new basket
 */
export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const backendUrl = `${process.env.BE_URL}/basket`;

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      body: body,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || data?.message || "Failed to create basket." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred while creating basket." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/basket
 * - Fetches the current basket
 */
export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  const backendUrl = `${process.env.BE_URL}/basket`;

  try {
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[BASKET GET] Backend error:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Failed to fetch basket." },
        { status: response.status }
      );
    }

    return NextResponse.json({ resource: data.resource });
  } catch (error: any) {
    console.error("[BASKET GET] Exception caught:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while fetching basket." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/basket
 * - Updates the current basket
 */
export async function PUT(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const backendUrl = `${process.env.BE_URL}/basket`;

  try {
    const response = await fetch(backendUrl, {
      method: "PUT",
      body: body,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || data?.message || "Failed to update basket." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred while updating basket." },
      { status: 500 }
    );
  }
}


/**
 * DELETE /api/basket
 * - Clears the current basket
*/
export async function DELETE(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  const backendUrl = `${process.env.BE_URL}/basket/clear`;

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