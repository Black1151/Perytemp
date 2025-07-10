import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';


interface GuideReadPayload {
  id: number
  guideId: string | number;
  customerId: string | number;
  userId: string | number;
}

async function forwardToBackend(
  method: 'GET' | 'POST' | 'DELETE',
  payload: GuideReadPayload | null
): Promise<NextResponse> {
  const cookieStore = cookies();
  const authToken = cookieStore.get('auth_token')?.value;

  let url: string;
  if (method === 'GET') {
    url = `${process.env.BE_URL}/guideRead/allBy/?userId=${payload?.userId}`;
  } else if (method === 'DELETE' && payload) {
    url = `${process.env.BE_URL}/guideRead/${payload.id}`;
  } else {
    // POST
    url = `${process.env.BE_URL}/guideRead`;
  }

  const fetchOpts: RequestInit = { method, headers: {} };

  if (authToken) {
    fetchOpts.headers = { Authorization: `Bearer ${authToken}` };
  }

  if (method !== 'GET' && payload) {
    fetchOpts.headers = { ...fetchOpts.headers, 'Content-Type': 'application/json' };
    fetchOpts.body = JSON.stringify(payload);
  }

  try {
    const res = await fetch(url, fetchOpts);

    let data: any;
    try {
      data = await res.json();
    } catch (jsonErr) {
      return NextResponse.json({ error: 'Invalid JSON from backend' }, { status: 502 });
    }

    if (!res.ok) {
      return NextResponse.json({ error: data.error ?? 'Backend error' }, { status: res.status });
    }

    return NextResponse.json({ resource: data.resource ?? null });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Network error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as GuideReadPayload;
    return forwardToBackend('POST', payload);
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const payload = (await req.json()) as GuideReadPayload;
    return forwardToBackend('DELETE', payload);
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId in query params' }, { status: 400 });
  }
  return forwardToBackend('GET', { id: 0, guideId: '', customerId: '', userId });
}
