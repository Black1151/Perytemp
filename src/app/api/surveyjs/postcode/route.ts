import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postcode = searchParams.get("postcode");

  if (!postcode) {
    return NextResponse.json(
      { error: "Please provide a postcode" },
      { status: 400 },
    );
  }

  try {
    // Fetch the postcode data from the Postcodes.io API
    const res = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
    const data = await res.json();

    // Check if the postcode was found
    if (res.status !== 200) {
      return NextResponse.json({ error: data.error }, { status: res.status });
    }

    // Return the postcode data as JSON
    return NextResponse.json(data);
  } catch (error) {
    // Handle any potential errors from the fetch call
    return NextResponse.json(
      { error: "Failed to fetch postcode data" },
      { status: 500 },
    );
  }
}
