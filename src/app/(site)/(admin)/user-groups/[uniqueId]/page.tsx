import { redirect } from "next/navigation";
import { UserGroupDetailsBanner } from "@/components/AdminDetailsBanners/UserGroupDetailsBanner";

import apiClient from "@/lib/apiClient";
import { checkUserRole, getUser } from "@/lib/dal";
import UserGroupsTabs from "@/app/(site)/(admin)/user-groups/[uniqueId]/UserGroupTabs";
import { userGroupJson } from "@/components/surveyjs/forms/userGroup";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

interface UserInGroup {
  id: number;
  userUniqueId: string;
  email: string;
  role: string;
  titleId: number;
  title: string;
  firstName: string;
  lastName: string;
  fullName: string;
  telephone: string;
  mobile: string;
  vehicleRegistration: string;
  aboutMe: string;
  jobTitle: string;
  imageUrl: string;
  customerId: number;
  custName: string;
  custUniqueId: string;
  custImageUrl: string;
  custParentId: number;
  siteId: number;
  siteName: string;
  remoteWorker: boolean;
  departmentId: number;
  deptName: string;
  teamId: number;
  teamName: string;
  jobLevelId: number;
  jobLevel: string;
  contractTypeId: number;
  contractType: string;
  employStartDate: string;
  marketingOptOutId: number;
  marketingOptOut: number;
  isActive: boolean;
  siteUniqueId: string;
}

interface TeamInGroup {
  id: number;
  name: string;
  description: string;
  customerId: number;
  managerId: number;
  parentTeamId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  uniqueId: string;
  isDepartment: boolean;
}

export default async function UserGroupsDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  const user = await getUser();
  await checkUserRole(`/user-groups/${params.uniqueId}`);
  if (user?.customerIsFree) {
    return redirect("/error");
  }

  // Fetch user group details
  const userGroupRes = await apiClient(
    `/userGroup/findBy?uniqueId=${params.uniqueId}`
  );

  if (!userGroupRes.ok) {
    return redirect("/error");
  }

  const userGroup = await userGroupRes.json();
  const userGroupData = userGroup.resource;

  if (user.role === "PA") {
    return (
      <>
        <UserGroupDetailsBanner userGroup={userGroupData} />
        <AdminFormWrapper
          formJson={userGroupJson}
          data={userGroupData}
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
          endpoint={`/userGroup/${params.uniqueId}`}
          formSuccessMessage={null}
          reloadPageOnSuccess={true}
          redirectUrl={null}
          isNew={false}
          isAllowedToEdit={true}
        />
      </>
    );
  }

  // Fetch additional data for non-PA users
  const userGroupId = userGroupData?.id;
  if (!userGroupId) {
    return redirect("/error");
  }

  // TODO: change the logic below to remove duplicated call to /userGroupMember/allBy?userGroupId=${userGroupId}
  const [userPopulationRes, userSampleRes, teamPopulationRes, teamSampleRes] =
    await Promise.all([
      apiClient("/usersGroupManagementList", { method: "POST" }),
      apiClient(`/userGroupMember/allBy?userGroupId=${userGroupId}`),
      apiClient(`/userTeam/allBy?customerId=${user.customerId}`),
      apiClient(`/userGroupMember/allBy?userGroupId=${userGroupId}`),
    ]);

  if (!userPopulationRes.ok || !userSampleRes.ok) {
    return redirect("/error");
  }

  const userPopulationData = (await userPopulationRes.json()).resource;
  const activeUserPopulationData = userPopulationData.filter(
    (user: UserInGroup) => user.isActive
  );

  const userSampleData = (await userSampleRes.json()).resource;
  const teamPopulationData = (await teamPopulationRes.json()).resource;

  const activeTeamPopulationData = teamPopulationData.filter(
    (team: TeamInGroup) => team.isActive
  );

  const teamSampleData = (await teamSampleRes.json()).resource;

  return (
    <>
      <UserGroupDetailsBanner userGroup={userGroupData} />
      <UserGroupsTabs
        userGroupId={userGroupId}
        userGroupData={userGroupData}
        userPopulationData={activeUserPopulationData}
        userSampleData={userSampleData}
        teamPopulationData={activeTeamPopulationData}
        teamSampleData={teamSampleData}
      />
    </>
  );
}
