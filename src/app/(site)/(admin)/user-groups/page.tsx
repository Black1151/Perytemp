import { redirect } from "next/navigation";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { groupFields } from "@/components/agGrids/dataFields/userGroupFields";
import AdminHeader from "@/components/AdminHeader";
import apiClient from "@/lib/apiClient";
import { checkUserRole, getUser } from "@/lib/dal";

export default async function UserGroupsPage() {
  const user = await getUser();
  await checkUserRole("/user-groups");

  const res = await apiClient(`/getAllView?view=vwUserGroupsList`);

  if (!res.ok) {
    return redirect("/error");
  }

  if (user.customerIsFree) {
    return redirect("/error");
  }

  const userGroups = await res.json();
  const userGroupData = userGroups.resource || [];

  const userGroupCount = userGroupData.length;

  return (
    <>
      <AdminHeader headingText={"User Groups"} dataCount={userGroupCount} />
      <DataGridComponent
        data={userGroupData}
        initialFields={groupFields}
        createNewUrl={"/user-groups/create"}
      />
    </>
  );
}
