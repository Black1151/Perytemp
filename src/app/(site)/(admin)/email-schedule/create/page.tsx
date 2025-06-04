import AdminHeader from "@/components/AdminHeader";
import { redirect } from "next/navigation";
import { emailScheduleJson } from "@/components/surveyjs/forms/emailSchedule";
import { checkUserRole, getUser } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function EmailTemplateCreatePage() {
  await checkUserRole("/email-schedule/create");
  const user = await getUser();
  if (user.customerIsFree) {
      return redirect("/error"); // Redirect if the user is free
    }

  return (
    <>
      <AdminHeader headingText="Create Email Schedule" />
      <AdminFormWrapper
        formJson={emailScheduleJson}
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
        endpoint={`/emailSchedule`}
        formSuccessMessage={null}
        reloadPageOnSuccess={false}
        redirectUrl={"/dashboards"}
        isNew={true}
        isAllowedToEdit={true}
      />
    </>
  );
}
