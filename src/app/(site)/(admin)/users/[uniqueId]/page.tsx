import { UserDetailsBanner } from "@/components/AdminDetailsBanners/UserDetailsBanner";
import { userJson } from "@/components/surveyjs/forms/user";
import { redirect } from "next/navigation";

import apiClient from "@/lib/apiClient";
import { checkUserRole, getUser } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";
import { checkUserRoleAccess } from "@/components/surveyjs/lib/utils";

export default async function UsersDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  const user = await getUser();
  await checkUserRole(`/users/${params.uniqueId}`);

  const res = await apiClient(`/user/findBy?uniqueId=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const pageUser = await res.json();
  const pageUserData = pageUser.resource;

  return (
    <>
      <UserDetailsBanner surveyUser={pageUserData} />
      <AdminFormWrapper
        formJson={userJson}
        data={pageUserData}
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
        excludeKeys={["imageUrl"]}
        endpoint={`/user/${params.uniqueId}`}
        formSuccessMessage={null}
        reloadPageOnSuccess={true}
        redirectUrl={null}
        isNew={false}
        isAllowedToEdit={checkUserRoleAccess(user.role, ["PA", "CA"])}
      />
    </>
  );
}
