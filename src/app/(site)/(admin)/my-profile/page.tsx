import { UserDetailsBanner } from "@/components/AdminDetailsBanners/UserDetailsBanner";
import { userJson } from "@/components/surveyjs/forms/user";
import { redirect } from "next/navigation";

import apiClient from "@/lib/apiClient";
import { checkUserRole, getUser } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function MyProfilePage() {
  const user = await getUser();
  await checkUserRole(`/my-profile`);

  const { userUniqueId } = user;

  const res = await apiClient(`/user/findBy?uniqueId=${userUniqueId}`);

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
        endpoint={`/user/${userUniqueId}`}
        formSuccessMessage={null}
        reloadPageOnSuccess={true}
        redirectUrl={null}
        isNew={false}
        isAllowedToEdit={true}
      />
    </>
  );
}
