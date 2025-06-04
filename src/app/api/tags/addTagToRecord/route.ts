import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function POST(req: NextRequest) {
  try {
    const { recordId, recordTypeId, tagId } = await req.json();

    if (!recordId || !recordTypeId || !tagId) {
      return NextResponse.json(
        { error: "recordId, recordTypeId and tagId are required." },
        { status: 400 },
      );
    }

    const response = await apiClient("/tagAssociation", {
      method: "POST",
      body: JSON.stringify({
        recordId,
        recordTypeId,
        tagId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData?.error || "Failed to add tag to record.";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "An error occurred while adding the tag." },
      { status: 500 },
    );
  }
}
