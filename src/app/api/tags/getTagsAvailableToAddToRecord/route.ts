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

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json();
    const { customerId, recordTypeId, recordId } = body;

    if (!customerId || !recordTypeId || !recordId) {
      return NextResponse.json(
        { error: "CustomerId, recordTypeId, and recordId are required." },
        { status: 400 },
      );
    }

    const response = await apiClient("/availableTagsForCustomerAndRecord", {
      method: "POST",
      body: JSON.stringify({ customerId, recordTypeId, recordId }),
    });

    if (!response.ok) {
      const errorMessage =
        (await response.json())?.error || "Failed to fetch available tags.";
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
      {
        error:
          error.message || "An error occurred while fetching available tags.",
      },
      { status: 500 },
    );
  }
}
