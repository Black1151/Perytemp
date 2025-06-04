import { redirect } from "next/navigation";
import WorkflowEngine from "@/app/(site)/(apps)/WorkflowEngine";
import { verifySession } from "@/lib/dal";
import CompanyStats from "@/app/(site)/(apps)/happiness-score/dashboard/company-stats-dashboard/CompanyStats";

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
      <CompanyStats />
    </WorkflowEngine>
  );
}
