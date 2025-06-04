import AdminHeader from "@/components/AdminHeader";

import { workflowJson } from "@/components/surveyjs/forms/workflows";
import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function WorkflowsCreatePage() {
  await checkUserRole("/workflows/create");

  return (
    <>
      <AdminHeader headingText="Create Workflow" />
      <AdminFormWrapper
        formJson={workflowJson}
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
        endpoint={"/workflow"}
        formSuccessMessage={null}
        reloadPageOnSuccess={false}
        redirectUrl={"/workflows"}
        isNew={true}
        isAllowedToEdit={true}
      />
    </>
  );
}
