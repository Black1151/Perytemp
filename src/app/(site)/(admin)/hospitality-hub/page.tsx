import AdminHeader from "@/components/AdminHeader";
import TabbedGrids from "@/components/agGrids/TabbedGrids";
import { hotelsFields, rewardsFields, eventsFields, medicalFields, legalFields } from "@/components/agGrids/dataFields/hospitalityHubFields";
import { checkUserRole } from "@/lib/dal";

export const dynamic = "force-dynamic";

export default async function HospitalityHubAdminPage() {
  await checkUserRole("/hospitality-hub");

  const baseUrl = process.env.NEXTAUTH_URL || "";

  const [hotelsRes, rewardsRes, eventsRes, medicalRes, legalRes] = await Promise.all([
    fetch(`${baseUrl}/api/hospitality-hub/hotels`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/hospitality-hub/rewards`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/hospitality-hub/events`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/hospitality-hub/medical`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/hospitality-hub/legal`, { cache: "no-store" }),
  ]);

  const [hotelsJson, rewardsJson, eventsJson, medicalJson, legalJson] = await Promise.all([
    hotelsRes.json(),
    rewardsRes.json(),
    eventsRes.json(),
    medicalRes.json(),
    legalRes.json(),
  ]);

  const dataSources = [
    {
      data: hotelsJson.resource || [],
      title: "Hotels",
      fields: hotelsFields,
      createNewUrl: "/hospitality-hub/admin/hotels/create",
    },
    {
      data: rewardsJson.resource || [],
      title: "Rewards",
      fields: rewardsFields,
      createNewUrl: "/hospitality-hub/admin/rewards/create",
    },
    {
      data: eventsJson.resource || [],
      title: "Events",
      fields: eventsFields,
      createNewUrl: "/hospitality-hub/admin/events/create",
    },
    {
      data: medicalJson.resource || [],
      title: "Medical",
      fields: medicalFields,
      createNewUrl: "/hospitality-hub/admin/medical/create",
    },
    {
      data: legalJson.resource || [],
      title: "Legal",
      fields: legalFields,
      createNewUrl: "/hospitality-hub/admin/legal/create",
    },
  ];

  return (
    <>
      <AdminHeader headingText="Hospitality Hub Admin" />
      <TabbedGrids dataSources={dataSources} />
    </>
  );
}
