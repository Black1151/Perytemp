import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";

import { EmailScheduleDetailsBanner } from "@/components/AdminDetailsBanners/EmailScheduleDetailsBanner";
import { emailSecureLinkJson } from "@/components/surveyjs/forms/emailSecureLink";
import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function EmailTemplatesDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/email-secure-link/${params.uniqueId}`);

  const res = await apiClient(`/emailSecureLink/findBy?id=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const emailSecureLink = await res.json();
  const emailSecureLinkData = emailSecureLink.resource;

  return (
    <>
      <EmailScheduleDetailsBanner emailSchedule={emailSecureLinkData} />
      <AdminFormWrapper
        formJson={emailSecureLinkJson}
        data={emailSecureLinkData}
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
        endpoint={`/emailSecureLink/${params.uniqueId}`}
        formSuccessMessage={null}
        reloadPageOnSuccess={true}
        redirectUrl={null}
        isNew={false}
        isAllowedToEdit={true}
      />
    </>
  );
}
