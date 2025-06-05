import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { legal } from "../../mockData/legal";

export async function GET(
  _req: NextRequest,
  { params }: { params: { legalId: string } },
) {
  const { legalId } = params;
  /*
  try {
    const response = await apiClient(`/hospitality-hub/legal/${legalId}`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || "Failed to fetch legal record." },
        { status: response.status },
      );
    }

    return NextResponse.json({ resource: data.resource });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  */

  const record = legal.find((l) => l.id === legalId);
  if (!record) {
    return NextResponse.json(
      { error: "Legal record not found" },
      { status: 404 },
    );
  }
  return NextResponse.json({ resource: record });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { legalId: string } },
) {
  const { legalId } = params;

  if (!legalId) {
    return NextResponse.json(
      { error: "legalId is required." },
      { status: 400 },
    );
  }

  try {
    const payload = await req.json();
    const response = await apiClient(`/hospitality-hub/legal/${legalId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.error || "Failed to update legal record.";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    return NextResponse.json({ message: "Legal record updated successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred during the update." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { legalId: string } },
) {
  const { legalId } = params;

  try {
    const response = await apiClient(`/hospitality-hub/legal/${legalId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || "Failed to delete legal record." },
        { status: response.status },
      );
    }

    return NextResponse.json({ message: "Legal record deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred during deletion." },
      { status: 500 },
    );
  }
}
