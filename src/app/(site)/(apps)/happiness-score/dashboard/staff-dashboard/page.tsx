import { redirect } from "next/navigation";
import WorkflowEngine from "@/app/(site)/(apps)/WorkflowEngine";
import StaffDashboardPage from "@/app/(site)/(apps)/happiness-score/dashboard/staff-dashboard/StaffDashboardPage";
import { verifySession } from "@/lib/dal";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await verifySession();

  if (!session) {
    redirect("/login");
  }

  const toolId = searchParams.toolId as string;
  const workflowId = searchParams.wfId as string;

  if (!workflowId || !toolId) {
    return redirect("/");
  }

  return (
    <WorkflowEngine toolId={toolId} workflowId={workflowId}>
      <StaffDashboardPage />
    </WorkflowEngine>
  );
}
