import DraggableGridsComponent from "@/components/agGrids/DraggableGridsComponent";
import { ColDef } from "ag-grid-community";
import { checkUserRole } from "@/lib/dal";
import apiClient from "@/lib/apiClient";

export default async function MyCustomerPage() {
  await checkUserRole("/grid-test");

  let populationData = [];

  // User Data
  const populationRes = await apiClient(
    "/user/allBy?selectColumns=id,firstName,lastName,role,email",
  );

  if (populationRes.ok) {
    const populationJson = await populationRes.json();
    populationData = populationJson.resource;
  }

  let sampleData = [];

  // User Data
  const sampleRes = await apiClient("/userGroupMember/allBy?userGroupId=11");

  if (sampleRes.ok) {
    const sampleJson = await sampleRes.json();
    sampleData = sampleJson.resource;
  }

  const fieldDefs: ColDef[] = [
    { headerName: "ID", field: "id", rowDrag: true },
    { headerName: "First", field: "firstName" },
    { headerName: "Last", field: "lastName" },
    { headerName: "Role", field: "role" },
    { headerName: "Email", field: "email" },
  ];

  return (
    <>
      <DraggableGridsComponent
        populationData={populationData}
        populationTitle={"ALL USERS"}
        sampleData={sampleData}
        endpoint={"/api/userGroup/many/11"}
        sampleTitle={"USER GROUP MEMBERS"}
        fieldDefs={fieldDefs}
        dynamicIdField={"id"}
        mappingField={"userId"}
        payloadKey={"users"}
      />
    </>
  );
}
