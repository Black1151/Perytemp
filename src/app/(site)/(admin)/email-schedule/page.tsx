import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { emailScheduleFields } from "@/components/agGrids/dataFields/emailScheduleFields";
import { checkUserRole, getUser } from "@/lib/dal";
import { caEmailScheduleFields } from "@/components/agGrids/dataFields/caEmailScheduleFields";

export default async function EmailSchedulePage() {
  const user = await getUser();
  await checkUserRole("/email-schedule");

  if (user.customerIsFree) {
    return redirect("/error"); // Redirect if the user is free
  }

  let url =
    user.role === "PA"
      ? "/getAllView?view=vwEmailSchedulesList"
      : `/getAllView?view=vwEmailSchedulesCustomerList&customerId=${user.customerId}`;
  let headerTitle = "Email Schedules";

  const res = await apiClient(url, { cache: "no-store" });

  if (!res.ok) {
    return redirect("/error");
  }

  const emailSchedules = await res.json();
  const emailScheduleData = emailSchedules.resource || [];

  const emailScheduleCount = emailScheduleData.length;

  return (
    <>
      <AdminHeader headingText={headerTitle} dataCount={emailScheduleCount} />
      <DataGridComponent
        data={emailScheduleData}
        initialFields={
          user.role === "PA" ? emailScheduleFields : caEmailScheduleFields
        }
        createNewUrl={user.role === "PA" ? "/email-schedule/create" : undefined}
      />
    </>
  );
}
