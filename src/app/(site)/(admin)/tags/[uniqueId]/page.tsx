import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";

import { TagDetailsBanner } from "@/components/AdminDetailsBanners/TagDetailsBanner";
import { tagsJson } from "@/components/surveyjs/forms/tags";
import { checkUserRole, getUser } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function TagsDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/tags/${params.uniqueId}`);
  const user = await getUser();
  if (user?.customerIsFree) {
    return redirect("/error");
  }

  const res = await apiClient(`/tag/findBy?id=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const tag = await res.json();
  const tagData = tag.resource;

  return (
    <>
      <TagDetailsBanner tag={tagData} />
      <AdminFormWrapper
        formJson={tagsJson}
        data={tagData}
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
        endpoint={`/tag/${params.uniqueId}`}
        formSuccessMessage={null}
        reloadPageOnSuccess={true}
        redirectUrl={null}
        isNew={false}
        isAllowedToEdit={true}
      />
    </>
  );
}
