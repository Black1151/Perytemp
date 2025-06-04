import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";

import { EmailTemplateDetailsBanner } from "@/components/AdminDetailsBanners/EmailTemplateDetailsBanner";
import { emailTemplateJson } from "@/components/surveyjs/forms/emailTemplate";
import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function EmailTemplatesDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/email-template/${params.uniqueId}`);

  const res = await apiClient(`/emailTemplate/findBy?id=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const emailTemplate = await res.json();
  const emailTemplateData = emailTemplate.resource;

  return (
    <>
      <EmailTemplateDetailsBanner emailTemplate={emailTemplateData} />
      <AdminFormWrapper
        formJson={emailTemplateJson}
        data={emailTemplateData}
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
        endpoint={`/emailTemplate/${params.uniqueId}`}
        formSuccessMessage={null}
        reloadPageOnSuccess={true}
        redirectUrl={null}
        isNew={false}
        isAllowedToEdit={true}
      />
    </>
  );
}
