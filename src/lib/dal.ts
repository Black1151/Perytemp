import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Role } from "@/types/user";

// Define an interface for the user data
interface User {
  userId: number;
  userUniqueId: string;
  email: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  siteId?: number;
  siteName?: string;
  remoteWorker?: boolean;
  departmentId?: number;
  deptName?: string;
  teamId?: number;
  teamName?: string;
  jobLevelId?: number;
  jobLevel?: string;
  contractTypeId?: number;
  contractType?: string;
  employStartDate?: string;
  userIsActive: boolean;
  customerId?: number;
  customerName?: string;
  customerCode?: string;
  customerType?: string;
  customerUniqueId?: string;
  webAddress?: string;
  noOfUsers?: number;
  noOfSites?: number;
  businessTypeId?: number;
  businessTypeName?: string;
  sectorId?: number;
  sectorName?: string;
  regionId?: number;
  regionName?: string;
  companySizeId?: number;
  companyNo?: string;
  numberOfEmployees?: number;
  multiSite?: boolean;
  customerParentId?: number;
  customerParentName?: string;
  customerIsActive?: boolean;
  userImageUrl?: string;
  custImageUrl?: string;
  teamManagerCount: number;
  parentCustImageUrl?: string;
  customerIsFree?: boolean;
}

const roleBasedRoutes: { [key: string]: string[] } = {
  CA: [
    "/customers",
    "/customers/[dynamicSegment]",
    "/customers/create",
    "/sites",
    "/sites/[dynamicSegment]",
    "/sites/create",
    "/tags",
    "/tags/[dynamicSegment]",
    "/tags/create",
    "/teams",
    "/teams/[dynamicSegment]",
    "/teams/create",
    "/email-schedule",
    "/email-schedule/[dynamicSegment]",
    "/user-groups",
    "/user-groups/[dynamicSegment]",
    "/user-groups/create",
    "/users",
    "/users/[dynamicSegment]",
    "/users/create",
    "/my-company",
    "/my-profile",
    "/activity",
  ],
  PA: [
    "/customers",
    "/customers/[dynamicSegment]",
    "/customers/create",
    "/sites",
    "/sites/[dynamicSegment]",
    "/sites/create",
    "/tags",
    "/tags/[dynamicSegment]",
    "/tags/create",
    "/option-lists",
    "/option-lists/groups/[dynamicSegment]",
    "/option-lists/groups/create",
    "/option-lists/items/[dynamicSegment]",
    "/option-lists/items/create",
    "/option-lists/lists/[dynamicSegment]",
    "/option-lists/lists/create",
    "/select-items",
    "/select-items/[dynamicSegment]",
    "/select-items/create",
    "/forms",
    "/forms/[dynamicSegment]",
    "/forms/create",
    "/email-template",
    "/email-template/[dynamicSegment]",
    "/email-template/create",
    "/email-schedule",
    "/email-schedule/[dynamicSegment]",
    "/email-schedule/create",
    "/email-secure-link",
    "/email-secure-link/[dynamicSegment]",
    "/email-secure-link/create",
    "/tools",
    "/tools/[dynamicSegment]",
    "/tools/create",
    "/tool-subscriptions",
    "/tool-subscriptions/[dynamicSegment]",
    "/tool-subscriptions/create",
    "/workflows",
    "/workflows/[dynamicSegment]",
    "/workflows/create",
    "/business-processes",
    "/business-processes/[dynamicSegment]",
    "/business-processes/create",
    "/teams",
    "/teams/[dynamicSegment]",
    "/teams/create",
    "/user-groups",
    "/user-groups/[dynamicSegment]",
    "/user-groups/create",
    "/users",
    "/users/[dynamicSegment]",
    "/survey-test",
    "/grid-test",
    "/dashboards",
    "/dashboards/create",
    "/dashboards/[dynamicSegment]",
    "/dashboard-workflows",
    "/dashboard-workflows/create",
    "/dashboard-workflows/[dynamicSegment]",
  ],
  CU: [
    "/my-profile",
    "/my-company",
    "/activity",
    "/users",
    "/users/[dynamicSegment]",
    "/sites",
    "/sites/[dynamicSegment]",
    "/teams",
    "/teams/[dynamicSegment]",
  ],
  CL: [
    "/my-profile",
    "/my-company",
    "/activity",
    "/users",
    "/users/[dynamicSegment]",
    "/customers",
    "/customers/[dynamicSegment]",
    "/sites",
    "/sites/[dynamicSegment]",
    "/teams",
    "/teams/[dynamicSegment]",
  ],
  CS: [
    "/my-profile",
    "/my-company",
    "/activity",
    "/users",
    "/users/[dynamicSegment]",
    "/customers",
    "/customers/[dynamicSegment]",
    "/sites",
    "/sites/[dynamicSegment]",
    "/teams",
    "/teams/[dynamicSegment]",
  ],
  // Add more roles and routes as needed
};

const redirectRoutes: { [key: string]: string } = {
  PA: "/customers",
  CA: "/customers",
  CU: "/",
  CM: "/",
  CL: "/",
  CS: "/",
  // Add more role-based default redirect routes if needed
};

export const verifySession = async () => {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  const uniqueId = cookieStore.get("user_uuid")?.value;

  if (!authToken) {
    redirect("/login?MissingAuthToken=true");
  }

  if (!uniqueId) {
    redirect("/login?MissingAuthToken=true");
  }

  return { isAuth: true, userId: uniqueId };
};

export const getUser = async (): Promise<User> => {
  const session = await verifySession();

  // If there's no session, redirect to login
  if (!session) {
    redirect("/login?MissingAuthToken=true");
  }

  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  try {
    const response = await fetch(`${process.env.BE_URL}/getUserMetadata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify({ p_userUniqueId: session.userId }),
      cache: "no-store", // Prevent caching
    });

    if (!response.ok) {
      throw new Error(
        `Network response was not ok. Status: ${response.status}`,
      );
    }

    const userData = await response.json();

    return userData.resource as User; // Cast the response to the User type
  } catch (error) {
    redirect("/login?MissingAuthToken=true"); // Redirect to login if there's an error
    throw error; // Optional: re-throw if additional handling is needed
  }
};

export async function checkUserRole(targetPathname: string): Promise<boolean> {
  const user = await getUser();

  if (!user) {
    redirect("/login");
    return false;
  }

  const allowedRoutes = roleBasedRoutes[user.role] || [];

  // Split the targetPathname to get the base route and the dynamic segment
  const pathSegments = targetPathname.split("/");

  if (pathSegments.length > 1) {
    const lastSegment = pathSegments[pathSegments.length - 1];

    if (lastSegment === "create") {
      const explicitCreateRoute =
        pathSegments.slice(0, -1).join("/") + "/create";
      if (allowedRoutes.includes(explicitCreateRoute)) {
        return true;
      } else {
        const fallbackRoute = redirectRoutes[user.role] || "/";
        redirect(fallbackRoute);
        return false;
      }
    }
  }

  // Check for other routes and dynamic segments
  const isAllowed = allowedRoutes.some((route) => {
    if (!route.includes("[dynamicSegment]")) {
      // Direct route match
      return route === targetPathname;
    }

    // Handle dynamic segments using a regex
    const routeRegex = new RegExp(
      `^${route.replace("[dynamicSegment]", "([^/]+)")}$`,
    );
    return routeRegex.test(targetPathname);
  });

  if (!isAllowed) {
    const fallbackRoute = redirectRoutes[user.role] || "/";
    redirect(fallbackRoute);
    return false;
  }

  return true;
}
