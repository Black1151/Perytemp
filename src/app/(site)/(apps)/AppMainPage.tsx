import WorkflowEngine from "@/app/(site)/(apps)/WorkflowEngine";
import { redirect } from "next/navigation";
import { getFilteredDashboards } from "@/lib/dashboardUtils";
import apiClient from "@/lib/apiClient";
import { verifySession } from "@/lib/dal";
import { ToolLandingPage } from "@/app/(site)/(apps)/ToolLandingPageInner";
import NoDashboardsModal from "./NoDashboardModal";

interface WorkflowInstanceResponse {
  resource: {
    new_wfinstid: string;
  };
}

export default async function AppMainPage({
  searchParams,
  baseUrl,
  SplashScreenComponent,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  baseUrl: string;
  SplashScreenComponent: React.ComponentType;
}) {
  const session = await verifySession();

  if (!session) {
    redirect("/login");
  }

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
        redirectUrl = `${baseUrl}/workflow/${responseData.resource.new_wfinstid}`;
      }
    }
  }

  const { filteredDashboards, toolData } = await getFilteredDashboards(
    toolId,
    workflowId,
    baseUrl
  );

  if (!redirectUrl && filteredDashboards.length > 0) {
    const singleDashboard = filteredDashboards[0];
    redirectUrl = `${singleDashboard.dashboardUrl}?toolId=${toolId}&wfId=${workflowId}`;
  }

  return (
    <WorkflowEngine toolId={toolId} workflowId={workflowId}>
      {filteredDashboards.length === 0 && <NoDashboardsModal />}
      <ToolLandingPage
        redirectUrl={redirectUrl}
        splashScreen={<SplashScreenComponent />}
      />
    </WorkflowEngine>
  );
}
