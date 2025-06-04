import apiClient from "@/lib/apiClient";
import { checkUserRole, getUser } from "@/lib/dal";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { dashboardFields } from "@/components/agGrids/dataFields/dashboardFields";

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
  await checkUserRole("/dashboards");

  let url = `/dashboard/allBy`;
  let headerTitle = "Dashboards";
  let createNewUrl = `/dashboards/create`;

  const res = await apiClient(url, { cache: "no-store" });

  if (!res.ok) {
    return redirect("/error");
  }

  const dashboards = await res.json();
  const dashboardData = dashboards.resource || [];
  const dashboardCount = dashboardData.length;

  return (
    <>
      <AdminHeader headingText={headerTitle} dataCount={dashboardCount} />
      <DataGridComponent
        data={dashboardData}
        initialFields={dashboardFields}
        createNewUrl={createNewUrl}
      />
    </>
  );
}
