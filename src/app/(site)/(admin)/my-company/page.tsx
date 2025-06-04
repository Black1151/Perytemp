import { CustomerDetailsBanner } from "@/components/AdminDetailsBanners/CustomerDetailsBanner";
import { customerJson } from "@/components/surveyjs/forms/customer";
import { redirect } from "next/navigation";

import apiClient from "@/lib/apiClient";
import { checkUserRole, getUser } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";
import { checkUserRoleAccess } from "@/components/surveyjs/lib/utils";

export default async function MyCustomerPage() {
  const user = await getUser();
  await checkUserRole(`/my-company`);

  const { customerUniqueId } = user;

  const res = await apiClient(`/customer/findBy?uniqueId=${customerUniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const customer = await res.json();
  const customerData = customer.resource;

  return (
    <>
      <CustomerDetailsBanner customer={customerData} />
      <AdminFormWrapper
        formJson={customerJson}
        data={customerData}
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
        endpoint={`/customer/${customerUniqueId}`}
        formSuccessMessage={null}
        reloadPageOnSuccess={true}
        redirectUrl={null}
        isNew={false}
        isAllowedToEdit={checkUserRoleAccess(user.role, ["CA", "PA"])}
      />
    </>
  );
}
