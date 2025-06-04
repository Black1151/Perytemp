import AdminHeader from "@/components/AdminHeader";

import { emailTemplateJson } from "@/components/surveyjs/forms/emailTemplate";
import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function EmailTemplateCreatePage() {
  await checkUserRole("/email-template/create");

  return (
    <>
      <AdminHeader headingText="Create Email Template" />
      <AdminFormWrapper
        formJson={emailTemplateJson}
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
        endpoint={"/emailTemplate"}
        formSuccessMessage={null}
        reloadPageOnSuccess={false}
        redirectUrl={"/email-template"}
        isNew={true}
        isAllowedToEdit={true}
      />
    </>
  );
}
