import { redirect } from "next/navigation";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { siteFields } from "@/components/agGrids/dataFields/siteFields";
import AdminHeader from "@/components/AdminHeader";
import apiClient from "@/lib/apiClient";
import { checkUserRole, getUser } from "@/lib/dal";
import SiteLimitReached from "./SiteLimitReached";
import { subscriptionLimits } from "@/utils/constants/subscriptionLimits";

interface SearchParams {
  siteType?: string;
}

export default async function SitesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getUser();
  await checkUserRole("/sites");

  let url = `/getAllView?view=vwSitesList&customerId=not-null&selectColumns=id,siteName,siteUniqueId,custName,custUniqueId,custImageUrl,siteTypeName,address1,address3,postcode,isActive,primaryContactUniqueId,primaryContactFullName,primaryContactImageUrl`;
  let headerTitle = "Sites";
  let siteTypeParam = searchParams.siteType;
  let createNewUrl = "/sites/create";

  switch (user.role) {
    case "PA":
      headerTitle = "Sites";
      createNewUrl = "/sites/create";
      break;

    case "CA": {
      const siteType =
        siteTypeParam && ["internal", "external"].includes(siteTypeParam)
          ? siteTypeParam
          : "internal";

      if (siteType === "external" && user.customerIsFree) {
        redirect("/error");
      }

      if (siteType === "internal") {
        headerTitle = "My Company Sites";
        url += `&customerId=${user.customerId}`;
        createNewUrl += `?siteType=internal`;
      } else if (siteType === "external") {
        headerTitle = "Our Client Sites";
        url += `&custParentId=${user.customerId}`;
        createNewUrl += `?siteType=external`;
      }
      break;
    }

    case "CU":
    case "CL":
    case "CS":
      headerTitle = "Our Sites";
      url += `&customerId=${user.customerId}`;
      createNewUrl = "";
      break;
  }

  const res = await apiClient(url, { cache: "no-store" });

  if (!res.ok) {
    return redirect("/error");
  }

  const sites = await res.json();
  const siteData = sites.resource || [];

  const siteCount = siteData.length;

  const freeLimits = subscriptionLimits.free;
  let isAtLimit

  if (user.customerIsFree && siteCount >= freeLimits.maxSites) {
    isAtLimit = true;
  }

  return (
    <>
      <AdminHeader headingText={headerTitle} dataCount={siteCount} />
      <DataGridComponent
        data={siteData}
        initialFields={siteFields}
        createNewUrl={createNewUrl}
        isModalEnabled={isAtLimit}
        openModalComponent={SiteLimitReached}
      />
    </>
  );
}
