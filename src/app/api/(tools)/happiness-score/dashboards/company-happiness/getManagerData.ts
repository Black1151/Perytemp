// getManagerData.ts
import apiClient from "@/lib/apiClient";

interface ManagerDataResponse {
  resource: {
    managerOfDeptIds: number[];
    managerOfTeamIds: number[];
  };
}

export async function getManagerData(
  userUniqueId: string,
  apiToken: string
): Promise<{ deptIds: string[]; teamIds: string[] }> {
  const response = await apiClient("/getTeamsUserIsManagerOf", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({ userUniqueId }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch manager of departments and teams: ${response.statusText}`
    );
  }

  const data: ManagerDataResponse = await response.json();
  return {
    deptIds: data.resource.managerOfDeptIds.map(String),
    teamIds: data.resource.managerOfTeamIds.map(String),
  };
}
