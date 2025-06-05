import { NextRequest, NextResponse } from 'next/server';
import apiClient from '@/lib/apiClient';
import { hospitalityHubConfig } from '../hospitalityHubConfig';
import { mockDataMap } from '../mockData';

export async function GET(
  req: NextRequest,
  { params }: { params: { category: string } }
) {
  const { category } = params;
  const config = hospitalityHubConfig[category];
  if (!config) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  const query = req.nextUrl.searchParams.toString();
  const endpoint = `${config.endpoint}${query ? `?${query}` : ''}`;

  try {
    const response = await apiClient(endpoint, { method: 'GET' });
    const data = await response.json();

    if (!response.ok || response.status !== 200) {
      throw new Error(data?.error || `Failed to fetch ${category}.`);
    }

    return NextResponse.json({ resource: data.resource });
  } catch (error: any) {
    const fallback = mockDataMap[category];
    if (fallback) {
      return NextResponse.json({ resource: fallback });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { category: string } }
) {
  const { category } = params;
  const config = hospitalityHubConfig[category];
  if (!config) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  try {
    const payload = await req.json();
    const response = await apiClient(config.endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || `Failed to create ${category}.` },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || `An error occurred while creating ${category}.` },
      { status: 500 }
    );
  }
}
