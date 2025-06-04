import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  try {
    const response = await apiClient("/authentication/forgotPassword", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    const message =
      "A reset email will be sent if the address provided is valid";

    if (!response.ok || response.status !== 200) {
      console.error("Error occurred while sending the reset email.");
      return NextResponse.json(
        { error: data.error || "Failed to send reset email." },
        { status: response.status },
      );
    }

    return NextResponse.json({ message }, { status: 200 });
  } catch (error: any) {
    console.error(error.message || error);
    return NextResponse.json(
      {
        error:
          error.message || "An error occurred while sending the reset email.",
      },
      { status: 500 },
    );
  }
}
