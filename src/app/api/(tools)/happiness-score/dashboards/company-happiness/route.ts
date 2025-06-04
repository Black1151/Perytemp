// route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import apiClient from "@/lib/apiClient";

import { getManagerData } from "./getManagerData";
import { buildEndpoint } from "./buildQueryEndpoint";
import { processResponseData } from "./processResponseData";
import { fetchFilterGroups } from "./fetchFilterGroups";

import { ApiResponse, FilterOptionGroup } from "./types";

export async function GET(request: Request) {
  const cookieStore = cookies();
  const apiToken = cookieStore.get("auth_token")?.value;

  if (!apiToken) {
    return NextResponse.json(
      { error: "API token not found in cookies." },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  const preFilter = queryParams.preFilter;

  let managerOfDeptIds: string[] = [];
  let managerOfTeamIds: string[] = [];

  // If preFilter is departments or teams, fetch manager data
  if (preFilter === "departments" || preFilter === "teams") {
    try {
      const uniqueId = cookieStore.get("user_uuid")?.value;
      if (!uniqueId) {
        return NextResponse.json(
          { error: "User unique ID not found in cookies." },
          { status: 400 }
        );
      }

      const { deptIds, teamIds } = await getManagerData(uniqueId, apiToken);
      managerOfDeptIds = deptIds;
      managerOfTeamIds = teamIds;

      // If the user doesn't manage any relevant dept/team, return early
      if (preFilter === "departments" && managerOfDeptIds.length === 0) {
        return NextResponse.json(
          { error: "User does not manage any departments." },
          { status: 403 }
        );
      } else if (preFilter === "teams" && managerOfTeamIds.length === 0) {
        return NextResponse.json(
          { error: "User does not manage any teams." },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error("Error fetching manager data:", error);
      return NextResponse.json(
        { error: "Failed to fetch manager data." },
        { status: 500 }
      );
    }
  }

  // Collect filters from queryParams (these are user selections from FE)
  const selectedFilters = {
    siteId: queryParams.siteId?.split(",") || [],
    jobLevelId: queryParams.jobLevelId?.split(",") || [],
    deptId: queryParams.deptId?.split(",") || [],
    teamId: queryParams.teamId?.split(",") || [],
    contractTypeId: queryParams.contractTypeId?.split(",") || [],
    role: queryParams.role?.split(",") || [],
    remoteWorker: queryParams.remoteWorker === "true" ? ["true"] : [],
    userTagId: queryParams.userTagId?.split(",") || [],
    siteTagId: queryParams.siteTagId?.split(",") || [],
    customerTagId: queryParams.customerTagId?.split(",") || [],
  };

  // Standard IDs
  const workflowId = Number(queryParams.workflowId || 1);
  const businessProcessId = Number(queryParams.businessProcessId || 1);
  const toolConfigId = Number(queryParams.toolConfigId || 1);

  // 1) Fetch filter groups in parallel.
  //    This calls /getAllView for each group with the group's param excluded.
  let filterOptions: FilterOptionGroup[] = [];
  try {
    filterOptions = await fetchFilterGroups(
      selectedFilters,
      managerOfDeptIds,
      managerOfTeamIds,
      preFilter,
      toolConfigId,
      workflowId,
      businessProcessId,
      apiToken
    );
  } catch (error) {
    console.error("Error building filter groups:", error);
    // We'll allow the route to continue, but we won't have filters
    filterOptions = [];
  }

  // 2) Build the endpoint with *all* current filters to fetch final data
  const endpointWithAllFilters = buildEndpoint(
    selectedFilters,
    managerOfDeptIds,
    managerOfTeamIds,
    preFilter,
    toolConfigId,
    workflowId,
    businessProcessId
  );

  if (!endpointWithAllFilters) {
    return NextResponse.json(
      { error: "No data available based on your filters." },
      { status: 403 }
    );
  }

  // 3) Fetch the final data
  let finalData: ApiResponse;
  try {
    const response = await apiClient(endpointWithAllFilters, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch final data: ${response.statusText}`);
    }

    finalData = await response.json();
  } catch (error) {
    console.error("Error fetching final data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from the API." },
      { status: 500 }
    );
  }

  // 4) Process the data (group by week, fetch non-participants, etc.)
  const { lineGraphData, speechBubbleData, weeksData } =
    await processResponseData(
      finalData.resource,
      workflowId,
      businessProcessId,
      toolConfigId,
      preFilter,
      managerOfDeptIds,
      managerOfTeamIds
    );

  // 5) Return JSON response
  return NextResponse.json({
    filterOptions, // The parallel-fetched filter groups
    lineGraphData,
    speechBubbleData,
    weeksData,
    data: finalData.resource,
  });
}
