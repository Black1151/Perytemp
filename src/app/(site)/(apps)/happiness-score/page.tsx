import WorkflowEngine from "@/app/(site)/(apps)/WorkflowEngine";
import { redirect } from "next/navigation";
import { getFilteredDashboards } from "@/lib/dashboardUtils";
import NoDashboardsModal from "../NoDashboardModal";
import apiClient from "@/lib/apiClient";
import { getUser } from "@/lib/dal";
import { ToolLandingPage } from "@/app/(site)/(apps)/ToolLandingPageInner";
import { HappinessScoreSplashScreen } from "@/app/(site)/(apps)/happiness-score/HappinessScoreSplashScreen";

interface WorkflowInstanceResponse {
  resource: {
    new_wfinstid: string;
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();

  const toolId = searchParams.toolId as string;
  const workflowId = searchParams.wfId as string;
  const action = searchParams.a as string;

  if (!workflowId || !toolId) {
    return redirect("/");
  }

  let redirectUrl: string | null = null;

  if (action && parseInt(action) === 1) {
    const response = await apiClient(`/startWorkflow`, {
      method: "POST",
      body: JSON.stringify({
        p_wfid: workflowId,
        p_toolid: toolId,
      }),
    });

    if (response.ok) {
      const responseData: WorkflowInstanceResponse = await response.json();
      if (responseData?.resource.new_wfinstid) {
        redirectUrl = `/happiness-score/workflow/${responseData.resource.new_wfinstid}`;
      }
    }
  }

  const { filteredDashboards, toolData } = await getFilteredDashboards(
    toolId,
    workflowId,
    "/happiness-score",
  );

  if (!redirectUrl && filteredDashboards.length > 0) {
    const singleDashboard = filteredDashboards[0];
    redirectUrl = `${singleDashboard.dashboardUrl}?toolId=${toolId}&wfId=${workflowId}`;
  }

  return (
    <WorkflowEngine toolId={toolId} workflowId={workflowId}>
      {user.role === "EU" || filteredDashboards.length > 0 ? (
        <ToolLandingPage
          redirectUrl={redirectUrl}
          splashScreen={<HappinessScoreSplashScreen />}
        />
      ) : (
        <NoDashboardsModal />
      )}
    </WorkflowEngine>
  );
}
