import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function PUT(req: NextRequest) {
  try {
    // Parse the full JSON body
    const { uniqueId, data } = await req.json();

    // Check if the required uniqueId is present
    if (!uniqueId) {
      return NextResponse.json(
        { error: "Unique ID is required." },
        { status: 400 },
      );
    }

    // Now using the uniqueId to construct the API endpoint
    try {
      const response = await apiClient(`/customer/${uniqueId}`, {
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

      // Respond with success message
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
