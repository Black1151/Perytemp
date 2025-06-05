import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { rewards } from "../../mockData/rewards";

export async function GET(
  _req: NextRequest,
  { params }: { params: { rewardId: string } },
) {
  const { rewardId } = params;
  /*
  try {
    const response = await apiClient(`/hospitality-hub/rewards/${rewardId}`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || "Failed to fetch reward." },
        { status: response.status },
      );
    }

    return NextResponse.json({ resource: data.resource });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  */

  const reward = rewards.find((r) => r.id === rewardId);
  if (!reward) {
    return NextResponse.json(
      { error: "Reward not found" },
      { status: 404 },
    );
  }
  return NextResponse.json({ resource: reward });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { rewardId: string } },
) {
  const { rewardId } = params;

  if (!rewardId) {
    return NextResponse.json({ error: "rewardId is required." }, { status: 400 });
  }

  try {
    const payload = await req.json();
    const response = await apiClient(`/hospitality-hub/rewards/${rewardId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.error || "Failed to update reward.";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    return NextResponse.json({ message: "Reward updated successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred during the update." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { rewardId: string } },
) {
  const { rewardId } = params;

  try {
    const response = await apiClient(`/hospitality-hub/rewards/${rewardId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || "Failed to delete reward." },
        { status: response.status },
      );
    }

    return NextResponse.json({ message: "Reward deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred during deletion." },
      { status: 500 },
    );
  }
}
