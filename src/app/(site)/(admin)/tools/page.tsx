import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { toolFields } from "@/components/agGrids/dataFields/toolFields";
import { checkUserRole } from "@/lib/dal";

export default async function ToolsPage() {
  await checkUserRole("/tools");

  let url = "/getAllView?view=vwToolsConfigList";
  let headerTitle = "Tools";

  const res = await apiClient(url, { cache: "no-store" });

  if (!res.ok) {
    return redirect("/error");
  }

  const tools = await res.json();
  const toolData = tools.resource || [];

  const toolCount = toolData.length;

  return (
    <>
      <AdminHeader headingText={headerTitle} dataCount={toolCount} />
      <DataGridComponent
        data={toolData}
        initialFields={toolFields}
        createNewUrl={"/tools/create"}
      />
    </>
  );
}
