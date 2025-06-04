import { Tag } from "@/components/AdminDetailsBanners/TagDetailsBanner";
import apiClient from "@/lib/apiClient";
import { NextRequest, NextResponse } from "next/server";

export interface TagsResponse {
  resource: Tag[];
}

export interface ErrorResponse {
  error: string;
}

type ApiResponse = TagsResponse | ErrorResponse;

export async function GET(
  req: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  const { searchParams } = new URL(req.url);

  try {
    const recordTypeId = searchParams.get("recordTypeId");
    const recordId = searchParams.get("recordId");

    if (!recordTypeId || !recordId) {
      return NextResponse.json(
        { error: "Both recordTypeId and recordId are required." },
        { status: 400 },
      );
    }

    const response = await apiClient(
      `/getAllView?view=vwTagAssociationsList&selectColumns=name,colour,tagId,tagAssocId&recordTypeId=${recordTypeId}&recordId=${recordId}`,
    );

    if (!response.ok) {
      const errorMessage =
        (await response.json())?.error || "Failed to fetch tags.";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    const tags: TagsResponse = await response.json();

    return NextResponse.json(tags);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "An error occurred while fetching tags." },
      { status: 500 },
    );
  }
}
