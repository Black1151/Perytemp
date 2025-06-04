import { NextResponse } from "next/server";

// POST: Handles new survey submissions
export async function POST(req: Request) {
  try {
    const surveyData = await req.json(); // Parse the JSON body from the request

    // Simulate saving the data to a database (or perform actual logic here)
    return NextResponse.json(
      {
        message: "Survey created successfully!",
        data: surveyData,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error submitting survey:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT: Handles updating existing surveys
export async function PUT(req: Request) {
  try {
    const surveyData = await req.json(); // Parse the JSON body from the request

    // Log additional details about the survey data
    if (Array.isArray(surveyData)) {
    }

    // Simulate updating the data in a database (or perform actual logic here)
    return NextResponse.json(
      {
        message: "Survey updated successfully!",
        data: surveyData,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating survey:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
