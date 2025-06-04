import apiClient from "@/lib/apiClient";
import { checkUserRole, getUser } from "@/lib/dal";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import { activityFields } from "@/components/agGrids/dataFields/activityFields";
import TabbedGrids from "@/components/agGrids/TabbedGrids";

export const dynamic = "force-dynamic";

export interface ActivityResponse {
  wfInstId: number;
  wfInstUniqueId: string;
  toolConfigId: number;
  toolName: string;
  toolIconUrl: string;
  toolAppUrl: string;
  wfId: number;
  wfInstCustId: number;
  wfInstCustName: string;
  wfInstCustUniqueId: string;
  wfInstCustImageUrl: string;
  wfInstStartedBy: number;
  wfStarterUniqueId: string;
  wfStarterFullname: string;
  wfStarterImageUrl: string;
  wfStarterDeptId: number;
  wfStarterTeamId: number;
  wfStarterTeamName: string;
  wfInstStartDate: string;
  wfInstCompDate: string;
  wfInstStatus: number;
  wfInstStatusName: string;
  wfInstStatusBgColour: string;
  wfInstStatusFgColour: string;
  noStagesPossible: number;
  noStagesPending: number;
  noStagesStarted: number;
  noStagesCompleted: number;
}

export default async function ActivityPage() {
  const user = await getUser(); // Awaiting user data
  if (user.customerIsFree) {
    return redirect("/error"); // Redirect if the user is free
  }
  const userRole = user.role; // Fetch the user's role
  const isManagerofDepts =
    user.teamManagerCount === 1 || user.teamManagerCount === 3;
  await checkUserRole("/activity");

  let headerTitle = "Activity";

  // URLs for different activity types
  let ourClientActivityUrl = `/getAllView?view=vwProgressList&wfInstCustParentId=${user.customerId}`; // CS CL CA

  let resArray: string[] = [];

  // Set up conditional API calls based on the user's role
  const apiCalls = [
    apiClient(ourClientActivityUrl, { cache: "no-store" }), // My Activity is for everyone
  ];
  resArray.push("ourClientActivityRes");

  // Execute the relevant API calls in parallel
  const apiResponses = await Promise.all(apiCalls);

  // Check if any of the responses are not ok
  if (apiResponses.some((res) => !res.ok)) {
    return redirect("/error");
  }

  // Extract the data from each response dynamically based on `resArray`
  const responseData = await Promise.all(apiResponses.map((res) => res.json()));

  // Create a dynamic mapping of responses
  const responses: { [key: string]: ActivityResponse[] } = {};
  resArray.forEach((key, index) => {
    responses[key] = responseData[index]?.resource || [];
  });

  // Map responses to their respective data arrays
  const ourClientActivityData = responses["ourClientActivityRes"] || [];

  // Create data sources for TabbedGrids
  const dataSources = [
    {
      data: ourClientActivityData,
      title: "Our Client Activity",
      fields: activityFields,
    },
  ];

  // Set the header title dynamically based on the number of data sources
  if (dataSources.length === 1) {
    headerTitle = dataSources[0].title;
  }

  return (
    <>
      <AdminHeader headingText={headerTitle} />
      <TabbedGrids dataSources={dataSources} />
    </>
  );
}
