import AdminHeader from "@/components/AdminHeader";

import { optionListJson } from "@/components/surveyjs/forms/optionLists";
import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function OptionListsCreatePage() {
  await checkUserRole("/option-lists/lists/create");

  return (
    <>
      <AdminHeader headingText="Create Option List" />
      <AdminFormWrapper
        formJson={optionListJson}
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
        endpoint={"/optionList"}
        formSuccessMessage={null}
        reloadPageOnSuccess={false}
        redirectUrl={"/option-lists"}
        isNew={true}
        isAllowedToEdit={true}
      />
    </>
  );
}
