import apiClient from "@/lib/apiClient";
import TabbedGrids from "@/components/agGrids/TabbedGrids";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import { optionListFields } from "@/components/agGrids/dataFields/optionListFields";
import { optionListGroupsFields } from "@/components/agGrids/dataFields/optionListGroupFields";
import { optionListItemsFields } from "@/components/agGrids/dataFields/optionListItemFields";
import { checkUserRole } from "@/lib/dal";

export default async function OptionListsPage() {
  await checkUserRole("/option-lists");

  const optionListUrl = "/optionList/allBy";
  const optionListItemsUrl = "/optionListItem/allBy";
  const optionListGroupsUrl = "/optionListGroup/allBy";

  // Simulate fetching all data in parallel using fake promises
  const [optionListsRes, optionListItemsRes, optionListGroupsRes] =
    await Promise.all([
      apiClient(optionListUrl, { cache: "no-store" }),
      apiClient(optionListItemsUrl, { cache: "no-store" }),
      apiClient(optionListGroupsUrl, { cache: "no-store" }),
    ]);

  // Check if any of the responses are not ok
  if (!optionListsRes.ok || !optionListItemsRes.ok || !optionListGroupsRes.ok) {
    return redirect("/error");
  }

  const optionListsJson = await optionListsRes.json();
  const optionListItemsJson = await optionListItemsRes.json();
  const optionListGroupsJson = await optionListGroupsRes.json();

  // Use the fake data
  const optionListData = optionListsJson.resource || [];
  const optionListItemData = optionListItemsJson.resource || [];
  const optionListGroupData = optionListGroupsJson.resource || [];

  const dataSources = [
    {
      data: optionListData,
      title: "Option Lists",
      fields: optionListFields,
      createNewUrl: "/option-lists/lists/create",
    },
    {
      data: optionListItemData,
      title: "Option List Items",
      fields: optionListItemsFields,
      createNewUrl: "/option-lists/items/create",
    },
    {
      data: optionListGroupData,
      title: "Option List Groups",
      fields: optionListGroupsFields,
      createNewUrl: "/option-lists/groups/create",
    },
  ];

  return (
    <>
      {/* Admin header with consistent theme */}
      <AdminHeader headingText="Option Lists Management" />
      <TabbedGrids dataSources={dataSources} />
    </>
  );
}
