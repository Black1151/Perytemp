import AdminHeader from "@/components/AdminHeader";

import { optionListGroupsJson } from "@/components/surveyjs/forms/optionListGroups";
import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function OptionListGroupsCreatePage() {
  await checkUserRole("/option-lists/groups/create");

  return (
    <>
      <AdminHeader headingText="Create Option List Group" />
      <AdminFormWrapper
        formJson={optionListGroupsJson}
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
        endpoint={"/optionListGroup"}
        formSuccessMessage={null}
        reloadPageOnSuccess={false}
        redirectUrl={"/option-lists"}
        isNew={true}
        isAllowedToEdit={true}
      />
    </>
  );
}
