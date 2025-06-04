import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

interface apiBodyType {
  loginType?: string;
  email?: string;
  password?: string;
  secureLinkUniqueId?: string;
  accessToken?: string;
  type?: number;
  sub?: string;
}

export async function POST(req: NextRequest) {
  const {
    loginType,
    email,
    password,
    accessToken,
    type,
    secureLinkUniqueId,
    sub,
  } = await req.json();

  // Extract searchParams from the incoming request
  const { searchParams } = req.nextUrl;

  // Extract `searchParams` from the request URL
  const secureLink = req.nextUrl.searchParams.get("l");

  try {
    let apiBody: apiBodyType = {};

    if (loginType === "sso") {
      apiBody = {
        loginType: loginType,
        email: email,
        accessToken: accessToken,
        secureLinkUniqueId: secureLinkUniqueId,
        type: type,
        sub: sub,
      };
    }

    if (loginType === "email") {
      apiBody = {
        email: email,
        password: password,
      };
    }

    if (loginType === "guestUser") {
      apiBody = {
        loginType: loginType,
        secureLinkUniqueId: secureLinkUniqueId,
      };
    }

    const response = await apiClient("/authentication/login", {
      method: "POST",
      body: JSON.stringify(apiBody),
    });
    const data = await response.json();

    if (!response.ok || response.status !== 200) {
      const errorMessage = data?.error || "Invalid login credentials";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    if (data.resource.sub && data.resource.type != 1) {
      return NextResponse.json({ sub: data.resource.sub });
    } else {
      const { token, UUID, role, isProfileRegistered } = data.resource;

      let redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;

      if (!isProfileRegistered && role !== "EU") {
        redirectUrl += "/profile-setup";
      } else if (role === "PA") {
        redirectUrl += "/customers";
      } else if (secureLink) {
        if (secureLink != "${secureLink}" && secureLink.length > 0) {
          redirectUrl += `/link?l=${secureLink}`;
        }
      }

      const res = NextResponse.json({ redirectUrl });

      res.cookies.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.cookies.set("user_uuid", UUID, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return res;
    }
  } catch (error: any) {
    console.error(error);
    const errorMessage = error.message || "An error occurred during login";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
