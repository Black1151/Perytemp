// fetchFilterGroups.ts
import apiClient from "@/lib/apiClient";
import { buildEndpoint } from "./buildQueryEndpoint";
import { ApiResponse, ApiResponseItem, FilterOptionGroup } from "./types";

interface FilterGroupsDefinition {
  key: string;
  paramName: string;
}

/**
 * Maps certain keys (like "deptName") to the ID field used as the value (like "deptId").
 */
const keyToIdMapping: Record<string, string> = {
  deptName: "deptId",
  teamName: "teamId",
  jobLevelName: "jobLevelId",
  contractTypeName: "contractTypeId",
  siteName: "siteId",
  userTags: "tagId",
  siteTags: "tagId",
  customerTags: "tagId",
};

/**
 * Convert somethingLikeThis -> "Something Like This"
 */
function camelCaseToWords(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());
}

/**
 * The labels for certain keys that might not map well to camelCase.
 */
const groupLabels: Record<string, string> = {
  userTags: "User Tags",
  siteTags: "Site Tags",
  customerTags: "Customer Tags",
};

const filterGroupsDefinition: FilterGroupsDefinition[] = [
  { key: "deptName", paramName: "deptId" },
  { key: "teamName", paramName: "teamId" },
  { key: "role", paramName: "role" },
  { key: "jobLevelName", paramName: "jobLevelId" },
  { key: "contractTypeName", paramName: "contractTypeId" },
  { key: "remoteWorker", paramName: "remoteWorker" },
  { key: "siteName", paramName: "siteId" },
  { key: "userTags", paramName: "userTagId" },
  { key: "siteTags", paramName: "siteTagId" },
  { key: "customerTags", paramName: "customerTagId" },
];

/**
 * Build filter groups in parallel based on partial filters.
 */
export async function fetchFilterGroups(
  selectedFilters: Record<string, string[]>,
  managerOfDeptIds: string[],
  managerOfTeamIds: string[],
  preFilter: string | undefined,
  toolConfigId: number,
  workflowId: number,
  businessProcessId: number,
  apiToken: string
): Promise<FilterOptionGroup[]> {
  const filterGroupPromises = filterGroupsDefinition.map(async (group) => {
    // We build a new filter object that EXCLUDES the current group's param
    const filtersExcludingCurrent = { ...selectedFilters };
    delete filtersExcludingCurrent[group.paramName];

    // Build the endpoint
    const endpoint = buildEndpoint(
      filtersExcludingCurrent,
      managerOfDeptIds,
      managerOfTeamIds,
      preFilter,
      toolConfigId,
      workflowId,
      businessProcessId
    );

    // If endpoint is empty string, it means user doesn't manage any depts/teams or no data
    if (!endpoint) {
      return null;
    }

    // Fetch data
    let apiRes: ApiResponse;
    try {
      const response = await apiClient(endpoint, {
        method: "GET",
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch data for ${group.key}`);
      }
      apiRes = await response.json();
    } catch (error) {
      console.error(`Error fetching data for group: ${group.key}`, error);
      return null;
    }

    // Process data, building a unique set of options
    const optionsSet = new Map<string, { label: string; value: string }>();
    for (const item of apiRes.resource) {
      let dataField = item[group.key as keyof ApiResponseItem];

      // If it’s one of the tag fields, it might be an array
      if (
        group.key === "userTags" ||
        group.key === "siteTags" ||
        group.key === "customerTags"
      ) {
        // dataField might be an array of {tagId, name}
        const tagsArray = Array.isArray(dataField) ? dataField : [];
        for (const tag of tagsArray as any[]) {
          if (tag && tag.tagId && tag.name) {
            optionsSet.set(String(tag.tagId), {
              label: tag.name,
              value: String(tag.tagId),
            });
          }
        }
      } else if (group.key === "remoteWorker") {
        // remoteWorker is a boolean (true/false), or item.remoteWorker
        // If the item has remoteWorker === true, we store "true", etc.
        if (item.remoteWorker) {
          optionsSet.set("true", { label: "Remote Worker", value: "true" });
        } else {
          // If you want the "false" as a filter, you could also store that:
          // optionsSet.set("false", { label: "On-site Worker", value: "false" });
        }
      } else {
        // Normal single field
        const label = dataField;
        const idKey = keyToIdMapping[group.key];
        const value = idKey ? item[idKey as keyof ApiResponseItem] : label;

        // Only add if label is valid
        if (label && label !== "null") {
          optionsSet.set(String(value), {
            label: String(label),
            value: String(value),
          });
        }
      }
    }

    // Sort options
    const options = Array.from(optionsSet.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );

    // Build group label
    const groupLabel = groupLabels[group.key] || camelCaseToWords(group.key);

    return {
      label: groupLabel,
      options,
    } as FilterOptionGroup;
  });

  const filterGroupResults = await Promise.all(filterGroupPromises);
  const availableOptions = filterGroupResults.filter(
    (x) => x !== null
  ) as FilterOptionGroup[];

  return availableOptions;
}
