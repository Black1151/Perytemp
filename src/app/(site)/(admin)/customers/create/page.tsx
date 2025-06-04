import { customerJson } from "@/components/surveyjs/forms/customer";
import AdminHeader from "@/components/AdminHeader";
import { redirect } from "next/navigation";
import { checkUserRole, getUser } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function CustomersCreatePage() {
  const user = await getUser();
  await checkUserRole(`/customers/create`);

  if (user.customerIsFree) {
    return redirect("/error"); // Redirect if the user is free
  }

  let headerTitle = "Create Customer";

  if (user.role === "CA") {
    headerTitle = "Create New Client";
  }

  return (
    <>
      <AdminHeader headingText={headerTitle} />
      <AdminFormWrapper
        formJson={customerJson}
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
        excludeKeys={["imageUrl"]}
        endpoint={"/customer"}
        formSuccessMessage={null}
        reloadPageOnSuccess={false}
        redirectUrl={"/customers"}
        isNew={true}
        isAllowedToEdit={true}
      />
    </>
  );
}
