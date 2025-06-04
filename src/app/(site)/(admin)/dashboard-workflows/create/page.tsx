import { dashboardWorkflowJson } from "@/components/surveyjs/forms/dashboardWorkflow";
import AdminHeader from "@/components/AdminHeader";

import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function DashboardWorkflowsCreatePage() {
  await checkUserRole(`/dashboard-workflows/create`);

  let headerTitle = "Create Dashboard Workflow";

  return (
    <>
      <AdminHeader headingText={headerTitle} />
      <AdminFormWrapper
        formJson={dashboardWorkflowJson}
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
        excludeKeys={["imageUrl"]}
        endpoint={"/dashboardWorkflow"}
        formSuccessMessage={null}
        reloadPageOnSuccess={false}
        redirectUrl={"/dashboard-workflows"}
        isNew={true}
        isAllowedToEdit={true}
      />
    </>
  );
}
