import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";

import { businessProcessJson } from "@/components/surveyjs/forms/businessProcess";
import { BusinessProcessDetailsBanner } from "@/components/AdminDetailsBanners/BusinessProcessDetailsBanner";
import { checkUserRole, getUser } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function BusinessProcessesDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/business-processes/${params.uniqueId}`);
  const res = await apiClient(`/businessProcess/findBy?id=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const user = await getUser();
  if (user.customerIsFree) {
    return redirect("/error"); // Redirect if the user is free
  }

  const businessProcess = await res.json();
  const businessProcessData = businessProcess.resource;

  return (
    <>
      <BusinessProcessDetailsBanner businessProcess={businessProcessData} />
      <AdminFormWrapper
        formJson={businessProcessJson}
        data={businessProcessData}
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
        endpoint={`/businessProcess/${params.uniqueId}`}
        formSuccessMessage={null}
        reloadPageOnSuccess={true}
        redirectUrl={null}
        isNew={false}
        isAllowedToEdit={true}
      />
    </>
  );
}
