import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";

import { selectItemsJson } from "@/components/surveyjs/forms/selectItems";
import { SelectItemDetailsBanner } from "@/components/AdminDetailsBanners/SelectItemDetailsBanner";
import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function SelectItemsDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/select-items/${params.uniqueId}`);

  const res = await apiClient(`/selectItem/findBy?id=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const selectItem = await res.json();
  const selectItemData = selectItem.resource;

  return (
    <>
      <SelectItemDetailsBanner selectItem={selectItemData} />
      <AdminFormWrapper
        formJson={selectItemsJson}
        data={selectItemData}
        layoutConfig={{
          layoutKey: "default",
          layoutProps: {},
        }}
        globalVariables={[]}
        stylingConfig={{
          sjsFilePath: "admin",
          cssFilePath: "admin",
        }}
        jsImport={""}
        excludeKeys={[]}
        endpoint={`/selectItem/${params.uniqueId}`}
        formSuccessMessage={null}
        reloadPageOnSuccess={true}
        redirectUrl={null}
        isNew={false}
        isAllowedToEdit={true}
      />
    </>
  );
}
