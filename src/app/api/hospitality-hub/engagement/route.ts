import { NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const response = await apiClient(`/userHospitalityEngagement`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    const errorMessage =
      error.message ||
      "An error occurred while creating a hospitality booking.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
