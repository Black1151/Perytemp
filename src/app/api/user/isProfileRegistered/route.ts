import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { uniqueId } = await req.json();
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  try {
    const response = await fetch(
      `${process.env.BE_URL}/user/isProfileComplete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken ? `Bearer ${authToken}` : "",
        },
        body: JSON.stringify({ uniqueId }),
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || "Something went wrong");
    }
    const data = await response.json();
    const isProfileRegistered = data.resource.isProfileRegistered;
    return NextResponse.json({ isProfileRegistered });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
