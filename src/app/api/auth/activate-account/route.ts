import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function PUT(req: NextRequest) {
  const { token, password } = await req.json();

  try {
    const response = await apiClient(`/authentication/verifyAccount`, {
      method: "POST",
      body: JSON.stringify({
        verificationToken: token,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok || response.status !== 200) {
      const errorMessage =
        data?.error || "Verification failed - please try again.";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;
    return NextResponse.json({ redirectUrl });
  } catch (error: any) {
    const errorMessage = error.message || "An error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
