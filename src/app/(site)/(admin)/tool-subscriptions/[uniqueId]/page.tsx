import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";

import { toolSubscriptionsJson } from "@/components/surveyjs/forms/toolSubscriptions";
import { ToolSubscriptionDetailsBanner } from "@/components/AdminDetailsBanners/ToolSubscriptionDetailsBanner";
import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function ToolSubscriptionsDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/tool-subscriptions/${params.uniqueId}`);

  const res = await apiClient(`/toolCustomer/findBy?id=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const toolSubscription = await res.json();
  const toolSubscriptionData = toolSubscription.resource;

  return (
    <>
      <ToolSubscriptionDetailsBanner toolSubscription={toolSubscriptionData} />
      <AdminFormWrapper
        formJson={toolSubscriptionsJson}
        data={toolSubscriptionData}
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
        endpoint={`/toolCustomer/${params.uniqueId}`}
        formSuccessMessage={null}
        reloadPageOnSuccess={true}
        redirectUrl={null}
        isNew={false}
        isAllowedToEdit={true}
      />
    </>
  );
}
