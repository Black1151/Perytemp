import { redirect } from "next/navigation";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { teamFields } from "@/components/agGrids/dataFields/teamFields";
import AdminHeader from "@/components/AdminHeader";
import apiClient from "@/lib/apiClient";
import { checkUserRole, getUser } from "@/lib/dal";
import TeamLimitReached from "./TeamLimitReached";
import { subscriptionLimits } from "@/utils/constants/subscriptionLimits";

export default async function TeamsPage() {
  const user = await getUser();
  await checkUserRole("/teams");

  let headerTitle = "Departments / Teams";
  let createNewUrl = "/teams/create";

  if (user.role !== "CA") {
    headerTitle = "Our Departments / Teams";
  }

  if (!["CA", "PA"].includes(user.role)) {
    createNewUrl = "";
  }

  const res = await apiClient(`/getAllView?view=vwUserTeamsList`);

  if (!res.ok) {
    return redirect("/error");
  }

  const teams = await res.json();
  const teamData = teams.resource || [];

  const teamCount = teamData.length;

  let isAtLimit
  if (user.customerIsFree && teamCount >= subscriptionLimits.free.maxTeams) {
    isAtLimit = true;
  }
  
  return (
    <>
      <AdminHeader headingText={headerTitle} dataCount={teamCount} />
      <DataGridComponent
        data={teamData}
        initialFields={teamFields}
        createNewUrl={createNewUrl}
        isModalEnabled={isAtLimit}
        openModalComponent={TeamLimitReached}
      />
    </>
  );
}
