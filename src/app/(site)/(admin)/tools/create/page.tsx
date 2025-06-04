import AdminHeader from "@/components/AdminHeader";

import { toolsJson } from "@/components/surveyjs/forms/tools";
import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function ToolsCreatePage() {
  await checkUserRole("/tools/create");

  return (
    <>
      <AdminHeader headingText="Create Tool" />
      <AdminFormWrapper
        formJson={toolsJson}
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
        endpoint={"/toolConfig"}
        formSuccessMessage={null}
        reloadPageOnSuccess={false}
        redirectUrl={"/tools"}
        isNew={true}
        isAllowedToEdit={true}
      />
    </>
  );
}
