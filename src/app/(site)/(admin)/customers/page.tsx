import apiClient from "@/lib/apiClient";
import { checkUserRole, getUser } from "@/lib/dal";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { customerFields } from "@/components/agGrids/dataFields/customerFields";

export const dynamic = "force-dynamic";

interface SearchParams {
  customerType?: string;
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getUser();
  await checkUserRole("/customers");

  if (user.customerIsFree) {
    return redirect("/error"); // Redirect if the user is free
  }

  let url = `/getAllView?view=vwCustomersList&selectColumns=id,name,custId,customerCode,imageUrl,isActive,noOfUsers,noOfSites,sectorName,regionName,customerType`;
  let headerTitle = "Customers";
  let customerTypeParam = searchParams.customerType;
  let createNewUrl = "/customers/create";

  switch (user.role) {
    case "PA":
      headerTitle = "Customers";
      break;

    case "CA":
      customerTypeParam = "external";
      headerTitle = "Our Clients";
      break;

    case "CL":
    case "CS":
      customerTypeParam = "external";
      headerTitle = "Our Clients";
      createNewUrl = "";
      break;
  }

  const res = await apiClient(url, { cache: "no-store" });

  if (!res.ok) {
    return redirect("/error");
  }

  const customers = await res.json();
  const customerData = customers.resource || [];
  const customerCount = customerData.length;

  return (
    <>
      <AdminHeader headingText={headerTitle} dataCount={customerCount} />
      <DataGridComponent
        data={customerData}
        initialFields={customerFields}
        createNewUrl={createNewUrl}
      />
    </>
  );
}
