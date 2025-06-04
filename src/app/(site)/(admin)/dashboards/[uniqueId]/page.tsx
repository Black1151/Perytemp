import { DashboardDetailsBanner } from "@/components/AdminDetailsBanners/DashboardBanner";
import { dashboardJson } from "@/components/surveyjs/forms/dashboard";
import { redirect } from "next/navigation";

import { checkUserRole, getUser } from "@/lib/dal";
import apiClient from "@/lib/apiClient";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";
import { checkUserRoleAccess } from "@/components/surveyjs/lib/utils";

export default async function CustomersDetailsPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  const user = await getUser();
  await checkUserRole(`/dashboards/${params.uniqueId}`);

  const res = await apiClient(`/dashboard/findBy?id=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const dashboard = await res.json();
  const dashboardData = dashboard.resource;

  return (
    <div>
      <DashboardDetailsBanner dashboard={dashboardData} />
      <AdminFormWrapper
        formJson={dashboardJson}
        data={dashboardData}
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
        endpoint={`/dashboard/${params.uniqueId}`}
        formSuccessMessage={null}
        reloadPageOnSuccess={true}
        redirectUrl={null}
        isNew={false}
        isAllowedToEdit={checkUserRoleAccess(user.role, ["PA"])}
      />
    </div>
  );
}
