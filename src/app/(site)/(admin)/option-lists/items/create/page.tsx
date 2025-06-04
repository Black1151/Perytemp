import AdminHeader from "@/components/AdminHeader";

import { optionListItemsJson } from "@/components/surveyjs/forms/optionListItems";
import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function OptionListItemsCreatePage() {
  await checkUserRole("/option-lists/items/create");

  return (
    <>
      <AdminHeader headingText="Create Option List Item" />
      <AdminFormWrapper
        formJson={optionListItemsJson}
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
        endpoint={"/optionListItem"}
        formSuccessMessage={null}
        reloadPageOnSuccess={false}
        redirectUrl={"/option-lists"}
        isNew={true}
        isAllowedToEdit={true}
      />
    </>
  );
}
