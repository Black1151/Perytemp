"use server";

import apiClient from "@/lib/apiClient";
import { WorkflowStage } from "@/components/Sidebars/WorkflowSidebar/WorkflowSidebar";
import { revalidateTag } from "next/cache";

interface ApiResponse {
  resource: WorkflowStage[];
}

export const getWorkflowStages = async (
  workflowInstanceId: string,
): Promise<WorkflowStage[]> => {
  revalidateTag("workflow");

  const response = await apiClient(
    `/getAllView?view=vwWorkflowStageInstancesStatus&wfInstId=${workflowInstanceId}`,
    {
      cache: "no-store",
      next: { tags: ["workflow"] },
    },
  );

  const responseData: ApiResponse = await response.json();
  return responseData.resource;
};
