import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { hotels } from "../../mockData/hotels";

export async function GET(
  _req: NextRequest,
  { params }: { params: { hotelId: string } },
) {
  const { hotelId } = params;
  /*
  try {
    const response = await apiClient(`/hospitality-hub/hotels/${hotelId}`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || "Failed to fetch hotel." },
        { status: response.status },
      );
    }

    return NextResponse.json({ resource: data.resource });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  */

  // Return a single record from mock data
  const hotel = hotels.find((h) => h.id === hotelId);
  if (!hotel) {
    return NextResponse.json(
      { error: "Hotel not found" },
      { status: 404 },
    );
  }
  return NextResponse.json({ resource: hotel });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { hotelId: string } },
) {
  const { hotelId } = params;

  if (!hotelId) {
    return NextResponse.json({ error: "hotelId is required." }, { status: 400 });
  }

  try {
    const payload = await req.json();
    const response = await apiClient(`/hospitality-hub/hotels/${hotelId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.error || "Failed to update hotel.";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    return NextResponse.json({ message: "Hotel updated successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred during the update." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { hotelId: string } },
) {
  const { hotelId } = params;

  try {
    const response = await apiClient(`/hospitality-hub/hotels/${hotelId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || "Failed to delete hotel." },
        { status: response.status },
      );
    }

    return NextResponse.json({ message: "Hotel deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred during deletion." },
      { status: 500 },
    );
  }
}
