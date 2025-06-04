import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";

import { optionListItemsJson } from "@/components/surveyjs/forms/optionListItems";
import { OptionListItemDetailsBanner } from "@/components/AdminDetailsBanners/OptionListItemDetailsBanner";
import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function OptionListItemsDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/option-lists/items/${params.uniqueId}`);

  const res = await apiClient(`/optionListItem/findBy?id=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const optionListItem = await res.json();
  const optionListItemData = optionListItem.resource;

  return (
    <>
      <OptionListItemDetailsBanner optionListItem={optionListItemData} />
      <AdminFormWrapper
        formJson={optionListItemsJson}
        data={optionListItemData}
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
        endpoint={`/optionListItem/${params.uniqueId}`}
        formSuccessMessage={null}
        reloadPageOnSuccess={true}
        redirectUrl={null}
        isNew={false}
        isAllowedToEdit={true}
      />
    </>
  );
}
