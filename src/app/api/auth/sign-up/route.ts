import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  try {
    const requestBody = JSON.stringify({ email });

    const response = await apiClient("/authentication/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data?.error || "An error occurred during registration";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    return NextResponse.json(
      { message: "Registration successful" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(error);

    const errorMessage =
      error.message || "An error occurred during registration";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
