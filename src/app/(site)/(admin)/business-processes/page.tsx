import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { businessProcessFields } from "@/components/agGrids/dataFields/businessProcessFields";
import { checkUserRole, getUser } from "@/lib/dal";

export default async function WorkflowsPage() {
  await checkUserRole("/business-processes");
  const user = await getUser();
  if (user.customerIsFree) {
    return redirect("/error"); // Redirect if the user is free
  }

  let url = "/getAllView?view=vwBusinessProcessesList";
  let headerTitle = "Business Processes";

  const res = await apiClient(url, { cache: "no-store" });

  if (!res.ok) {
    return redirect("/error");
  }

  const businessProcesses = await res.json();
  const businessProcessData = businessProcesses.resource || [];

  const businessProcessCount = businessProcessData.length;

  return (
    <>
      <AdminHeader headingText={headerTitle} dataCount={businessProcessCount} />
      <DataGridComponent
        data={businessProcessData}
        initialFields={businessProcessFields}
        createNewUrl={"/business-processes/create"}
      />
    </>
  );
}
