import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  const { searchParams } = req.nextUrl;
  const hasId = searchParams.has("id");
  const basePath = hasId
    ? "/userHospitalityCategory/findBy"
    : "/userHospitalityCategory/allBy";

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
        { error: data?.error || "Failed to fetch categories." },
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
    let response: Response;

    if (contentType.includes("multipart/form-data")) {
      const incoming = await req.formData();
      const laravelFormData = new FormData();
      incoming.forEach((value, key) => {
        if (value instanceof Blob) {
          laravelFormData.append(key, value, (value as File).name);
        } else {
          laravelFormData.append(key, value as string);
        }
      });

      response = await fetch(`${process.env.BE_URL}/userHospitalityCategory`, {
        method: "POST",
        headers: {
          Authorization: authToken ? `Bearer ${authToken}` : "",
        },
        body: laravelFormData,
      });
    } else {
      const payload = await req.json();
      response = await fetch(`${process.env.BE_URL}/userHospitalityCategory`, {
        method: "POST",
        headers: {
          Authorization: authToken ? `Bearer ${authToken}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.error || "Failed to create category.",
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
    let response: Response;

    if (contentType.includes("multipart/form-data")) {
      const incoming = await req.formData();
      const id = incoming.get("id");
      if (!id) {
        return NextResponse.json({ error: "Missing id" }, { status: 400 });
      }

      const laravelFormData = new FormData();
      incoming.forEach((value, key) => {
        if (value instanceof Blob) {
          laravelFormData.append(key, value, (value as File).name);
        } else {
          laravelFormData.append(key, value as string);
        }
      });

      response = await fetch(
        `${process.env.BE_URL}/userHospitalityCategory/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: authToken ? `Bearer ${authToken}` : "",
          },
          body: laravelFormData,
        },
      );
    } else {
      const payload = await req.json();
      const id = payload?.id;
      if (!id) {
        return NextResponse.json({ error: "Missing id" }, { status: 400 });
      }

      response = await fetch(
        `${process.env.BE_URL}/userHospitalityCategory/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: authToken ? `Bearer ${authToken}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.error || "Failed to update category.",
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
      `${process.env.BE_URL}/userHospitalityCategory/${id}`,
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
          error: data?.error || "Failed to delete category.",
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
