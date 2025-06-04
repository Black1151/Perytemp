import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function POST(req: NextRequest) {
  try {
    // Parse the full JSON body
    const { p_wfid, p_toolid } = await req.json();

    // Check if both required fields (p_wfid and p_toolid) are present
    if (!p_wfid || !p_toolid) {
      return NextResponse.json(
        { error: "Both Workflow ID and Tool ID are required." },
        { status: 400 },
      );
    }

    // Using p_wfid and p_toolid to construct the API request
    const response = await apiClient(`/startWorkflow`, {
      method: "POST",
      body: JSON.stringify({
        p_wfid,
        p_toolid,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // If the API call fails, return the error response
      return NextResponse.json(
        { error: responseData.error || "Failed to create record." },
        { status: response.status },
      );
    }

    const resource = responseData.resource;

    // Respond with success message
    return NextResponse.json(resource);
  } catch (error: any) {
    console.error("Error:", error);

    // Handling JSON parsing errors or other unexpected issues
    return NextResponse.json(
      { error: error.message || "An error occurred during the create." },
      { status: 500 },
    );
  }
}
