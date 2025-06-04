import { NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function POST(
  req: Request,
  { params }: { params: { uniqueId: string } },
) {
  try {
    const receivedData = await req.json(); // Parse the JSON body from the request
    const { uniqueId } = params; // Extract the dynamic uniqueId from the URL

    if (!uniqueId) {
      return NextResponse.json(
        { message: "Unique ID is required in the URL" },
        { status: 400 },
      );
    }

    // Construct the payload to send to the API
    const payload = {
      userGroupId: parseInt(uniqueId),
      ...receivedData,
    };

    // Use the apiClient to make a POST request
    const response = await apiClient("/userGroupMember", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const responseData = await response.json();
      return NextResponse.json({
        message: "Data successfully submitted.",
        responseData,
      });
    } else {
      const errorData = await response.json();
      console.error("Error from API:", errorData);
      return NextResponse.json(
        {
          message: "Failed to submit data to the external API.",
          error: errorData,
        },
        { status: response.status },
      );
    }
  } catch (error) {
    console.error("Error submitting data:", error);

    // Check if the error is an instance of Error
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Internal server error", error: error.message },
        { status: 500 },
      );
    }

    // If the error is not an instance of Error, return a generic message
    return NextResponse.json(
      { message: "Internal server error", error: "An unknown error occurred." },
      { status: 500 },
    );
  }
}
