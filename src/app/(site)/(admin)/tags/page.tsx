import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { tagFields } from "@/components/agGrids/dataFields/tagFields";
import { checkUserRole, getUser } from "@/lib/dal";

export default async function TagsPage() {
  await checkUserRole("/tags");
  const user = await getUser();
  if (user?.customerIsFree) {
    return redirect("/error");
  }

  let url = "/getAllView?view=vwTagsList";
  let headerTitle = "Tags";

  const res = await apiClient(url, { cache: "no-store" });

  if (!res.ok) {
    return redirect("/error");
  }

  const tags = await res.json();
  const tagData = tags.resource || [];

  const tagCount = tagData.length;

  return (
    <>
      <AdminHeader headingText={headerTitle} dataCount={tagCount} />
      <DataGridComponent
        data={tagData}
        initialFields={tagFields}
        createNewUrl={"/tags/create"}
      />
    </>
  );
}
