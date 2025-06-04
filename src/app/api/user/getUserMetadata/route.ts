import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import apiClient from "@/lib/apiClient";

export async function GET() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  const uniqueId = cookieStore.get("user_uuid")?.value;

  if (!authToken) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  try {
    const res = await apiClient(`/getUserMetadata`, {
      method: "POST",
      body: JSON.stringify({ p_userUniqueId: uniqueId }),
      cache: "no-store",
    });

    const userMetadataData = await res.json();

    const userMetadata = userMetadataData.resource;

    return NextResponse.json(userMetadata);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
