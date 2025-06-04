import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

// The POST function for handling /api/workflows/getForm endpoint
export async function POST(req: NextRequest) {
  try {
    const { businessProcessInstanceId } = await req.json();

    // Ensure that formId is provided
    if (!businessProcessInstanceId) {
      return NextResponse.json(
        { error: "Business Process Instance ID is required." },
        { status: 400 },
      );
    }

    // Fetch form data using the provided formId
    const response = await apiClient(
      `/businessProcessInstance/findBy?id=${businessProcessInstanceId}`,
    );

    const responseData = await response.json();

    // If the API call fails, return the error response
    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.error || "Failed to retrieve data." },
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
      { error: error.message || "An error occurred while fetching data." },
      { status: 500 },
    );
  }
}
