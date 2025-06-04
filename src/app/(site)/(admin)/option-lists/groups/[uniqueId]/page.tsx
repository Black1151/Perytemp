import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";

import { OptionListGroupDetailsBanner } from "@/components/AdminDetailsBanners/OptionListGroupDetailsBanner";
import { optionListGroupsJson } from "@/components/surveyjs/forms/optionListGroups";
import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function OptionListGroupsDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/option-lists/groups/${params.uniqueId}`);

  const res = await apiClient(`/optionListGroup/findBy?id=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const optionListGroup = await res.json();
  const optionListGroupData = optionListGroup.resource;

  return (
    <>
      <OptionListGroupDetailsBanner optionListGroup={optionListGroupData} />
      <AdminFormWrapper
        formJson={optionListGroupsJson}
        data={optionListGroupData}
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
        endpoint={`/optionListGroup/${params.uniqueId}`}
        formSuccessMessage={null}
        reloadPageOnSuccess={true}
        redirectUrl={null}
        isNew={false}
        isAllowedToEdit={true}
      />
    </>
  );
}
