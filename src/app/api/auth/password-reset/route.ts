import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  try {
    const response = await apiClient(`/authentication/passwordReset`, {
      method: "POST",
      body: JSON.stringify({
        rememberToken: token,
        password,
      }),
    });

    const data = await response.json();

    if (response.status === 401) {
      const errorMessage =
        data?.error || "Invalid token - please request a new password reset.";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    if (!response.ok) {
      const errorMessage =
        data?.error || "An error occurred during the password reset.";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;
    return NextResponse.json({ redirectUrl });
  } catch (error: any) {
    console.error(error);
    const errorMessage =
      error.message ||
      "An unexpected error occurred during the password reset.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
