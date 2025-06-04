import AdminHeader from "@/components/AdminHeader";

import { toolSubscriptionsJson } from "@/components/surveyjs/forms/toolSubscriptions";
import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function ToolSubscriptionsCreatePage() {
  await checkUserRole("/tool-subscriptions/create");

  return (
    <>
      <AdminHeader headingText="Add Tool Subscription" />
      <AdminFormWrapper
        formJson={toolSubscriptionsJson}
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
        endpoint={"/toolCustomer"}
        formSuccessMessage={null}
        reloadPageOnSuccess={false}
        redirectUrl={"/tool-subscriptions"}
        isNew={true}
        isAllowedToEdit={true}
      />
    </>
  );
}
