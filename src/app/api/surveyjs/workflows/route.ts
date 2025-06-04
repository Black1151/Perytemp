import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Handles the POST request
export async function POST(
  req: NextRequest,
  { params }: { params: { endpoint: string } },
) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  try {
    // Parse the incoming JSON body
    const filteredSurveyData = await req.json();

    // Construct the backend URL for POST
    const backendUrl = `${process.env.BE_URL}/${params.endpoint}`;

    // Make the POST request to the backend
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
      body: JSON.stringify(filteredSurveyData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("POST request failed with status:", response.status);
      return NextResponse.json(
        { error: responseData.message || "Request failed" },
        { status: response.status },
      );
    }

    // Return the successful response data
    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    console.error("Error in POST request:", error.message);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}

// Handles the PUT request
export async function PUT(
  req: NextRequest,
  { params }: { params: { endpoint: string } },
) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  try {
    // Parse the incoming JSON body
    const filteredSurveyData = await req.json();

    // Extract uniqueId and construct the backend URL for PUT
    const uniqueId = filteredSurveyData.uniqueId;
    const backendUrl = `${process.env.BE_URL}/${params.endpoint}/${uniqueId}`;

    // Prepare the PUT request body
    const requestBody = filteredSurveyData.data;

    // Make the PUT request to the backend
    const response = await fetch(backendUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("PUT request failed with status:", response.status);
      return NextResponse.json(
        { error: responseData.message || "Request failed" },
        { status: response.status },
      );
    }

    // Return the successful response data
    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    console.error("Error in PUT request:", error.message);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
