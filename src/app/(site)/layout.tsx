import React, { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SiteProviders from "./SiteProviders";
import {
  UserAccessControlContextProps,
  UserContextProps,
} from "@/providers/UserProvider";
import apiClient from "@/lib/apiClient";
import NavBar from "@/components/NavBar/NavBar";

interface NavBarProps {
  userFirstName: string;
  userImageUrl: string;
  userRole: string;
  userCustomerId: string;
  logoImageUrl?: string;
}

export const dynamic = "force-dynamic";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  const uniqueId = cookieStore.get("user_uuid")?.value;

  if (!authToken) {
    redirect("/login");
  }

  let navBarProps = {
    userFirstName: "",
    userImageUrl: "",
    userRole: "",
    userCustomerId: "",
  };

  let userMetadata: UserContextProps | null = null;
  let userAccessControl: UserAccessControlContextProps | null = null;

  try {
    const [fetchUserInfo, fetchUserMetadata] = await Promise.all([
      apiClient(
        `/getView?view=vwLoggedInUserIdentity&userUniqueId=${uniqueId}&selectColumns=userImageUrl,firstName,role,customerId`,
        { cache: "no-store" }
      ),
      apiClient(`/getUserMetadata`, {
        method: "POST",
        body: JSON.stringify({ p_userUniqueId: uniqueId }),
        cache: "no-store",
      }),
    ]);

    const userInfoData = await fetchUserInfo.json();
    const userMetadataData = await fetchUserMetadata.json();

    navBarProps = {
      userFirstName: userInfoData.resource.firstName,
      userImageUrl: userInfoData.resource.userImageUrl,
      userRole: userInfoData.resource.role,
      userCustomerId: userInfoData.resource.customerId,
    };

    userMetadata = userMetadataData.resource;
    if (userMetadata) {
      userAccessControl = {
        role: userMetadata.role,
        customerId: userMetadata.customerId,
        teamManagerCount: userMetadata.teamManagerCount,
        groupNames: userMetadata.groupNames,
        customerIsFree: userMetadata.customerIsFree,
        customerIsFreeUntilDate: userMetadata.customerIsFreeUntilDate,
        subscribedTools: userMetadata.subscribedTools,
      };
    }

    if (userMetadata?.role === "CA" && userMetadata?.customerId === null) {
      return (
        <SiteProviders
          userMetadata={userMetadata as UserContextProps}
          userAccessControl={userAccessControl as UserAccessControlContextProps}
        >
          <PerygonContainer>{children}</PerygonContainer>
        </SiteProviders>
      );
    }
  } catch (error: any) {
    console.error("Error details:", error);
    redirect("/error");
  }

  return (
    <SiteProviders
      userMetadata={userMetadata as UserContextProps}
      userAccessControl={userAccessControl as UserAccessControlContextProps}
    >
      <PerygonContainer>
        <NavBar {...(navBarProps as NavBarProps)} />
        {children}
      </PerygonContainer>
      <Footer />
    </SiteProviders>
  );
}
