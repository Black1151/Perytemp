import { NextRequest, NextResponse } from 'next/server';
import apiClient from '@/lib/apiClient';
import { hospitalityHubConfig } from '../../hospitalityHubConfig';
import { mockDataMap } from '../../mockData';

export async function GET(
  _req: NextRequest,
  { params }: { params: { category: string; itemId: string } }
) {
  const { category, itemId } = params;
  const config = hospitalityHubConfig[category];
  if (!config) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  try {
    const response = await apiClient(`${config.endpoint}/${itemId}`, { method: 'GET' });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || `Failed to fetch ${category} item.`);
    }

    return NextResponse.json({ resource: data.resource });
  } catch (error: any) {
    const items = mockDataMap[category];
    const fallback = items?.find((i: any) => i.id === itemId);
    if (fallback) {
      return NextResponse.json({ resource: fallback });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { category: string; itemId: string } }
) {
  const { category, itemId } = params;
  const config = hospitalityHubConfig[category];
  if (!config) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  try {
    const payload = await req.json();
    const response = await apiClient(`${config.endpoint}/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.error || `Failed to update ${category} item.`;
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: `${category} item updated successfully` });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An error occurred during the update.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { category: string; itemId: string } }
) {
  const { category, itemId } = params;
  const config = hospitalityHubConfig[category];
  if (!config) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  try {
    const response = await apiClient(`${config.endpoint}/${itemId}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || `Failed to delete ${category} item.` },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: `${category} item deleted successfully` });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An error occurred during deletion.' },
      { status: 500 }
    );
  }
}
