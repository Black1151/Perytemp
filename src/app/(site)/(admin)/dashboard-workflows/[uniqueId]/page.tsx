import { DashboardWorkflowDetailsBanner } from "@/components/AdminDetailsBanners/DashboardWorkflowBanner";
import { dashboardWorkflowJson } from "@/components/surveyjs/forms/dashboardWorkflow";
import { redirect } from "next/navigation";

import { checkUserRole, getUser } from "@/lib/dal";
import apiClient from "@/lib/apiClient";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";
import { checkUserRoleAccess } from "@/components/surveyjs/lib/utils";

export default async function DashboardWorkflowDetailsPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  const user = await getUser();
  await checkUserRole(`/dashboard-workflows/${params.uniqueId}`);

  const res = await apiClient(
    `/dashboardWorkflow/findBy?id=${params.uniqueId}`,
  );

  if (!res.ok) {
    return redirect("/error");
  }

  const dashboardWorkflow = await res.json();
  const dashboardWorkflowData = dashboardWorkflow.resource;

  return (
    <div>
      <DashboardWorkflowDetailsBanner
        dashboardWorkflow={dashboardWorkflowData}
      />
      <AdminFormWrapper
        formJson={dashboardWorkflowJson}
        data={dashboardWorkflowData}
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
        excludeKeys={["imageUrl"]}
        endpoint={`/dashboardWorkflow/${params.uniqueId}`}
        formSuccessMessage={null}
        reloadPageOnSuccess={true}
        redirectUrl={null}
        isNew={false}
        isAllowedToEdit={checkUserRoleAccess(user.role, ["PA"])}
      />
    </div>
  );
}
