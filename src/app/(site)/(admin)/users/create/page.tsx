import { userJson } from "@/components/surveyjs/forms/user";

import AdminHeader from "@/components/AdminHeader";
import { checkUserRole, getUser } from "@/lib/dal";
import { redirect } from "next/navigation";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

interface SearchParams {
  userType?: string;
}

export default async function UsersCreatePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getUser();
  await checkUserRole(`/users/create`);

  if (!["CA", "PA"].includes(user.role)) {
    return redirect("/");
  }

  let headerTitle = "Create User";
  let userTypeParam = searchParams.userType;

  if (user.role === "CA") {
    if (!["external"].includes(userTypeParam || "")) {
      userTypeParam = "external";
      headerTitle = "Create New Client User";
    } else if (userTypeParam === "external") {
      headerTitle = "Create New Client User";
    }
  } else if (user.role === "PA") {
    headerTitle = "Create User";
  }

  const surveyVariables = [
    {
      userType: {
        userTypeParam,
      },
    },
  ];

  return (
    <>
      <AdminHeader headingText={headerTitle} />
      <AdminFormWrapper
        formJson={userJson}
        data={null}
        layoutConfig={{
          layoutKey: "default",
          layoutProps: {},
        }}
        globalVariables={surveyVariables}
        stylingConfig={{
          sjsFilePath: "admin",
          cssFilePath: "admin",
        }}
        jsImport={""}
        excludeKeys={["imageUrl"]}
        endpoint={"/user"}
        formSuccessMessage={null}
        reloadPageOnSuccess={false}
        redirectUrl={
          user.role === "PA" ? "/users" : `/users?userType=${userTypeParam}`
        }
        isNew={true}
        isAllowedToEdit={true}
      />
    </>
  );
}
