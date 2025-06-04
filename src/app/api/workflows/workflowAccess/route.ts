import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function POST(req: NextRequest) {
  try {
    const { workflowInstanceId } = await req.json();

    if (!workflowInstanceId) {
      return NextResponse.json(
        { error: "Workflow Instance ID is required." },
        { status: 400 },
      );
    }

    // Fetch form data using the provided formId
    const response = await apiClient("/getUserWorkflowAccess", {
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

    const resource = responseData.access;

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
