import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";

import { workflowJson } from "@/components/surveyjs/forms/workflows";
import { WorkflowDetailsBanner } from "@/components/AdminDetailsBanners/WorkflowDetailsBanner";
import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function WorkflowsDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/workflows/${params.uniqueId}`);

  const res = await apiClient(`/workflow/findBy?id=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const workflow = await res.json();
  const workflowData = workflow.resource;

  return (
    <>
      <WorkflowDetailsBanner workflow={workflowData} />
      <AdminFormWrapper
        formJson={workflowJson}
        data={workflowData}
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
        endpoint={`/workflow/${params.uniqueId}`}
        formSuccessMessage={null}
        reloadPageOnSuccess={true}
        redirectUrl={null}
        isNew={false}
        isAllowedToEdit={true}
      />
    </>
  );
}
