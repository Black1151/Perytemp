import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { events } from "../../mockData/events";

export async function GET(
  _req: NextRequest,
  { params }: { params: { eventId: string } },
) {
  const { eventId } = params;
  /*
  try {
    const response = await apiClient(`/hospitality-hub/events/${eventId}`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || "Failed to fetch event." },
        { status: response.status },
      );
    }

    return NextResponse.json({ resource: data.resource });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  */

  const event = events.find((e) => e.id === eventId);
  if (!event) {
    return NextResponse.json(
      { error: "Event not found" },
      { status: 404 },
    );
  }
  return NextResponse.json({ resource: event });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { eventId: string } },
) {
  const { eventId } = params;

  if (!eventId) {
    return NextResponse.json(
      { error: "eventId is required." },
      { status: 400 },
    );
  }

  try {
    const payload = await req.json();
    const response = await apiClient(`/hospitality-hub/events/${eventId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.error || "Failed to update event.";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    return NextResponse.json({ message: "Event updated successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred during the update." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { eventId: string } },
) {
  const { eventId } = params;

  try {
    const response = await apiClient(`/hospitality-hub/events/${eventId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || "Failed to delete event." },
        { status: response.status },
      );
    }

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred during deletion." },
      { status: 500 },
    );
  }
}
