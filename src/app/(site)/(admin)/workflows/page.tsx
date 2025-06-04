import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { workflowFields } from "@/components/agGrids/dataFields/workflowFields";
import { checkUserRole } from "@/lib/dal";

export default async function WorkflowsPage() {
  await checkUserRole("/workflows");

  let url = "/getAllView?view=vwWorkflowsList";
  let headerTitle = "Workflows";

  const res = await apiClient(url, { cache: "no-store" });

  if (!res.ok) {
    return redirect("/error");
  }

  const workflows = await res.json();
  const workflowData = workflows.resource || [];

  const workflowCount = workflowData.length;

  return (
    <>
      <AdminHeader headingText={headerTitle} dataCount={workflowCount} />
      <DataGridComponent
        data={workflowData}
        initialFields={workflowFields}
        createNewUrl={"/workflows/create"}
      />
    </>
  );
}
