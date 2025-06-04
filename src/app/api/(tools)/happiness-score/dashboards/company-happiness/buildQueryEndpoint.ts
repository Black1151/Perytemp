// buildQueryEndpoint.ts

interface Filters {
  siteId?: string[];
  jobLevelId?: string[];
  deptId?: string[];
  teamId?: string[];
  contractTypeId?: string[];
  role?: string[];
  remoteWorker?: string[];
  userTagId?: string[];
  siteTagId?: string[];
  customerTagId?: string[];
  [key: string]: string[] | undefined;
}

export function buildEndpoint(
  filters: Filters,
  managerOfDeptIds: string[],
  managerOfTeamIds: string[],
  preFilter: string | undefined,
  toolConfigId: string | number,
  workflowId: string | number,
  businessProcessId: string | number
): string {
  let endpoint = `/getAllView?view=vwDashboardDataFromReportJson&toolConfigId=${toolConfigId}&workflowId=${workflowId}&businessProcessId=${businessProcessId}`;

  // Departments preFilter
  if (preFilter === "departments") {
    if (managerOfDeptIds.length > 0) {
      if (filters.deptId && filters.deptId.length > 0) {
        filters.deptId = filters.deptId.filter((id: string) =>
          managerOfDeptIds.includes(id)
        );
        if (filters.deptId.length === 0) {
          return ""; // short-circuit: no data
        }
      } else {
        filters.deptId = managerOfDeptIds;
      }
    } else {
      return ""; // short-circuit: user manages no departments
    }
  }

  // Teams preFilter
  if (preFilter === "teams") {
    if (managerOfTeamIds.length > 0) {
      if (filters.teamId && filters.teamId.length > 0) {
        filters.teamId = filters.teamId.filter((id: string) =>
          managerOfTeamIds.includes(id)
        );
        if (filters.teamId.length === 0) {
          return "";
        }
      } else {
        filters.teamId = managerOfTeamIds;
      }
    } else {
      return "";
    }
  }

  // Append other filters
  Object.keys(filters).forEach((key) => {
    const filterValues = filters[key];
    if (filterValues && filterValues.length) {
      endpoint += `&${key}=${filterValues.join(",")}`;
    }
  });

  return endpoint;
}
