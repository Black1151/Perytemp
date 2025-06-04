import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { selectItemFields } from "@/components/agGrids/dataFields/selectItemFields";
import { checkUserRole } from "@/lib/dal";

export default async function FormsPage() {
  await checkUserRole("/select-items");

  let url = "/selectItem/allBy";
  let headerTitle = "Select Items";

  const res = await apiClient(url, { cache: "no-store" });

  if (!res.ok) {
    return redirect("/error");
  }

  const selectItems = await res.json();
  const selectItemData = selectItems.resource || [];

  const selectItemCount = selectItemData ? selectItemData.length : 0;

  return (
    <>
      <AdminHeader headingText={headerTitle} dataCount={selectItemCount} />
      <DataGridComponent
        data={selectItemData}
        initialFields={selectItemFields}
        createNewUrl={"/select-items/create"}
      />
    </>
  );
}
