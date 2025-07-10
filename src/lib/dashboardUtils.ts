import apiClient from "@/lib/apiClient";
import { getUser } from "@/lib/dal";

export interface Dashboard {
  dashboardId: number;
  dashboardName: string;
  workflowId: number;
  userRole: string;
  userAccessGroupNames?: string;
  dashboardUrl: string;
  smallIconImageUrl?: string;
  largeIconImageUrl?: string;
  dashboardOrder: number;
  availableAs: string;
  teamManagerRequired: boolean;
  deptManagerRequired: boolean;
  customerRestrictionList?: string;
  disableIfFree?: boolean;
}

export async function getFilteredDashboards(
  toolId: string,
  workflowId: string,
  pathname: string
): Promise<{
  filteredDashboards: Dashboard[];
  toolData: any;
  activeDashboardName: string | null;
  redirectPath?: string;
}> {
  const user = await getUser();
  const userRole = user.role;
  const userCustomerId = user.customerId;
  const isFree = user.customerIsFree;
  const isManagerofDept =
    user.teamManagerCount === 1 || user.teamManagerCount === 3;
  const isManagerofTeam =
    user.teamManagerCount === 2 || user.teamManagerCount === 3;

  const [dashboardListRes, toolDataRes] = await Promise.all([
    apiClient(
      `/getAllView?view=vwWorkflowDashboardList&workflowId=${workflowId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    ),
    apiClient(`/getView?view=vwToolsWorkflowList&toolId=${toolId}`, {
      method: "GET",
      cache: "no-store",
    }),
  ]);

  if (!dashboardListRes.ok || !toolDataRes.ok) {
    throw new Error("Failed to fetch data");
  }

  const dashboardListData = await dashboardListRes.json();
  const toolConfigData = await toolDataRes.json();

  const dashboardList: Dashboard[] = dashboardListData.resource;

  const filteredDashboards = dashboardList.filter((dashboard) => {
    let customerRestrictionList = null;

    if (dashboard.customerRestrictionList) {
      try {
        customerRestrictionList = JSON.parse(dashboard.customerRestrictionList);

        if (!Array.isArray(customerRestrictionList)) {
          customerRestrictionList = null;
        }
      } catch (error) {
        customerRestrictionList = null;
      }
    }

    if (
      customerRestrictionList &&
      !customerRestrictionList.includes(userCustomerId)
    ) {
      return false;
    }

    if (dashboard.deptManagerRequired && !isManagerofDept) {
      return false;
    }

    if (dashboard.teamManagerRequired && !isManagerofTeam) {
      return false;
    }

    switch (userRole) {
      case "CU":
        const cuCondition =
          dashboard.userRole === "CU" ||
          (dashboard.teamManagerRequired && dashboard.userRole === "CU") ||
          (dashboard.deptManagerRequired && dashboard.userRole === "CU");

        return cuCondition;

      case "CL":
      case "CA":
        return true;

      case "CS":
        const csCondition =
          dashboard.userRole === "CU" ||
          dashboard.userRole === "CS" ||
          (dashboard.teamManagerRequired &&
            (dashboard.userRole === "CU" || dashboard.userRole === "CS")) ||
          (dashboard.deptManagerRequired &&
            (dashboard.userRole === "CU" || dashboard.userRole === "CS"));

        return csCondition;

      default:
        return false;
    }
  });

  const activeDashboard = filteredDashboards.find(
    (dashboard) => dashboard.dashboardUrl === pathname
  );

  let redirectPath: string | undefined = undefined;

  if (!activeDashboard && filteredDashboards.length > 0) {
    redirectPath = filteredDashboards[0].dashboardUrl;
  }

  const activeDashboardName = activeDashboard
    ? activeDashboard.dashboardName
    : null;

  if (isFree) {
    return {
      filteredDashboards: filteredDashboards.filter(
        (dashboard) => !dashboard.disableIfFree
      ),
      toolData: toolConfigData.resource,
      activeDashboardName,
      redirectPath,
    };
  }

  return {
    filteredDashboards,
    toolData: toolConfigData.resource,
    activeDashboardName,
    redirectPath,
  };
}
