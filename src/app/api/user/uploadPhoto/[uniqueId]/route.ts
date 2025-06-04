import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(
  req: NextRequest,
  { params }: { params: { uniqueId: string } },
) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  const uniqueId = params.uniqueId;

  if (!uniqueId) {
    return NextResponse.json({ error: "Missing uniqueId." }, { status: 400 });
  }

  try {
    // Parse the incoming form data (from the user upload)
    const formData = await req.formData();
    const file = formData.get("imageUrl"); // Get the photo field

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    // Forward the file to the Laravel backend
    const laravelFormData = new FormData();
    laravelFormData.append("imageUrl", file, (file as File).name); // Send file as form-data

    // Make the POST request to the Laravel backend
    const laravelResponse = await fetch(
      `${process.env.BE_URL}/user/${uniqueId}`,
      {
        method: "POST", // HAS TO BE POST
        body: laravelFormData,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    // Check if the request was successful
    if (laravelResponse.ok) {
      const laravelResponseBody = await laravelResponse.json(); // Parse Laravel response if needed
      return NextResponse.json({
        success: "File uploaded successfully.",
        data: laravelResponseBody,
      });
    } else {
      const errorBody = await laravelResponse.text(); // Get error message from Laravel backend
      return NextResponse.json(
        {
          error: "Failed to upload file to Laravel backend.",
          details: errorBody,
        },
        { status: laravelResponse.status },
      );
    }
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "An error occurred during the upload." },
      { status: 500 },
    );
  }
}
