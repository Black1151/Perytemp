import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";

import { OptionListDetailsBanner } from "@/components/AdminDetailsBanners/OptionListDetailsBanner";
import { optionListJson } from "@/components/surveyjs/forms/optionLists";
import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function OptionListsDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/option-lists/lists/${params.uniqueId}`);

  const res = await apiClient(`/optionList/findBy?id=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const optionList = await res.json();
  const optionListData = optionList.resource;

  return (
    <>
      <OptionListDetailsBanner optionList={optionListData} />
      <AdminFormWrapper
        formJson={optionListJson}
        data={optionListData}
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
        endpoint={`/optionList/${params.uniqueId}`}
        formSuccessMessage={null}
        reloadPageOnSuccess={true}
        redirectUrl={null}
        isNew={false}
        isAllowedToEdit={true}
      />
    </>
  );
}
