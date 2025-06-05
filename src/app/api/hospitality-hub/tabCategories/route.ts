import { NextResponse } from 'next/server';
import hospitalityHubConfig from '@/app/(site)/(apps-non-standard)/hospitality-hub/hospitalityHubConfig';

export async function GET() {
  return NextResponse.json({ resource: hospitalityHubConfig });
}
