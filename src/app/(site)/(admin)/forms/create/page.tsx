import AdminHeader from "@/components/AdminHeader";

import { formsJson } from "@/components/surveyjs/forms/forms";
import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function FormsCreatePage() {
  await checkUserRole("/forms/create");

  return (
    <>
      <AdminHeader headingText="Create Form" />
      <AdminFormWrapper
        formJson={formsJson}
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
        endpoint={"/form"}
        formSuccessMessage={null}
        reloadPageOnSuccess={false}
        redirectUrl={"/forms"}
        isNew={true}
        isAllowedToEdit={true}
      />
    </>
  );
}
