import AdminHeader from "@/components/AdminHeader";

import { emailSecureLinkJson } from "@/components/surveyjs/forms/emailSecureLink";
import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function EmailSecureLinkCreatePage() {
  await checkUserRole("/email-secure-link/create");

  return (
    <>
      <AdminHeader headingText="Create Email Secure Link" />
      <AdminFormWrapper
        formJson={emailSecureLinkJson}
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
        endpoint={"/emailSecureLink"}
        formSuccessMessage={null}
        reloadPageOnSuccess={false}
        redirectUrl={"/email-secure-link"}
        isNew={true}
        isAllowedToEdit={true}
      />
    </>
  );
}
