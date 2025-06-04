import AdminHeader from "@/components/AdminHeader";
import { redirect } from "next/navigation";
import { tagsJson } from "@/components/surveyjs/forms/tags";
import { checkUserRole, getUser } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function TagsCreatePage() {
  await checkUserRole("/tags/create");
  const user = await getUser();
  if (user?.customerIsFree) {
    return redirect("/error");
  }

  return (
    <>
      <AdminHeader headingText="Create Tag" />
      <AdminFormWrapper
        formJson={tagsJson}
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
        endpoint={"/tag"}
        formSuccessMessage={null}
        reloadPageOnSuccess={false}
        redirectUrl={"/tags"}
        isNew={true}
        isAllowedToEdit={true}
      />
    </>
  );
}
