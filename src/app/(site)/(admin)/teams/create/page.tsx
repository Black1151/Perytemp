import { userTeamJson } from "@/components/surveyjs/forms/userTeam";
import AdminHeader from "@/components/AdminHeader";

import { checkUserRole, getUser } from "@/lib/dal";
import { redirect } from "next/navigation";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function TeamsCreatePage() {
  const user = await getUser();
  await checkUserRole(`/teams/create`);

  if (!["CA", "PA"].includes(user.role)) {
    return redirect("/");
  }

  return (
    <>
      <AdminHeader headingText={"Create Department / Team"} />
      <AdminFormWrapper
        formJson={userTeamJson}
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
        endpoint={"/userTeam"}
        formSuccessMessage={null}
        reloadPageOnSuccess={false}
        redirectUrl={"/teams"}
        isNew={true}
        isAllowedToEdit={true}
      />
    </>
  );
}
