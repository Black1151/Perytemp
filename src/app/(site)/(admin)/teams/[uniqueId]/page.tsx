import { redirect } from "next/navigation";
import { userTeamJson } from "@/components/surveyjs/forms/userTeam";
import { UserTeamDetailsBanner } from "@/components/AdminDetailsBanners/UserTeamDetailsBanner";

import apiClient from "@/lib/apiClient";
import { checkUserRole, getUser } from "@/lib/dal";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { userTeamMembersListFields } from "@/components/agGrids/dataFields/userTeamMembersListFields";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";
import { checkUserRoleAccess } from "@/components/surveyjs/lib/utils";

export default async function TeamsDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  const user = await getUser();
  await checkUserRole(`/teams/${params.uniqueId}`);

  const [userTeamDetailsRes, userTeamMembersRes] = await Promise.all([
    apiClient(`/userTeam/findBy?uniqueId=${params.uniqueId}`),
    apiClient(
      `/getAllView?view=vwUserTeamMembersList&userTeamUniqueId=${params.uniqueId}`,
    ),
  ]);

  if (!userTeamDetailsRes.ok || !userTeamMembersRes.ok) {
    return redirect("/error");
  }

  const userTeam = await userTeamDetailsRes.json();
  const userTeamMembers = await userTeamMembersRes.json();

  const userTeamData = userTeam?.resource;
  const userTeamMembersData = userTeamMembers?.resource;

  return (
    <>
      <UserTeamDetailsBanner team={userTeamData} />
      <Tabs variant="enclosed" size="md" isFitted>
        <TabList>
          <Tab
            color={"white"}
            fontSize={["sm", "sm", "md"]}
            _selected={{ color: "white", bg: "#FFFFFF44" }}
          >
            {userTeamData.isDepartment ? "Department" : "Team"}
          </Tab>
          <Tab
            color={"white"}
            fontSize={["sm", "sm", "md"]}
            _selected={{ color: "white", bg: "#FFFFFF44" }}
          >
            {userTeamData.isDepartment ? "Department" : "Team"} Members
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <AdminFormWrapper
              formJson={userTeamJson}
              data={userTeamData}
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
              endpoint={`/userTeam/${params.uniqueId}`}
              formSuccessMessage={null}
              reloadPageOnSuccess={true}
              redirectUrl={null}
              isNew={false}
              isAllowedToEdit={checkUserRoleAccess(user.role, ["PA", "CA"])}
            />
          </TabPanel>
          <TabPanel p={0}>
            <DataGridComponent
              data={userTeamMembersData}
              initialFields={userTeamMembersListFields}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
