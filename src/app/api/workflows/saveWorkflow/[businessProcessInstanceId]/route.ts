import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function POST(
  req: NextRequest,
  { params }: { params: { businessProcessInstanceId: string } },
) {
  try {
    const { businessProcessInstanceId } = params;

    // Ensure that businessProcessInstanceId is provided
    if (!businessProcessInstanceId) {
      return NextResponse.json(
        { error: "Business Process Instance ID is required." },
        { status: 400 },
      );
    }

    const { jsonResponse, isComplete } = await req.json();

    // Stringify jsonResponse before sending it in the API request
    const response = await apiClient(`/saveWorkflow`, {
      method: "POST",
      body: JSON.stringify({
        businessProcessInstanceId: businessProcessInstanceId,
        jsonResponse: JSON.stringify(jsonResponse), // Stringify jsonResponse
        isComplete: isComplete,
      }),
    });

    const responseData = await response.json();

    // If the API call fails, return the error response
    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.error || "Failed to send results record." },
        { status: response.status },
      );
    }

    // Respond with the success message or the resource data
    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("Error:", error);

    // Handling JSON parsing errors or other unexpected issues
    return NextResponse.json(
      { error: error.message || "An error occurred during the save process." },
      { status: 500 },
    );
  }
}
