import React from "react";
import NewWorkflowLayout from "@/app/(site)/(apps)/NewWorkflowLayout";
import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";
import { getWorkflowStages } from "@/utils/functions/workflow";

export const revalidate = 0;

export default async function ClientSatisfactionWorkflowPage({
  params,
}: {
  params: { workflowInstanceId: string };
}) {
  const session = await verifySession();

  const workflowInstanceId = params.workflowInstanceId;

  if (!session || !workflowInstanceId) {
    redirect("/login");
  }

  const stages = await getWorkflowStages(workflowInstanceId);

  return (
    <NewWorkflowLayout
      stages={stages}
      layout={"tester"}
      workflowInstanceId={workflowInstanceId}
    />
  );
}
