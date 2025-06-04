import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function PUT(req: NextRequest) {
  try {
    const { uniqueId, data } = await req.json();

    if (!uniqueId) {
      return NextResponse.json(
        { error: "Unique ID is required." },
        { status: 400 },
      );
    }

    try {
      const response = await apiClient(`/tag/${uniqueId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok || response.status !== 200) {
        const errorMessage =
          responseData?.error || "Failed to update record - please try again.";
        return NextResponse.json(
          { error: errorMessage },
          { status: response.status },
        );
      }

      return NextResponse.json({ message: "Record updated successfully" });
    } catch (error: any) {
      const errorMessage =
        error.message || "An error occurred during the update.";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "An error occurred." },
      { status: 500 },
    );
  }
}
