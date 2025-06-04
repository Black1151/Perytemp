import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import CustomerRenderer from "@/components/agGrids/CellRenderers/CustomerRenderer";

// Updated AgGrids fields
export const customerFields: ColDef[] | any = [
  {
    field: "id",
    headerName: "ID",
    filter: "agNumberColumnFilter",
    maxWidth: 128,
    minWidth: 64,
  },
  {
    field: "name",
    headerName: "Name",
    filter: "agMultiColumnFilter",
    cellRenderer: CustomerRenderer,
    cellRendererParams: {
      uniqueIdField: "custId",
      nameField: "name",
      imageUrlField: "imageUrl",
    },
  },
  {
    field: "customerCode",
    headerName: "Code",
    filter: "agMultiColumnFilter",
  },
  {
    field: "sectorName",
    headerName: "Sector",
    filter: "agMultiColumnFilter",
  },
  {
    field: "regionName",
    headerName: "Region",
    filter: "agMultiColumnFilter",
  },
  {
    field: "noOfUsers",
    headerName: "# Users",
    filter: "agNumberColumnFilter",
  },
  {
    field: "noOfSites",
    headerName: "# Sites",
    filter: "agNumberColumnFilter",
  },
  {
    field: "customerType",
    headerName: "Customer Type",
    filter: "agMultiColumnFilter",
  },
  {
    field: "isActive",
    headerName: "",
    cellRenderer: ActionButtonRenderer,
    cellRendererParams: {
      redirectUrl: "/customers",
      updateUrl: "/api/customer/",
      idField: "custId",
      rolesCanEdit: ["CA", "PA"],
    },
  },
];
