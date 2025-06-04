import AdminHeader from "@/components/AdminHeader";

import { selectItemsJson } from "@/components/surveyjs/forms/selectItems";
import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function OptionListsCreatePage() {
  await checkUserRole("/select-items/create");

  return (
    <>
      <AdminHeader headingText="Create Select Item" />
      <AdminFormWrapper
        formJson={selectItemsJson}
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
        endpoint={"/selectItem"}
        formSuccessMessage={null}
        reloadPageOnSuccess={false}
        redirectUrl={"/select-items"}
        isNew={true}
        isAllowedToEdit={true}
      />
    </>
  );
}
