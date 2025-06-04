import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { emailTemplateFields } from "@/components/agGrids/dataFields/emailTemplateFields";
import { checkUserRole } from "@/lib/dal";

export default async function EmailTemplatePage() {
  await checkUserRole("/email-template");

  let url = "/getAllView?view=vwEmailTemplatesList";
  let headerTitle = "Email Templates";

  const res = await apiClient(url, { cache: "no-store" });

  if (!res.ok) {
    return redirect("/error");
  }

  const emailTemplates = await res.json();
  const emailTemplateData = emailTemplates.resource || [];

  const emailTemplateCount = emailTemplateData.length;

  return (
    <>
      <AdminHeader headingText={headerTitle} dataCount={emailTemplateCount} />
      <DataGridComponent
        data={emailTemplateData}
        initialFields={emailTemplateFields}
        createNewUrl={"/email-template/create"}
      />
    </>
  );
}
