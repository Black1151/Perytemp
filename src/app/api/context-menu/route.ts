import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const incoming = await req.json() as { toolId: number; userAccessMetadata: any };

  const payload = new URLSearchParams();
  payload.set('toolId', String(incoming.toolId));
  payload.set('userAccessMetadata', JSON.stringify(incoming.userAccessMetadata));

  const backendUrl = `${process.env.BE_URL}/getAllowedToolContextMenu`;
  const authToken = cookies().get('auth_token')?.value ?? '';

  try {
    const backendRes = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': authToken ? `Bearer ${authToken}` : '',
        'Accept': 'application/json',
      },
      body: payload.toString(),
    });

    const text = await backendRes.text();
    let data: unknown;

    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: 'Backend did not return JSON', raw: text },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: backendRes.status });
  } catch (err) {
    console.error('[ContextMenu API] Error calling backend:', err);
    return NextResponse.json({ error: 'Failed to fetch context menu' }, { status: 500 });
  }
}
