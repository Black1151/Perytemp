import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

// The POST function for handling /api/workflows/getForm endpoint
export async function POST(req: NextRequest) {
  try {
    const { formId } = await req.json();

    // Ensure that formId is provided
    if (!formId) {
      return NextResponse.json(
        { error: "Form ID is required." },
        { status: 400 },
      );
    }

    // Fetch form data using the provided formId
    const response = await apiClient(`/form/findBy?id=${formId}`);

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
