// getDidNotParticipate.ts
import apiClient from "@/lib/apiClient";
import {getUser} from "@/lib/dal";

interface DidNotParticipateParams {
  workflowId: number;
  businessProcessId: number;
  toolConfigId: number;
  startDate: string;
  endDate: string;
}

export async function getDidNotParticipate({
  workflowId,
  businessProcessId,
  toolConfigId,
  startDate,
  endDate,
}: DidNotParticipateParams) {

  const user = await getUser();

  const response = await apiClient("/getUserHappinessParticipants", {
    method: "POST",
    body: JSON.stringify({
      scheduleId: 14,
      customerId: user.customerId,
      toolConfigId,
      workflowId,
      businessProcessId,
      startDate,
      endDate,
    }),
  });

  return response.json();
}
