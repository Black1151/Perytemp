import { dashboardJson } from "@/components/surveyjs/forms/dashboard";
import AdminHeader from "@/components/AdminHeader";

import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function DashboardsCreatePage() {
  await checkUserRole(`/dashboards/create`);

  let headerTitle = "Create Dashboard";

  return (
    <>
      <AdminHeader headingText={headerTitle} />
      <AdminFormWrapper
        formJson={dashboardJson}
        data={null}
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
        endpoint={"/dashboard"}
        formSuccessMessage={null}
        reloadPageOnSuccess={false}
        redirectUrl={"/dashboards"}
        isNew={true}
        isAllowedToEdit={true}
      />
    </>
  );
}
