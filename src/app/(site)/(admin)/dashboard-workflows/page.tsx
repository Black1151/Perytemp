import apiClient from "@/lib/apiClient";
import { checkUserRole, getUser } from "@/lib/dal";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { dashboardWorkflowFields } from "@/components/agGrids/dataFields/dashboardWorkflowFields";

export const dynamic = "force-dynamic";

interface SearchParams {
  customerType?: string;
}

export default async function DashboardsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getUser();
  await checkUserRole("/dashboard-workflows");

  let url = `/dashboardWorkflow/allBy`;
  let headerTitle = "Dashboard Workflows";
  let createNewUrl = `/dashboard-workflows/create`;

  const res = await apiClient(url, { cache: "no-store" });

  if (!res.ok) {
    return redirect("/error");
  }

  const dashboardWorkflows = await res.json();
  const dashboardWorkflowsData = dashboardWorkflows.resource || [];
  const dashboardWorkflowsCount = dashboardWorkflowsData.length;

  return (
    <>
      <AdminHeader
        headingText={headerTitle}
        dataCount={dashboardWorkflowsCount}
      />
      <DataGridComponent
        data={dashboardWorkflowsData}
        initialFields={dashboardWorkflowFields}
        createNewUrl={createNewUrl}
      />
    </>
  );
}
