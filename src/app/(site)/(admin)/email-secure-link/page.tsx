import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { emailSecureLinkFields } from "@/components/agGrids/dataFields/emailSecureLinkFields";
import { checkUserRole } from "@/lib/dal";

export default async function EmailSecureLinkPage() {
  await checkUserRole("/email-secure-link");

  let url = "/getAllView?view=vwEmailSecureLinksList";
  let headerTitle = "Email Secure Links";

  const res = await apiClient(url, { cache: "no-store" });

  if (!res.ok) {
    return redirect("/error");
  }

  const emailSecureLinks = await res.json();
  const emailSecureLinkData = emailSecureLinks.resource || [];

  const emailSecureLinkCount = emailSecureLinkData.length;

  return (
    <>
      <AdminHeader headingText={headerTitle} dataCount={emailSecureLinkCount} />
      <DataGridComponent
        data={emailSecureLinkData}
        initialFields={emailSecureLinkFields}
        createNewUrl={"/email-secure-link/create"}
      />
    </>
  );
}
