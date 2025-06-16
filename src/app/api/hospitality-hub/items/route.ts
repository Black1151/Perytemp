import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import apiClient from "@/lib/apiClient";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  const { searchParams } = req.nextUrl;
  const hasId = searchParams.has("id");
  const basePath = hasId
    ? "/userHospitalityItem/findBy"
    : "/userHospitalityItem/allBy";

  const url = new URL(`${process.env.BE_URL}${basePath}`);
  searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || "Failed to fetch items." },
        { status: response.status },
      );
    }

    return NextResponse.json({ resource: data.resource });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  try {
    const contentType = req.headers.get("content-type") || "";
    let formData: FormData;

    if (contentType.includes("multipart/form-data")) {
      const incoming = await req.formData();
      formData = new FormData();
      incoming.forEach((value, key) => {
        if (value instanceof Blob) {
          formData.append(key, value, (value as File).name);
        } else {
          formData.append(key, value as string);
        }
      });
    } else {
      const payload = await req.json();
      formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
    }

    const response = await fetch(`${process.env.BE_URL}/userHospitalityItem`, {
      method: "POST",
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.error || "Failed to create item.",
          details: data?.details,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred." },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  try {
    const contentType = req.headers.get("content-type") || "";
    let incoming: FormData | null = null;
    let payload: any = null;
    let formData: FormData;

    if (contentType.includes("multipart/form-data")) {
      incoming = await req.formData();
    } else {
      payload = await req.json();
    }

    const id = incoming ? incoming.get("id") : payload?.id;
    if (id === undefined || id === null || id === "") {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    formData = new FormData();

    if (incoming) {
      incoming.forEach((value, key) => {
        if (value instanceof Blob) {
          formData.append(key, value, (value as File).name);
        } else {
          formData.append(key, value as string);
        }
      });
    } else if (payload) {
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
    }

    const response = await fetch(
      `${process.env.BE_URL}/userHospitalityItem/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: authToken ? `Bearer ${authToken}` : "",
        },
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.error || "Failed to update item.",
          details: data?.details,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred." },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${process.env.BE_URL}/userHospitalityItem/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: authToken ? `Bearer ${authToken}` : "",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.error || "Failed to delete item.",
          details: data?.details,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({ resource: data.resource });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred." },
      { status: 500 },
    );
  }
}
