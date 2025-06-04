import { NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function DELETE(
  request: Request,
  { params }: { params: { tagId: string } },
) {
  try {
    const { tagId } = params;

    if (!tagId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const response = await apiClient(`/tagAssociation/${tagId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to remove tag from record");
    }

    return NextResponse.json({ success: true, resource: data });
  } catch (error) {
    console.error("Error removing tag from record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
