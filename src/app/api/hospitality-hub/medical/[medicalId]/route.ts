import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function GET(
  _req: NextRequest,
  { params }: { params: { medicalId: string } },
) {
  const { medicalId } = params;

  try {
    const response = await apiClient(`/hospitality-hub/medical/${medicalId}`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || "Failed to fetch medical record." },
        { status: response.status },
      );
    }

    return NextResponse.json({ resource: data.resource });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { medicalId: string } },
) {
  const { medicalId } = params;

  if (!medicalId) {
    return NextResponse.json(
      { error: "medicalId is required." },
      { status: 400 },
    );
  }

  try {
    const payload = await req.json();
    const response = await apiClient(`/hospitality-hub/medical/${medicalId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.error || "Failed to update medical record.";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    return NextResponse.json({
      message: "Medical record updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred during the update." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { medicalId: string } },
) {
  const { medicalId } = params;

  try {
    const response = await apiClient(`/hospitality-hub/medical/${medicalId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || "Failed to delete medical record." },
        { status: response.status },
      );
    }

    return NextResponse.json({
      message: "Medical record deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred during deletion." },
      { status: 500 },
    );
  }
}
