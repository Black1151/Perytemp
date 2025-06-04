// src/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import apiClient from "./lib/apiClient";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const fullPath = `${pathname}${search}`;

  // ----------------------------------------------------------------
  // Section 1: SKIP these patterns entirely (no auth/access checks)
  // ----------------------------------------------------------------
  // • any request for a static asset (filename.ext)
  // • /login and all its sub-paths
  // • /api/* (backend routes) - not included yet
  // • /_next/* (Next.js internals)
  // • other public routes
  if (
    /\/[^\/]+\.[^\/]+$/.test(pathname) || // ends with a file extension
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/access-denied") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/activate-account") ||
    pathname.startsWith("/profile-setup") ||
    pathname.startsWith("/privacy-policy") ||
    pathname.startsWith("/support") ||
    pathname.startsWith("/marketing") ||
    pathname.startsWith("/delete-my-data") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/error") ||
    pathname.startsWith("/password-recovery") ||
    pathname.startsWith("/trial-expired")
  ) {
    console.log(`[Middleware] Bypassing: ${pathname}`);
    return NextResponse.next();
  }

  // -----------------------------
  // Section 2: AUTHENTICATION
  // -----------------------------
  // 2a) Check for auth token
  const token = request.cookies.get("auth_token")?.value;

  // 2b) If missing, redirect to /login
  if (!token) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("auth_token");
    res.cookies.delete("user_uuid");
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return res;
  }

  // 2c) Validate the token
  try {
    const { status, ok } = await apiClient("/authentication/check", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!ok || status !== 200) {
      console.log();
      const res = NextResponse.redirect(
        new URL("/login?MissingAuthToken=true", request.url)
      );
      [
        "auth_token",
        "user_uuid",
        "next-auth.callback-url",
        "next-auth.csrf-token",
        "next-auth.session-token",
        "__Host-next-auth.csrf-token",
        "__Secure-next-auth.callback-url",
        "__Secure-next-auth.session-token",
      ].forEach((cookieName) => {
        res.cookies.delete(cookieName);
      });
      res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
      return res;
    }

    // -----------------------------
    // Section 3: ACCESS CONTROL (api fail results in access denied)
    // -----------------------------
    console.log(`[Middleware] Checking access control for URL: ${fullPath}`);
    let allowed = false;

    // SECTION 3A: get user metadata
    const userUUID = request.cookies.get("user_uuid")?.value;
    if (!userUUID) {
      console.warn("No user UUID found in cookies — denying access.");
      return new Response("Unauthorized", { status: 401 });
    }

    const metadataResponse = await apiClient("/getUserMetadata", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_userUniqueId: userUUID ?? "" }),
    });

    const metadataJson = await metadataResponse.json();

    const {
      role,
      customerId,
      teamManagerCount,
      groupNames,
      customerIsFree,
      customerIsFreeUntilDate,
      subscribedTools,
    } = metadataJson.resource;

    const userACMetadata = {
      role: role,
      customerId: customerId,
      teamManagerCount: teamManagerCount,
      groupNames: groupNames,
      customerIsFree: customerIsFree === null ? true : customerIsFree,
      customerIsFreeUntilDate: customerIsFreeUntilDate,
      subscribedTools: subscribedTools,
    };

    // Section 3B: ACCESS CONTROL PLATFORM (platform check done first)
    try {
      const params = new URLSearchParams();
      params.append("checkUrl", fullPath);
      params.append("userMetadata", JSON.stringify(userACMetadata));

      const acpResponse = await apiClient("/getAllowedPlatformUrlsUser", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      let acpJson: any = null;
      if (acpResponse.ok && acpResponse.status === 200) {
        acpJson = await acpResponse.json();
        console.log(
          `[Middleware] ACPlatform response: status=${acpResponse.status}, ok=${acpResponse.ok}, body=${JSON.stringify(
            acpJson
          )} path=${pathname}`
        );

        const resourceObj = acpJson?.resource?.[0];
        const firstVal = resourceObj
          ? Object.values(resourceObj)[0]
          : undefined;

        // Only grant access if that value is exactly the string "true"
        if (firstVal === "true") {
          allowed = true;
        }

        // Edge case, expired CA and CL trial users who are expired, redirect to /tool-store if their path gets blocked.
        if (
          !allowed &&
          userACMetadata.customerIsFree &&
          userACMetadata.customerIsFreeUntilDate &&
          new Date(userACMetadata.customerIsFreeUntilDate) < new Date()
        ) {
          if (userACMetadata.role === "CA" || userACMetadata.role === "CL") {
            console.log(
              "[Middleware] → Expired free user (CA) or (CL). Access denied, redirecting to /tool-store"
            );
            return NextResponse.redirect(new URL("/tool-store", request.url));
          } else {
            console.log(
              "[Middleware] → Expired free user. Access denied, redirecting to /tool-store"
            );
            return NextResponse.redirect(
              new URL("/trial-expired", request.url)
            );
          }
        }
      } else {
        console.warn(
          `[Middleware] ACPlatorm endpoint returned non-200: status=${acpResponse.status}, ok=${acpResponse.ok} path=${pathname}`
        );
      }
    } catch (err: any) {
      // any exception we shoud deny
      console.error(
        `[Middleware] Platform Access-control call failed on path ${fullPath}: ${err}`
      );
    }

    // Section 3C: ACCESS CONTROL DASHBAORDS (if access has not already been granted, check if its an allowed dashb path)
    if (!allowed) {
      try {
        const params = new URLSearchParams();
        params.append("checkUrl", fullPath);
        params.append("userMetadata", JSON.stringify(userACMetadata));

        const acdResponse = await apiClient("/getAllowedDashboardUrlsUser", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        });

        let acdJson: any = null;
        if (acdResponse.ok && acdResponse.status === 200) {
          acdJson = await acdResponse.json();
          console.log(
            `[Middleware] ACDashboard response: status=${acdResponse.status}, ok=${acdResponse.ok}, body=${JSON.stringify(
              acdJson
            )} path=${pathname}`
          );

          const resourceObj = acdJson?.resource?.[0];
          const firstVal = resourceObj
            ? Object.values(resourceObj)[0]
            : undefined;

          // Only grant access if that value is exactly the string "true"
          if (firstVal === "true") {
            allowed = true;
          }
        } else {
          console.warn(
            `[Middleware] ACDashboard endpoint returned non-200: status=${acdResponse.status}, ok=${acdResponse.ok}`
          );
        }
      } catch (err: any) {
        // any exception we shoud deny
        console.error(
          `[Middleware] Dashboard Access-control call failed on path ${fullPath}: ${err}`
        );
      }
    }

    // Section 3D: Final decision
    if (!allowed) {
      console.log(
        "[Middleware] → Access denied, redirecting to /access-denied"
      );
      const redirectUrl = new URL("/access-denied", request.url);
      redirectUrl.searchParams.set("path", fullPath);
      redirectUrl.searchParams.set("user", userUUID);
      return NextResponse.redirect(redirectUrl);
    }

    console.log("[Middleware] → Access granted");

    // --------------------------------
    // Section 4: CONTINUE THE REQUEST
    // --------------------------------
    const res = NextResponse.next();
    // Prevent caching of protected pages
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    console.log("[Middleware] → Request allowed, passing through");
    return res;
  } catch (error: any) {
    // ----------------------------------
    // Section 5: ERROR HANDLING & FALLBACK
    // ----------------------------------
    console.error(
      `[Middleware] Error during auth & access control check: ${error}`
    );
    console.log("[Middleware] → Redirecting to /login due to error");
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("auth_token");
    res.cookies.delete("user_uuid");
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return res;
  }
}

export const config = {
  // catch all paths (were choose paths to skips inside the middleware function)
  matcher: ["/:path*"],
};
