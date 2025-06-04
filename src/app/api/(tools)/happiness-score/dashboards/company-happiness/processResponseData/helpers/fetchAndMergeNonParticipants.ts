// helpers/fetchAndMergeNonParticipants.ts

import { Person } from "@/app/api/(tools)/happiness-score/dashboards/company-happiness/types";
import { getDidNotParticipate } from "../../getDidNotParticipate";

interface FetchAndMergeParams {
  workflowId: number;
  businessProcessId: number;
  toolConfigId: number;
  startDate: string;
  endDate: string;
  preFilter: string | undefined;
  managerOfDeptIds: string[];
  managerOfTeamIds: string[];
}

/**
 * Merges non-participants into `peopleList` and increments `masonryCounts[4]`.
 */
export async function fetchAndMergeNonParticipants(
  params: FetchAndMergeParams,
  peopleList: Person[],
  masonryCounts: number[]
): Promise<void> {
  const {
    workflowId,
    businessProcessId,
    toolConfigId,
    startDate,
    endDate,
    preFilter,
    managerOfDeptIds,
    managerOfTeamIds,
  } = params;

  const nonParticipantsResp = await getDidNotParticipate({
    workflowId,
    businessProcessId,
    toolConfigId,
    startDate,
    endDate,
  });

  // Possibly filter by manager coverage
  const filteredNonParticipantData =
    nonParticipantsResp?.resource?.filter((np: any) => {
      if (preFilter === "departments") {
        return managerOfDeptIds.includes(String(np.departmentId));
      }
      if (preFilter === "teams") {
        return managerOfTeamIds.includes(String(np.teamId));
      }
      return true;
    }) || [];

  // Count them
  masonryCounts[4] = filteredNonParticipantData.length;

  // Merge them into the overall peopleList
  const nonParticipants = filteredNonParticipantData.map((np: any) => ({
    userId: np.UserId,
    imageUrl: np.imageUrl,
    fullName: np.fullName,
    firstName: np.fullName.split(" ")[0] || "",
    lastName: np.fullName.split(" ").slice(1).join(" ") || "",
    jobTitle: np.jobTitle,
    department: np.deptName,
    site: np.siteName,
    score: null,
  }));

  peopleList.push(...nonParticipants);
}
