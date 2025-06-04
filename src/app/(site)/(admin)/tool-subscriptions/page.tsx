import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { toolSubscriptionFields } from "@/components/agGrids/dataFields/toolSubscriptionFields";
import { checkUserRole } from "@/lib/dal";

export default async function ToolSubscriptionsPage() {
  await checkUserRole("/tool-subscriptions");

  let url = "/getAllView?view=vwToolSubscriptionsList";
  let headerTitle = "Tool Subscriptions";

  const res = await apiClient(url, { cache: "no-store" });

  if (!res.ok) {
    return redirect("/error");
  }

  const toolSubscriptions = await res.json();
  const toolSubscriptionData = toolSubscriptions.resource || [];

  const toolSubscriptionCount = toolSubscriptionData.length;

  return (
    <>
      <AdminHeader
        headingText={headerTitle}
        dataCount={toolSubscriptionCount}
      />
      <DataGridComponent
        data={toolSubscriptionData}
        initialFields={toolSubscriptionFields}
        createNewUrl={"/tool-subscriptions/create"}
      />
    </>
  );
}
