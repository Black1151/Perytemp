import { userGroupJson } from "@/components/surveyjs/forms/userGroup";
import AdminHeader from "@/components/AdminHeader";

import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function UserGroupsCreatePage() {
  await checkUserRole(`/user-groups/create`);

  return (
    <>
      <AdminHeader headingText={"Create User Group"} />
      <AdminFormWrapper
        formJson={userGroupJson}
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
        endpoint={"/userGroup"}
        formSuccessMessage={null}
        reloadPageOnSuccess={false}
        redirectUrl={"/user-groups"}
        isNew={true}
        isAllowedToEdit={true}
      />
    </>
  );
}
