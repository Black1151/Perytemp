import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

interface RequestBody {
  workflowInstanceId: number;
}

// The POST function for handling /api/workflows/getForm endpoint
export async function POST(req: NextRequest) {
  try {
    const { workflowInstanceId }: RequestBody = await req.json();

    // Ensure that workflowInstanceId is provided
    if (!workflowInstanceId) {
      return NextResponse.json(
        { error: "Workflow ID is required." },
        { status: 400 },
      );
    }

    const response = await apiClient(`/getWorkflowVariables`, {
      method: "POST",
      body: JSON.stringify({
        workflowInstanceId,
      }),
    });

    const responseData = await response.json();

    // If the API call fails, return the error response
    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.error || "Failed to retrieve form data." },
        { status: response.status },
      );
    }

    const resource = responseData.resource;

    // Respond with the resource data
    return NextResponse.json(resource);
  } catch (error: any) {
    console.error("Error:", error);

    // Handling JSON parsing errors or other unexpected issues
    return NextResponse.json(
      { error: error.message || "An error occurred while fetching form data." },
      { status: 500 },
    );
  }
}
