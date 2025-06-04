import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";

import { EmailScheduleDetailsBanner } from "@/components/AdminDetailsBanners/EmailScheduleDetailsBanner";
import { emailScheduleJson } from "@/components/surveyjs/forms/emailSchedule";
import { checkUserRole, getUser } from "@/lib/dal";
import { caEmailScheduleJson } from "@/components/surveyjs/forms/caEmailSchedule";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function EmailTemplatesDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  const user = await getUser();
  await checkUserRole(`/email-schedule/${params.uniqueId}`);
  if (user.customerIsFree) {
    return redirect("/error"); // Redirect if the user is free
  }

  // Determine the correct URL based on the user's role
  const apiUrl =
    user.role === "CA"
      ? `/emailScheduleCustomerOpt/findBy?customerId=${user.customerId}&id=${params.uniqueId}`
      : `/emailSchedule/findBy?id=${params.uniqueId}`;

  const res = await apiClient(apiUrl);

  if (!res.ok) {
    return redirect("/error");
  }

  const emailSchedule = await res.json();
  const emailScheduleData = emailSchedule.resource;

  return (
    <>
      <EmailScheduleDetailsBanner emailSchedule={emailScheduleData} />
      <AdminFormWrapper
        formJson={user.role === "PA" ? emailScheduleJson : caEmailScheduleJson}
        data={emailScheduleData}
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
        endpoint={
          user.role === "PA"
            ? `/emailSchedule/${params.uniqueId}`
            : `/emailScheduleCustomerOpt/${params.uniqueId}`
        }
        formSuccessMessage={null}
        reloadPageOnSuccess={true}
        redirectUrl={null}
        isNew={false}
        isAllowedToEdit={true}
      />
    </>
  );
}
