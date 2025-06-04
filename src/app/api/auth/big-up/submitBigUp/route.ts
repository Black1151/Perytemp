import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function POST(req: NextRequest) {
  try {
    const { fromUserId, toUserId, reason, bigupTypeId, customerId } =
      await req.json();

    const response = await apiClient(`/userBigup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fromUserId,
        toUserId,
        reason,
        bigupTypeId,
        customerId,
      }),
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {

    const errorMessage =
      error.message || "An error occurred while submitting BigUp.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
