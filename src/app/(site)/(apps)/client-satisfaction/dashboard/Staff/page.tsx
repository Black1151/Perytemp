import { redirect } from "next/navigation";
import WorkflowEngine from "@/app/(site)/(apps)/WorkflowEngine";
import { verifySession } from "@/lib/dal";
import StaffDashboard from "./StaffDashboard";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await verifySession();

  // If there's no session, redirect to login
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
      <StaffDashboard />    
    </WorkflowEngine>
  );
}
