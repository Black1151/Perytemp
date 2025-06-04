import AdminHeader from "@/components/AdminHeader";
import { redirect } from "next/navigation";
import { businessProcessJson } from "@/components/surveyjs/forms/businessProcess";
import { checkUserRole, getUser } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function BusinessProcessCreatePage() {
  await checkUserRole("/business-processes/create");
  const user = await getUser();
  if (user.customerIsFree) {
    return redirect("/error"); // Redirect if the user is free
  }

  return (
    <>
      <AdminHeader headingText="Create Business Process" />
      <AdminFormWrapper
        formJson={businessProcessJson}
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
        endpoint={"/businessProcess"}
        formSuccessMessage={null}
        reloadPageOnSuccess={false}
        redirectUrl={"/business-processes"}
        isNew={true}
        isAllowedToEdit={true}
      />
    </>
  );
}
