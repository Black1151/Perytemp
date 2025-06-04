import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";

import { ToolDetailsBanner } from "@/components/AdminDetailsBanners/ToolDetailsBanner";
import { toolsJson } from "@/components/surveyjs/forms/tools";
import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function ToolsDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/tools/${params.uniqueId}`);

  const res = await apiClient(`/toolConfig/findBy?id=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const tool = await res.json();
  const toolData = tool.resource;

  return (
    <>
      <ToolDetailsBanner tool={toolData} />
      <AdminFormWrapper
        formJson={toolsJson}
        data={toolData}
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
        endpoint={`/toolConfig/${params.uniqueId}`}
        formSuccessMessage={null}
        reloadPageOnSuccess={true}
        redirectUrl={null}
        isNew={false}
        isAllowedToEdit={true}
      />
    </>
  );
}
