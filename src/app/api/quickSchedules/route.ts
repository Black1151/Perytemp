// File: src/app/api/quickSchedules/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

type ViewResponse = { schedules: any[] };
type EditResponse = { success: true; result: any };
type ErrorResponse = { error: string };

type ApiResponse = ViewResponse | EditResponse | ErrorResponse;

export async function POST(
  request: Request
): Promise<NextResponse<ApiResponse>> {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  let body: any;
  try {
    body = await request.json();
  } catch (jsonErr) {
    console.error("⚠️ Could not parse JSON body:", jsonErr);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    customerId,
    toolId,
    subscriptionType,
    timeOfDay,
    day,
    singleToolSched,
    isActive,
  } = body;

  const missingFields: string[] = [];
  if (typeof customerId !== "number") missingFields.push("customerId (number)");
  if (typeof toolId !== "number") missingFields.push("toolId (number)");
  if (typeof subscriptionType !== "string") missingFields.push("subscriptionType (string)");

  if (missingFields.length > 0) {
    console.error(
      `❌ Missing or invalid required fields: ${missingFields.join(", ")}`,
      { customerId, toolId, subscriptionType }
    );
    return NextResponse.json(
      {
        error: `Missing or invalid: ${missingFields.join(", ")}`,
      },
      { status: 400 }
    );
  }

  // 2) Validate subscriptionType
  if (!["view", "free", "paid"].includes(subscriptionType)) {
    return NextResponse.json(
      { error: 'subscriptionType must be one of: "view", "free", "paid"' },
      { status: 400 }
    );
  }

  // 3) Ensure BE_URL is defined
  const BACKEND_URL = process.env.BE_URL;
  if (!BACKEND_URL) {
    console.error("❌ Environment variable BE_URL is not defined.");
    return NextResponse.json(
      { error: "BE_URL is not defined in environment" },
      { status: 500 }
    );
  }

  //
  // 4) Handle “view” → POST to backend/setupCustomerSchedulesForTool
  //
  if (subscriptionType === "view") {
    try {
      const url = `${BACKEND_URL}/setupCustomerSchedulesForTool`;
      const viewBody = { customerId, toolId, subscriptionType: "view" };

      const viewResp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken ? `Bearer ${authToken}` : "",
        },
        body: JSON.stringify(viewBody),
      });

      if (!viewResp.ok) {
        let errJson: any = null;
        try {
          errJson = await viewResp.json();
        } catch {}
        console.error("  Error payload from backend:", errJson);
        return NextResponse.json(
          { error: errJson?.message || "Failed to fetch schedules" },
          { status: viewResp.status }
        );
      }

      const schedules = await viewResp.json();
      return NextResponse.json({ schedules }, { status: 200 });
    } catch (fetchError: any) {
      console.error("⚠️ Unexpected error in 'view' branch:", fetchError);
      return NextResponse.json(
        { error: "Unexpected error fetching schedules" },
        { status: 500 }
      );
    }
  }

  // Validate isActive if provided
  if (typeof isActive !== "undefined" && typeof isActive !== "boolean") {
    return NextResponse.json(
      { error: "isActive must be a boolean if included" },
      { status: 400 }
    );
  }

  // Validate timeOfDay if provided
  const validTimes = ["morning", "afternoon", "evening"];
  if (
    typeof timeOfDay !== "undefined" &&
    (typeof timeOfDay !== "string" || !validTimes.includes(timeOfDay))
  ) {
    console.error(
      `❌ Invalid timeOfDay: ${timeOfDay}. Must be one of ${JSON.stringify(
        validTimes
      )}.`
    );
    return NextResponse.json(
      { error: `timeOfDay must be one of: ${validTimes.join(", ")}` },
      { status: 400 }
    );
  }

  // Validate day if provided
  if (
    typeof day !== "undefined" &&
    (typeof day !== "number" || day < 1 || day > 7)
  ) {
    console.error(`❌ Invalid day: ${day}. Must be an integer from 1 to 7.`);
    return NextResponse.json(
      { error: "day must be an integer between 1 and 7 (1=Monday, 7=Sunday)" },
      { status: 400 }
    );
  }

  // Build the edit payload with only provided fields
  const editBody: any = {
    customerId,
    toolId,
    subscriptionType,
    singleToolSched,
    isActive,
  };

  if (typeof isActive !== "undefined") {
    editBody.isActive = isActive ? 1 : 0;
  }
  if (typeof timeOfDay !== "undefined") {
    editBody.timeOfDay = timeOfDay;
  }
  if (typeof day !== "undefined") {
    editBody.day = day;
  }


  const url = `${BACKEND_URL}/setupCustomerSchedulesForTool`;

  try {
    const editResp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
      body: JSON.stringify(editBody),
    });

    if (!editResp.ok) {
      let errJson: any = null;
      try {
        errJson = await editResp.json();
      } catch {}
      console.error("  Error payload from backend:", errJson);
      return NextResponse.json(
        { error: errJson?.message || "Failed to update schedule" },
        { status: editResp.status }
      );
    }

    const editResult = await editResp.json();

    return NextResponse.json(
      { success: true, result: editResult },
      { status: 200 }
    );
  } catch (editError: any) {
    console.error("⚠️ Unexpected error in edit branch:", editError);
    return NextResponse.json(
      { error: "Unexpected error updating schedule" },
      { status: 500 }
    );
  }
}