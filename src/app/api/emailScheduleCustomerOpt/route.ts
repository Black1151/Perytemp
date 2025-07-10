import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";

export async function PUT(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  try {
    const searchParams = req.nextUrl.searchParams;
    const custSchedId = searchParams.get("custSchedId");

    if (!custSchedId) {
      return NextResponse.json(
        { error: "ID is required in search params." },
        { status: 400 }
      );
    }

    try {
      const response = await apiClient(
        `/emailScheduleCustomerOpt/${custSchedId}`,
        {
          method: "PUT",
          body: JSON.stringify({ isViewed: true }),
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken ? `Bearer ${authToken}` : "",
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok || response.status !== 200) {
        const errorMessage =
          responseData?.error || "Failed to update record - please try again.";
        return NextResponse.json(
          { error: errorMessage },
          { status: response.status }
        );
      }

      return NextResponse.json({ message: "Record updated successfully" });
    } catch (error: any) {
      const errorMessage =
        error.message || "An error occurred during the update.";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "An error occurred." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const customerId = req.nextUrl.searchParams.get("customerId");
    const custSchedId = req.nextUrl.searchParams.get("custSchedId");

    if (!customerId) {
      return NextResponse.json(
        { error: "Missing customerId in query parameters." },
        { status: 400 }
      );
    }

    const response = await apiClient(
      `/emailScheduleCustomerOpt/allBy/?customerId=${customerId}&id=${custSchedId}`,
      {
        method: "GET",
      }
    );

    const responseData = await response.json();

    if (!response.ok || response.status !== 200) {
      const errorMessage =
        responseData?.error || "Failed to fetch record - please try again.";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);
  } catch (error: any) {
    const errorMessage = error.message || "An error occurred during the fetch.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
